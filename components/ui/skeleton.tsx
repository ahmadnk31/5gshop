import React from 'react';
import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  'data-sidebar'?: string;
}

export function Skeleton({ className = '', style, ...props }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} 
      style={style}
      {...props}
    />
  );
}

export default Skeleton;
