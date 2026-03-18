import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

// Quando o backend está em `backend/`, o `.env` pode estar na raiz do monorepo.
// Carregamos o `.env` local se existir; caso contrário, tentamos a raiz.
const localEnv = resolve(process.cwd(), ".env");
const rootEnv = resolve(process.cwd(), "..", ".env");
const envPath = existsSync(localEnv) ? localEnv : rootEnv;
dotenv.config({ path: envPath });

export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",

  database: {
    url:
      process.env.DATABASE_URL ||
      "postgres://postgres:postgres@localhost:5432/job_email_sender",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "change-me-in-production",
    expiresIn: "7d",
  },

  smtp: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
  },

  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY || "",
    domain: process.env.MAILGUN_DOMAIN || "",
    from: process.env.MAILGUN_FROM || "",
  },

  resend: {
    apiKey: process.env.RESEND_API_KEY || "",
    from: process.env.RESEND_FROM || "onboarding@resend.dev",
  },

  brevo: {
    user: process.env.BREVO_USER || "",
    pass: process.env.BREVO_PASS || "",
    from: process.env.BREVO_FROM || "",
  },

  senderName: process.env.SENDER_NAME || "Marcielle Paula",

  admin: {
    email: process.env.ADMIN_EMAIL || "admin@admin.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
    name: process.env.ADMIN_NAME || "Admin",
  },

  delayMs: Number(process.env.EMAIL_DELAY_MS) || 7000,

  cors: {
    origin: process.env.CORS_ORIGIN || true,
  },
};
