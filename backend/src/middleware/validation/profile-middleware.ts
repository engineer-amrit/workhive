import blockHandler from "@/classes/controllers/blockHandler.js";
import { RequestWithUser } from "@/middleware/auth/tokenVerifier-middleware.js";
import { CustomError } from "@/classes/customError.js";

export default blockHandler.createMiddleware(async (req, _,) => {
  const { profileFilled } = (req as RequestWithUser).decoded;
  if (profileFilled) {
    throw new CustomError({
      status: 403,
      message: "Profile is already complete",
    });
  }

}).errorMessage("Profile can not be created again")
