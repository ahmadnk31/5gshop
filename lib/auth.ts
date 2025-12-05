import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/database";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Note: Using JWT strategy, so we don't need PrismaAdapter for sessions
  // adapter: PrismaAdapter(prisma),
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
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.hashedPassword) {
          return null;
        }
        
        // Check if user is banned
        if (user.role === 'BANNED') {
          return null; // Return null for banned users
        }
        
        const isValid = await compare(credentials.password, user.hashedPassword);
        if (!isValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || undefined,
          role: user.role,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          emailVerified: user.emailVerified || undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if user is banned during sign in
      if (user && user.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser && dbUser.role === 'BANNED') {
          return false; // Prevent sign in for banned users
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "";
        // Include user profile fields in session
        session.user.image = token.image as string | undefined;
        session.user.name = token.name as string | undefined;
        session.user.firstName = token.firstName as string | undefined;
        session.user.lastName = token.lastName as string | undefined;
        session.user.emailVerified = token.emailVerified as Date | undefined;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Set user data from credentials login
      if (user) {
        token.role = user.role;
        token.image = user.image;
        token.name = user.name;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.emailVerified = (user as any).emailVerified;
      }
      
      // For OAuth users, fetch data from database only once
      if (account?.provider === "google" && !token.role && user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({ 
            where: { email: user.email },
            select: { role: true, image: true, name: true, firstName: true, lastName: true, emailVerified: true }
          });
          if (dbUser) {
            token.role = dbUser.role || "user";
            token.image = dbUser.image || undefined;
            token.name = dbUser.name || undefined;
            token.firstName = dbUser.firstName || undefined;
            token.lastName = dbUser.lastName || undefined;
            token.emailVerified = dbUser.emailVerified || undefined;
          } else {
            token.role = "user"; // Default role if not found
          }
        } catch (error) {
          console.error('Error fetching user data in JWT callback:', error);
          token.role = "user"; // Fallback to default role
        }
      }
      
      // Fallback: fetch role from DB if missing (for existing sessions)
      if (!token.role && token.sub) {
        try {
          const dbUser = await prisma.user.findUnique({ 
            where: { id: token.sub },
            select: { role: true, image: true, name: true, firstName: true, lastName: true, emailVerified: true }
          });
          if (dbUser) {
            token.role = dbUser.role || "user";
            token.image = dbUser.image || undefined;
            token.name = dbUser.name || undefined;
            token.firstName = dbUser.firstName || undefined;
            token.lastName = dbUser.lastName || undefined;
            token.emailVerified = dbUser.emailVerified || undefined;
          }
        } catch (error) {
          console.error('Error fetching user data in JWT fallback:', error);
          token.role = "user"; // Fallback to default role
        }
      }
      
      // Always refresh emailVerified from DB to ensure it's up to date
      if (token.sub) {
        try {
          const dbUser = await prisma.user.findUnique({ 
            where: { id: token.sub },
            select: { emailVerified: true }
          });
          if (dbUser) {
            token.emailVerified = dbUser.emailVerified || undefined;
          }
        } catch (error) {
          console.error('Error refreshing emailVerified in JWT:', error);
        }
      }
      
      return token;
    },
    
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async signOut({ token }) {
      // Clear any custom data when signing out
      console.log('User signed out:', token?.email);
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);