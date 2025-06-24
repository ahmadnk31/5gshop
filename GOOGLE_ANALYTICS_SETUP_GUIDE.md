# 🚀 Google Analytics Setup Guide for 5gphones

## Step 1: Get Your Google Analytics Measurement ID

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Create Account** (if you don't have one)
3. **Create Property** for 5gphones.be
4. **Copy your Measurement ID** (looks like `G-XXXXXXXXXX`)

## Step 2: Update Configuration

Replace the placeholder in `/lib/google-analytics.ts`:

```typescript
// Change this line:
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// To your actual ID:
export const GA_MEASUREMENT_ID = 'G-YOUR-ACTUAL-ID';
```

## Step 3: Test Your Integration

### 🧪 Local Testing

1. **Start your development server**:
```bash
npm run dev
```

2. **Open browser dev tools** (F12)
3. **Go to Console tab**
4. **Visit**: http://localhost:3000
5. **Accept analytics cookies** when banner appears
6. **Look for Google Analytics events** in console

### 🔍 What You Should See:

#### **Console Output**:
```javascript
// When cookies are accepted:
gtag('consent', 'update', {
  analytics_storage: 'granted',
  ad_storage: 'denied',  // (if marketing not accepted)
  ...
})

// When pages are visited:
gtag('config', 'G-YOUR-ID', {
  page_path: '/',
  page_title: 'TechFix Pro - Device Repair & Accessories',
  ...
})

// When forms are submitted:
gtag('event', 'form_submit', {
  event_category: 'contact',
  form_type: 'contact_general'
})
```

## Step 4: Real-Time Testing

### 📊 Google Analytics Dashboard

1. **Go to Google Analytics**
2. **Navigate to Reports > Real-time**
3. **Visit your website** with analytics enabled
4. **You should see**:
   - Active users counter increase
   - Page views appear in real-time
   - Events when you interact with the site

### 🎯 Test These Interactions:

#### **Phone Call Tracking**:
- Click phone numbers in footer
- Click phone numbers on contact page
- Check Real-time > Events for `phone_call` events

#### **Form Submissions**:
- Submit contact form
- Submit quote request
- Check for `form_submit` and `generate_lead` events

#### **Page Navigation**:
- Navigate between pages
- Check Real-time > Page views

## Step 5: Privacy Compliance Testing

### 🍪 Cookie Consent Testing

1. **Clear browser data** (cookies/localStorage)
2. **Visit site in incognito/private mode**
3. **Test these scenarios**:

#### **Scenario A: Reject Analytics**
1. Cookie banner appears
2. Click "Reject All" or customize and turn off analytics
3. Browse the site
4. **Expected**: No events in Google Analytics

#### **Scenario B: Accept Analytics**
1. Cookie banner appears  
2. Click "Accept All" or customize and turn on analytics
3. Browse the site
4. **Expected**: Events appear in Google Analytics

#### **Scenario C: Change Preferences**
1. Accept analytics initially
2. Use "Cookie Preferences" button in footer
3. Turn off analytics
4. **Expected**: No new events after disabling

## Step 6: Business Intelligence Setup

### 📈 Custom Goals in Google Analytics

Set up these goals in your GA dashboard:

#### **Quote Requests** (High Value):
- Event Category: `quote`
- Event Action: `generate_lead`
- **Value**: Assign monetary value (e.g., €50 potential revenue)

#### **Contact Forms** (Medium Value):
- Event Category: `contact`
- Event Action: `form_submit`
- **Value**: Assign value (e.g., €20 potential revenue)

#### **Phone Calls** (High Value):
- Event Category: `contact`
- Event Action: `phone_call`
- **Value**: Assign value (e.g., €75 potential revenue)

### 📊 Custom Reports

Create these reports to track your business:

#### **Device Repair Funnel**:
1. Page views on services
2. Quote requests by device type
3. Conversion rates by repair type

#### **Customer Journey**:
1. Traffic sources (Google, social, direct)
2. Popular pages before quote requests
3. Time from visit to quote request

## Step 7: Advanced Features

### 🔗 Google Ads Integration

If you plan to run Google Ads:

1. **Link Google Analytics to Google Ads**
2. **Import conversion goals**
3. **Track ad performance to actual quotes**

### 📱 Enhanced Ecommerce

For tracking repair services as products:

```typescript
// Already implemented - tracks repair services like products
ecommerce.viewItem('iphone-screen-repair', 'iPhone Screen Repair', 'Repair Services', 150);
```

## Step 8: Monitoring & Alerts

### 🚨 Set Up Alerts

In Google Analytics, create alerts for:

1. **Sudden traffic drops** (> 20% decrease)
2. **Quote request drops** (> 30% decrease)
3. **High bounce rate** (> 80%)
4. **Site errors** (increase in error events)

### 📧 Weekly Reports

Set up automated weekly reports for:
- Website traffic summary
- Top performing pages
- Conversion rates
- Device type popularity

## 🎯 Expected Analytics Data

### **For 5gphones, you'll track**:

#### **User Behavior**:
- Which device repairs are most popular
- Peak times for quote requests
- User journey from landing to quote
- Most effective traffic sources

#### **Business Metrics**:
- Quote request conversion rates
- Phone call frequency
- Contact form completion rates
- Popular service categories

#### **Technical Insights**:
- Page load performance
- Mobile vs desktop usage
- Browser/device preferences
- Geographic distribution

## 🔧 Troubleshooting

### **No Data in Google Analytics?**

1. **Check measurement ID** in `/lib/google-analytics.ts`
2. **Verify cookie consent** is given for analytics
3. **Check browser console** for errors
4. **Use Google Tag Assistant** Chrome extension

### **Events Not Tracking?**

1. **Check cookie consent status** (analytics must be enabled)
2. **Verify function calls** in browser console
3. **Check Real-time > Events** in GA dashboard
4. **Ensure proper import** of analytics hooks

### **Debug Mode**

Add this to your page during development:

```tsx
import { AnalyticsStatus } from '@/components/analytics-components';

// Shows real-time consent status
<AnalyticsStatus />
```

## ✅ Success Checklist

- [ ] Google Analytics account created
- [ ] Measurement ID updated in code
- [ ] Cookie consent working properly
- [ ] Real-time data showing in GA dashboard
- [ ] Form submissions tracking correctly
- [ ] Phone calls tracking correctly
- [ ] Page views tracking correctly
- [ ] Privacy compliance verified
- [ ] Goals and conversions configured
- [ ] Custom reports created

## 🎉 You're Done!

Your Google Analytics integration is now complete and GDPR-compliant! 

### **Benefits You'll Get**:

🎯 **Business Intelligence**:
- Track which devices need repair most
- Identify peak business hours
- Monitor conversion from visitor to customer
- Understand customer journey and preferences

📊 **Marketing Insights**:
- See which marketing channels work best
- Track ROI on advertising spend
- Identify content that drives quotes
- Optimize website for better conversions

🔒 **Privacy-First**:
- Full GDPR compliance with user consent
- Transparent data collection
- User control over their data
- Professional privacy management

**Happy tracking! Your website now provides powerful business insights while respecting user privacy.** 📈🔧
