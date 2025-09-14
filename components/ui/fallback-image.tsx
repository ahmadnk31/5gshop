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
      {/* Loading skeleton if image is loading */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-20" />
      )}
    </div>
  );
}
