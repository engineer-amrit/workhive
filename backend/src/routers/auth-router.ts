import validator from "../middleware/validation/validate-middleware.js";
import express from "express";
import { signUpSchema, loginSchema, resetPasswordSchema } from "@/validation/auth-schema.js";
import authController from "../controllers/auth-controller.js";

const router: express.Router = express.Router();

// /otp
router.post("/", validator({ body: loginSchema }), authController.login);
router.post("/signup", validator({ body: signUpSchema }), authController.signup);
router.post("/forgot-password", validator({
    body: signUpSchema.pick({
        email: true,
    })
}), authController.forgetPassword);
router.post("/reset-password", validator({
    body: resetPasswordSchema
}), authController.resetPassword);

export default router;
