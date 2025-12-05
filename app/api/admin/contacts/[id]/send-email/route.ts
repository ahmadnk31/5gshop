import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ResendService } from '@/lib/resend-service';
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

    const { responseMessage, adminNotes } = await request.json();
    
    if (!responseMessage) {
      return NextResponse.json({ error: 'Response message is required' }, { status: 400 });
    }
    
    // Get contact details
    const contact = await prisma.contact.findUnique({
      where: { id: id },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    if (!contact.email) {
      return NextResponse.json({ error: 'Contact email not found' }, { status: 400 });
    }

    // Send email response
    await ResendService.sendContactResponse({
      customerEmail: contact.email,
      customerName: `${contact.firstName} ${contact.lastName}`,
      responseMessage,
      adminEmail: session.user.email || process.env.ADMIN_EMAIL || 'admin@5gphones.be',
    });

    // Update contact status
    await prisma.contact.update({
      where: { id: id },
      data: {
        status: 'responded',
        respondedAt: new Date(),
        adminNotes: adminNotes || responseMessage,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Contact response email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending contact response email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

