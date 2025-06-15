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
      console.log(user, account);
      // Handle Google OAuth sign-in
      if (account?.provider === "google" && user.email && user.name) {
        try {
          // Get role from cookies (set in registerGoogle function)
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const selectedRole = cookieStore.get("pending-role")?.value;

          const role = (selectedRole as "customer" | "teacher") || "customer";

          const result = await handleGoogleSignUp(
            {
              email: user.email,
              name: user.name,
              image: user.image || undefined,
            },
            role
          );

          // Add user ID to the user object for JWT
          user.id = result.userId;
          user.isNewUser = result.isNewUser;

          if (result.isNewUser) {
            cookieStore.set("new-user-redirect", "google", {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60,
            });
          }

          cookieStore.delete("pending-role");

          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      // Add user info to token
      if (user) {
        token.userId = user.id;
        token.isNewUser = user.isNewUser;
      }

      return token;
    },
    async session({ session, token }) {
      // Add user info to session
      if (token.userId) {
        session.user.id = token.userId as string;
        session.user.isNewUser = token.isNewUser as boolean;
      }

      return session;
    },
  },
});
