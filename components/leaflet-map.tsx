"use client";

import { useEffect, useState } from "react";

interface LeafletMapProps {
  address?: string;
  className?: string;
}

const LeafletMapComponent: React.FC<LeafletMapProps> = ({ 
  address = "84A Bondgenotenlaan, 3000 Leuven, Belgium",
  className = "h-64 w-full rounded-lg"
}) => {
  const [isClient, setIsClient] = useState(false);
  const [mapComponents, setMapComponents] = useState<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Load everything dynamically on client side only
    if (typeof window !== 'undefined') {
      Promise.all([
        import("react-leaflet"),
        import("leaflet")
      ]).then(([reactLeaflet, L]) => {
        // Import CSS dynamically
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
        
        setMapComponents(reactLeaflet);
        setLeaflet(L);
      }).catch(console.error);
    }
  }, []);

  if (!isClient || !mapComponents || !leaflet) {
    return (
      <div className={className} style={{ backgroundColor: '#f0f0f0' }}>
        <div className="flex items-center justify-center h-full">
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = mapComponents;
  const L = leaflet;
  
  // Coordinates for Leuven, Belgium - 84A Bondgenotenlaan
  const position: [number, number] = [50.880150, 4.709603];

  // Custom marker icon
  const customIcon = new L.Icon({
    iconUrl: "data:image/svg+xml,%3Csvg width='25' height='41' viewBox='0 0 25 41' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0ZM12.5 17C10 17 8 15 8 12.5S10 8 12.5 8S17 10 17 12.5S15 17 12.5 17Z' fill='%23dc2626'/%3E%3C/svg%3E",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  return (
    <div className={className}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="text-center p-2">
              <h3 className="font-semibold text-gray-900 mb-1">
                5G Phones - Phone Repair & Accessories
              </h3>
              <p className="text-sm text-gray-600 mb-1">84A Bondgenotenlaan</p>
              <p className="text-sm text-gray-600 mb-1">3000 Leuven, Belgium</p>
              <p className="text-sm text-gray-600 mb-2">+32 (466) 13 41 81</p>
              <a 
                href="https://www.openstreetmap.org/directions?from=&to=50.880150%2C4.709603" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Get Directions
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export const LeafletMap = LeafletMapComponent;

