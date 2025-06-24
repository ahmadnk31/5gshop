// Map Options Example for Contact Page
// You can uncomment one of these options based on your preference

import { EmbeddedMap } from "@/components/embedded-map";
// import { LeafletMap } from "@/components/leaflet-map";
// import { GoogleMap } from "@/components/google-map";

// Option 1: Embedded Map (Current - Free, Simple)
<EmbeddedMap address="84A Bondgenotenlaan, 3000 Leuven, Belgium" />

// Option 2: Leaflet Map (Free, Interactive)
// <LeafletMap address="84A Bondgenotenlaan, 3000 Leuven, Belgium" />

// Option 3: Google Maps (Premium, requires API key)
// {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
//   <GoogleMap 
//     apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} 
//     address="84A Bondgenotenlaan, 3000 Leuven, Belgium" 
//   />
// )}

// Option 4: Fallback to embedded if no API key
// {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
//   <GoogleMap 
//     apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} 
//     address="84A Bondgenotenlaan, 3000 Leuven, Belgium" 
//   />
// ) : (
//   <EmbeddedMap address="84A Bondgenotenlaan, 3000 Leuven, Belgium" />
// )}
