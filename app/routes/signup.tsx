// src/components/auth/SignupForm.jsx
import { useEffect, useState } from "react";
import { Link, useFetcher, redirect } from "react-router";
import { type SignUpSchema, signUpSchema } from "~/validation/auth-schema";
import { CustomAction } from "~/classes/utils/action";
import { Auth } from "~/classes/services/auth";
import type { Data } from "~/types/index";
import { CustomLoader } from "~/classes/utils/loader";
import { UserContext } from "~/middleware/context";

export const action = CustomAction.withTx(async ({ request }, tx) => {

    // parse form data
    const formData = await request.formData();
    const data = CustomAction.objectMaker(formData);

    // sign up
    const auth = new Auth(tx);
    const validData = await signUpSchema.parseAsync(data);
    const newUser = await auth.signUp(validData);

    // create tokens
    const { access, refresh } = await auth.generateTokens(newUser.id, true);

    // set cookies
    const headers = auth.setCookies(new Headers, access, refresh);

    return redirect("/", { headers });
});

export const loader = CustomLoader.withoutTx(async ({ context }) => {
    const user = context.get(UserContext);
    if (user) {
        return redirect("/");
    }
})


function SignupForm() {
    const { Form, data, state } = useFetcher<Data<SignUpSchema>>();
    const [errors, setErrors] = useState<{
        [key: string]: string
    }>();

    useEffect(() => {
        if (data && "errors" in data && data.errors) {
            const e = data.errors;
            let er: {
                [key: string]: string
            } = {};
            e.forEach(err => {
                const path = err.path.join('.');
                er[path] = err.message;
            });
            setErrors(er);
        } else if (data instanceof Response) {
            console.log(data);

        } else {
            setErrors(undefined);
        }
        return () => { setErrors(undefined); };
    }, [data]);
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState<1 | 2>(1); // 1: basic info, 2: onboarding
    const [onboardingData, setOnboardingData] = useState({
        role: "",
        teamSize: "",
        useCase: "",
    });


    // Step 1: Basic Information
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 box-border">
            <div
                key={step}
                className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-10 w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2.5 mb-2">
                        <span className="text-2xl">🐝</span>
                        <h1 className="text-2xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent m-0">WorkHive</h1>
                    </div>
                    <p className="text-sm text-gray-500 m-0">
                        {step === 1 ? "Create your account to get started" : "Tell us a bit about yourself"}
                    </p>
                </div>

                {/* Form */}

                {step == 1 ? <Form
                    autoComplete="on"
                    method="POST"

                    className="flex flex-col gap-4 ">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="fullName"
                            className="text-sm font-semibold text-gray-800">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Enter your full name"
                            autoComplete="name"
                            className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                        />
                        {errors && errors.fullName && < p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="email"
                            className="text-sm font-semibold text-gray-800">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                        />
                        {errors && errors.email && < p className="text-xs text-red-500 mt-1">{errors.email}</p>}
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
                                autoComplete="new-password"
                                name="password.password"
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
                        {errors && errors['password.password'] && < p className="text-xs text-red-500 mt-1">{errors['password.password']}</p>}
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
                            name="password.confirmPassword"
                            className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                        />
                        {errors && errors['password.confirmPassword'] && < p className="text-xs text-red-500 mt-1">{errors['password.confirmPassword']}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        disabled={state === "submitting"}
                        type="submit"
                        className="px-4 py-3 cursor-pointer bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold text-sm mt-1 hover:translate-y-[-2px] hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {state === "submitting" ? "Creating Account..." : "Create Account"}
                    </button>
                </Form> :

                    <Form className="flex flex-col gap-4">
                        {/* Role */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="role" className="text-sm font-semibold text-gray-800">
                                What's your role?
                            </label>
                            <select
                                id="role"
                                value={onboardingData.role}
                                onChange={(e) =>
                                    setOnboardingData({ ...onboardingData, role: e.target.value })
                                }
                                className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                            >
                                <option value="">Select your role</option>
                                <option value="developer">Developer</option>
                                <option value="designer">Designer</option>
                                <option value="product-manager">Product Manager</option>
                                <option value="marketing">Marketing</option>
                                <option value="student">Student</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Team Size */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="teamSize" className="text-sm font-semibold text-gray-800">
                                Team Size
                            </label>
                            <select
                                id="teamSize"
                                value={onboardingData.teamSize}
                                onChange={(e) =>
                                    setOnboardingData({ ...onboardingData, teamSize: e.target.value })
                                }
                                className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                            >
                                <option value="">Select team size</option>
                                <option value="solo">Just me</option>
                                <option value="small">2-10 people</option>
                                <option value="medium">11-50 people</option>
                                <option value="large">51+ people</option>
                            </select>
                        </div>

                        {/* Use Case */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="useCase" className="text-sm font-semibold text-gray-800">
                                Primary Use Case
                            </label>
                            <select
                                id="useCase"
                                value={onboardingData.useCase}
                                onChange={(e) =>
                                    setOnboardingData({ ...onboardingData, useCase: e.target.value })
                                }
                                className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                            >
                                <option value="">Select use case</option>
                                <option value="personal">Personal projects</option>
                                <option value="team">Team collaboration</option>
                                <option value="documentation">Documentation</option>
                                <option value="project-management">Project management</option>
                                <option value="knowledge-base">Knowledge base</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2.5 mt-1 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-4 py-3 bg-white text-[#667eea] border-2 border-[#667eea] rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors flex-1 sm:flex-auto"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-semibold hover:translate-y-[-2px] hover:shadow-lg transition-all flex-1 sm:flex-auto"
                            >
                                Continue
                            </button>
                        </div>
                    </Form>
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
