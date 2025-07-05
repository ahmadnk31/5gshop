import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('Checking user status for email:', email);
    
    if (!email) {
      console.log('No email provided');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true }
    });
    
    console.log('User found:', user);
    
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    console.log('User role:', user.role);
    return NextResponse.json({ role: user.role });
  } catch (error) {
    console.error('Error checking user status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 