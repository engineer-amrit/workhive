import { createContext } from "react-router";
import type { User } from "@prisma/client";
export const UserContext = createContext<Omit<User, "password"> & {
    headers?: Headers
}>();
