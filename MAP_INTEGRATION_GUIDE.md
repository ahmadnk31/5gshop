# Map Integration Setup Guide

## ✅ **FIXED: All TypeScript Errors Resolved**
- Added proper Google Maps type definitions
- Fixed window.google namespace declarations
- All map components now compile without errors

## Current Implementation: OpenStreetMap (Free)
✅ **Currently Active**: The contact page now uses OpenStreetMap via iframe embed
- No API key required
- Completely free to use
- Shows your business location with interactive controls
- Includes "Get Directions" and "Open in Maps" buttons

## Option 1: Google Maps (Premium - Requires API Key)

### Setup Steps:
1. **Install dependencies** ✅ (Already done):
   ```bash
   npm install @googlemaps/react-wrapper @types/google.maps
   ```

2. **Get Google Maps API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable "Maps Embed API" and "Maps JavaScript API"
   - Create credentials (API Key)
   - Restrict the API key to your domain

3. **Add to environment variables**:
   ```bash
   # Add to .env.local
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. **Use Google Maps component**:
   ```tsx
   import { GoogleMap } from "@/components/google-map";
   
   <GoogleMap apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} />
   ```

### Benefits:
- More detailed maps
- Better styling options
- Satellite view
- Street View integration
- Better performance
- ✅ **No TypeScript errors**

## Option 2: Leaflet/OpenStreetMap (Free + Interactive)

### Use the Leaflet component:
```tsx
import { LeafletMap } from "@/components/leaflet-map";

<LeafletMap address="84A Bondgenotenlaan, 3000 Leuven, Belgium" />
```

### Benefits:
- Fully interactive
- No API key required
- Customizable markers
- Better user experience than iframe embed
- ✅ **No TypeScript errors**

## Option 3: Current Embedded Map (Free + Simple)
✅ **Currently in use** - Basic but functional
- ✅ **No TypeScript errors**

## 🔄 **How to Switch Between Map Options**

### In your contact page, you can easily switch by changing the import:

```tsx
// Option 1: Embedded (Current)
import { EmbeddedMap } from "@/components/embedded-map";
<EmbeddedMap address="84A Bondgenotenlaan, 3000 Leuven, Belgium" />

// Option 2: Leaflet (Free + Interactive)
import { LeafletMap } from "@/components/leaflet-map";
<LeafletMap address="84A Bondgenotenlaan, 3000 Leuven, Belgium" />

// Option 3: Google Maps (Premium)
import { GoogleMap } from "@/components/google-map";
{process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
  <GoogleMap 
    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} 
    address="84A Bondgenotenlaan, 3000 Leuven, Belgium" 
  />
)}
```

## Recommendation:
1. **✅ Keep current embedded map** (already working) 
2. **Upgrade to Leaflet** for better interactivity (no cost, no API key)
3. **Consider Google Maps** only if you need premium features

## ✅ **Status: All Components Ready**
- All TypeScript errors fixed
- All map options available and tested
- Easy to switch between options
- Comprehensive documentation provided
