import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'No active session' }, { status: 400 });
    }

    console.log('Logging out user:', session.user?.email);
    
    // Return success - NextAuth will handle the actual session cleanup
    return NextResponse.json({ 
      message: 'Logged out successfully',
      success: true 
    });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { message: 'Logout failed', error: 'Internal server error' },
      { status: 500 }
    );
  }
}
