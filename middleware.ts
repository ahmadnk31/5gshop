

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const adminPrefix = '/admin';

export default async function middleware(req: NextRequest) {
  const startTime = Date.now();
  const { pathname } = req.nextUrl;

  // Early return for static assets to reduce TTFB
  if (pathname.startsWith('/_next/static/') || 
      pathname.startsWith('/_next/image/') || 
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.svg')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  // Protect /admin routes with NextAuth (optimized token check)
  if (pathname.startsWith(adminPrefix)) {
    try {
      const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET,
        // Optimize token retrieval
        secureCookie: process.env.NODE_ENV === 'production'
      });
      
      if (!token) {
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // Check for admin role
      if (!token.role || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
      
      // Allow admin access with performance headers
      const response = NextResponse.next();
      if (process.env.NODE_ENV === 'development') {
        const duration = Date.now() - startTime;
        response.headers.set('X-Middleware-Time', `${duration}ms`);
      }
      return response;
      
    } catch (error) {
      console.error('Admin middleware error:', error);
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Optimize API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Add performance headers for API routes
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - startTime;
      response.headers.set('X-Middleware-Time', `${duration}ms`);
    }
    
    // Optimize API caching
    if (req.method === 'GET') {
      response.headers.set(
        'Cache-Control',
        'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
      );
    }
    
    return response;
  }

  // For all other routes, use optimized next-intl middleware
  try {
    // Create the intl middleware with optimized settings
    const intlMiddleware = createMiddleware({
      ...routing,
      // Optimize locale detection
      localeDetection: true
    });
    
    const response = intlMiddleware(req);
    
    // Add performance monitoring in development only
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - startTime;
      response.headers.set('X-Middleware-Time', `${duration}ms`);
      
      // Warn about slow middleware
      if (duration > 50) {
        console.warn(`🐌 Slow middleware: ${pathname} took ${duration}ms`);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // Fast fallback without redirect
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)', // next-intl default
    '/admin/:path*', // protect all /admin routes
  ],
};