import { Prisma } from "@prisma/client";
import { db } from "~/config/db";
import type { LoaderFunction, LoaderFunctionArgs } from "react-router";
import { globalFetchErrorHandler } from "./globalFetchErrorHandler";
import { BaseUtils } from "./base";

type WithTxArgs = (args: LoaderFunctionArgs, tx: Prisma.TransactionClient) => Promise<ReturnType<LoaderFunction>>;


class Loader extends BaseUtils {

    withTx(fn: WithTxArgs): LoaderFunction {
        return async function loaer(args) {
            // start transaction
            try {
                return await db.$transaction(async (tx) => {
                    return await fn(args, tx);
                })
            } catch (error) {
                return globalFetchErrorHandler(error);
            }
        }
    }
    withoutTx(fn: LoaderFunction): LoaderFunction {
        return async function loader(args) {
            try {
                return await fn(args);
            } catch (error) {
                return globalFetchErrorHandler(error);
            }
        }
    }
}

export const CustomLoader = new Loader();