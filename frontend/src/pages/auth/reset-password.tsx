import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SignUpSchema, ErrorResponse } from '@app/backend';
import axiosInstance from "@/config/axios";
import { useParams } from "react-router-dom";

type ResetPasswordSchema = Pick<SignUpSchema, "password">;

const ResetPassword = () => {
    const params = useParams();

    const [message, setMessage] = useState<string>();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setError } = useForm<ResetPasswordSchema>();

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: ResetPasswordSchema) => {
        await axiosInstance.post(`/auth/reset-password`, {
            ...data,
            hash: params.hash,
            id: params.id
        }).then((res) => {
            setMessage(res.data.message);
            reset();
        }).catch((error: ErrorResponse) => {
            if (error.errors) {
                error.errors.forEach((err) => {
                    const path = err.path.join(".")
                    setError(path as keyof ResetPasswordSchema, { type: "manual", message: err.message });
                })
            } else {
                setError("password.confirmPassword", { type: "manual", message: error.message });
            }

            setMessage(undefined);
        });

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5">
            <div className="bg-white grid gap-2 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-10 w-full max-w-md animate-slideUp">
                {/* Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-3xl">🐝</span>
                        <h1 className="text-3xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent m-0">
                            WorkHive
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 m-0">
                        Hi
                        <b> Amrit Singh</b>
                        , reset your password to continue.

                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-1">
                    {message && (
                        <div className="flex items-center gap-3 p-3 rounded-lg text-sm bg-green-200 text-green-700 border border-green-300">
                            <span className="text-lg">✅</span>
                            <p className="m-0 flex-1">{message}</p>
                        </div>
                    )}
                    {/* Password */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-800">
                            Password
                        </label>
                        <div className="relative flex flex-col">
                            <input
                                {...register("password.password")}
                                id='password'
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                autoComplete="new-password"
                                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white pr-12"
                            />

                            <input
                                {...register("password.confirmPassword")}
                                id='confirmPassword'
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white pr-12 mt-4"
                            />

                            {errors?.password?.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.password.confirmPassword.message}</p>}

                            <button
                                type="button"
                                className="absolute right-2 text-xl opacity-50 hover:opacity-80"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>

                        {errors?.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="px-4 py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold text-sm mt-2 hover:translate-y-[-2px] hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 m-0">
                        Alrady have an account?{' '}
                        <Link to="/login" className="text-[#667eea] font-semibold hover:text-[#764ba2]">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
