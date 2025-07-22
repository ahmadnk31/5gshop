// Server-side performance monitoring and optimization
import { NextRequest, NextResponse } from 'next/server';

export class ServerPerformanceMonitor {
  private static startTime = Date.now();
  private static requestCount = 0;
  private static slowRequests: Array<{ url: string; duration: number; timestamp: number }> = [];

  static trackRequest(url: string, startTime: number) {
    const duration = Date.now() - startTime;
    this.requestCount++;
    
    // Track slow requests (> 1000ms)
    if (duration > 1000) {
      this.slowRequests.push({
        url,
        duration,
        timestamp: Date.now()
      });
      
      // Keep only last 50 slow requests
      if (this.slowRequests.length > 50) {
        this.slowRequests = this.slowRequests.slice(-50);
      }
      
      console.warn(`🐌 Slow request detected: ${url} took ${duration}ms`);
    }
    
    return duration;
  }

  static getStats() {
    return {
      uptime: Date.now() - this.startTime,
      totalRequests: this.requestCount,
      slowRequests: this.slowRequests,
      averageSlowRequestTime: this.slowRequests.length > 0 
        ? this.slowRequests.reduce((sum, req) => sum + req.duration, 0) / this.slowRequests.length 
        : 0
    };
  }

  static reset() {
    this.requestCount = 0;
    this.slowRequests = [];
    this.startTime = Date.now();
  }
}

// Middleware for performance tracking
export function withPerformanceTracking(handler: any) {
  return async (req: NextRequest, ...args: any[]) => {
    const startTime = Date.now();
    const url = req.url;
    
    try {
      const response = await handler(req, ...args);
      const duration = ServerPerformanceMonitor.trackRequest(url, startTime);
      
      // Add performance headers in development
      if (process.env.NODE_ENV === 'development') {
        const headers = new Headers(response?.headers);
        headers.set('X-Response-Time', `${duration}ms`);
        headers.set('X-Server-Timing', `total;dur=${duration}`);
        
        return new NextResponse(response?.body, {
          status: response?.status,
          statusText: response?.statusText,
          headers,
        });
      }
      
      return response;
    } catch (error) {
      ServerPerformanceMonitor.trackRequest(url, startTime);
      throw error;
    }
  };
}

// Database operation performance tracker
export class DatabasePerformanceTracker {
  private static queries: Array<{ query: string; duration: number; timestamp: number }> = [];

  static trackQuery(query: string, startTime: number) {
    const duration = Date.now() - startTime;
    
    this.queries.push({
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration,
      timestamp: Date.now()
    });
    
    // Keep only last 100 queries
    if (this.queries.length > 100) {
      this.queries = this.queries.slice(-100);
    }
    
    if (duration > 500) {
      console.warn(`🐌 Slow database query: ${query.substring(0, 50)}... took ${duration}ms`);
    }
    
    return duration;
  }

  static getSlowQueries(threshold = 500) {
    return this.queries.filter(q => q.duration > threshold);
  }

  static getAverageQueryTime() {
    if (this.queries.length === 0) return 0;
    return this.queries.reduce((sum, q) => sum + q.duration, 0) / this.queries.length;
  }

  static getStats() {
    return {
      totalQueries: this.queries.length,
      slowQueries: this.getSlowQueries(),
      averageQueryTime: this.getAverageQueryTime(),
      recentQueries: this.queries.slice(-10)
    };
  }
}

// Enhanced Prisma client with performance tracking
export function createOptimizedPrismaClient() {
  // This would be used to wrap Prisma operations
  return {
    async findMany(model: string, args?: any) {
      const startTime = Date.now();
      try {
        // Here you would call the actual Prisma operation
        // const result = await prisma[model].findMany(args);
        DatabasePerformanceTracker.trackQuery(`${model}.findMany`, startTime);
        // return result;
      } catch (error) {
        DatabasePerformanceTracker.trackQuery(`${model}.findMany (ERROR)`, startTime);
        throw error;
      }
    },
    
    async findUnique(model: string, args?: any) {
      const startTime = Date.now();
      try {
        // const result = await prisma[model].findUnique(args);
        DatabasePerformanceTracker.trackQuery(`${model}.findUnique`, startTime);
        // return result;
      } catch (error) {
        DatabasePerformanceTracker.trackQuery(`${model}.findUnique (ERROR)`, startTime);
        throw error;
      }
    }
  };
}
