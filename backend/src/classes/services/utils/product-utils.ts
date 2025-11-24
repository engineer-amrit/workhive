import { ProductBack, ProductQuery } from "@app/schema";
import { BaseModel, Iopt } from "../baseModel.js";
import { customAlphabet } from "nanoid";
import { NodeType, Prisma } from "@prisma/client";

import { CustomError } from "@/classes/customError.js";
import { QueryFilterBuilder } from "./QueryFilter.js";

interface Product extends Omit<ProductBack, 'sku'> {
    sku: string;
    slug: string;
}

export class ProductUtils extends BaseModel {
    private nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);

    constructor(parameters: Iopt) {
        super(parameters);
    }

    static defaultSelect: Prisma.ProductSelect = {
        id: true,
        name: true,
        brand: {
            select: {
                name: true
            }
        },
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
        unit: {
            select: {
                name: true
            }
        },
        magnitude: true,
        discount: true,
        gst: true,
        slug: true,
        sku: true,
        thumbnail: true,
        price: true,
        stock: true,
        createdAt: true,
        updatedAt: true,
        draft: true,
        upComing: true,
    }


    getSku = () => {
        return this.nanoid();
    }

    slugify = (name: string, brand: String) => {
        return name
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-') +
            '-' + brand.toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-');        // Replace multiple - with single -
    }

    async node(name: string, type: NodeType, parentId?: string) {
        // Try to find an existing node
        let existing = await this.tx.node.findFirst({
            where: {
                name,
                type,
                ...(parentId ? { parentId } : {}),
            },
            select: { id: true },
        });

        // If not found, create one
        if (!existing) {
            existing = await this.tx.node.create({
                data: {
                    name,
                    type,
                    ...(parentId ? { parentId } : {}),
                },
                select: { id: true },
            });
        }

        return existing;
    }

    createProduct = async (data: Product) => {
        const { category, subCategory, brand, unit, ...rest } = data;
        const cat = await this.node(category, NodeType.CATEGORY);
        const subCat = await this.node(subCategory, NodeType.SUBCATEGORY, cat.id);
        const brandNode = await this.node(brand, NodeType.BRAND);
        const unitNode = await this.node(unit, NodeType.UNIT);
        return await this.tx.product.create({
            data: {
                subCategoryId: subCat.id,
                brandId: brandNode.id,
                unitId: unitNode.id,
                ...rest
            }
        })
    }

    findProductById = async () => {
        const p = await this.tx.product.findUnique({
            where: { id: this.id },
            select: {
                name: true, brand: {
                    select: { name: true }
                }
            }
        })

        if (!p) throw new CustomError({
            message: "Product not found",
            status: 404
        });

        return p;
    }
    updateProduct = async (data: Product) => {
        const { category, subCategory, brand, unit, ...rest } = data;
        const subcat = await this.node(subCategory, NodeType.SUBCATEGORY);
        const brandNode = await this.node(brand, NodeType.BRAND);
        const unitNode = await this.node(unit, NodeType.UNIT);

        return await this.tx.product.update({
            where: { id: this.id },
            data: {
                subCategoryId: subcat.id,
                brandId: brandNode.id,
                unitId: unitNode.id,
                ...rest
            }
        })
    };
    getProducts = async (query: ProductQuery) => {
        const { start, end } = query.date ? query.date : { start: undefined, end: undefined };
        const q = new QueryFilterBuilder<Prisma.ProductWhereInput>(query);
        q.search([
            "name",
            "description",
            "brand.name",
            "sku",
            "tags[]",
            "features[]"
        ])
            .match("subCategory.name", query.subCategory)
            .match("subCategory.parent.name", query.category)
            .match("brand.name", query.brand)
            .range("price", query.price?.min, query.price?.max)
            .range("createdAt", start, end);
        switch (query.status) {
            case "LIVE":
                q.boolean("draft", false).boolean("upComing", false);
                break;
            case "DRAFT":
                q.boolean("draft", true);
                break;
            case "UPCOMING":
                q.boolean("upComing", true).boolean("draft", false);
                break;
        }

        const { filter, options } = q.build();

        const products = await this.tx.product.findMany({
            where: filter,
            ...options,
            select: ProductUtils.defaultSelect
        });

        return {
            products: products.slice(0, q.limit()),
            nextPage: products.length == options.take ? q.page() + 1 : null
        }
    }
}