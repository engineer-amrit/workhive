import type { Route } from "../../+types/root";
import { globalFetchErrorHandler } from "./globalFetchErrorHandler";
import { Prisma } from "@prisma/client";
import { db } from "~/config/db";
type MiddlewareArgs = Parameters<Route.MiddlewareFunction>;
// [args, next]

type WithTxArgs = (
    ...args: [...MiddlewareArgs, tx: Prisma.TransactionClient]
) => ReturnType<Route.MiddlewareFunction>;

class Middleware {

    withTx(fn: WithTxArgs): Route.MiddlewareFunction {
        return async (args, next) => {
            // start transaction
            try {
                return await db.$transaction(async (tx) => {
                    return await fn(args, next, tx);
                })
            } catch (error) {
                return next();
            }
        }
    }
    withoutTx(fn: Route.MiddlewareFunction): Route.MiddlewareFunction {
        return async (args, next) => {
            try {
                return await fn(args, next);
            } catch (error) {
                return globalFetchErrorHandler(error);
            }
        }
    }
}

export const CustomMiddleware = new Middleware();