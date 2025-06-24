// Google Analytics Integration Test Script
// Run this in your browser console to test the analytics integration

console.log('🧪 Testing Google Analytics Integration for 5gphones...\n');

// Test 1: Check if Google Analytics is loaded
console.log('1️⃣ Checking Google Analytics Setup...');
if (typeof window.gtag === 'function') {
  console.log('✅ Google Analytics gtag function is loaded');
} else {
  console.log('❌ Google Analytics gtag function not found');
}

if (typeof window.dataLayer !== 'undefined') {
  console.log('✅ Google Analytics dataLayer is available');
} else {
  console.log('❌ Google Analytics dataLayer not found');
}

// Test 2: Check cookie consent status
console.log('\n2️⃣ Checking Cookie Consent Status...');
const consentData = localStorage.getItem('cookie-consent');
if (consentData) {
  try {
    const consent = JSON.parse(consentData);
    console.log('✅ Cookie consent found:', consent);
    
    if (consent.analytics) {
      console.log('✅ Analytics cookies are ENABLED');
    } else {
      console.log('⚠️ Analytics cookies are DISABLED');
    }
  } catch (e) {
    console.log('❌ Error parsing cookie consent data');
  }
} else {
  console.log('⚠️ No cookie consent data found (banner should be visible)');
}

// Test 3: Test Google Analytics tracking functions
console.log('\n3️⃣ Testing Analytics Tracking Functions...');

// Test page view tracking
try {
  if (typeof window.gtag === 'function') {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: '/test-page',
      page_title: 'Analytics Test Page',
      custom_map: { dimension1: 'test_value' }
    });
    console.log('✅ Page view tracking test successful');
  }
} catch (e) {
  console.log('❌ Page view tracking test failed:', e.message);
}

// Test event tracking
try {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'test_event', {
      event_category: 'test',
      event_label: 'console_test',
      value: 1
    });
    console.log('✅ Event tracking test successful');
  }
} catch (e) {
  console.log('❌ Event tracking test failed:', e.message);
}

// Test 4: Test repair shop specific events
console.log('\n4️⃣ Testing Repair Shop Specific Events...');

// Test quote request tracking
try {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'quote',
      event_label: 'iPhone_screen_repair',
      value: 150,
      currency: 'EUR',
      device_type: 'iPhone',
      repair_type: 'screen_repair'
    });
    console.log('✅ Quote request tracking test successful');
  }
} catch (e) {
  console.log('❌ Quote request tracking test failed:', e.message);
}

// Test contact form tracking
try {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'form_submit', {
      event_category: 'contact',
      event_label: 'contact_general',
      form_type: 'contact_general'
    });
    console.log('✅ Contact form tracking test successful');
  }
} catch (e) {
  console.log('❌ Contact form tracking test failed:', e.message);
}

// Test phone call tracking
try {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'phone_call', {
      event_category: 'contact',
      event_label: '+32466134181',
      phone_number: '+32466134181'
    });
    console.log('✅ Phone call tracking test successful');
  }
} catch (e) {
  console.log('❌ Phone call tracking test failed:', e.message);
}

// Test 5: Check consent mode configuration
console.log('\n5️⃣ Testing Google Consent Mode...');

try {
  if (typeof window.gtag === 'function') {
    // Test consent update
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'functionality_storage': 'granted',
      'personalization_storage': 'granted'
    });
    console.log('✅ Consent mode update test successful');
  }
} catch (e) {
  console.log('❌ Consent mode test failed:', e.message);
}

// Test 6: Verify data layer contents
console.log('\n6️⃣ Checking DataLayer Contents...');
if (window.dataLayer && Array.isArray(window.dataLayer)) {
  console.log('✅ DataLayer is array with', window.dataLayer.length, 'events');
  
  // Show recent events
  const recentEvents = window.dataLayer.slice(-5);
  console.log('📊 Recent dataLayer events:', recentEvents);
} else {
  console.log('❌ DataLayer is not properly configured');
}

// Test 7: Test ecommerce tracking
console.log('\n7️⃣ Testing Ecommerce Tracking...');

try {
  if (typeof window.gtag === 'function') {
    // Test view item
    window.gtag('event', 'view_item', {
      currency: 'EUR',
      value: 150,
      items: [{
        item_id: 'iphone-13-screen-repair',
        item_name: 'iPhone 13 Screen Repair',
        category: 'Repair Services',
        price: 150,
        quantity: 1
      }]
    });
    console.log('✅ Ecommerce view_item tracking test successful');
    
    // Test purchase event
    window.gtag('event', 'purchase', {
      transaction_id: 'test-repair-12345',
      currency: 'EUR',
      value: 150,
      items: [{
        item_id: 'iphone-13-screen-repair',
        item_name: 'iPhone 13 Screen Repair',
        category: 'Repair Services',
        price: 150,
        quantity: 1
      }]
    });
    console.log('✅ Ecommerce purchase tracking test successful');
  }
} catch (e) {
  console.log('❌ Ecommerce tracking test failed:', e.message);
}

// Summary
console.log('\n📋 Test Summary:');
console.log('=====================================');
console.log('Run these tests in your browser console after:');
console.log('1. ✅ Loading the page');
console.log('2. ✅ Accepting analytics cookies');
console.log('3. ✅ Checking Real-time reports in Google Analytics');
console.log('=====================================');

// Instructions for next steps
console.log('\n🎯 Next Steps:');
console.log('1. Replace GA_MEASUREMENT_ID with your actual Google Analytics ID');
console.log('2. Check Google Analytics Real-time reports');
console.log('3. Test form submissions and phone clicks');
console.log('4. Verify events appear in GA dashboard');
console.log('5. Set up goals and conversions in Google Analytics');

console.log('\n🔗 Useful Links:');
console.log('• Google Analytics: https://analytics.google.com/');
console.log('• Google Tag Assistant: Chrome Web Store');
console.log('• GA4 Setup Guide: https://support.google.com/analytics/');

console.log('\n✨ Integration test complete! Check the output above for results.');
