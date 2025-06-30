import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        part: {
          select: {
            id: true,
            name: true,
            cost: true,
            imageUrl: true,
            inStock: true,
            minStock: true,
            quality:true
          },
        },
        accessory: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            inStock: true,
            minStock: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ 
      success: true, 
      items: wishlistItems 
    });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ 
      error: "Failed to fetch wishlist" 
    }, { status: 500 });
  }
} 