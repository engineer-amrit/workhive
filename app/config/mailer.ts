
import nodemailer from "nodemailer";
import { env } from "./env";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.EMAIL_USER,  // your email
        pass: env.EMAIL_PASSWORD,  // your app password
    },
});

export function passwordResetEmail(resetLink: string) {
    return {
        subject: "Reset your password",
        text: `Click the link below to reset your password:\n${resetLink}`,
        html: `
      <div style="font-family: Arial; line-height: 1.5;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a 
          href="${resetLink}" 
          style="display:inline-block; padding:10px 15px; background:#007bff; color:white; text-decoration:none; border-radius:5px;"
        >
          Reset Password
        </a>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `
    };
}


