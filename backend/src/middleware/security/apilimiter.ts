// express rate limiter
import config from "@/config/config.js";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
// create a rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes"
  },
});

export default async function apilimiter(req: Request, res: Response, next: NextFunction) {
  if (config.NODE_ENV === "production")
    await limiter(req, res, next);
  else
    next();
};
