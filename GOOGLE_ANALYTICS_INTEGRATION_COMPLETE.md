# 📊 Google Analytics Integration with Cookie Consent

## 🎯 Overview
Complete Google Analytics 4 integration with GDPR-compliant cookie consent. Automatically respects user privacy preferences and tracks user interactions when consent is given.

## 🚀 Quick Setup

### 1. Get Your Google Analytics Measurement ID
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for your website
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Update Your Measurement ID
In `/lib/google-analytics.ts`, replace the placeholder:

```typescript
export const GA_MEASUREMENT_ID = 'G-YOUR-MEASUREMENT-ID-HERE';
```

### 3. That's It! 🎉
Google Analytics is now integrated and will automatically:
- ✅ Respect cookie consent preferences
- ✅ Track page views when analytics consent is given
- ✅ Apply Google Consent Mode v2
- ✅ Comply with GDPR requirements

## 📋 What's Included

### 🏗️ Core Files Created:

#### **`/lib/google-analytics.ts`**
- Google Analytics 4 initialization
- Consent Mode v2 configuration
- Pre-built tracking functions
- Ecommerce tracking for repair shop
- GDPR-compliant setup

#### **`/components/google-analytics.tsx`**  
- React component for GA integration
- Automatic page view tracking
- Custom hooks for analytics
- Cookie consent integration

#### **`/components/analytics-components.tsx`**
- Ready-to-use components with tracking
- Button click tracking
- Form submission tracking
- Phone call tracking
- Download tracking
- Scroll depth tracking

### 🔧 Integration Points:

#### **Layout Integration** (`/app/layout.tsx`)
- ✅ GoogleAnalytics component added
- ✅ Automatic initialization
- ✅ Respect for cookie preferences

## 🎯 Usage Examples

### Basic Event Tracking
```tsx
import { useGoogleAnalytics } from '@/components/google-analytics';

function MyComponent() {
  const { trackEvent } = useGoogleAnalytics();
  
  const handleClick = () => {
    trackEvent('button_click', { 
      button_name: 'get_quote',
      page: 'homepage' 
    });
  };
  
  return <button onClick={handleClick}>Get Quote</button>;
}
```

### Quote Request Tracking
```tsx
import { useGoogleAnalytics } from '@/components/google-analytics';

function QuoteForm() {
  const { trackQuoteRequest } = useGoogleAnalytics();
  
  const handleSubmit = (deviceType: string, repairType: string) => {
    trackQuoteRequest(deviceType, repairType, 150); // 150 EUR estimated value
  };
}
```

### Phone Call Tracking
```tsx
import { TrackablePhoneLink } from '@/components/analytics-components';

function ContactInfo() {
  return (
    <TrackablePhoneLink phoneNumber="+32466134181">
      📞 +32 (466) 13 41 81
    </TrackablePhoneLink>
  );
}
```

### Form Submission Tracking
```tsx
import { AnalyticsForm } from '@/components/analytics-components';

function ContactForm() {
  return (
    <AnalyticsForm formType="contact_form">
      <input type="email" placeholder="Your email" />
      <button type="submit">Send Message</button>
    </AnalyticsForm>
  );
}
```

### Button with Click Tracking
```tsx
import { AnalyticsButton } from '@/components/analytics-components';

function HomePage() {
  return (
    <AnalyticsButton 
      eventName="cta_click" 
      eventParams={{ location: 'hero_section', button_type: 'primary' }}
      onClick={() => console.log('Button clicked!')}
    >
      Get Free Quote
    </AnalyticsButton>
  );
}
```

## 📊 Available Tracking Methods

### Standard Events
- **Page Views**: Automatic when analytics consent is given
- **Click Events**: Button clicks, link clicks
- **Form Submissions**: Contact forms, quote requests
- **Phone Calls**: Click-to-call tracking
- **Downloads**: File downloads
- **Scroll Depth**: User engagement tracking

### Repair Shop Specific Events
- **Quote Requests**: Device type, repair type, estimated value
- **Service Views**: Specific repair service pages
- **Purchase Completions**: Repair service bookings
- **Contact Interactions**: Phone calls, emails, forms

### Ecommerce Events
- **View Item**: Service/product page views
- **Add to Cart**: Quote requests
- **Begin Checkout**: Quote confirmations  
- **Purchase**: Completed repairs/sales

## 🔧 Configuration Options

### Consent Mode Settings
```typescript
// Automatically configured with cookie consent
gtag('consent', 'default', {
  'analytics_storage': 'denied',     // Granted when analytics consent given
  'ad_storage': 'denied',           // Granted when marketing consent given
  'ad_user_data': 'denied',         // Granted when marketing consent given
  'ad_personalization': 'denied',   // Granted when marketing consent given
  'functionality_storage': 'denied', // Granted when preferences consent given
  'personalization_storage': 'denied', // Granted when preferences consent given
  'security_storage': 'granted'     // Always granted (security)
});
```

### Custom Event Parameters
```typescript
trackEvent('custom_event', {
  event_category: 'engagement',
  event_label: 'button_click',
  value: 1,
  custom_parameter: 'custom_value',
  page_location: window.location.href,
  page_title: document.title
});
```

## 🎨 Ready-to-Use Components

### 1. **AnalyticsButton** - Buttons with click tracking
### 2. **TrackablePhoneLink** - Phone links with call tracking  
### 3. **AnalyticsForm** - Forms with submission tracking
### 4. **AnalyticsExternalLink** - External links with click tracking
### 5. **QuoteRequestTracker** - Automatic quote tracking
### 6. **PageSectionTracker** - Section view tracking
### 7. **AnalyticsDownloadLink** - Download tracking
### 8. **ScrollDepthTracker** - Scroll engagement tracking
### 9. **AnalyticsStatus** - Debug component (dev only)

## 🚀 Advanced Features

### Cross-Device Tracking
```typescript
import { getGoogleAnalyticsClientId } from '@/lib/google-analytics';

// Get client ID for cross-platform tracking
const clientId = await getGoogleAnalyticsClientId();
```

### Enhanced Ecommerce for Repair Shop
```typescript
import { ecommerce } from '@/lib/google-analytics';

// Track service views
ecommerce.viewItem('iphone-screen-repair', 'iPhone Screen Repair', 'Repair Services', 150);

// Track quote requests
ecommerce.addToCart('iphone-screen-repair', 'iPhone Screen Repair', 'Repair Services', 150);

// Track completed repairs
ecommerce.purchase('repair-12345', [
  {
    item_id: 'iphone-screen-repair',
    item_name: 'iPhone 13 Screen Repair', 
    category: 'Repair Services',
    price: 150,
    quantity: 1
  }
], 150);
```

## 🔒 Privacy & GDPR Compliance

### ✅ What We Do Right:
- **No tracking without consent**: Analytics only run when user consents
- **Consent Mode v2**: Modern Google Analytics consent management
- **IP Anonymization**: Automatically enabled for GDPR compliance
- **Transparent consent**: Users know exactly what's being tracked
- **Easy opt-out**: Users can withdraw consent anytime

### ✅ Legal Compliance:
- **GDPR Article 7**: Valid consent requirements met
- **ePrivacy Directive**: Cookie consent before tracking
- **Data minimization**: Only collect necessary analytics data
- **User rights**: Easy consent withdrawal and data control

## 🎯 Business Benefits

### 📈 **Better Insights**:
- Understand user behavior on your website
- Track which pages drive most quote requests
- Monitor conversion rates from visits to repairs
- Identify most popular services and devices

### 🎯 **Marketing Optimization**:
- See which marketing channels work best
- Track phone calls from website visitors
- Measure form completion rates
- Optimize user journey for more conversions

### 💼 **Business Intelligence**:
- Monitor website performance and user engagement
- Track seasonal trends in repair requests
- Identify peak usage times and popular content
- Make data-driven decisions for business growth

## 🛠️ Development & Debugging

### Debug Mode (Development Only)
Add the `AnalyticsStatus` component to see real-time consent status:

```tsx
import { AnalyticsStatus } from '@/components/analytics-components';

// Add to your page during development
<AnalyticsStatus />
```

### Testing Analytics
1. **Open browser dev tools**
2. **Go to Console tab**
3. **Check for Google Analytics events**: Look for `gtag` calls
4. **Use Google Analytics Debugger**: Chrome extension for real-time testing
5. **Check Real-Time reports**: In Google Analytics dashboard

## 🎉 You're All Set!

Your Google Analytics integration is now complete and GDPR-compliant! 

### 🚀 Next Steps:
1. **Replace measurement ID** with your actual Google Analytics ID
2. **Test the integration** by visiting your site and checking analytics
3. **Customize tracking** by adding analytics components to your pages
4. **Monitor your data** in the Google Analytics dashboard

### 📊 **Your website now provides**:
- ✅ **Privacy-first analytics** that respects user consent
- ✅ **Business insights** to grow your repair business  
- ✅ **Legal compliance** with EU privacy regulations
- ✅ **Professional tracking** without compromising user trust

**Happy tracking! 📈🔧**
