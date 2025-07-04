import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/database";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Example: Google OAuth (remove if not needed)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Credentials (email/password) provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.hashedPassword) {
          throw new Error("No user found with this email");
        }
        const isValid = await compare(credentials.password, user.hashedPassword);
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || undefined,
          role: user.role,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "";
        // Include user profile fields in session
        session.user.image = token.image as string | undefined;
        session.user.name = token.name as string | undefined;
        session.user.firstName = token.firstName as string | undefined;
        session.user.lastName = token.lastName as string | undefined;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.image = user.image;
        token.name = user.name;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
      }
      
      // Always fetch role from DB if missing, even for OAuth
      if (!token.role && token.sub) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        token.role = dbUser?.role || "user";
        // Also fetch other profile fields
        if (dbUser) {
          token.image = dbUser.image || undefined;
          token.name = dbUser.name || undefined;
          token.firstName = dbUser.firstName || undefined;
          token.lastName = dbUser.lastName || undefined;
        }
      }
      //if user has admin role allow to access admin routes
      if (account?.provider === "google" && !token.role) {
        const dbUser = await prisma.user.findUnique({ where: { email: user?.email || "" } });
        if (dbUser) {
          token.role = dbUser.role || "user";
          // Also fetch other profile fields for OAuth users
          token.image = dbUser.image || undefined;
          token.name = dbUser.name || undefined;
          token.firstName = dbUser.firstName || undefined;
          token.lastName = dbUser.lastName || undefined;
        } else {
          token.role = "user"; // Default role if not found
        }
      } 
      return token;
    },
    
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // events, debug, etc. can be added here
};

export default NextAuth(authOptions);