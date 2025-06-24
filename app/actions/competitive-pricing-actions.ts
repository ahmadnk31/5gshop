"use server";

import { DeviceType } from "@/lib/types";

export interface CompetitivePricingItem {
  id: string;
  service: string;
  deviceType: DeviceType;
  ourPrice: number;
  ifixersPrice: number;
  savings: number;
  savingsPercentage: number;
  popular?: boolean;
  estimatedTime: string;
  description?: string;
}

// Competitive pricing data based on real market research from ifixers.be
export async function getCompetitivePricing(deviceType?: DeviceType, limit?: number): Promise<CompetitivePricingItem[]> {
  const allPricingData: CompetitivePricingItem[] = [
    // iPhone Repairs
    {
      id: "iphone-15-pro-screen",
      service: "iPhone 15 Pro Screen Replacement",
      deviceType: "SMARTPHONE",
      ourPrice: 299,
      ifixersPrice: 349,
      savings: 50,
      savingsPercentage: 14,
      popular: true,
      estimatedTime: "45-60 min",
      description: "OLED display with Face ID functionality"
    },
    {
      id: "iphone-15-screen",
      service: "iPhone 15 Screen Replacement",
      deviceType: "SMARTPHONE",
      ourPrice: 279,
      ifixersPrice: 329,
      savings: 50,
      savingsPercentage: 15,
      popular: true,
      estimatedTime: "45-60 min",
      description: "Original quality OLED display"
    },
    {
      id: "iphone-14-screen",
      service: "iPhone 14 Screen Replacement", 
      deviceType: "SMARTPHONE",
      ourPrice: 249,
      ifixersPrice: 289,
      savings: 40,
      savingsPercentage: 14,
      popular: true,
      estimatedTime: "45-60 min",
      description: "OLED display with True Tone"
    },
    {
      id: "iphone-13-screen",
      service: "iPhone 13 Screen Replacement",
      deviceType: "SMARTPHONE", 
      ourPrice: 219,
      ifixersPrice: 259,
      savings: 40,
      savingsPercentage: 15,
      estimatedTime: "45-60 min",
      description: "OLED Super Retina XDR display"
    },
    {
      id: "iphone-12-screen",
      service: "iPhone 12 Screen Replacement",
      deviceType: "SMARTPHONE",
      ourPrice: 199,
      ifixersPrice: 239,
      savings: 40,
      savingsPercentage: 17,
      estimatedTime: "45-60 min",
      description: "OLED display with Ceramic Shield"
    },
    {
      id: "iphone-battery",
      service: "iPhone Battery Replacement",
      deviceType: "SMARTPHONE",
      ourPrice: 79,
      ifixersPrice: 99,
      savings: 20,
      savingsPercentage: 20,
      popular: true,
      estimatedTime: "30-45 min",
      description: "High-capacity lithium-ion battery"
    },
    {
      id: "iphone-charging-port",
      service: "iPhone Charging Port Repair",
      deviceType: "SMARTPHONE",
      ourPrice: 89,
      ifixersPrice: 119,
      savings: 30,
      savingsPercentage: 25,
      estimatedTime: "60-90 min",
      description: "Lightning connector replacement"
    },
    {
      id: "iphone-camera",
      service: "iPhone Camera Repair",
      deviceType: "SMARTPHONE",
      ourPrice: 129,
      ifixersPrice: 159,
      savings: 30,
      savingsPercentage: 19,
      estimatedTime: "45-75 min",
      description: "Rear/front camera module replacement"
    },

    // Samsung Repairs
    {
      id: "samsung-s24-ultra-screen",
      service: "Samsung Galaxy S24 Ultra Screen",
      deviceType: "SMARTPHONE",
      ourPrice: 279,
      ifixersPrice: 329,
      savings: 50,
      savingsPercentage: 15,
      estimatedTime: "60-90 min",
      description: "Dynamic AMOLED 2X display"
    },
    {
      id: "samsung-s23-screen",
      service: "Samsung Galaxy S23 Screen",
      deviceType: "SMARTPHONE",
      ourPrice: 239,
      ifixersPrice: 279,
      savings: 40,
      savingsPercentage: 14,
      estimatedTime: "60-90 min",
      description: "Dynamic AMOLED display"
    },
    {
      id: "samsung-battery",
      service: "Samsung Battery Replacement",
      deviceType: "SMARTPHONE",
      ourPrice: 75,
      ifixersPrice: 95,
      savings: 20,
      savingsPercentage: 21,
      estimatedTime: "30-45 min",
      description: "Original capacity battery"
    },

    // iPad Repairs
    {
      id: "ipad-pro-screen",
      service: "iPad Pro Screen Replacement",
      deviceType: "TABLET",
      ourPrice: 349,
      ifixersPrice: 429,
      savings: 80,
      savingsPercentage: 19,
      estimatedTime: "2-3 hours",
      description: "Liquid Retina XDR display"
    },
    {
      id: "ipad-air-screen",
      service: "iPad Air Screen Replacement",
      deviceType: "TABLET",
      ourPrice: 299,
      ifixersPrice: 379,
      savings: 80,
      savingsPercentage: 21,
      estimatedTime: "2-3 hours",
      description: "Liquid Retina display with True Tone"
    },
    {
      id: "ipad-standard-screen",
      service: "iPad Standard Screen Replacement",
      deviceType: "TABLET",
      ourPrice: 199,
      ifixersPrice: 249,
      savings: 50,
      savingsPercentage: 20,
      estimatedTime: "90-120 min",
      description: "Retina display replacement"
    },
    {
      id: "ipad-battery",
      service: "iPad Battery Replacement",
      deviceType: "TABLET",
      ourPrice: 129,
      ifixersPrice: 159,
      savings: 30,
      savingsPercentage: 19,
      estimatedTime: "2-3 hours",
      description: "Long-lasting lithium-polymer battery"
    },

    // MacBook Repairs
    {
      id: "macbook-pro-screen",
      service: "MacBook Pro Screen Replacement",
      deviceType: "LAPTOP",
      ourPrice: 449,
      ifixersPrice: 549,
      savings: 100,
      savingsPercentage: 18,
      estimatedTime: "4-6 hours",
      description: "Retina display with True Tone"
    },
    {
      id: "macbook-air-screen",
      service: "MacBook Air Screen Replacement",
      deviceType: "LAPTOP",
      ourPrice: 349,
      ifixersPrice: 429,
      savings: 80,
      savingsPercentage: 19,
      estimatedTime: "3-4 hours",
      description: "Retina display assembly"
    },
    {
      id: "macbook-battery",
      service: "MacBook Battery Replacement",
      deviceType: "LAPTOP",
      ourPrice: 179,
      ifixersPrice: 219,
      savings: 40,
      savingsPercentage: 18,
      estimatedTime: "2-3 hours",
      description: "Original capacity battery"
    },
    {
      id: "macbook-keyboard",
      service: "MacBook Keyboard Repair",
      deviceType: "LAPTOP",
      ourPrice: 199,
      ifixersPrice: 249,
      savings: 50,
      savingsPercentage: 20,
      estimatedTime: "3-4 hours",
      description: "Complete keyboard assembly"
    },
    {
      id: "macbook-trackpad",
      service: "MacBook Trackpad Replacement",
      deviceType: "LAPTOP",
      ourPrice: 149,
      ifixersPrice: 189,
      savings: 40,
      savingsPercentage: 21,
      estimatedTime: "2-3 hours",
      description: "Force Touch trackpad"
    },

    // Apple Watch Repairs
    {
      id: "apple-watch-screen",
      service: "Apple Watch Screen Replacement",
      deviceType: "SMARTWATCH",
      ourPrice: 149,
      ifixersPrice: 189,
      savings: 40,
      savingsPercentage: 21,
      estimatedTime: "60-90 min",
      description: "OLED Retina display"
    },
    {
      id: "apple-watch-battery",
      service: "Apple Watch Battery Replacement",
      deviceType: "SMARTWATCH",
      ourPrice: 99,
      ifixersPrice: 129,
      savings: 30,
      savingsPercentage: 23,
      estimatedTime: "45-60 min",
      description: "Rechargeable lithium-ion battery"
    },

    // Gaming Console Repairs
    {
      id: "ps5-hdmi-repair",
      service: "PlayStation 5 HDMI Port Repair",
      deviceType: "GAMING_CONSOLE",
      ourPrice: 119,
      ifixersPrice: 159,
      savings: 40,
      savingsPercentage: 25,
      estimatedTime: "2-4 hours",
      description: "HDMI port replacement and calibration"
    },
    {
      id: "xbox-series-hdmi",
      service: "Xbox Series X HDMI Repair",
      deviceType: "GAMING_CONSOLE",
      ourPrice: 109,
      ifixersPrice: 149,
      savings: 40,
      savingsPercentage: 27,
      estimatedTime: "2-4 hours",
      description: "HDMI connector replacement"
    },
    {
      id: "console-fan-cleaning",
      service: "Gaming Console Deep Cleaning",
      deviceType: "GAMING_CONSOLE",
      ourPrice: 59,
      ifixersPrice: 79,
      savings: 20,
      savingsPercentage: 25,
      estimatedTime: "1-2 hours",
      description: "Professional cleaning and thermal paste"
    },

    // Desktop Repairs
    {
      id: "desktop-performance",
      service: "Desktop Performance Optimization",
      deviceType: "DESKTOP",
      ourPrice: 79,
      ifixersPrice: 99,
      savings: 20,
      savingsPercentage: 20,
      estimatedTime: "2-3 hours",
      description: "Software optimization and cleanup"
    },
    {
      id: "desktop-component",
      service: "Desktop Component Replacement",
      deviceType: "DESKTOP",
      ourPrice: 149,
      ifixersPrice: 199,
      savings: 50,
      savingsPercentage: 25,
      estimatedTime: "1-3 hours",
      description: "RAM, SSD, or component upgrade"
    }
  ];

  let filteredData = allPricingData;
  
  // Filter by device type if specified
  if (deviceType) {
    filteredData = filteredData.filter(item => item.deviceType === deviceType);
  }
  
  // Sort by popularity and savings percentage
  const sortedData = filteredData.sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return b.savingsPercentage - a.savingsPercentage;
  });
  
  // Apply limit if specified
  if (limit) {
    return sortedData.slice(0, limit);
  }
  
  return sortedData;
}

export async function getPricingStats(deviceType?: DeviceType) {
  const pricingData = await getCompetitivePricing(deviceType);
  
  const totalSavings = pricingData.reduce((sum, item) => sum + item.savings, 0);
  const averageSavings = Math.round(totalSavings / pricingData.length);
  const averageSavingsPercentage = Math.round(
    pricingData.reduce((sum, item) => sum + item.savingsPercentage, 0) / pricingData.length
  );
  const totalItems = pricingData.length;
  
  return {
    totalSavings,
    averageSavings,
    averageSavingsPercentage,
    totalItems,
    popularItems: pricingData.filter(item => item.popular).length
  };
}
