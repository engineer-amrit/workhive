import auth from "@/classes/services/auth-service.js"
import { generalLogger } from "../utils/logger.js";
import { BlockHandler } from "@/classes/controllers/blockHandler.js";
import { Profile } from "@/classes/services/profile-service.js";
import { SignUpSchema, LoginSchema, ResetPasswordSchema } from "@/validation/auth-schema.js";
import bcrypt from 'bcrypt';
import { CustomError } from "@/classes/customError.js";

class AuthController extends BlockHandler {

  // Send OTP controller
  login = this.createControllerWithTx(async (req, res, tx) => {
    const data = req.body as LoginSchema;
    const user = await tx.user.findUniqueOrThrow({
      where: { email: data.email },
    });
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new CustomError({
        status: 401,
        message: "Invalid credentials",
        extraDetails: "Password does not match",
      })
    }
    const tokens = await auth.generateTokens(user.id, tx, true)
    await auth.setAuthCookies(tokens, res);
    res.status(200).json({ message: "User logged in successfully" });
    // log the details
    generalLogger.info(req, {
      action: "User logged in",
      message: "User logged in successfully",
    });
  }).errorMessage('Error in logging in user');

  // Verify OTP controller
  signup = this.createControllerWithTx(async (req, res, tx) => {

    const data = req.body as SignUpSchema;

    const profile = new Profile({ tx });

    const user = await profile.create(data)

    const tokens = await auth.generateTokens(user.id, tx, true)

    await auth.setAuthCookies(tokens, res);

    res.status(200).json({ message: "user registered successfully", user });

    // log the details
    generalLogger.info(req, {
      action: "user registered",
      message: "user registered successfully",
    });
  }).errorMessage('Error in registering user');

  // Forget password controller
  forgetPassword = this.createControllerWithTx(async (req, res, tx) => {
    const data = req.body as Pick<SignUpSchema, 'email'>;

    await auth.sendResetPasswordEmail(tx, data.email);
    res.status(200).json({ message: "Reset link has been sent your mail" });

    generalLogger.info(req, {
      action: "Password reset email sent",
      message: "Password reset email sent successfully",
    });

  }).errorMessage('Error in resetting password');


  // Reset password controller
  resetPassword = this.createControllerWithTx(async (req, res, tx) => {
    const data = req.body as ResetPasswordSchema;
    await auth.resetPassword(tx, data);
    res.status(200).json({ message: "Password has been reset successfully" });
  }).errorMessage('Error in resetting password');
}

export default new AuthController();


