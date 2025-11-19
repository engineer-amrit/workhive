// src/components/dashboard/Dashboard.jsx
import Sidebar from "../components/dashboard/Sidebar";
import Calendar from "../components/widgets/Calender";
import Header from "../components/dashboard/Header";
import Features from "../components/dashboard/Features";
import Tasks from "~/components/widgets/Tasks";
import ProndoTimer from "~/components/widgets/Timer";
import Documents from "~/components/widgets/Documents";
import type { Route } from "../+types/root";
import { env } from "../config/env";
import jwt from "jsonwebtoken";
const { TokenExpiredError, JsonWebTokenError } = jwt;
import { json } from "@remix-run/node";
import { loaderWithTx } from "~/utils/loader";
import type { SignUpSchema } from "~/validation/auth-schema";
import type { User } from "@prisma/client";


export function HydrateFallback() {
    return <div>Loading...</div>;
}


export const loader = loaderWithTx<User>(async ({ request }, tx) => {
    // console cookies
    const cookies = request.headers.get("Cookie")?.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
    }, {} as Record<string, string>) || {};

    const access = cookies?.access
    const refresh = cookies?.refresh
    try {
        const re = jwt.verify(access, env.JWT_SECRET) as SignUpSchema;
        console.log(re, ".....................");

        return re
    } catch (error) {
        if ((!access || error instanceof TokenExpiredError) && refresh) {
            console.log("refresh token logic.........");
            const decodedRefresh = jwt.verify(refresh, env.JWT_SECRET) as { userId: string };

            const dToken = await tx.refreshToken.deleteMany(
                {
                    where: {
                        userId: decodedRefresh.userId,
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

            const user = await tx.user.findUnique({
                where: {
                    id: decodedRefresh.userId
                },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            })

            if (!user) {
                throw {
                    status: 401,
                    error: "User not found"
                }
            }
            const newAccessToken = jwt.sign(
                user,
                env.JWT_SECRET,
                { expiresIn: "12h" }
            );

            const newRefreshToken = jwt.sign({
                userId: user.id,
            }, env.JWT_SECRET, { expiresIn: '7d' });

            await tx.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId: user.id,
                }
            });

            const headers = new Headers();

            headers.append(
                "Set-Cookie",
                `access=${newAccessToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`
            );

            headers.append(
                "Set-Cookie",
                `refresh=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}`
            );

            return json(
                {
                    message: "Tokens refreshed",
                    ok: true
                },
                { headers }
            );
        }

        else if (!refresh) {
            return {
                status: 401,
                error: "Authentication required. Please log in.",
            }
            throw {
                status: 401,
                error: "Authentication required. Please log in.",
            };
        }

        else if (error instanceof JsonWebTokenError) {
            throw {
                status: 401,
                error: "Invalid token. Please log in again.",
            }
        }

        throw error;

    }

})
const Dashboard = ({ loaderData }: Route.ComponentProps) => {
    console.log(loaderData);


    return (
        <div className="h-screen w-full bg-gray-900 grid grid-cols-[250px_1fr]">
            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto  w-full h-full">
                {/* Header */}
                <Header />

                {/* Welcome Content */}
                <div className="max-w-6xl  mx-auto p-8">
                    {/* Features Section */}
                    <Features />

                    {/* Quick Access Widgets */}
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Access</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* TASKS WIDGET */}
                        <Tasks />

                        {/* POMODORO TIMER */}
                        <ProndoTimer />

                        {/* DOCUMENTS WIDGET */}
                        <Documents />

                        {/* CALENDAR WIDGET */}
                        <Calendar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
