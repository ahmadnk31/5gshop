"use client";
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./leaflet-map').then(mod => mod.LeafletMap), {
  ssr: false,
  loading: () => <div className="h-64 w-full rounded-lg bg-gray-200 animate-pulse flex items-center justify-center"><p>Loading map...</p></div>
});

export default LeafletMap;
