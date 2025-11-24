import express from "express";
import upload, { pathExtractor } from "../middleware/multer-middleware.js";
import { productController } from "../controllers/admin/product-controller.js";
// import { offerController } from "../controllers/admin/offer-controller";
// import { BannerController } from "../controllers/admin/banner-controller";
// import { logController } from "../controllers/admin/logs-controller";
// import { userController } from "../controllers/admin/user-controller";
// import { serviceController } from "../controllers/admin/services-controller";
import validator from "../middleware/validation/validate-middleware.js";
import { productBack } from "@app/schema";
// import { bannerSchema } from "@/validations/banner-schema";
import { adminAuth } from '@/middleware/auth/admin-auth.js'


const router: express.Router = express.Router();

const productMedia = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "sideImages", maxCount: 6 },
]);

// const offerMedia = upload.single("thumbnail");

// const bannerMedia = upload.single("banner");

router.use(adminAuth);


// post 
router.post(
  "/product", productMedia, pathExtractor, validator({
    body: productBack
  }), productController.upload
);

// put
router.put(
  "/product/:id",
  productMedia,
  pathExtractor,
  validator({
    body: productBack
  }),
  productController.update
);

// delete 
router.delete(
  "/product/:id",
  productController.delete
);


export default router;
