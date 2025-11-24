// src/utils/QueryFilterBuilder.ts
import { ProductQuery } from "@app/schema";

export type Query = ProductQuery;

interface Options {
    skip: number;
    take: number;
    orderBy: Record<string, "asc" | "desc">;
}

/**
 * Generic Query Filter Builder for Prisma-like queries.
 * Example:
 * new QueryFilterBuilder<Product>(query)
 *   .search(["name", "description"], query.keyword)
 *   .match("categoryId", query.category)
 *   .build()
 */
export class QueryFilterBuilder<T extends Record<string, any>> {
    private filter: Record<string, any> = {};
    private options: Options;
    private query: Query;

    constructor(query: Query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const sortField = query.sort?.key ?? "createdAt";
        const sortOrder = query.sort?.order ?? "desc";
        this.query = query;

        this.options = {
            orderBy: { [sortField]: sortOrder },
            skip: (page - 1) * limit,
            take: limit + 1,
        };
    }


    search(fields: string[]) {
        const keyword = this.query.search;
        if (!keyword || !fields.length) return this;

        this.filter.OR = fields.map((field) => {
            const path = field.split('.'); // e.g. ["brand", "name"]

            return this.nestedObject(path, keyword);
        });

        return this;
    }

    nestedObject(path: string[], value: string): Record<string, any> {
        const nested = path.reduceRight((acc, key, index) => {
            if (index === path.length - 1) {
                // last key → actual search condition
                if (key.includes("[]")) return { [key.replace("[]", "")]: { has: value } };
                else if (key.includes("-")) return { [key.replace("-", "")]: value };
                return { [key]: { contains: value, mode: "insensitive" } };
            }
            return { [key]: acc };
        }, {} as any);

        return nested;
    }

    /** Adds an exact match filter */
    match(field: string, value: any) {
        if (value !== undefined && value !== null) {
            // nested field support
            const path = field.split('.'); // e.g. ["subCategory", "name"]
            const nested = this.nestedObject(path, value);
            this.filter = { ...this.filter, ...nested };
        }
        return this;
    }

    /** Adds boolean equality filter */
    /** Adds boolean equality filter — skips if value is undefined or null */
    boolean(field: keyof T | undefined, condition?: boolean | string | null | undefined) {
        if (condition === undefined || condition === null || !field) return this; // skip entirely

        // Convert string "true"/"false" to real boolean
        const value =
            typeof condition === "string"
                ? condition.toLowerCase() === "true"
                : Boolean(condition);

        this.filter[field as string] = value;
        return this;
    }

    /** Adds tags (in array) filter */
    tags(field: keyof T, value: string) {
        if (value) {
            const tags = Array.isArray(value) ? value : [value];
            this.filter[field as string] = { in: tags };
        }
        return this;
    }

    /** Adds range filter for numbers or dates */
    range(field: keyof T, min?: number | Date, max?: number | Date) {
        this.filter[field as string] = {
            ...(min !== undefined ? { gte: min } : {}),
            ...(max !== undefined ? { lte: max } : {}),
        };
        return this;
    }

    /** Returns final Prisma-ready filter and pagination options */
    build() {
        return {
            filter: this.filter,
            options: this.options,
        };
    }

    limit() {
        if ("limit" in this.query)
            return this.query.limit;
        else {
            return 10;
        }
    }

    page() {
        return this.query.page || 1;
    }
}
