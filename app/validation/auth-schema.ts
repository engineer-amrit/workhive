import { z } from "zod";
import bcrypt from 'bcrypt';

const signUpSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters long"),
    email: z.email("Invalid email address"),
    password: z.object({
        password: z.string().min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string(),
    }).superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirmPassword"], // 👈 attaches error to confirmPassword
            });
        }
    }).transform((data) => {
        const hashedPassword = bcrypt.hashSync(data.password, 10);
        return hashedPassword;
    }),
}).strict();

const loginSchema = z.object({
    email: signUpSchema.shape.email,
    password: z.string("Password is required").min(8, "Password must be at least 8 characters long")
}).strict()

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export { signUpSchema, loginSchema };
