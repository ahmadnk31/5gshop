#!/bin/bash

# Google Analytics Integration Test & Verification Script
# Run this to verify your Google Analytics setup is working correctly

echo "🧪 Google Analytics Integration Test for 5gphones"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if development server is running
echo "1️⃣ Checking Development Server..."
if curl -s "http://localhost:3000" > /dev/null; then
    echo -e "${GREEN}✅ Development server is running at http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Development server is not running${NC}"
    echo "   Start it with: npm run dev"
    exit 1
fi

echo ""

# Check Google Analytics configuration
echo "2️⃣ Checking Google Analytics Configuration..."
GA_ID=$(grep "GA_MEASUREMENT_ID" lib/google-analytics.ts | grep -o 'G-[A-Z0-9]*')
if [ ! -z "$GA_ID" ]; then
    echo -e "${GREEN}✅ Google Analytics ID found: $GA_ID${NC}"
else
    echo -e "${RED}❌ Google Analytics ID not found or invalid${NC}"
    echo "   Check lib/google-analytics.ts"
fi

echo ""

# Check file structure
echo "3️⃣ Checking Required Files..."
files=(
    "lib/google-analytics.ts"
    "components/google-analytics.tsx"
    "components/analytics-components.tsx"
    "hooks/use-cookies.ts"
    "components/cookie-consent-context.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

echo ""

# Check for TypeScript compilation errors
echo "4️⃣ Checking TypeScript Compilation..."
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "${GREEN}✅ No TypeScript compilation errors${NC}"
else
    echo -e "${YELLOW}⚠️  TypeScript compilation warnings/errors found${NC}"
    echo "   Run: npx tsc --noEmit for details"
fi

echo ""

# Test JavaScript Console Script
echo "5️⃣ Generating Browser Test Script..."
cat > test-analytics-browser.js << 'EOF'
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
EOF

echo -e "${GREEN}✅ Browser test script created: test-analytics-browser.js${NC}"

echo ""

# Instructions
echo "6️⃣ Manual Testing Instructions:"
echo "================================"
echo ""
echo -e "${BLUE}📱 Browser Testing:${NC}"
echo "1. Open: http://localhost:3000"
echo "2. Accept analytics cookies when banner appears"
echo "3. Open browser dev tools (F12)"
echo "4. Go to Console tab"
echo "5. Copy and paste the contents of test-analytics-browser.js"
echo "6. Run the script and check for success messages"
echo ""
echo -e "${BLUE}📊 Google Analytics Dashboard:${NC}"
echo "1. Go to: https://analytics.google.com/"
echo "2. Select your property with ID: $GA_ID"
echo "3. Navigate to Reports > Real-time"
echo "4. You should see:"
echo "   - Active users when you visit the site"
echo "   - Events when you interact with tracked elements"
echo "   - Page views when you navigate"
echo ""
echo -e "${BLUE}🧪 Test These Interactions:${NC}"
echo "- Click main CTA buttons (Book Repair, Shop Accessories)"
echo "- Submit contact form"
echo "- Submit quote request"
echo "- Click phone numbers"
echo "- Navigate between pages"
echo ""
echo -e "${BLUE}🔍 What to Look For in GA Real-time:${NC}"
echo "- 'generate_lead' events for quote requests"
echo "- 'form_submit' events for contact forms"
echo "- 'phone_call' events for phone clicks"
echo "- 'cta_click' events for button clicks"
echo "- 'page_view' events for navigation"
echo ""

# Check if Google Analytics script is properly loaded
echo "7️⃣ Testing Analytics Script Loading..."
echo ""
echo "Open your browser and check these in the Network tab:"
echo "- googletagmanager.com/gtag/js?id=$GA_ID should load"
echo "- No JavaScript errors in console"
echo "- dataLayer variable should exist"
echo ""

echo -e "${GREEN}🎉 Analytics Integration Test Complete!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Run the browser tests above"
echo "2. Verify events in Google Analytics Real-time reports"
echo "3. Test cookie consent functionality"
echo "4. Check that analytics respect user consent preferences"
echo ""
echo -e "${BLUE}📞 Support:${NC}"
echo "If you see events in the browser console but not in Google Analytics:"
echo "- Verify your GA_MEASUREMENT_ID is correct"
echo "- Check that the property is set up correctly in GA"
echo "- Ensure you're looking at the right property in GA dashboard"
echo ""
echo "Happy tracking! 📈🔧"
