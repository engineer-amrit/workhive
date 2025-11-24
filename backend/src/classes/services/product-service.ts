import { Iopt } from "./baseModel.js";
import { ProductUtils } from "./utils/product-utils.js";
import { ProductBack } from "@app/schema";
import { CustomError } from "../customError.js";
import { NodeType, Prisma } from "@prisma/client";
import { QueryFilterBuilder } from "./utils/QueryFilter.js";

interface Get {
    id: string;
    slug: string;
}

interface ProductData extends ProductBack {
    sku: string;
    slug: string;
}
const include = {
    subCategory: {
        select: {
            name: true,
            parent: {
                select: {
                    name: true
                }
            }
        }
    },
    brand: true,
    unit: true,
    reviews: {
        select: {
            rating: true,
            comment: true,
            user: {
                select: {
                    phone: true
                }
            }
        }
    }
}

export class Product extends ProductUtils {
    constructor(parameters: Iopt) {
        super(parameters);
    }

    async create(data: ProductData) {
        // create sku if not provided
        data.sku = data.sku ? data.sku : this.getSku();

        // create slug
        data.slug = this.slugify(data.name, data.brand);

        //create product
        return await this.createProduct(data);
    }
    async update(data: ProductData) {
        // check if product exists
        const existing = await this.findProductById();

        // if name is being updated, update slug
        if (data.name !== existing.name || data.brand !== existing.brand.name) {
            data.slug = this.slugify(data.name, data.brand);
        }
        // update the product
        return await this.updateProduct(data);

    }
    static async delete(id: string, tx: Iopt["tx"]) {
        try {

            return await tx.product.delete({
                where: { id }
            });
        } catch (error) {
            throw new CustomError({
                message: "Product not found",
                status: 404
            })
        }
    }
    static async get(opt: Get, tx: Iopt["tx"]) {
        const { id, slug } = opt;
        let product = await tx.product.findUnique({
            where: { slug },
            include
        });

        if (product?.id !== id) {
            product = await tx.product.findUnique({
                where: { id },
                include
            }
            );
        }
        return product;
    }
    static async suggestions(search: string, tx: Iopt["tx"]) {
        const queruBuilder = new QueryFilterBuilder<Prisma.ProductWhereInput>({ search });
        const { filter, options } = queruBuilder.search(["name", "description", "brand.name", "sku", "tags[]", "features[]"]).build();
        const products = await tx.product.findMany({
            where: filter,
            ...options,
            select: {
                id: true,
                name: true,
                slug: true,
                thumbnail: true,
                subCategory: {
                    select: {
                        parent: {
                            select: { name: true }
                        }
                    }
                }
            }
        });
        return products;
    }

    async getnode(type: NodeType) {
        return await this.tx.node.findMany({
            where: {
                type: type,
            },
            select: type === NodeType.CATEGORY ? {
                name: true,
                id: true,
                children: {
                    select: {
                        name: true,
                    },
                },
            } : {
                name: true,
                id: true,
            },
        });
    }
}