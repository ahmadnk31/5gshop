// Copy and paste this script into your browser console to test Google Analytics

console.log('🧪 Testing Google Analytics Integration...\n');

// Test 1: Check if gtag is loaded
if (typeof window.gtag === 'function') {
    console.log('✅ Google Analytics gtag function is loaded');
} else {
    console.log('❌ Google Analytics gtag function not found');
}

// Test 2: Check cookie consent
const consent = JSON.parse(localStorage.getItem('cookie-consent') || '{}');
console.log('Cookie consent status:', consent);

// Test 3: Test tracking functions
if (typeof window.gtag === 'function') {
    // Test quote request
    window.gtag('event', 'generate_lead', {
        event_category: 'quote',
        event_label: 'test_iPhone_screen_repair',
        value: 150,
        currency: 'EUR',
        device_type: 'iPhone',
        repair_type: 'screen_repair'
    });
    console.log('✅ Quote request tracking test sent');

    // Test contact form
    window.gtag('event', 'form_submit', {
        event_category: 'contact',
        event_label: 'test_contact_form',
        form_type: 'contact_general'
    });
    console.log('✅ Contact form tracking test sent');

    // Test phone call
    window.gtag('event', 'phone_call', {
        event_category: 'contact',
        event_label: '+32466134181',
        phone_number: '+32466134181'
    });
    console.log('✅ Phone call tracking test sent');
}

console.log('\n📊 Check Google Analytics Real-time reports to see these test events!');
