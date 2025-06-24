import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - TechFix Pro",
  description: "Admin dashboard for managing repairs, customers, and inventory",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
