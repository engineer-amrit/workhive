//  improt .env variables
import "dotenv/config";

//  export env variables
export const env = {
    DATABASE_URL: process.env.DATABASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "default_secret",
    DOMAIN: process.env.DOMAIN || "localhost",
    EMAIL_USER: process.env.EMAIL_USER || "",
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
};  