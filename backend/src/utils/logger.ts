import winston from "winston";
import path from "path";
import { ensureDirectoryExists } from "./ensure-dir.js";
import config from "../config/config.js";
import { Request } from "express";
import { RequestWithUser } from '../middleware/auth/tokenVerifier-middleware.js';
import DailyRotateFile from "winston-daily-rotate-file";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.resolve(__dirname, "../../logs");
ensureDirectoryExists(logsDir);

interface LogEntry {
  status?: number;
  action?: string;
  responseTime?: number;
  message?: string;
}

class CustomLogger {
  private logger: winston.Logger;

  constructor(type: "access" | "general") {
    const isAccess = type === "access";
    const transports: winston.transport[] = [];

    const commonFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    );

    // Console logger for development
    if (config.NODE_ENV === "development") {
      transports.push(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ level, message }) => {
            const msg = typeof message === 'object' ? JSON.stringify(message) : message;
            return `${level}: ${msg}`;
          })
        )
      }));
    }

    // Helper to create rotated file transport
    const createRotatingTransport = (
      folder: string,
      level: string,
      filterFn?: (info: winston.Logform.TransformableInfo) => boolean
    ) => {
      const dir = path.join(logsDir, folder);
      ensureDirectoryExists(dir);

      const filters = filterFn
        ? winston.format((info) => (filterFn(info) ? info : false))()
        : winston.format((info) => info)();

      return new DailyRotateFile({
        filename: path.join(dir, `${folder}-%DATE%.log`),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "10m",
        maxFiles: "30d",
        level,
        utc: true,
        format: winston.format.combine(filters, commonFormat),
      });
    };

    // Setup transports
    if (isAccess) {
      transports.push(createRotatingTransport("access", "info"));
    } else {
      transports.push(createRotatingTransport("info", "info", (info) => info.level === "info"));
      transports.push(createRotatingTransport("warn", "warn", (info) => info.level === "warn"));
      transports.push(createRotatingTransport("error", "error"));
    }

    this.logger = winston.createLogger({
      level: "info",
      transports,
    });
  }

  private baseLog(req: Request, log: LogEntry) {
    const decoded = (req as RequestWithUser).decoded;
    const userId = decoded?.id || "guest";
    const Log = {
      userId,
      method: req.method,
      url: req.originalUrl,
      status: log.status,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      referrer: req.headers['referer'] || req.headers['referrer'],
      ...log
    };
    return { message: Log };
  }

  info(req: Request, log: LogEntry) {
    this.logger.info(this.baseLog(req, log));
  }

  warn(req: Request, log: LogEntry) {
    this.logger.warn(this.baseLog(req, log));
  }

  error(req: Request, log: LogEntry) {
    this.logger.error(this.baseLog(req, log));
  }
}

export const generalLogger = new CustomLogger("general");
export const accessLogger = new CustomLogger("access");
