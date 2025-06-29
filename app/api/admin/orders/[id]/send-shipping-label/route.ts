import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SESService } from '@/lib/ses-service';
import { prisma } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { labelAttachment, trackingNumber, message } = await request.json();
    
    if (!labelAttachment || !labelAttachment.filename || !labelAttachment.content) {
      return NextResponse.json({ error: 'Label attachment is required' }, { status: 400 });
    }
    const { id }=await params
    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        address: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order is for parts and has shipping option 'send'
    if (order.repairType !== 'by_us' || order.shippingOption !== 'send') {
      return NextResponse.json({ 
        error: 'Shipping label can only be sent for parts orders with "send" shipping option' 
      }, { status: 400 });
    }

    // Get customer name from user or address
    let customerName = 'Customer';
    if (order.user?.firstName && order.user?.lastName) {
      customerName = `${order.user.firstName} ${order.user.lastName}`;
    } else if (order.address?.name) {
      customerName = order.address.name;
    }

    // Send shipping label email
    const result = await SESService.sendShippingLabelEmail({
      customerEmail: order.email,
      customerName,
      orderId: order.id,
      orderDetails: order,
      labelAttachment,
      trackingNumber,
      message,
    });

    // Update order status to indicate shipping label sent
    await prisma.order.update({
      where: { id: id },
      data: {
        status: 'shipped',
      },
    });

    return NextResponse.json({ 
      success: true, 
      messageId: result.MessageId,
      message: 'Shipping label email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending shipping label email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 