import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Nodemailer from "next-auth/providers/nodemailer"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import { db } from "./db"
import { users, accounts, sessions, verificationTokens } from "./db/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
  logger: {
    error: (code, ...message) => console.error("[auth:error]", code, ...message),
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  providers: [
    Google({
      // Basic scopes only — calendar.events is requested via the
      // /api/google/connect-calendar incremental flow so the default
      // sign-up works for every Google user without verification.
      allowDangerousEmailAccountLinking: true,
    }),
    Nodemailer({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Allow linking Google to existing magic-link account
      if (account?.provider === "google" && user?.email) {
        const existing = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        })
        if (existing) {
          const existingAccount = await db.query.accounts.findFirst({
            where: eq(accounts.userId, existing.id),
          })
          if (!existingAccount && account.providerAccountId) {
            await db.insert(accounts).values({
              userId: existing.id,
              type: account.type as "oidc",
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token ?? null,
              refresh_token: account.refresh_token ?? null,
              expires_at: typeof account.expires_at === "number" ? account.expires_at : null,
              token_type: account.token_type ?? null,
              scope: account.scope ?? null,
              id_token: account.id_token ?? null,
            })
            user.id = existing.id
          } else if (existingAccount && account.provider === "google") {
            // Refresh stored tokens on subsequent sign-ins so calendar scope sticks
            await db
              .update(accounts)
              .set({
                access_token: account.access_token ?? existingAccount.access_token,
                refresh_token: account.refresh_token ?? existingAccount.refresh_token,
                expires_at:
                  typeof account.expires_at === "number"
                    ? account.expires_at
                    : existingAccount.expires_at,
                scope: account.scope ?? existingAccount.scope,
                id_token: account.id_token ?? existingAccount.id_token,
              })
              .where(eq(accounts.userId, existing.id))
          }
        }
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
  },
})
