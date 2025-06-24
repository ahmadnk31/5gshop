"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef } from "react";

// Type definitions for Google Maps
interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface MapProps {
  center: LatLngLiteral;
  zoom: number;
  mapId?: string;
}

// Extend Window interface to include google
declare global {
  interface Window {
    google: any;
  }
}

const MapComponent: React.FC<MapProps> = ({ center, zoom }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && window.google) {
      const map = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">TechFix Pro</h3>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">84A Bondgenotenlaan</p>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">3000 Leuven, Belgium</p>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">+32 (466) 13 41 81</p>
            <a href="https://maps.google.com/?q=84A+Bondgenotenlaan+Leuven+Belgium" target="_blank" style="color: #2563eb; text-decoration: none; font-size: 14px;">Get Directions</a>
          </div>
        `
      });

      // Add marker with custom icon
      const marker = new window.google.maps.Marker({
        position: center,
        map,
        title: "TechFix Pro - 5G Phones",
        icon: {
          url: "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' fill='%23dc2626'/%3E%3C/svg%3E",
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40)
        }
      });

      // Add click listener to marker
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    }
  }, [center, zoom]);

  return <div ref={ref} className="w-full h-full rounded-lg" />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="w-full h-64 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-2">Failed to load map</p>
            <p className="text-red-500 text-sm">Please check your internet connection</p>
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Initializing map...</p>
        </div>
      );
  }
};

interface GoogleMapProps {
  apiKey: string;
  address?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ 
  apiKey, 
  address = "84A Bondgenotenlaan, 3000 Leuven, Belgium" 
}) => {
  // Coordinates for Leuven, Belgium (approximate - you should get exact coordinates)
  const center = { lat: 50.8798, lng: 4.7005 };
  const zoom = 15;

  return (
    <div className="w-full h-64">
      <Wrapper apiKey={apiKey} render={render}>
        <MapComponent center={center} zoom={zoom} />
      </Wrapper>
    </div>
  );
};
