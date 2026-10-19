// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/db-types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      companyId: string | null;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    companyId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    companyId: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  // The adapter persists OAuth Account rows. It's optional for
  // credentials-only sign-in (which uses JWT sessions), but required
  // for OAuth — without it, NextAuth can't remember which Google or
  // GitHub identity maps to which local user.
  adapter: PrismaAdapter(prisma) as never,

  // Force JWT sessions even with an adapter. The default with an
  // adapter is database sessions, but our session shape (role,
  // companyId) comes from the token and would need extra plumbing
  // to fetch per-request from the DB.
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 hours

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Uncomment only if you trust Google to have verified emails
      // that might also exist on a credentials account. Left off by
      // default to prevent account takeover.
      // allowDangerousEmailAccountLinking: true,
    }),

         FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email ?? `${profile.id}@facebook.local`,
          image: profile.picture?.data?.url ?? null,
          role: "EMPLOYER",
          companyId: null,
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Credentials sign-in: `user` is the object returned from
      // `authorize()`, so all fields are present.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.companyId = user.companyId ?? null;
      }

      // OAuth first sign-in: `user` comes from the adapter, which
      // only knows about id/email/name/image. `role` and `companyId`
      // are not populated. Fall back to EMPLOYER (schema default) and
      // null company. The user completes their company profile later.
      if (account && (account.provider === "google" || account.provider === "facebook")) {
        if (!token.role) token.role = "EMPLOYER";
        if (token.companyId === undefined) token.companyId = null;
      }

      // On subsequent visits, the token already carries role and
      // companyId. But if the user has since updated their company
      // (via the profile-completion flow), the token is stale. Pull
      // fresh values from the DB whenever we have an id.
      if (token.id && (!user || account)) {
        // Only re-fetch when not already covered above. On OAuth
        // first sign-in the adapter already created the user; on
        // subsequent visits, this refreshes role/company if they
        // changed server-side.
        const fresh = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, companyId: true },
        });
        if (fresh) {
          token.role = fresh.role;
          token.companyId = fresh.companyId;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.companyId = token.companyId;
      return session;
    },
  },
};

/** Shortcut for server components and route handlers. */
export function auth() {
  return getServerSession(authOptions);
}