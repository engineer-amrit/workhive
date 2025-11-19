import type { Prisma } from "@prisma/client";
import { db } from "~/config/db";
import { erroHandler } from "./action";
import type { Route } from "../+types/root";
import type { ResponseSuccess, ResponseError } from "../types/index";
type ActionWithoutTx<T> = (args: Route.ActionArgs) => Promise<ResponseSuccess<T>> | Promise<Response>;
type ActionWithTx<T> = (args: Route.ActionArgs, tx: Prisma.TransactionClient) => Promise<ResponseSuccess<T>> | Promise<Response>;
type Res<T> = Promise<ResponseSuccess<T> | ResponseError | Response>;
export function loaderWithTx<T>(fn: ActionWithTx<T>) {
    return async function loader(arg: Route.LoaderArgs): Res<T> {
        try {
            return await db.$transaction(async (tx) => {
                const result = await fn(arg, tx);
                return result;
            });
        } catch (error) {
            return erroHandler(error)
        }
    };
}

export function loaderWithoutTx<T>(fn: ActionWithoutTx<T>) {
    return async function loader(arg: Route.LoaderArgs): Res<T> {
        try {
            const result = await fn(arg);
            return result;
        } catch (error) {
            return erroHandler(error)
        }
    };
}