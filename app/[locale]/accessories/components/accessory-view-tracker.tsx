'use client';

import { useEffect } from 'react';
import { addRecentlyViewed } from '@/lib/view-history';
import { Accessory } from '@/lib/types';

interface AccessoryViewTrackerProps {
  accessory: Accessory;
}

function createSlug(name: string, id: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${nameSlug}-${id}`;
}

export function AccessoryViewTracker({ accessory }: AccessoryViewTrackerProps) {
  useEffect(() => {
    const accessorySlug = createSlug(accessory.name, accessory.id);
    
    // Track the accessory as recently viewed
    addRecentlyViewed({
      id: accessory.id,
      name: accessory.name,
      price: accessory.price,
      imageUrl: accessory.imageUrl,
      type: 'accessory',
      category: accessory.category,
      url: `/accessories/${accessorySlug}`
    });
  }, [accessory]);

  // This component doesn't render anything
  return null;
} 