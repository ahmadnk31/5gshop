import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  
  // Performance optimizations for TTFB
  const response = NextResponse.next();
  
  // Add performance headers
  if (process.env.NODE_ENV === 'development') {
    const duration = Date.now() - startTime;
    response.headers.set('X-Middleware-Time', `${duration}ms`);
    response.headers.set('X-Request-Start', startTime.toString());
  }
  
  // Optimize caching headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }
  
  // API route optimizations
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Add CORS headers for better performance
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Optimize API caching
    if (request.method === 'GET') {
      response.headers.set(
        'Cache-Control',
        'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
      );
    }
  }
  
  // Preload critical resources
  if (request.nextUrl.pathname === '/') {
    response.headers.set(
      'Link',
      '</fonts/geist-sans.woff2>; rel=preload; as=font; type=font/woff2; crossorigin'
    );
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
