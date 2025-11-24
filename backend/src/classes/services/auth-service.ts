import config from "@/config/config.js"
import crypto from "crypto";
import { Response, Request } from "express";
import { CustomError } from "../customError.js";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import {
  type RequestWithUser,
} from '@/middleware/auth/tokenVerifier-middleware.js';
import { prisma } from "@/config/db.js";
import { transporter, passwordResetEmail } from "@/utils/mailer.js";
import { ResetPasswordSchema } from "@/validation/auth-schema.js";

interface Itokens {
  accessToken: string;
  refreshToken?: string;
}

interface Cookies {
  [key: string]: string | undefined;
}

interface IcookieBaseOP {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  domain?: string | undefined; // domain is optional in non-production environments
}

type IcookieOP = {
  [K in keyof Required<Itokens>]: IcookieBaseOP & { maxAge: number };
};


type JwtUser = RequestWithUser["decoded"];

class Auth {

  private cookieBaseOptions: IcookieBaseOP = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.SAME_SITE,
    domain: config.NODE_ENV === "production" ? config.DOMAIN : undefined,
  };

  private cookieOptions: IcookieOP = {
    accessToken: {
      ...this.cookieBaseOptions,
      maxAge: 1000 * 60 * 60 * 12, // 12 hours
    },
    refreshToken: {
      ...this.cookieBaseOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  };


  generateTokens = async (userId: string, tx: Prisma.TransactionClient, Rtoken = false) => {
    // 1. Update lastLogin and fetch user with role
    const user = await tx.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });

    // 2. Create Access Token   
    const accessToken = jwt.sign(
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        lastLogin: user.lastLogin,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      },
      config.JWT_SECRET,
      { expiresIn: "12h" }
    );

    let refreshToken;

    // 3. Optional: Generate & store refresh token
    if (Rtoken) {
      refreshToken = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: "7d" });

      await tx.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
    }

    // 4. Return tokens
    return Rtoken ? { accessToken, refreshToken } : { accessToken };
  }


  setAuthCookies = async (tokens: Itokens, res: Response) => {
    (Object.entries(tokens) as [keyof Itokens, string][])
      .forEach(([key, value]) => {
        res.cookie(key, value, this.cookieOptions[key]);
      });
  };


  passDecodedReq = (token: string, req: Request) => {

    (req as RequestWithUser).decoded = this.verifyToken(token);
  };

  setRToken = async (token: string, tx: Prisma.TransactionClient) => {
    const decoded = this.verifyToken(token);
    const { id } = decoded;

    const TokenWithUser = await tx.refreshToken.delete(
      {
        where: { userId: id, token },
      }
    )

    if (!TokenWithUser) {
      throw new CustomError({
        status: 401,
        message: "Session expired. Please log in again",
        extraDetails: "Invalid refresh token",
      });
    }

    return id;
  };

  // Utility function to verify token
  verifyToken = (token: string) => {
    return jwt.verify(token, config.JWT_SECRET) as JwtUser;
  };

  logout = async (rToken: string, id: string) => {

    await prisma.refreshToken.deleteMany({
      where: {
        userId: id,
        token: rToken
      }
    });

  };

  clearCookies(cookies: Cookies, res: Response) {
    // remove all the cookies
    Object.keys(this.cookieOptions).forEach((key) => {
      if (cookies[key]) {
        res.clearCookie(key, {
          httpOnly: true,
          secure: config.NODE_ENV === "production",
          sameSite: config.SAME_SITE,
          domain: config.NODE_ENV === "production" ? config.DOMAIN : undefined,
        });
      }
    });
  }

  async sendResetPasswordEmail(tx: Prisma.TransactionClient, email: string) {
    const user = await tx.user.findUniqueOrThrow({
      where: { email },
    });
    const passHash = await tx.passHash.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        passHash: crypto.randomBytes(32).toString('hex'),
      },
    });

    const resetLink = `${config.CLIENT_URL}/reset-password/${passHash.passHash}/${user.id}`;

    // Send email
    await transporter.sendMail({
      from: `"WorkHive Support" <${config.EMAIL_USER}>`,
      to: user.email,
      ...passwordResetEmail(resetLink),
    });
  }

  async resetPassword(tx: Prisma.TransactionClient, args: ResetPasswordSchema) {
    const { id, hash, password } = args;

    const storedPassHash = await tx.passHash.findFirst({
      where: { userId: id },
    })

    if (!storedPassHash || storedPassHash.passHash !== hash) {
      throw new CustomError({
        status: 400,
        message: "Invalid or expired password reset link",
        extraDetails: "PassHash does not match",
      });
    }
    await tx.user.update({
      where: { id: id },
      data: { password },
    });

    await tx.passHash.delete({
      where: { userId: id },
    });

  }

}
export default new Auth();