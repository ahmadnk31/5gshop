import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the built-in types for session and user

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      firstName?: string;
      lastName?: string;
      image?: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role: string;
    id: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    // Add any other custom fields here
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  }
}
