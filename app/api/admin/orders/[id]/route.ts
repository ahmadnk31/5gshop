import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/database";
import { NextResponse } from "next/server";
import { SESService } from "@/lib/ses-service";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  // Optionally, check for admin role
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id } = await params;
  const { status } = await req.json();
  if (!status) return NextResponse.json({ error: "No status provided" }, { status: 400 });

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { user: true, address: true },
  });

  // Send email to user on status change
  if (order.user?.email || order.email) {
    // Parse products from order.cart (JSON string)
    let products: Array<{ name: string; image?: string; quantity: number; price: number }> = [];
    try {
      products = JSON.parse(order.cart);
    } catch {}
    await SESService.sendOrderStatusEmail({
      to: order.user?.email || order.email,
      status,
      orderId: order.id,
      order,
      products,
    });
  }

  return NextResponse.json({ success: true });
}
