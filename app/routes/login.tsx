// src/components/auth/LoginForm.tsx
import { useState, useEffect } from 'react';
import { Link, useFetcher } from 'react-router';
import { actionWithtx, type Data } from '~/utils/action';
import { type LoginSchema, loginSchema } from '~/validation/auth-schema';
import { objectMaker } from '~/utils/objectMaker';
import { validateSchema } from '~/utils/validator';
import bcrypt from 'bcrypt';
import { env } from '~/config/env';
import jwt from 'jsonwebtoken';
import { redirect } from '@remix-run/node';


export const action = actionWithtx<LoginSchema>(async ({ request }, tx) => {
    const formData = await request.formData();
    const data = objectMaker(formData);
    const parsedData = await validateSchema(loginSchema, data);

    // find user
    const user = await tx.user.findUnique({
        where: {
            email: parsedData.email
        },
    });

    if (!user) {
        throw {
            status: 404,
            error: "User not found"
        }
    }

    const compare = bcrypt.compareSync(parsedData.password, user.password);

    if (!compare) {
        throw {
            status: 401,
            error: "Invalid credentials"
        }
    }

    // remove sensitive fields before signing
    const { password: _password, ...userWithoutPassword } = user;

    // creating jwt token
    const access = jwt.sign(userWithoutPassword, env.JWT_SECRET, {
        expiresIn: '12h'
    });
    const refresh = jwt.sign({
        userId: user.id,
    }, env.JWT_SECRET, { expiresIn: '7d' });

    await tx.refreshToken.create({
        data: {
            token: refresh,
            userId: user.id,
        }
    });
    const headers = new Headers();

    headers.append(
        "Set-Cookie",
        `access=${access}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`
    );
    headers.append(
        "Set-Cookie",
        `refresh=${refresh}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}`
    );

    return redirect("/", { headers });

    // Perform login logic here, e.g., check credentials against the database
    // For demonstration, we'll just return a success message
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
