import express from "express";
import validator from "../middleware/validation/validate-middleware.js";
import clientController from "../controllers/client-controller.js";
import { profileInitialsSchema } from "@/validation/profile-initials.js";

const router: express.Router = express.Router();

router.post(
    "/initials",
    validator({
        body: profileInitialsSchema,
    }),
    clientController.createInital
);

router.get("/", clientController.userData)

router.get("/logout", clientController.logout);

export default router;
