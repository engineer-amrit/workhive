import { RequestWithUser } from '../middleware/auth/tokenVerifier-middleware.js';
import { generalLogger } from "../utils/logger.js";
import { BlockHandler } from "@/classes/controllers/blockHandler.js";
import { Profile } from "@/classes/services/profile-service.js"
import { ProfileInitialsSchema } from '@/validation/profile-initials.js';
import auth from '@/classes/services/auth-service.js';


class ClientController extends BlockHandler {

  // Create profile controller
  createInital = this.createControllerWithTx(async (req, res, tx) => {

    const { id } = (req as RequestWithUser).decoded;
    const data = req.body as ProfileInitialsSchema

    const profile = new Profile({ tx, id });

    // // 2. Update user details
    await profile.createInitial(data);

    // // 3. Find or create CommonAddress atomically
    // const address = new Address({ id, tx })
    // await address.create(addr);

    // // Generate tokens
    // const tokens = await auth.generateTokens(id, tx);

    // await auth.setAuthCookies(tokens, res)

    // Send response
    res
      .status(200)
      .json({
        message: "Profile created successfully",
      });
    generalLogger.info(req, {
      action: "Profile created",
      message: "User profile created successfully",
    });
  }).errorMessage("Error in creating profile")

  // Get user data controller
  userData = this.createController(async (req, res) => {
    const data = (req as RequestWithUser).decoded;
    res.status(200).json(data);
  }
  ).errorMessage("Error in getting user data");

  logout = this.createControllerWithTx(async (req, res, tx) => {
    const cookies = req.cookies;
    await tx.refreshToken.deleteMany({
      where: {
        userId: (req as RequestWithUser).decoded.id,
        token: cookies.refreshToken,
      }
    });
    auth.clearCookies(cookies, res);
    res.status(200).json({ message: "User logged out successfully" });
    generalLogger.info(req, {
      action: "User logged out",
      message: "User logged out successfully",
    });
  }).errorMessage("Error in logging out user");


}

export default new ClientController();
