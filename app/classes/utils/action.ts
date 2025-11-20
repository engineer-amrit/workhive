import { Prisma } from "@prisma/client";
import { db } from "~/config/db";
import type { ActionFunction, ActionFunctionArgs } from "react-router";
import { globalFetchErrorHandler } from "./globalFetchErrorHandler";
import { BaseUtils } from "./base";

type WithTxArgs = (args: ActionFunctionArgs, tx: Prisma.TransactionClient) => Promise<ReturnType<ActionFunction>>;

class Action extends BaseUtils {

    public withTx(fn: WithTxArgs): ActionFunction {
        return async function action(args) {
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
    public withoutTx(fn: ActionFunction): ActionFunction {
        return async function action(args) {
            try {
                return await fn(args);
            } catch (error) {
                return globalFetchErrorHandler(error);
            }
        }
    }
}

export const CustomAction = new Action();