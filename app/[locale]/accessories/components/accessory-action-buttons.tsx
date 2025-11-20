"use client"
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function AccessoryActionButtons({ accessory }: { accessory: any }) {
  const t = useTranslations('');
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Check if accessory is in wishlist
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      try {
        const res = await fetch('/api/wishlist');
        if (res.ok) {
          const data = await res.json();
          // Handle different response formats
          if (Array.isArray(data)) {
            return data;
          } else if (data && Array.isArray(data.items)) {
            return data.items;
          } else if (data && Array.isArray(data.data)) {
            return data.data;
          }
          return [];
        }
        return [];
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        return [];
      }
    },
    enabled: !!session?.user?.id,
  });

  const wishlistItems = Array.isArray(wishlistData) ? wishlistData : [];
  const isInWishlist = wishlistItems.some((item: any) => item.accessoryId === accessory?.id);

  // Toggle wishlist mutation
  const toggleWishlistMutation = useMutation({
    mutationFn: async (accessoryId: string) => {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessoryId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to toggle wishlist');
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch wishlist to update UI
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (error) => {
      console.error('Error toggling wishlist:', error);
    },
  });

  const toggleWishlist = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!session?.user?.id) {
      return;
    }
    
    if (!accessory?.id) {
      console.error('Accessory ID is missing');
      return;
    }
    
    toggleWishlistMutation.mutate(accessory.id);
  };

  return (
    <>
      {session?.user?.id && (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={toggleWishlist}
          disabled={toggleWishlistMutation.isPending}
        >
          {isInWishlist ? (
            <Heart className="h-4 w-4 mr-2 text-red-500 fill-red-500" />
          ) : (
            <Heart className="h-4 w-4 mr-2" />
          )}
        </Button>
      )}
    </>
  );
} 