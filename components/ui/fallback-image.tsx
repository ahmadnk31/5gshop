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
  width,
  height,
  className,
  sizes,
  fallbackContent
}: FallbackImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (imageError) {
    return <>{fallbackContent}</>;
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        onError={(e) => {
          console.log('Image failed to load:', src);
          setImageError(true);
        }}
        onLoad={() => {
          setImageLoaded(true);
        }}
      />
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </>
  );
}
