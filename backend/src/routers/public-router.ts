import { publicController } from "../controllers/public/public-controller.js";
import express from "express";
import { nodeQuarySchema, productQuerySchema } from "@app/schema";
import validator from "@/middleware/validation/validate-middleware.js";


const router: express.Router = express.Router();

// get
router.get(
    "/product",
    validator({
        query: productQuerySchema
    })
    , publicController.products
);
router.get(
    "/product/:slug/:id",
    publicController.getProduct
);

router.get(
    "/node",
    validator({
        query: nodeQuarySchema
    }),
    publicController.node
)

router.get(
    "/search",
    publicController.search
);

router.get("/product-suggestions/:search", validator({
    params: productQuerySchema.pick({
        search: true
    }).required()
}), publicController.suggestions);

export default router;