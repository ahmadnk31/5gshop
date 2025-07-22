import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SESService } from '@/lib/ses-service';
import { prisma } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { responseMessage, estimatedCost, estimatedTime, attachments } = await request.json();
    
    if (!responseMessage) {
      return NextResponse.json({ error: 'Response message is required' }, { status: 400 });
    }
    
    // Get quote details
    const quote = await prisma.quote.findUnique({
      where: { id: id },
      include: {
        customer: true,
        device: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (!quote.customer?.email) {
      return NextResponse.json({ error: 'Customer email not found' }, { status: 400 });
    }

    // Prepare device info
    const deviceInfo = quote.device 
      ? `${quote.device.brand} ${quote.device.model}`
      : 'Device Information';

    // Send email with or without attachments
    const emailData = {
      customerEmail: quote.customer.email,
      customerName: `${quote.customer.firstName} ${quote.customer.lastName}`,
      deviceInfo,
      responseMessage,
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
      estimatedTime,
      adminEmail: session.user.email || '',
      attachments: attachments || []
    };

    let result;
    if (attachments && attachments.length > 0) {
      result = await SESService.sendQuoteResponseWithAttachment(emailData);
    } else {
      result = await SESService.sendQuoteResponse(emailData);
    }

    // Update quote with response
    await prisma.quote.update({
      where: { id: id },
      data: {
        status: 'RESPONDED',
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
        estimatedTime,
        adminNotes: responseMessage, // Store response in adminNotes
      },
    });

    return NextResponse.json({ 
      success: true, 
      messageId: result.MessageId,
      message: 'Quote response email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending quote response email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 