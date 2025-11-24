import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const LoginForm = lazy(() => import("../pages/auth/login"));
const SignupForm = lazy(() => import("../pages/auth/signup"));

export const AuthRouter: RouteObject[] = [
    {
        path: "/login",
        Component: LoginForm,
    },
    {
        path: "/signup",
        Component: SignupForm,
    }, {
        path: "forgot-password",
        Component: lazy(() => import("../pages/auth/forgot-password"))
    }, {
        path: "reset-password/:hash/:id",
        Component: lazy(() => import("../pages/auth/reset-password"))
    }
];