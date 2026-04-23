import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
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
    Google({ allowDangerousEmailAccountLinking: true }),
    Resend({ from: process.env.EMAIL_FROM }),
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
              token_type: account.token_type ?? null,
              scope: account.scope ?? null,
              id_token: account.id_token ?? null,
            })
            user.id = existing.id
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
