import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/database";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Dashboard - TechFix Pro",
  description: "Admin dashboard for managing repairs, customers, and inventory",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, id: true, email: true, name: true },
      })
    : null;

  if (dbUser?.role !== "ADMIN") {
    return (
      <div className="flex items-center flex-col justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-600 mt-2">You do not have permission to access this page.</p>
        <Link href="/" className="text-blue-500 hover:underline mt-4">
          Go to Home
        </Link>
        <Link href="/auth/login" className="text-blue-500 hover:underline mt-2">
          Login
        </Link>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
