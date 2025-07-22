import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

// itemType: 'part' or 'accessory'
export async function POST(req: NextRequest, { params }: { params: Promise<{ itemType: string, itemId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { itemType, itemId } = await params;
  try {
    if (itemType === 'part') {
      await prisma.wishlistItem.create({
        data: {
          userId: session.user.id,
          partId: itemId,
        },
      });
    } else if (itemType === 'accessory') {
      await prisma.wishlistItem.create({
        data: {
          userId: session.user.id,
          accessoryId: itemId,
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.code === 'P2002') { // Unique constraint violation
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ itemType: string, itemId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { itemType, itemId } = await params;
  if (itemType === 'part') {
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
        partId: itemId,
      },
    });
  } else if (itemType === 'accessory') {
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
        accessoryId: itemId,
      },
    });
  } else {
    return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ itemType: string, itemId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { itemType, itemId } = await params;
  let item = null;
  if (itemType === 'part') {
    item = await prisma.wishlistItem.findFirst({
      where: {
        userId: session.user.id,
        partId: itemId,
      },
    });
  } else if (itemType === 'accessory') {
    item = await prisma.wishlistItem.findFirst({
      where: {
        userId: session.user.id,
        accessoryId: itemId,
      },
    });
  } else {
    return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
  }
  return NextResponse.json({ inWishlist: !!item });
} 