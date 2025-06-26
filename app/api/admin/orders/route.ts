import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  // Optionally, check for admin role here
  if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
  return NextResponse.json({ orders });
}
