# Quote Form Auto-Population Feature

## Overview
The quote form auto-population feature allows users to seamlessly navigate from the device catalog browser to the quote form with pre-filled device information, improving user experience and reducing form abandonment.

## How It Works

### 1. URL Parameter System
The quote page (`/app/quote/page.tsx`) now accepts URL parameters to pre-populate form fields:

- `deviceType`: The type of device (SMARTPHONE, TABLET, etc.)
- `brand`: Device brand (Apple, Samsung, etc.)
- `model`: Specific device model (iPhone 15 Pro, Galaxy S23, etc.)
- `service`: Requested service (Screen Repair, Battery Replacement, etc.)
- `part`: Specific part name (if requesting part replacement)

### 2. Device Catalog Integration
The device catalog browser (`/components/device-catalog-browser.tsx`) has been updated to generate quote URLs with relevant parameters:

#### From Brand/Service Level:
```tsx
<Link href={`/quote?deviceType=${selectedType}&service=${encodeURIComponent(service)}`}>
  Get Quote
</Link>
```

#### From Parts Level:
```tsx
<Link href={`/quote?deviceType=${selectedType}&brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedModel)}&part=${encodeURIComponent(part.name)}`}>
  Request Repair Quote
</Link>
```

#### From Model Services:
```tsx
<Link href={`/quote?deviceType=${selectedType}&brand=${encodeURIComponent(selectedBrand)}&model=${encodeURIComponent(selectedModel)}&service=${encodeURIComponent(service)}`}>
  Get Detailed Quote
</Link>
```

### 3. Form Pre-Population Logic

The quote form automatically:

1. **Pre-fills basic device information**:
   - Device type radio button selection
   - Brand dropdown selection
   - Model text input
   
2. **Generates contextual descriptions**:
   - For services: "Screen Repair repair for Apple iPhone 15 Pro"
   - For parts: "Front Camera replacement for Samsung Galaxy S23"

3. **Auto-selects relevant issue checkboxes**:
   - Screen services → Screen damage checkbox
   - Battery services → Battery issues checkbox
   - Camera services → Camera issues checkbox
   - Audio services → Audio issues checkbox
   - Charging services → Charging port checkbox

4. **Shows visual confirmation**:
   - Green notification banner when form is pre-populated
   - Clear indication that information was auto-filled

### 4. User Experience Features

#### Visual Indicators:
- Green success banner showing "Form pre-populated with device information from your selection"
- Pre-selected checkboxes based on service type
- Pre-filled text areas with contextual descriptions

#### Smart Mapping:
The system intelligently maps services to related issues:
```tsx
const issueMap = {
  'Screen Repair': ['screen'],
  'Battery Replacement': ['battery'],
  'Camera Repair': ['camera'],
  'Charging Port Repair': ['charging'],
  'Speaker Repair': ['audio'],
  'Microphone Repair': ['audio'],
};
```

## Example URLs

### Complete Device + Service:
```
/quote?deviceType=SMARTPHONE&brand=Apple&model=iPhone%2015%20Pro&service=Screen%20Repair
```

### Device + Part Replacement:
```
/quote?deviceType=SMARTPHONE&brand=Samsung&model=Galaxy%20S23&part=Battery
```

### Service Only:
```
/quote?deviceType=TABLET&service=Screen%20Repair
```

## Testing the Feature

1. **Navigate to Repairs page**: `/repairs`
2. **Browse device hierarchy**: Phones → Apple → iPhone 15 Pro → Parts/Services
3. **Click "Get Quote" buttons**: Notice URL parameters being passed
4. **Verify form pre-population**: Check that fields are filled and notification shows
5. **Test different paths**: Try both parts and services to see different auto-fills

## Benefits

1. **Reduced friction**: Users don't need to re-enter device information
2. **Improved accuracy**: Less chance of user input errors
3. **Better conversion**: Pre-filled forms have higher completion rates
4. **Contextual help**: Auto-selected issues guide users to describe problems better
5. **Seamless flow**: Natural progression from browsing to quoting

## Technical Implementation

### State Management:
- Uses React hooks (`useState`, `useEffect`) for form state
- `useSearchParams` for URL parameter reading
- Controlled components for all form inputs

### URL Encoding:
- Proper `encodeURIComponent()` usage for special characters
- Null-safe parameter handling
- Type-safe device type mapping

### Form Validation:
- All pre-populated fields remain editable
- Required field validation still applies
- User can modify any auto-filled information

This feature significantly improves the user journey from device discovery to quote request, making the repair booking process more efficient and user-friendly.
