import fs from "fs";
import sharp from "sharp";
import { BlockHandler } from "@/classes/controllers/blockHandler.js";
import { CustomError } from "@/classes/customError.js";
import { Product } from "@/classes/services/product-service.js";
import { ValidReq } from "@/middleware/validation/validate-middleware.js";
import { NodeQuary, ProductQuery } from "@app/schema";


class PublicController extends BlockHandler {

    cdn = this.createController(async (req, res) => {
        const { w, h, url } = req.query as { w?: string; h?: string; url: string };


        if (!url) {
            throw new CustomError({
                status: 400,
                message: "URL query parameter is required.",
                extraDetails: "Please provide a valid URL to the image.",
            });
        }



        // 🔹 Check if the file exists asynchronously
        await fs.promises.access(url);

        // Parse width and height, defaulting to null if not provided
        const width = w ? parseInt(w) : undefined;
        const height = h ? parseInt(h) : undefined;

        // Open file stream
        const fileHandle = await fs.promises.open(url, 'r');
        const readStream = fileHandle.createReadStream();

        let transformer = sharp();

        // Apply resizing without cropping
        if (width || height) {
            transformer = transformer.resize(width, height, { fit: "inside" });
        }

        // Stream the processed image back to the client
        res.type("image/jpeg");

        readStream
            .pipe(transformer)
            .pipe(res)
            .on("finish", async () => {
                await fileHandle.close(); // Close the file descriptor after response ends
            });

        readStream.on("error", async (err) => {
            console.error("Stream Read Error:", err);
            await fileHandle.close();
            res.status(500).send("Error reading file.");
        });

        transformer.on("error", async (err) => {
            console.error("Sharp Processing Error:", err);
            await fileHandle.close();
            res.status(500).send("Error processing image.");
        });
    }).errorMessage("Failed to process image from CDN.");

    products = this.createControllerWithTx(async (req, res, tx) => {
        const product = new Product({ tx });
        const ValidQuery = (req as ValidReq).ValidQuery as ProductQuery;
        // if ((req as RequestWithUser).decoded.role.name !== "ADMIN" && ValidQuery.status && ValidQuery.status === "DRAFT") {
        //     throw new CustomError({
        //         message: "Unauthorized to access draft products",
        //         status: 403
        //     });
        // }
        const { products, nextPage } = await product.getProducts(ValidQuery);
        res.status(200).json({
            message: "Products fetched successfully",
            products,
            nextPage
        });
    }).errorMessage("Error in fetching products");

    search = this.createControllerWithTx(async () => {

    }).errorMessage("Error in fetching product suggestions");

    node = this.createControllerWithTx(async (req, res, tx) => {
        const { type, include } = (req as ValidReq).ValidQuery as NodeQuary;
        const product = new Product({ tx });
        let node: {
            [key: string]: unknown
        } = {};
        if (type !== "GROUP") {
            node = {
                [type.toLowerCase()]: await product.getnode(type)
            }
        } else if (include) {
            for (const t of include) {
                node[t.toLowerCase()] = await product.getnode(t);
            }
        }

        res.status(200).json({
            message: "Node fetched successfully",
            ...node
        });
    }).errorMessage("Error in fetching categories");

    getProduct = this.createControllerWithTx(async (req, res, tx) => {
        const { id, slug } = req.params;
        const product = await Product.get({ id, slug }, tx);

        if (!product) {
            throw new CustomError({
                message: "Product not found",
                status: 404
            });
        }

        res.status(200).json({
            message: "Product details fetched successfully",
            product
        });
    }).errorMessage("Error in fetching product details");

    suggestions = this.createControllerWithTx(async (req, res, tx) => {
        const { search } = req.params as unknown as Required<Pick<ProductQuery, "search">>;
        const suggestions = await Product.suggestions(search, tx);
        res.status(200).json({
            message: "Product suggestions fetched successfully",
            suggestions
        });
    }).errorMessage("Error in fetching product suggestions");
}
export const publicController = new PublicController();