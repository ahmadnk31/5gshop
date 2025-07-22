import { NextRequest, NextResponse } from 'next/server';
import { ServerPerformanceMonitor } from '@/lib/server-performance';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get performance stats
    const serverStats = ServerPerformanceMonitor.getStats();
    
    // Add basic system info
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      env: process.env.NODE_ENV,
    };
    
    const responseData = {
      server: serverStats,
      system: systemInfo,
      timestamp: new Date().toISOString(),
      suggestions: generatePerformanceSuggestions(serverStats)
    };
    
    const duration = Date.now() - startTime;
    
    const response = NextResponse.json(responseData);
    response.headers.set('X-Response-Time', `${duration}ms`);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return response;
    
  } catch (error) {
    console.error('Performance API error:', error);
    return NextResponse.json(
      { error: 'Failed to get performance stats' }, 
      { status: 500 }
    );
  }
}

function generatePerformanceSuggestions(stats: any) {
  const suggestions = [];
  
  if (stats.slowRequests.length > 5) {
    suggestions.push({
      type: 'warning',
      message: `${stats.slowRequests.length} slow requests detected. Consider optimizing server-side operations.`,
      action: 'Check database queries and API endpoints'
    });
  }
  
  if (stats.averageSlowRequestTime > 2000) {
    suggestions.push({
      type: 'critical',
      message: `Average slow request time is ${Math.round(stats.averageSlowRequestTime)}ms`,
      action: 'Investigate database connections and external API calls'
    });
  }
  
  suggestions.push({
    type: 'info',
    message: 'Monitor TTFB in the performance dashboard',
    action: 'Aim for TTFB < 800ms for good performance'
  });
  
  return suggestions;
}
