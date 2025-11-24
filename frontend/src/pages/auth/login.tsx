
// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { LoginSchema, ErrorResponse } from '@app/backend';
import axiosInstance from '@/config/axios';
import { useAuth } from '../../context/useAuth.tsx';

function LoginForm() {
    const nav = useNavigate();
    const { fetchUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginSchema>();

    const onSubmit = async (data: LoginSchema) => {
        await axiosInstance.post("/auth", data).then(() => {
            // Handle successful login, e.g., redirect or show a message
            fetchUser?.();
            nav("/");
        }).catch((error: ErrorResponse) => {
            if (error.errors) {
                error.errors.forEach((err) => {
                    const path = err.path.join(".")
                    setError(path as keyof LoginSchema, { type: "manual", message: err.message });
                })
            } else {
                setError("password", { type: "manual", message: error.message });
            }
        });
    };


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
                        Welcome back! Please login to your account.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-1">
                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-800">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="Enter your email"
                            autoComplete="email"
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                        />
                        {errors?.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-800">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <input
                                {...register("password")}
                                id='password'
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                autoComplete="new-password"
                                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white pr-12"
                            />
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

                    {/* Forgot Password */}
                    <div className="flex justify-start mt-2">
                        <Link to="/forgot-password" className="text-[#667eea] text-sm font-medium hover:text-[#764ba2]">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="px-4 py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold text-sm mt-2 hover:translate-y-[-2px] hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 m-0">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-[#667eea] font-semibold hover:text-[#764ba2]">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;