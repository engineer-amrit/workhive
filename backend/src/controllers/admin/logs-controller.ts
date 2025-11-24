import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path from "path";
import config from "../../config/config.js";

const getLogs = async (req: Request, res: Response, next: NextFunction) => {
    const { level, timestamp } = req.query as {
        level: string;
        timestamp: string;
    };
    try {
        // get file name based on the level
        if (!timestamp) {
            return next({
                status: 400,
                message: "Timestamp is required",
            });
        }
        const fileName = `${level}-${new Date(timestamp).toISOString().split("T")[0]
            }.log`;
        const filePath = path.join(__dirname, "../logs", level, fileName);

        // read the file
        const logs = await fs.readFile(filePath, "utf-8");
        res.status(200).json({ logs });
    } catch (e) {
        if (e instanceof Error) {
            return next({
                status: 500,
                message: "Error in fetching logs",
                extraDetails: config.NODE_ENV === "development" ? e.message : undefined,
            });
        }
    }
};

export const logController = { getLogs };