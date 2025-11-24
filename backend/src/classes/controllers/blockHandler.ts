// src/classes/BaseController.ts
import { Request, Response, NextFunction } from "express";
import { Prisma, Prisma as prismaType } from "@prisma/client";
import { prisma } from "@/config/db.js";
import { CustomError } from "@/classes/customError.js";

type ControllerBody = (req: Request, res: Response) => Promise<void> | void;
type ControllerBodyWithTx = (
  req: Request,
  res: Response,
  tx: prismaType.TransactionClient
) => Promise<void> | void;
interface Ename {
  value: string
}

export class BlockHandler {
  protected async beforeErrorHandling(_: Request, __: Response) {
    // Optionally overridden
  }

  protected async errorHandler(error: unknown, errorName: Ename, next: NextFunction) {
    if (error instanceof CustomError) {
      // your own custom error
      const { message, ...rest } = error;
      next({
        ...rest,
        message: message || errorName.value,
      });

    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          // Unique constraint failed
          next({
            status: 409,
            message: error.meta?.modelName ? `${error.meta.modelName} already exists` : "Resource already exists",
            extraDetails: error.meta || error.message,
          });
          break;
        case "P2025":
          // Prisma not found
          next({
            status: 404,
            message: error.meta?.modelName ? `${error.meta.modelName} not found` : "Resource not found",
            extraDetails: error.meta || error.message,
          });
          break;
        default:
          next({
            message: errorName.value,
            extraDetails: error.message,
            stack: error.stack, // helpful for debugging
          });
      }

    } else if (error instanceof Error) {
      // Generic JS error
      next({
        status: 500,
        message: errorName.value,
        extraDetails: error.message,
        stack: error.stack, // helpful for debugging
      });

    } else {
      // Fallback if error is not Error object
      next({
        status: 500,
        message: errorName.value,
        extraDetails: String(error),
      });
    }
  }

  private wrapHandler<T extends Function>(handler: T, errorName: Ename) {
    return Object.assign(handler, {
      errorMessage(name: string) {
        errorName.value = name;
        return handler;
      },
    });
  }

  createController(Body: ControllerBody) {
    let errorName = { value: "BlockHandler Error" };

    const handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        await Body(req, res);
      } catch (error) {
        await this.beforeErrorHandling(req, res);
        await this.errorHandler(error, errorName, next);
      }
    };

    return this.wrapHandler(handler, errorName);
  }


  createMiddleware(Body: ControllerBody) {
    let errorName = { value: "BlockHandler Error" };

    const handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        await Body(req, res);
        next();
      } catch (error) {
        await this.beforeErrorHandling(req, res);
        await this.errorHandler(error, errorName, next);
      }
    };

    return this.wrapHandler(handler, errorName);
  }

  createMiddlewareWithTx(Body: ControllerBodyWithTx) {
    let errorName = { value: "Transaction Controller Error" };

    const handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        await prisma.$transaction(async (tx) => {
          await Body(req, res, tx);
        });
        next();
      } catch (error) {
        await this.beforeErrorHandling(req, res);
        await this.errorHandler(error, errorName, next);
      }
    };

    return this.wrapHandler(handler, errorName);
  }
  createControllerWithTx(Body: ControllerBodyWithTx) {
    let errorName = { value: "Transaction Controller Error" };

    const handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        await prisma.$transaction(async (tx) => {
          await Body(req, res, tx);
        });
      } catch (error) {
        // if (this.beforeErrorHandling !== this.defaultBeforeErrorHandling) {

        await this.beforeErrorHandling(req, res);
        // }
        await this.errorHandler(error, errorName, next);
      }
    };

    return this.wrapHandler(handler, errorName);
  }
}

export default new BlockHandler();
