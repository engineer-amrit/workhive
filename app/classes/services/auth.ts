import type { Prisma, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { env } from "~/config/env";
import type { LoginSchema, SignUpSchema } from "~/validation/auth-schema";
import bcrypt from "bcrypt";

export class Auth {
    private tx: Prisma.TransactionClient;
    constructor(tx: Prisma.TransactionClient,) {
        this.tx = tx;
    }

    getCookies = (request: Request) => {
        // console cookies
        const cookies = request.headers.get("Cookie")?.split("; ").reduce((acc, cookie) => {
            const [key, value] = cookie.split("=");
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>) || {};

        return cookies;
    }

    generateTokens = async (userId: string, Rtoken = false) => {
        // 1. Update lastLogin and fetch user with role
        const user = await this.tx.user.update({
            where: { id: userId },
            data: { lastLogin: new Date() },
            select: {
                id: true,
                fullName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });

        // 2. Create Access Token   
        const access = jwt.sign(
            {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        let refresh;

        // 3. Optional: Generate & store refresh token
        if (Rtoken) {
            refresh = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: "7d" });

            await this.tx.refreshToken.create({
                data: {
                    userId: user.id,
                    token: refresh,
                    createdAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                },
            });
        }

        // 4. Return tokens
        return Rtoken ? { access, refresh } : { access };
    }

    verifyToken = <T>(token: string): T => {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        return decoded as T;
    }

    setCookies = (headers: Headers, accessToken: string, refreshToken?: string) => {
        headers.append(
            "Set-Cookie",
            `access=${accessToken}; HttpOnly; Path=/; Max-Age=${12 * 60 * 60}` // 12 hours
        );
        if (refreshToken) {
            headers.append(
                "Set-Cookie",
                `refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}` // 7 days
            );
        }

        return headers;
    }

    signUp = async (data: SignUpSchema) => {
        const newUser = await this.tx.user.create({
            data,
            select: {
                id: true,
                fullName: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                lastLogin: true
            }
        })
        return newUser;
    }

    signIn = async (data: LoginSchema) => {
        const user = await this.tx.user.findUniqueOrThrow({
            where: {
                email: data.email
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                password: true,
                createdAt: true,
                updatedAt: true
            }
        });

        const { password, ...userWithoutPassword } = user;

        const compare = bcrypt.compareSync(data.password, user.password);

        if (!compare) {
            throw {
                status: 401,
                error: "Invalid credentials"
            }
        }

        return userWithoutPassword;

    }

    signOut = async (userId: string) => {

    }

    refreshTokens = async (refresh: string) => {
        const decodedRefresh = jwt.verify(refresh, env.JWT_SECRET) as { id: string };

        const dToken = await this.tx.refreshToken.deleteMany(
            {
                where: {
                    userId: decodedRefresh.id,
                    token: refresh
                }
            }
        )
        if (dToken.count === 0) {
            throw {
                status: 401,
                error: "Invalid refresh token. Please log in again."
            }
        }
        const user = await this.tx.user.findUniqueOrThrow({
            where: {
                id: decodedRefresh.id
            },
            select: { id: true, fullName: true, email: true, createdAt: true, updatedAt: true, lastLogin: true }
        })

        const { access, refresh: newRefresh } = await this.generateTokens(user.id, true);

        return {
            access, refresh: newRefresh, decoded: user
        };

    }

    clearCookies = (headers: Headers) => {
        headers.append(
            "Set-Cookie",
            `access=; HttpOnly; Path=/; Max-Age=0`
        );
        headers.append(
            "Set-Cookie",
            `refresh=; HttpOnly; Path=/; Max-Age=0`
        );
        return headers;
    }
}
