import { z } from "zod";

enum Role {
    DEVELOPER = "DEVELOPER",
    DESIGNER = "DESIGNER",
    PRODUCT_MANAGER = "PRODUCT_MANAGER",
    MARKETING = "MARKETING",
    STUDENT = "STUDENT",
    OTHER = "OTHER"
}

enum Size {
    SOLO = "SOLO",
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE"
}

enum UseCase {
    PERSONAL = "PERSONAL",
    TEAM = "TEAM",
    DOCUMENTATION = "DOCUMENTATION",
    PROJECT_MANAGEMENT = "PROJECT_MANAGEMENT",
    KNOWLEDGE_BASE = "KNOWLEDGE_BASE",
}

const enumPreprocess = (arg: string) => {
    if (typeof arg === "string") {
        return arg.toUpperCase();
    }
}


export const profileInitialsSchema = z.object({
    role: z.preprocess(enumPreprocess, z.enum(Role, "Invalid role selected")),
    useCase: z.preprocess(enumPreprocess, z.enum(UseCase, "Invalid use case selected")),
    teamSize: z.preprocess(enumPreprocess, z.enum(Size, "Invalid team size selected")),
}).strict();

export type ProfileInitialsSchema = z.infer<typeof profileInitialsSchema>;