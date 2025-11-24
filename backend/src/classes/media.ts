// src/classes/Media.ts
import fs from "fs/promises";
import { CustomError } from "./customError.js";
import { generalLogger } from "@/utils/logger.js";
import { Request } from "express";

export class Media {
    static async checkPath(filePath: string): Promise<void> {
        try {
            await fs.access(filePath);
        } catch (e) {
            throw new CustomError({
                status: 400,
                message: "File not found",
                extraDetails: `The file path ${filePath} does not exist.`,
            });
        }
    }

    static async deleteFile(filePath: string, req: Request): Promise<void> {
        try {
            await fs.rm(filePath, { recursive: true });
        } catch (e) {
            generalLogger.error(req, {
                action: "File Deletion Failed at path " + filePath,
                message: e instanceof Error ? e.message : String(e),
            })
        }
    }

    // 🔥 New Optimized Methods (MULTIPLE FILES)

    static async checkImagesExist(filePaths: string[]): Promise<void> {
        await Promise.all(filePaths.map((path) => this.checkPath(path)));
    }

    static async deleteFiles(filePaths: string[], req: Request): Promise<void> {
        await Promise.all(filePaths.map((path) => this.deleteFile(path, req)));
    }
}
