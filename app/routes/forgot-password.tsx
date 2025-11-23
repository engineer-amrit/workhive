// src/components/auth/ForgotPassword.jsx
import { useState } from "react";
import { useFetcher, Link, useRouteError } from "react-router";
import { CustomAction } from "~/classes/utils/action";
import { transporter, passwordResetEmail } from "~/config/mailer";
import { env } from "~/config/env";
import { loginSchema } from "~/validation/auth-schema";
import type { ResponseError } from "~/classes/utils/globalFetchErrorHandler";

export const action = CustomAction.withoutTx(async ({ request }) => {
    const formData = await request.formData();
    const data = CustomAction.objectMaker(formData);
    const validData = loginSchema.pick({ email: true }).parse(data);

    // await transporter.sendMail({
    //     from: '"WorkHive security" <' + env.EMAIL_USER + '>', // sender address
    //     to: validData.email, // list of receivers
    //     ...passwordResetEmail(`https://${env.DOMAIN.slice(1)}/reset-password?token=dummytoken`)
    // });
    return Response.json({
        message: "A password reset link has been sent."
    });
});

function ForgotPassword() {
    const error = useRouteError() as ResponseError;
    const { state, data, Form } = useFetcher<
        { message: string }
    >();


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-600 p-5">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 p-10 w-full max-w-md animate-slideUp">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-sm text-gray-500">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <Form method='POST'
                    className="flex flex-col gap-5">
                    {error && (
                        <div className="flex items-center gap-3 p-3 rounded-lg text-sm bg-red-200 text-red-700 border border-red-300">
                            <span className="text-lg">⚠️</span>
                            <p className="m-0 flex-1">{error.error}</p>
                        </div>
                    )}

                    {data && !error && (
                        <div className="flex items-center gap-3 p-3 rounded-lg text-sm bg-green-200 text-green-700 border border-green-300">
                            <span className="text-lg">✅</span>
                            <p className="m-0 flex-1">{data.message}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            className="
              p-3 border-2 border-gray-300 rounded-lg text-base
              transition-all duration-200
              focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200
              disabled:bg-gray-100 disabled:cursor-not-allowed
            "
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={state == "submitting"}
                        className="
            p-3 bg-gradient-to-br from-indigo-400 to-purple-600 text-white
            rounded-lg text-lg font-semibold transition-all duration-200
            hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-400/40
            disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
          "
                    >
                        {state == "submitting" ? "Sending..." : "Send Reset Link"}
                    </button>

                    <div className="text-center mt-2">
                        <Link to="/login" className="text-indigo-500 text-sm font-medium hover:text-purple-600">
                            ← Back to Login
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );

}

export default ForgotPassword;