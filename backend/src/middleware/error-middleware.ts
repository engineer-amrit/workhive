import { NextFunction, Request, Response } from "express";
import config from "@/config/config.js";
import { generalLogger } from "@/utils/logger.js";

interface CustomError extends Error {
  user?: string;
  action?: string;
  status?: number;
  errors?: {
    path: string[];
    message: string;
  }[];
  extraDetails?: string;
}

const errorMiddleware = (
  error: CustomError | unknown,
  req: Request,
  res: Response,
  __: NextFunction
) => {
  const safeError: Partial<CustomError> =
    typeof error === "object" && error !== null ? (error as CustomError) : { message: String(error) };

  const {
    status: rawStatus,
    extraDetails: rawExtraDetails,
    message: rawMessage,
    action,
  } = safeError;

  const status = rawStatus ?? 500;
  const message = rawMessage || "Something went wrong";

  const extraDetails =
    config.NODE_ENV === "production" || !rawExtraDetails
      ? undefined
      : rawExtraDetails || "Internal server error";

  const logPayload = {
    status,
    action,
    message,
    ...(extraDetails && { extraDetails }),
  };

  if (status >= 500) {
    generalLogger.error(req, logPayload);
  } else {
    generalLogger.warn(req, logPayload);
  }

  if (config.NODE_ENV === "development") {
    console.error(JSON.stringify({ ...logPayload, errors: safeError.errors }, null, 2));
    if (safeError.stack) console.error(safeError.stack);
  }

  res.status(status).json({
    message,
    errors: safeError.errors ?? undefined,
    ...(extraDetails && { extraDetails }),
  });
};


export default errorMiddleware;
