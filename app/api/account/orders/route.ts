import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch orders for the logged-in user
    const orders = await prisma.order.findMany({
      where: { 
        OR: [
          { email: session.user.email },
          { userId: session.user.id }
        ]
      },
      orderBy: { createdAt: "desc" },
      include: { address: true },
    });

    return NextResponse.json({ 
      success: true, 
      orders: orders 
    });

  } catch (error) {
    console.error('Orders retrieval error:', error);
    return NextResponse.json({ 
      error: "Failed to retrieve orders" 
    }, { status: 500 });
  }
} 