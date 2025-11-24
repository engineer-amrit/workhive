import { RequestWithUser } from "./tokenVerifier-middleware.js";
import blockhandler from "@/classes/controllers/blockHandler.js";
import { CustomError } from "@/classes/customError.js";

export const adminAuth = blockhandler.createMiddleware(
  async (req) => {
    const user = (req as RequestWithUser).decoded;
    // Check if the user has admin role
    if (user.role.name !== "ADMIN") {
      throw new CustomError({
        status: 403,
        message: "Access denied. Admins only.",
        extraDetails: "User does not have admin privileges",
      });
    }
  }).errorMessage("Error in admin authentication middleware");
