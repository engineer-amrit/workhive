// src/components/auth/SignupForm.jsx
import axiosInstance from "@/config/axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, } from "react-router-dom";
import type { ErrorResponse, SignUpSchema } from "@app/backend";
import ProfileInital from "@/components/ProfileInital";

function SignupForm() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<SignUpSchema>();
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState<1 | 2>(1); // 1: basic info, 2: onboarding

    const onSubmit = async (data: SignUpSchema) => {
        await axiosInstance.post("/auth/signup", data)
            .then(() => {
                setStep(2);
            })
            .catch((error: ErrorResponse) => {
                if (error.errors) {
                    error.errors.forEach((err) => {
                        const field = err.path.join(".");
                        setError(field, { type: "manual", message: err.message });
                    });
                } else {
                    setError("password.confirmPassword", { type: "manual", message: error.message });
                }
            });

    };

    // Step 1: Basic Information
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 box-border">
            <div
                // key={step}
                className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-10 w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp">

                {/* Header */}
                <div className="text-center mb-6">
                    <Link to="/" className="flex items-center justify-center gap-2.5 mb-2">
                        <span className="text-2xl">🐝</span>
                        <h1 className="text-2xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent m-0">WorkHive</h1>
                    </Link>
                    <p className="text-sm text-gray-500 m-0">
                        {step === 1 ? "Create your account to get started" : "Tell us a bit about yourself"}
                    </p>
                </div>

                {/* Form */}

                {step == 1 ? <form
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="on"

                    className="flex flex-col gap-4 ">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="fullName"
                            className="text-sm font-semibold text-gray-800">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            {...register("fullName")}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                        />
                        {errors.fullName && < p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="email"
                            className="text-sm font-semibold text-gray-800">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            {...register("email")}
                            placeholder="Enter your email"
                            autoComplete="email"
                            className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                        />
                        {errors && errors.email && < p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5 relative">
                        <label
                            htmlFor="password"
                            className="text-sm font-semibold text-gray-800">Password</label>
                        <div className="relative flex items-center">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                {...register("password.password")}
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
                        {errors && errors.password?.password && < p className="text-xs text-red-500 mt-1">{errors.password.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-semibold text-gray-800">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            {...register("password.confirmPassword")}
                            className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                        />
                        {errors && errors.password?.confirmPassword && < p className="text-xs text-red-500 mt-1">{errors.password.confirmPassword.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="px-4 py-3 cursor-pointer bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold text-sm mt-1 hover:translate-y-[-2px] hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>
                </form> :

                    <ProfileInital
                        setStep={setStep}
                    />
                }



                {/* Footer */}
                <div className="text-center mt-5 pt-5 border-t border-gray-200">
                    <p className="text-sm text-gray-500 m-0">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#667eea] font-semibold hover:text-[#764ba2]">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    );
}


export default SignupForm;
