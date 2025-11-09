"use client";

import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface ImageZoomProps {
  src: string;
  alt: string;
  fallbackContent?: React.ReactNode;
  className?: string;
}

export function ImageZoom({ src, alt, fallbackContent, className }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageClick = () => {
    if (!imageError) {
      setIsZoomed(true);
    }
  };

  const handleClose = () => {
    setIsZoomed(false);
  };

  const handleImageError = () => {
    console.log('Image failed to load:', src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <div className={`absolute inset-0 ${!imageError ? 'group cursor-zoom-in' : ''}`} onClick={handleImageClick}>
        {/* Main image or fallback */}
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center">
            {fallbackContent}
          </div>
        ) : (
          <>
            <Image
              src={src}
              alt={alt}
              fill
              className={className || "object-contain aspect-square hover:scale-105 transition-transform duration-300"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
            )}
            {/* Zoom indicator overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none z-20">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                <ZoomIn className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Zoomed Image Modal */}
      {isZoomed && !imageError && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[10001] bg-black/95 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={handleClose}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-[10002] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors shadow-xl backdrop-blur-sm"
            aria-label="Close zoom"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Zoomed Image Container */}
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
            />
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
            Click anywhere to close
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
