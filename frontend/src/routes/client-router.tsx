import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Dashboard = lazy(() => import("../pages/client/dashboard"));

export const ClientRouter: RouteObject[] = [
    {
        index: true,
        Component: Dashboard,
    },
    {
        path: "templates",
        Component: lazy(() => import("../pages/client/templates")),
    },
    {
        path: "calendar",
        Component: lazy(() => import("../pages/client/calendar")),
    }
];