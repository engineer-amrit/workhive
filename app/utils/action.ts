import type { Prisma } from "@prisma/client";
import type { ResponseSuccess, ResponseError } from "../types/index";
import type { Route } from "../+types/root";
type ActionWithoutTx<T> = (args: Route.ActionArgs) => Promise<ResponseSuccess<T>> | Promise<Response>;
type ActionWithTx<T> = (args: Route.ActionArgs, tx: Prisma.TransactionClient) => Promise<ResponseSuccess<T>> | Promise<Response>;
type Res<T> = Promise<ResponseSuccess<T> | ResponseError | Response>;
export type Data<T> = ResponseSuccess<T> | ResponseError | Response;
import { db } from "../config/db";

export const erroHandler = (error: unknown) => {
    const err = error as Error | ResponseError
    const ee = {
        status: "status" in err ? err.status : 500,
        error: "message" in err ? err.message : err.error,
        errors: "errors" in err ? err.errors : undefined,
    };
    console.log(ee);
    return ee;
}

function actionwithouttx<T>(fn: ActionWithoutTx<T>) {
    return async function action(args: Route.ActionArgs): Res<T> {
        try {
            const result = await fn(args);
            return result;
        } catch (error) {
            return erroHandler(error)
        }
    };
}
function actionWithtx<T>(fn: ActionWithTx<T>) {
    return async function action(args: Route.ActionArgs): Res<T> {
        try {
            const tx = await db.$transaction(async (tx) => {
                const result = await fn(args, tx);
                return result;
            })
            return tx;
        } catch (error) {
            return erroHandler(error)
        }
    };
}
export { actionWithtx, actionwithouttx }