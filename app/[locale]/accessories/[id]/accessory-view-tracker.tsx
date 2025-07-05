'use client';

import { useEffect } from 'react';
import { addRecentlyViewed } from '@/lib/view-history';
import { Accessory } from '@/lib/types';

interface AccessoryViewTrackerProps {
  accessory: Accessory;
}

export function AccessoryViewTracker({ accessory }: AccessoryViewTrackerProps) {
  useEffect(() => {
    // Track the accessory as recently viewed
    addRecentlyViewed({
      id: accessory.id,
      name: accessory.name,
      price: accessory.price,
      imageUrl: accessory.imageUrl,
      type: 'accessory',
      category: accessory.category,
      url: `/accessories/${accessory.id}`
    });
  }, [accessory]);

  // This component doesn't render anything
  return null;
} 