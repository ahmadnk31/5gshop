"use client"
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export function AccessoryActionButtons({ accessory }: { accessory: any }) {
  const t = useTranslations('');
  const { data: session } = useSession();
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Check if accessory is in wishlist
  useEffect(() => {
    if (!session?.user?.id || !accessory?.id) return;
    fetch(`/api/wishlist/accessory/${accessory.id}`)
      .then(res => res.json())
      .then(data => setInWishlist(!!data.inWishlist));
  }, [session?.user?.id, accessory?.id]);

  const toggleWishlist = async () => {
    console.log('🔍 toggleWishlist called (accessory)');
    console.log('🔍 session?.user?.id:', session?.user?.id);
    console.log('🔍 accessory?.id:', accessory?.id);
    
    if (!session?.user?.id || !accessory?.id) {
      console.log('❌ Early return - missing session or accessory id');
      return;
    }
    
    setWishlistLoading(true);
    const method = inWishlist ? 'DELETE' : 'POST';
    const url = `/api/wishlist/accessory/${accessory.id}`;
    
    console.log('🔍 Making request:', method, url);
    
    try {
      const response = await fetch(url, { method });
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Wishlist request failed:', errorText);
      } else {
        console.log('✅ Wishlist request successful');
      }
    } catch (error) {
      console.error('❌ Wishlist request error:', error);
    }
    
    setInWishlist(!inWishlist);
    setWishlistLoading(false);
  };

  return (
    <>
      {session?.user?.id && (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={toggleWishlist}
          disabled={wishlistLoading}
        >
          {inWishlist ? (
            <Heart className="h-4 w-4 mr-2 text-red-500 fill-red-500" />
          ) : (
            <Heart className="h-4 w-4 mr-2" />
          )}
        </Button>
      )}
    </>
  );
} 