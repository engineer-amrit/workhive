import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthRouter } from "./auth-router";
import LoaderWrapper from "../components/ui/LoaderWrapper";
import { ClientRouter } from "./client-router";


export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <LoaderWrapper>
                <Outlet />
            </LoaderWrapper>
        ),
        children: [
            ...ClientRouter,
            ...AuthRouter,
        ]
    }
]);