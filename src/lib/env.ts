import { z } from "zod"

const serverSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Auth
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),

  // Cron
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),

  // OpenAI (optional — AI analysis degrades gracefully)
  OPENAI_API_KEY: z.string().optional(),

  // Stripe (optional until billing is live)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRO_PRICE_ID: z.string().optional(),

  // Email (SMTP — optional, email alerts degrade gracefully)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // Telegram (optional — telegram alerts degrade gracefully)
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_WEBHOOK_SECRET: z.string().optional(),

  // R2 (optional)
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_URL: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().min(1, "NEXT_PUBLIC_APP_URL is required"),
  NEXT_PUBLIC_APP_NAME: z.string().min(1, "NEXT_PUBLIC_APP_NAME is required"),

  // Google OAuth (optional until auth is configured)
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
})

function validateEnv() {
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    return process.env as unknown as z.infer<typeof serverSchema>
  }

  const parsed = serverSchema.safeParse(process.env)

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    const missing = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(", ")}`)
      .join("\n")
    console.error(`[env] Missing or invalid environment variables:\n${missing}`)
    throw new Error(`Invalid environment variables:\n${missing}`)
  }

  return parsed.data
}

export const env = validateEnv()
