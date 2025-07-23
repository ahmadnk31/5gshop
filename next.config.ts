import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Performance optimizations for TTFB reduction
  experimental: {
    // Temporarily disable package optimizations to test build
    // optimizePackageImports: [
    //   'lucide-react', 
    //   '@radix-ui/react-icons',
    //   '@radix-ui/react-dropdown-menu',
    //   '@radix-ui/react-dialog',
    //   'framer-motion'
    // ],
    // Enable concurrent features for better performance
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  
  
  // Compression and caching
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tire-files.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    // Performance optimizations for images
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Bundle optimization
  webpack: (config, { isServer }) => {
    // Add self polyfill for server builds to prevent "self is not defined" error
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Add self polyfill
      config.plugins = config.plugins || [];
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'typeof self': '"undefined"',
          'self': 'undefined',
        })
      );
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Exclude problematic libraries from server bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        'leaflet', 
        'react-leaflet',
        'react-confetti',
        'fuse.js',
        'recharts'
      );
    }
    
    // Split chunks for better caching
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Bundle frequently used UI components together
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@radix-ui|cmdk|lucide-react)[\\/]/,
            priority: 20,
          },
          // Bundle analytics and tracking separately
          analytics: {
            name: 'analytics',
            chunks: 'all',
            test: /[\\/](google-analytics|analytics)[\\/]/,
            priority: 15,
          },
          // Common vendor chunks
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
          },
        },
      },
    };
    
    return config;
  },
  
  // Build performance - crucial for TTFB
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Output configuration for faster builds
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Remove deprecated swcMinify (it's enabled by default in Next.js 13+)
  
  // Headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
