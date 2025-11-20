import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

const { JsonWebTokenError } = jwt;


export interface ResponseError {
    status: number;
    errors?: {
        path: PropertyKey[];
        message: string;
    }[];
    error: string;
}
export function globalFetchErrorHandler(error: unknown): Response {
    const err = error as Prisma.PrismaClientKnownRequestError | ZodError | ResponseError | Error | typeof JsonWebTokenError;
    let responseError: ResponseError = {
        status: 500,
        error: "Internal Server Error",
    };

    if (err instanceof ZodError) {
        responseError = {
            status: 400,
            errors: err.issues.map(({ path, message }) => ({ path, message })),
            error: "validation error",
        }
    } else if ("status" in err && "error" in err) {
        responseError = {
            status: err.status,
            error: err.error,
            ...(err.errors ? { errors: err.errors } : {}),
        }
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            const fields = (err.meta?.target as string[]).join(", ");
            responseError = {
                status: 400,
                error: fields + " already exists.",
            }
        }
        else {
            responseError = {
                status: 400,
                error: err.message,
            }
        }
    }
    else if (err instanceof JsonWebTokenError) {
        responseError = {
            status: 401,
            error: "Invalid token. Please log in again.",
        }
    }
    else {
        responseError = {
            status: 500,
            error: (err as Error).message || "Internal Server Error",
        }
    }

    console.log(responseError);

    return new Response(
        JSON.stringify(responseError),
        { status: responseError.status, headers: { "Content-Type": "application/json" } }
    );

}