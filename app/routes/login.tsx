
// src/components/auth/LoginForm.tsx
import { useState, useEffect } from 'react';
import { Link, useFetcher } from 'react-router';
import { CustomAction } from '~/classes/utils/action';
import { type LoginSchema, loginSchema } from '~/validation/auth-schema';
import { redirect } from '@remix-run/node';
import { Auth } from '~/classes/services/auth';
import type { Data } from '~/types/index';
import { CustomLoader } from '~/classes/utils/loader';
import { UserContext } from '~/middleware/context';

export const loader = CustomLoader.withoutTx(async ({ context }) => {
    const user = context.get(UserContext);
    if (user) {
        return redirect("/");
    }
})

export const action = CustomAction.withTx(async ({ request }, tx) => {
    const formData = await request.formData();
    const data = CustomAction.objectMaker(formData);

    // validate data
    const valid = await loginSchema.parseAsync(data);

    const auth = new Auth(tx);
    const user = await auth.signIn(valid);

    // creating jwt token
    const { access, refresh } = await auth.generateTokens(user.id, true);
    const headers = auth.setCookies(new Headers, access, refresh);
    return redirect("/", { headers });
});

function LoginForm() {
    const { Form, data, state } = useFetcher<Data<LoginSchema>>();
    const [showPassword, setShowPassword] = useState(false);
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
                <Form method='post' className="flex flex-col gap-1">
                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-800">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name='email'
                            placeholder="Enter your email"
                            autoComplete="email"
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                        />
                        {errors?.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-800">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <input
                                name='password'
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

                        {errors?.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-start mt-2">
                        <Link to="/forgot-password" className="text-[#667eea] text-sm font-medium hover:text-[#764ba2]">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={state === "submitting"}
                        className="px-4 py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold text-sm mt-2 hover:translate-y-[-2px] hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {state === "submitting" ? "Logging in..." : "Login"}
                    </button>
                </Form>

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