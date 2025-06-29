"use client";

import Image from 'next/image';
import { useState } from 'react';

interface FallbackImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  fallbackContent: React.ReactNode;
}

export function FallbackImage({
  src,
  alt,
  fill,
  width=200,
  height=200,
  className,
  sizes,
  fallbackContent
}: FallbackImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Only pass width/height if fill is not set
  const imageProps: any = {
    src,
    alt,
    className,
    sizes,
    onError: (e: any) => {
      console.log('Image failed to load:', src);
      setImageError(true);
    },
    onLoad: () => {
      setImageLoaded(true);
    },
  };
  if (fill) {
    imageProps.fill = true;
    imageProps.style = { objectFit: 'contain', ...imageProps.style };
  } else {
    imageProps.width = width;
    imageProps.height = height;
    imageProps.style = { objectFit: 'contain', ...imageProps.style };
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main image or fallback */}
      {imageError ? (
        <div className="w-full h-full flex items-center justify-center">
          {fallbackContent}
        </div>
      ) : (
        <Image {...imageProps} />
      )}
      {/* Watermark always visible */}
      <img
        src="/logo.svg"
        alt="Watermark Logo"
        className="pointer-events-none select-none opacity-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 max-w-xs z-10"
        aria-hidden="true"
      />
      {/* Loading skeleton if image is loading */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-20" />
      )}
    </div>
  );
}
