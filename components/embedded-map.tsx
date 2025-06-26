"use client";

import { Button } from "@/components/ui/button";
import { Navigation, ExternalLink } from "lucide-react";

interface EmbeddedMapProps {
  address?: string;
  className?: string;
}

export const EmbeddedMap: React.FC<EmbeddedMapProps> = ({ 
  address = "5G Phones, 84, Bondgenotenlaan, Sint-Maartensdal, Leuven, Vlaams-Brabant, Vlaanderen, 3000, België",
  className = "h-64 w-full rounded-lg"
}) => {
  // Encode the address for the Google Maps embed URL
  const encodedAddress = encodeURIComponent(address);
  
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}&zoom=15`;
  
  // Alternative: OpenStreetMap embed (no API key needed)
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=4.695,50.875,4.705,50.885&layer=mapnik&marker=50.8798,4.7005`;
  
  const handleGetDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* OpenStreetMap Embed (Free - No API Key Required) */}
      <div className={className}>
        <iframe
          src={osmUrl}
          className="w-full h-full rounded-lg border-0"
          title="TechFix Pro Location"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          onClick={handleGetDirections}
          variant="outline" 
          className="flex-1"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Get Directions
        </Button>
        
        <Button 
          asChild
          variant="outline"
        >
          <a 
            href={`https://www.openstreetmap.org/?mlat=50.8798&mlon=4.7005&zoom=15#map=15/50.8798/4.7005`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Maps
          </a>
        </Button>
      </div>

      {/* Deprecation Note */}
      <div className="text-sm text-red-500">
        NOTE: This component is now deprecated in favor of LeafletMap for precise, interactive location display. Use LeafletMap in your contact page for best results.
      </div>
    </div>
  );
};

// Optionally, you can remove this file if not needed elsewhere.
