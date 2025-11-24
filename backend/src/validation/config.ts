import z from "zod";

export const envSchema = z.object({
    DATABASE_URL: z.url(),
    PORT: z.coerce.number(),
    API_KEY: z.string().min(1),
    CLIENT_URL: z.url(),
    DOMAIN: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "staging"]).default("development"),
    HOST: z.string().min(1).default("localhost"),
    SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
    EMAIL_USER: z.string().min(1),
    EMAIL_PASSWORD: z.string().min(1),
}).strict();
export type Env = z.infer<typeof envSchema>;