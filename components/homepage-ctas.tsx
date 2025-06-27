'use client';

import { Button } from "@/components/ui/button";
import { Wrench, ShoppingBag } from "lucide-react";

import { useGoogleAnalytics } from "@/components/google-analytics";
import { Link } from "@/i18n/navigation";

export function HomePageCTAs() {
  const { trackEvent } = useGoogleAnalytics();

  const handleBookRepairClick = () => {
    trackEvent('cta_click', {
      button_type: 'book_repair',
      location: 'hero_section',
      page: 'homepage'
    });
  };

  const handleShopAccessoriesClick = () => {
    trackEvent('cta_click', {
      button_type: 'shop_accessories',
      location: 'hero_section',
      page: 'homepage'
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto sm:max-w-none">
      <Link href="/repairs" onClick={handleBookRepairClick} className="w-full sm:w-auto">
        <Button size="lg" variant="secondary" className="w-full">
          <Wrench className="mr-2 h-5 w-5" />
          Book Repair
        </Button>
      </Link>
      <Link 
        href="/accessories" 
        onClick={handleShopAccessoriesClick}
        className="w-full sm:w-auto"
      >
        <Button 
          size="lg" 
          variant="outline" 
          className="w-full text-white border-white hover:bg-white bg-transparent hover:text-gray-900"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Shop Accessories
        </Button>
      </Link>
    </div>
  );
}
