import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { handleGoogleSignUp } from "@/app/auth/register/_actions/register";
import { authenticateUser } from "@/app/auth/login/_actions/login";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const result = await authenticateUser(
          credentials.email as string,
          credentials.password as string
        );

        if (result.success && result.user) {
          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.fullName,
            image: result.user.avatar,
            role: result.user.role,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email && user.name) {
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const selectedRole = cookieStore.get("pending-role")?.value;

          const role =
            (selectedRole as "customer" | "teacher" | "admin") || "customer";

          const result = await handleGoogleSignUp(
            {
              email: user.email,
              name: user.name,
              image: user.image || undefined,
            },
            role
          );

          user.id = result.userId;
          (user as any).role = role;

          cookieStore.delete("pending-role");

          return true;
        } catch {
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, session, trigger }) {
      if (trigger === "update" && session?.image) token.image = session.image;

      if (user) {
        token.userId = user.id;
        token.role = (user as any).role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string;
      if (token.role)
        session.user.role = token.role as "customer" | "teacher" | "admin";
      if (token.image) session.user.image = token.image as string;

      return session;
    },
  },
});
