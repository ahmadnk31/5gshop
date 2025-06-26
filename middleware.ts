import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const adminPrefix = '/admin';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes with NextAuth
  if (pathname.startsWith(adminPrefix)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('MIDDLEWARE TOKEN:', token); // Debug log
    if (!token) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Optionally, check for admin role:
    if (!token.role || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    // Allow admin access
    return NextResponse.next();
  }

  // For all other routes, use next-intl middleware
  // (this preserves locale handling for the rest of the app)
  return createMiddleware(routing)(req);
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)', // next-intl default
    '/admin/:path*', // protect all /admin routes
  ],
};