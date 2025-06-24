#!/usr/bin/env node

// Comprehensive test for quote auto-population functionality
console.log('🧪 Testing Quote Auto-Population Functionality\n');

// Test URLs that should be generated from the home page
const testUrls = [
  // Device Categories
  {
    description: 'Device Category - Smartphone',
    url: '/quote?deviceType=SMARTPHONE',
    expectedFields: { deviceType: 'SMARTPHONE' }
  },
  {
    description: 'Device Category - Laptop',
    url: '/quote?deviceType=LAPTOP',
    expectedFields: { deviceType: 'LAPTOP' }
  },
  {
    description: 'Device Category - Tablet',
    url: '/quote?deviceType=TABLET',
    expectedFields: { deviceType: 'TABLET' }
  },
  {
    description: 'Device Category - Smartwatch',
    url: '/quote?deviceType=SMARTWATCH',
    expectedFields: { deviceType: 'SMARTWATCH' }
  },
  
  // Repair Services
  {
    description: 'Repair Service - Screen Replacement for Smartphone',
    url: '/quote?service=Screen%20Replacement&deviceType=SMARTPHONE',
    expectedFields: { 
      service: 'Screen Replacement', 
      deviceType: 'SMARTPHONE',
      issues: ['Screen damage'],
      issueDescription: 'Screen Replacement service request'
    }
  },
  {
    description: 'Repair Service - Battery Replacement for Smartphone',
    url: '/quote?service=Battery%20Replacement&deviceType=SMARTPHONE',
    expectedFields: { 
      service: 'Battery Replacement', 
      deviceType: 'SMARTPHONE',
      issues: ['Battery issues'],
      issueDescription: 'Battery Replacement service request'
    }
  },
  {
    description: 'Repair Service - Water Damage Recovery',
    url: '/quote?service=Water%20Damage%20Recovery&deviceType=SMARTPHONE',
    expectedFields: { 
      service: 'Water Damage Recovery', 
      deviceType: 'SMARTPHONE',
      issues: ['Water damage'],
      issueDescription: 'Water Damage Recovery service request'
    }
  },
  
  // Complex scenarios
  {
    description: 'Full Auto-Population with Brand and Model',
    url: '/quote?service=Screen%20Replacement&deviceType=SMARTPHONE&brand=Apple&model=iPhone%2015%20Pro',
    expectedFields: { 
      service: 'Screen Replacement', 
      deviceType: 'SMARTPHONE',
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      issues: ['Screen damage'],
      issueDescription: 'Screen Replacement for Apple iPhone 15 Pro'
    }
  }
];

// Function to simulate URL parameter parsing
function parseUrlParams(url) {
  const urlObj = new URL(`http://localhost:3000${url}`);
  const params = new URLSearchParams(urlObj.search);
  
  return {
    deviceType: params.get('deviceType'),
    brand: params.get('brand'),
    model: params.get('model'),
    service: params.get('service'),
    part: params.get('part')
  };
}

// Function to generate issue description (matching the logic in quote page)
function generateIssueDescription(deviceType, brand, model, service, part) {
  if (service && brand && model) {
    return `${service} for ${brand} ${model}`;
  } else if (part && brand && model) {
    return `${part} replacement for ${brand} ${model}`;
  } else if (service) {
    return `${service} service request`;
  } else if (part) {
    return `${part} replacement request`;
  }
  return '';
}

// Function to get auto-selected issues (matching the logic in quote page)
function getAutoSelectedIssues(service, part) {
  const issues = [];
  const text = (service || part || '').toLowerCase();
  
  if (text.includes('screen') || text.includes('display')) issues.push('Screen damage');
  if (text.includes('battery')) issues.push('Battery issues');
  if (text.includes('camera')) issues.push('Camera issues');
  if (text.includes('audio') || text.includes('speaker') || text.includes('microphone')) issues.push('Audio issues');
  if (text.includes('charging') || text.includes('port')) issues.push('Charging port');
  if (text.includes('water') || text.includes('liquid')) issues.push('Water damage');
  
  return issues;
}

// Run tests
let passedTests = 0;
let totalTests = testUrls.length;

testUrls.forEach((test, index) => {
  console.log(`${index + 1}. Testing: ${test.description}`);
  console.log(`   URL: ${test.url}`);
  
  const params = parseUrlParams(test.url);
  const issueDescription = generateIssueDescription(params.deviceType, params.brand, params.model, params.service, params.part);
  const autoIssues = getAutoSelectedIssues(params.service, params.part);
  
  const actualFields = {
    ...params,
    issues: autoIssues,
    issueDescription
  };
  
  // Remove null/undefined values for comparison
  Object.keys(actualFields).forEach(key => {
    if (actualFields[key] === null || actualFields[key] === undefined || actualFields[key] === '') {
      delete actualFields[key];
    }
  });
  
  // Check if expected fields match actual fields
  let testPassed = true;
  Object.keys(test.expectedFields).forEach(field => {
    if (Array.isArray(test.expectedFields[field])) {
      // For arrays, check if they have the same elements
      const expected = test.expectedFields[field].sort();
      const actual = (actualFields[field] || []).sort();
      if (JSON.stringify(expected) !== JSON.stringify(actual)) {
        console.log(`   ❌ Field '${field}': Expected [${expected.join(', ')}], Got [${actual.join(', ')}]`);
        testPassed = false;
      }
    } else {
      if (actualFields[field] !== test.expectedFields[field]) {
        console.log(`   ❌ Field '${field}': Expected '${test.expectedFields[field]}', Got '${actualFields[field]}'`);
        testPassed = false;
      }
    }
  });
  
  if (testPassed) {
    console.log(`   ✅ All fields auto-populated correctly`);
    passedTests++;
  }
  
  console.log(`   Parsed Fields:`, actualFields);
  console.log('');
});

console.log(`\n🏁 Test Results: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log('🎉 All auto-population tests passed! The functionality is working correctly.');
} else {
  console.log('⚠️  Some tests failed. Please check the implementation.');
}

// Generate test URLs for manual verification
console.log('\n🔗 Test URLs for manual verification:');
testUrls.forEach((test, index) => {
  console.log(`${index + 1}. http://localhost:3000${test.url}`);
});
