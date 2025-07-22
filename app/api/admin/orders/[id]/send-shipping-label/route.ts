import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SESService } from '@/lib/ses-service';
import { prisma } from '@/lib/database';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role!=='ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { trackingNumber, message, labelFile } = await req.json();

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        address: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get customer email from order.email or user.email
    const customerEmail = order.email || order.user?.email;
    console.log('🔍 Shipping label API - Email debug:', {
      orderId: order.id,
      orderEmail: order.email,
      userEmail: order.user?.email,
      finalEmail: customerEmail,
      hasUser: !!order.user,
      userData: order.user ? {
        id: order.user.id,
        email: order.user.email,
        firstName: order.user.firstName,
        lastName: order.user.lastName
      } : null
    });
    
    if (!customerEmail) {
      return NextResponse.json({ error: "No customer email found" }, { status: 400 });
    }

    // Get customer name from user object or address
    const customerName = order.user?.firstName && order.user?.lastName 
      ? `${order.user.firstName} ${order.user.lastName}`
      : order.address?.name || 'Valued Customer';

    // Parse cart items for email
    let cartItems: Array<{ name: string; image?: string; quantity: number; price: number }> = [];
    try {
      const parsedCart = JSON.parse(order.cart || "[]");
      cartItems = parsedCart.map((item: any) => ({
        name: item.name || 'Unknown Item',
        image: item.image,
        quantity: item.quantity || 1,
        price: item.price || 0
      }));
    } catch (e) {
      console.error('Failed to parse cart:', e);
      cartItems = [{ name: 'Order Items', quantity: 1, price: order.amount / 100 }];
    }

    // Prepare shipping label attachment
    let labelAttachment: { filename: string; content: string | Buffer; contentType: string } | null = null;
    if (labelFile) {
      labelAttachment = {
        filename: `shipping-label-${order.id}.pdf`,
        content: labelFile.content,
        contentType: 'application/pdf'
      };
    }

    // Send shipping label email to customer
    const emailData: any = {
      customerEmail: customerEmail,
      customerName: customerName,
      orderId: order.id,
      orderDetails: {
        id: order.id,
        amount: order.amount / 100,
        currency: order.currency,
        createdAt: order.createdAt,
        shippingAddress: order.address ? {
          name: order.address.name,
          line1: order.address.line1,
          line2: order.address.line2,
          city: order.address.city,
          state: order.address.state,
          postalCode: order.address.postalCode,
          country: order.address.country,
        } : null
      },
      trackingNumber,
      message: message || `Your order #${order.id} has been shipped!`
    };

    // Add label attachment if provided
    if (labelAttachment) {
      emailData.labelAttachment = labelAttachment;
    }

    await SESService.sendShippingLabelEmail(emailData);

    // Update order status to shipped
    await prisma.order.update({
      where: { id },
      data: { 
        status: "SHIPPED",
        // You might want to add tracking number to the order model
      },
    });

    console.log(`✅ Shipping label sent for order ${order.id}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Shipping label sent successfully' 
    });

  } catch (error) {
    console.error('Error sending shipping label:', error);
    return NextResponse.json(
      { error: 'Failed to send shipping label' },
      { status: 500 }
    );
  }
} 