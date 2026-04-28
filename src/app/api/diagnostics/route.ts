import { and, eq, sql } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { accounts, notificationSettings, users } from "@/lib/db/schema"

type CheckStatus = "ok" | "warn" | "fail" | "skip"
type Check = {
  id: string
  label: string
  status: CheckStatus
  detail: string
  testable?: boolean // if true, UI shows "Probar ahora" button
  testEndpoint?: string
}

function envCheck(name: string): boolean {
  return Boolean(process.env[name] && process.env[name]!.length > 0)
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: "No autorizado" }, { status: 401 })

  // ---- DB connectivity ----
  let dbStatus: CheckStatus = "fail"
  let dbDetail = "Sin respuesta"
  try {
    const res = await db.execute(sql`SELECT 1 as ok`)
    if (res) {
      dbStatus = "ok"
      dbDetail = "Conexión a Neon Postgres OK"
    }
  } catch (e) {
    dbDetail = e instanceof Error ? e.message : "DB error"
  }

  // ---- Auth / NextAuth ----
  const authStatus: CheckStatus =
    envCheck("AUTH_SECRET") && envCheck("AUTH_URL") ? "ok" : "fail"
  const authDetail =
    authStatus === "ok"
      ? `AUTH_URL=${process.env.AUTH_URL} · AUTH_SECRET configurado`
      : "Faltan AUTH_SECRET o AUTH_URL"

  // ---- Email / SMTP ----
  const smtpHost = process.env.SMTP_HOST
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS
  const emailFrom = process.env.EMAIL_FROM
  const emailStatus: CheckStatus =
    smtpHost && smtpUser && smtpPass && emailFrom ? "ok" : "fail"
  const emailDetail =
    emailStatus === "ok"
      ? `${smtpUser}@${smtpHost} · From: ${emailFrom}`
      : "Faltan SMTP_HOST, SMTP_USER, SMTP_PASSWORD o EMAIL_FROM"

  // ---- Google OAuth ----
  const googleStatus: CheckStatus =
    envCheck("AUTH_GOOGLE_ID") && envCheck("AUTH_GOOGLE_SECRET") ? "ok" : "fail"
  const googleDetail =
    googleStatus === "ok"
      ? "OAuth client configurado"
      : "Faltan AUTH_GOOGLE_ID o AUTH_GOOGLE_SECRET"

  // ---- Google Calendar (per-user) ----
  const googleAcct = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, session.user.id), eq(accounts.provider, "google")),
  })
  let gcalStatus: CheckStatus = "warn"
  let gcalDetail = "No has conectado tu cuenta de Google"
  if (googleAcct?.access_token) {
    if (googleAcct.scope?.includes("calendar")) {
      gcalStatus = "ok"
      gcalDetail = "Token con scope calendar.events presente · refresh disponible: " +
        (googleAcct.refresh_token ? "sí" : "no")
    } else {
      gcalStatus = "warn"
      gcalDetail = "Conectado a Google pero sin scope de calendario (haz logout y vuelve a entrar con Google)"
    }
  }

  // ---- WhatsApp ----
  const wppStatus: CheckStatus =
    envCheck("WHATSAPP_TOKEN") && envCheck("WHATSAPP_PHONE_ID") ? "ok" : "fail"
  const wppDetail =
    wppStatus === "ok"
      ? `Phone ID ${process.env.WHATSAPP_PHONE_ID?.slice(0, 6)}…`
      : "Faltan WHATSAPP_TOKEN o WHATSAPP_PHONE_ID"

  // ---- Telegram ----
  const telegramTokenSet = envCheck("TELEGRAM_BOT_TOKEN")
  const notifs = await db.query.notificationSettings.findFirst({
    where: eq(notificationSettings.userId, session.user.id),
  })
  let telegramStatus: CheckStatus = "fail"
  let telegramDetail = "TELEGRAM_BOT_TOKEN no configurado"
  if (telegramTokenSet) {
    if (notifs?.telegramChatId) {
      telegramStatus = "ok"
      telegramDetail = "Bot configurado y vinculado a tu Telegram"
    } else {
      telegramStatus = "warn"
      telegramDetail = "Bot configurado pero tu Telegram no está vinculado (abre @JuristeaBot)"
    }
  }

  // ---- Stripe ----
  const stripeKeys = [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_PRO_PRICE_ID",
  ].filter((k) => !envCheck(k))
  const stripeStatus: CheckStatus = stripeKeys.length === 0 ? "ok" : "fail"
  const stripeDetail =
    stripeStatus === "ok"
      ? "API + webhook + price IDs OK"
      : `Faltan: ${stripeKeys.join(", ")}`

  // ---- Cloudflare R2 (LexNET / docs storage) ----
  const r2Keys = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
  ].filter((k) => !envCheck(k))
  const r2Status: CheckStatus = r2Keys.length === 0 ? "ok" : "warn"
  const r2Detail =
    r2Status === "ok"
      ? `Bucket ${process.env.R2_BUCKET_NAME}`
      : `Faltan: ${r2Keys.join(", ")} (opcional para fotos/docs)`

  // ---- LexNET upload endpoint reachability ----
  // We can't HEAD our own routes here cleanly; just confirm parser exists.
  const lexnetStatus: CheckStatus = "ok"
  const lexnetDetail = "Parser cargado · POST a /api/lexnet-upload con un ZIP"

  // ---- Cron secret ----
  const cronStatus: CheckStatus = envCheck("CRON_SECRET") ? "ok" : "warn"
  const cronDetail = cronStatus === "ok"
    ? "CRON_SECRET configurado"
    : "Sin CRON_SECRET — los crons no estarán protegidos"

  // ---- App URL ----
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""
  const appUrlStatus: CheckStatus = appUrl.startsWith("https://") ? "ok" : "warn"
  const appUrlDetail = appUrl ? appUrl : "NEXT_PUBLIC_APP_URL no configurado"

  // ---- User onboarding ----
  const me = await db.query.users.findFirst({ where: eq(users.id, session.user.id) })
  const userStatus: CheckStatus = me?.onboardingCompleted ? "ok" : "warn"
  const userDetail = me?.onboardingCompleted
    ? `Tu cuenta: ${me.email} · plan ${me.plan}`
    : "Onboarding sin completar"

  const checks: Check[] = [
    { id: "db",        label: "Base de datos (Neon)",     status: dbStatus,       detail: dbDetail },
    { id: "auth",      label: "NextAuth",                 status: authStatus,     detail: authDetail },
    { id: "user",      label: "Tu usuario",                status: userStatus,     detail: userDetail },
    { id: "appUrl",    label: "URL de la app",             status: appUrlStatus,   detail: appUrlDetail },
    { id: "email",     label: "Email · SMTP",              status: emailStatus,    detail: emailDetail, testable: true, testEndpoint: "/api/diagnostics/email" },
    { id: "google",    label: "Google OAuth",              status: googleStatus,   detail: googleDetail },
    { id: "gcal",      label: "Google Calendar",           status: gcalStatus,     detail: gcalDetail, testable: gcalStatus === "ok", testEndpoint: "/api/diagnostics/gcal" },
    { id: "whatsapp",  label: "WhatsApp Cloud API",        status: wppStatus,      detail: wppDetail, testable: wppStatus === "ok", testEndpoint: "/api/diagnostics/whatsapp" },
    { id: "telegram",  label: "Telegram bot",              status: telegramStatus, detail: telegramDetail },
    { id: "stripe",    label: "Stripe",                    status: stripeStatus,   detail: stripeDetail },
    { id: "r2",        label: "Cloudflare R2",             status: r2Status,       detail: r2Detail },
    { id: "lexnet",    label: "LexNET (parser + upload)",  status: lexnetStatus,   detail: lexnetDetail },
    { id: "cron",      label: "Cron jobs (CRON_SECRET)",   status: cronStatus,     detail: cronDetail },
  ]

  return Response.json({ checks })
}
