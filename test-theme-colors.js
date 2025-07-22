#!/usr/bin/env node

/**
 * Test script to verify theme colors are applied correctly
 * Run with: node test-theme-colors.js
 */

const fs = require('fs');
const path = require('path');

// Read critical CSS and layout files to verify theme colors
const criticalCssPath = path.join(__dirname, 'app', 'critical.css');
const layoutPath = path.join(__dirname, 'app', '[locale]', 'layout.tsx');

console.log('🎨 Testing Theme Color Implementation...\n');

// Check critical CSS
if (fs.existsSync(criticalCssPath)) {
  const criticalCss = fs.readFileSync(criticalCssPath, 'utf8');
  
  // Check for hardcoded blue colors
  const blueMatches = criticalCss.match(/#[0-9a-fA-F]{3,6}.*blue|blue(?![a-zA-Z])|#3b82f6|#2563eb|#1d4ed8/gi);
  
  if (blueMatches) {
    console.log('❌ Found hardcoded blue colors in critical.css:');
    blueMatches.forEach(match => console.log(`  - ${match}`));
  } else {
    console.log('✅ No hardcoded blue colors found in critical.css');
  }
  
  // Check for theme variables
  const themeVars = criticalCss.match(/var\(--[^)]+\)/g);
  if (themeVars && themeVars.length > 0) {
    console.log(`✅ Found ${themeVars.length} theme variable usages in critical.css`);
  }
} else {
  console.log('❌ critical.css not found');
}

// Check layout file
if (fs.existsSync(layoutPath)) {
  const layout = fs.readFileSync(layoutPath, 'utf8');
  
  // Check for hardcoded blue colors
  const blueMatches = layout.match(/#[0-9a-fA-F]{3,6}.*blue|blue(?![a-zA-Z])|#3b82f6|#2563eb|#1d4ed8/gi);
  
  if (blueMatches) {
    console.log('❌ Found hardcoded blue colors in layout.tsx:');
    blueMatches.forEach(match => console.log(`  - ${match}`));
  } else {
    console.log('✅ No hardcoded blue colors found in layout.tsx');
  }
  
  // Check for theme variables
  const themeVars = layout.match(/var\(--[^)]+\)/g);
  if (themeVars && themeVars.length > 0) {
    console.log(`✅ Found ${themeVars.length} theme variable usages in layout.tsx`);
  }
} else {
  console.log('❌ layout.tsx not found');
}

console.log('\n🚀 Theme Color Test Complete!');
console.log('\nNext steps:');
console.log('1. Test your website with Google PageSpeed Insights');
console.log('2. Check mobile performance score (should be improved from 77%)');
console.log('3. Verify theme colors are consistent across all pages');
