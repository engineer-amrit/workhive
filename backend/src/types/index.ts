import type { User as U } from "@prisma/client";
export type { SignUpSchema, LoginSchema } from "@/validation/auth-schema.js"
export type { ProfileInitialsSchema } from "@/validation/profile-initials.js"

export type User = U;

export interface ErrorResponse {
    status: number;
    message: string;
    extraDetails?: string;
    errors?: {
        path: string[];
        message: string;
    }[] | [];
}

