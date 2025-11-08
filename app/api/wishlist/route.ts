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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { partId, accessoryId } = body;

    if (!partId && !accessoryId) {
      return NextResponse.json({ 
        error: "Either partId or accessoryId is required" 
      }, { status: 400 });
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: session.user.id,
        ...(partId ? { partId } : { accessoryId }),
      },
    });

    if (existingItem) {
      // Remove from wishlist
      await prisma.wishlistItem.delete({
        where: {
          id: existingItem.id,
        },
      });

      return NextResponse.json({ 
        success: true, 
        action: 'removed',
        message: 'Item removed from wishlist' 
      });
    } else {
      // Add to wishlist
      const newItem = await prisma.wishlistItem.create({
        data: {
          userId: session.user.id,
          ...(partId ? { partId } : { accessoryId }),
        },
      });

      return NextResponse.json({ 
        success: true, 
        action: 'added',
        message: 'Item added to wishlist',
        item: newItem 
      });
    }

  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return NextResponse.json({ 
      error: "Failed to update wishlist" 
    }, { status: 500 });
  }
}