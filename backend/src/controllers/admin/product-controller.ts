import { MediaController } from "@/classes/controllers/mediaController.js";
import { Product } from "@/classes/services/product-service.js";
import { Media } from "@/classes/media.js";
import { generalLogger } from "@/utils/logger.js";
import blockhandler from "@/classes/controllers/blockHandler.js";


class ProductController extends MediaController {
    upload = this.createControllerWithTx(async (req, res, tx) => {
        const product = new Product({ tx });

        // ensure files are present
        await Media.checkImagesExist([req.body.thumbnail, ...(req.body.sideImages)]);

        const created = await product.create(req.body);

        res.status(201).json({
            message: "Product created successfully",
            product: created
        });

        generalLogger.info(req, {
            action: "Product created",
            message: `Product ${created.name} created successfully`,
        });

    }).errorMessage("Error in creating product");

    update = this.createControllerWithTx(async (req, res, tx) => {
        const { id } = req.params;
        const product = new Product({ id, tx });

        // ensure files are present
        await Media.checkImagesExist([req.body.thumbnail, ...(req.body.sideImages)]);

        const updated = await product.update(req.body);

        res.status(200).json({
            message: "Product updated successfully",
            product: updated
        });

        generalLogger.info(req, {
            action: "Product updated",
            message: `Product ${updated.name} updated successfully`,
        });

    }).errorMessage("Error in updating product");

    delete = blockhandler.createControllerWithTx(async (req, res, tx) => {
        const { id } = req.params;
        const product = await Product.delete(id, tx);

        await Media.deleteFiles([product.thumbnail, ...(product.sideImages || [])], req);

        res.status(200).json({
            message: "Product deleted successfully",
            product
        });

        generalLogger.info(req, {
            action: "Product deleted",
            message: `Product with id ${id} deleted successfully`,
        });

    }).errorMessage("Error in deleting product");
}

export const productController = new ProductController();