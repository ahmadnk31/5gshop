import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Admin orders API - Session:', {
      user: session?.user?.email,
      role: session?.user?.role,
      hasSession: !!session
    });

    // Check if user is authenticated
    if (!session?.user) {
      console.log('Admin orders API - No session found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user has admin role
    if (session.user.role !== 'ADMIN') {
      console.log('Admin orders API - User does not have admin role:', session.user.role);
      return NextResponse.json({ 
        error: 'Admin access required',
        userRole: session.user.role 
      }, { status: 403 });
    }

    console.log('Admin orders API - Fetching orders for admin user:', session.user.email);
    
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { 
        user: true,
        address: true 
      },
    });

    console.log('Admin orders API - Found orders:', orders.length);
    
    return NextResponse.json({ 
      orders,
      count: orders.length,
      user: {
        email: session.user.email,
        role: session.user.role
      }
    });
  } catch (error) {
    console.error('Admin orders API - Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
