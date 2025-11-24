import jwt from "jsonwebtoken";
import { Request } from "express";
import blockHandler from "@/classes/controllers/blockHandler.js";
import { generalLogger } from "@/utils/logger.js";
import auth from "@/classes/services/auth-service.js"
import { CustomError } from "@/classes/customError.js";
import { User } from "@prisma/client";

const { TokenExpiredError, JsonWebTokenError } = jwt;



export type RequestWithUser = Request & {
  decoded: User
}

export default blockHandler.createMiddlewareWithTx(async (req, res, tx) => {
  const {
    accessToken,
    refreshToken,
  } = req.cookies;

  try {
    auth.passDecodedReq(accessToken, req);
  } catch (error) {
    // If token is missing or expired, try refreshing it
    if ((!accessToken || error instanceof TokenExpiredError) && refreshToken) {

      const id = await auth.setRToken(refreshToken, tx);

      // generate new access token and refresh token
      const tokens = await auth.generateTokens(id, tx, true);
      // sending the decoded to the next middleware
      auth.passDecodedReq(tokens.accessToken, req);
      await auth.setAuthCookies(tokens, res);
      // log the details
      generalLogger.info(req, {
        action: "Token refreshed",
        message: "Token refreshed successfully",
      });
    }
    else if (!refreshToken) {
      res.status(401).json({
        message: "Session expired. Please log in again",
        extraDetails: "Refresh token not found",
      });
    }
    else if (error instanceof JsonWebTokenError) {
      throw new CustomError({
        status: 401,
        message: "Session expired. Please log in again.",
        extraDetails: "Invalid access token",
      });
    } else {
      throw new CustomError({
        status: 500,
        message: "Authentication failed",
        extraDetails: (error as Error).message,
      });
    }
  }

}).errorMessage("Error in token verification middleware");
