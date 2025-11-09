# SEO Audit Fixes - Action Plan

## Current Score: 53/100
**Target Score: 85+/100**

---

## 🔴 CRITICAL ISSUES (Priority 1)

### 1. TITLE TAG - Homepage
**Issues:**
- ❌ Title doesn't start with keyword "gsm reparatie"
- ❌ Title too long (current: 77 characters)
- ❌ Keyword not in first position

**Current Title:**
```
5GPhones - Phone Repair Leuven | iPhone, MacBook, iPad, Laptop & Accessories [] Online Appointment or Walk-in [] 5G Phones
```

**Fixed Title (60 chars):**
```
GSM Reparatie Leuven | iPhone, MacBook & iPad Herstel ⭐
```

**SEO Benefits:**
- ✅ Starts with exact keyword "gsm reparatie"
- ✅ Within 60 character limit
- ✅ Includes location (Leuven)
- ✅ Covers main services
- ✅ Trust signal (⭐)

---

### 2. META DESCRIPTION
**Issues:**
- ❌ Too long (current: 180+ characters)
- ❌ Keyword not prominent
- ❌ Missing call-to-action

**Current Description:**
```
⭐ Professional repair & software service Leuven - iPhone, MacBook, iPad, Laptop repair ✓ Windows installation ✓ Password reset ✓ Software troubleshooting ✓ Virus removal ✓ Data recovery ✓ 6 months warranty ✓ Bondgenotenlaan 84A. Hardware & Software solutions!
```

**Fixed Description (158 chars):**
```
GSM reparatie Leuven ⭐ iPhone, Samsung, MacBook herstel. Same-day service, 6 maanden garantie. Ook software & Windows installatie. Bondgenotenlaan 84A
```

**SEO Benefits:**
- ✅ Exact keyword in first position
- ✅ 158 characters (within limit)
- ✅ Clear services
- ✅ Local address
- ✅ Trust signals

---

### 3. H1 TAG OPTIMIZATION
**Issue:**
- ❌ Current H1 doesn't contain exact keyword "gsm reparatie"

**Current H1:**
```
Hardware & Software Reparatie Leuven - Alle Technische Problemen Opgelost
```

**Fixed H1:**
```
GSM Reparatie Leuven | Hardware & Software Service voor Alle Toestellen
```

**SEO Benefits:**
- ✅ Exact keyword "gsm reparatie" at start
- ✅ Includes "Leuven"
- ✅ Clear service offering
- ✅ Natural language

---

### 4. KEYWORD DENSITY
**Issue:**
- ❌ "gsm reparatie" used only 2 times
- ❌ Need 2-4 occurrences in first 100 words

**Fix:**
Add keyword to:
1. First paragraph (intro text)
2. Service descriptions
3. FAQ answers
4. Alt text for images
5. Internal links

**Target Placement:**
- First 100 words: 2 times
- Throughout page: 4-6 times total
- In headings: H1, H2 or H3
- In bold/strong tags
- In anchor text

---

### 5. PAGE SPEED (4.93 seconds → Target: <3 seconds)
**Issues:**
- Page size: 4414 KB (too large)
- 40 HTTP requests

**Solutions:**

#### A. Image Optimization
```bash
# Convert images to WebP
- Reduce quality to 80%
- Implement lazy loading
- Use next/image component
- Add responsive images
```

#### B. Code Optimization
```typescript
// Already implemented:
- Static generation
- Incremental Static Regeneration
- Code splitting
- Tree shaking

// Need to add:
- Bundle analyzer
- Remove unused CSS
- Minify JavaScript
- Enable compression
```

#### C. Caching Strategy
```typescript
// Add to next.config.ts
images: {
  minimumCacheTTL: 31536000, // 1 year
  formats: ['image/webp', 'image/avif'],
}
```

---

### 6. CONTENT LENGTH
**Issue:**
- ❌ Current: ~800 words
- ❌ Target: 2000+ words

**Solution:**
Add comprehensive sections:

1. **Detailed Service Descriptions** (300 words)
   - GSM reparatie proces
   - Wat repareren wij
   - Garantievoorwaarden

2. **Device-Specific Content** (400 words)
   - iPhone reparatie guide
   - Samsung reparatie info
   - MacBook herstel details
   - Laptop reparatie service

3. **Software Services** (300 words)
   - Windows installatie
   - Password reset service
   - Virus verwijdering
   - Data recovery

4. **Location Content** (200 words)
   - Bondgenotenlaan locatie
   - Bereikbaarheid
   - Openingstijden
   - Parking info

5. **Extended FAQ** (400 words)
   - Expand from 11 to 20 questions
   - More detailed answers

6. **Customer Guide** (200 words)
   - How to prepare for repair
   - What to expect
   - Pricing information

7. **Blog Snippets** (200 words)
   - Latest tips
   - Common problems
   - Maintenance advice

**Total: ~2000 words**

---

### 7. HEADING STRUCTURE
**Issues:**
- ❌ Duplicate headings
- ❌ Missing keyword in H2/H3

**Current Structure:**
```
H1: Hardware & Software Reparatie Leuven
H2: All Your Device Needs in One Place
H3: Quick Links
```

**Fixed Structure:**
```
H1: GSM Reparatie Leuven | Hardware & Software Service
H2: Professionele GSM Reparatie voor Alle Merken
H3: iPhone, Samsung, Huawei & MacBook Herstel
H2: Software Service Leuven - Windows & Password Reset
H3: Onze GSM Reparatie Diensten
H2: Waarom Kiezen voor Onze GSM Reparatie Service?
H3: Same-Day Service & 6 Maanden Garantie
```

**SEO Benefits:**
- ✅ Keyword in H1, H2, H3
- ✅ Logical hierarchy
- ✅ No duplicates
- ✅ Natural variations

---

### 8. IMAGE SEO
**Issues:**
- ❌ No images with keyword in filename
- ❌ No images with keyword in alt text
- ❌ Images use underscores

**Current Images:**
```
hero-lifestyle.jpg
hero-accessories.jpg
placeholder_accessory.jpg  ← has underscore
```

**Fixed Images:**
```
gsm-reparatie-leuven-winkel.jpg
iphone-reparatie-leuven-scherm.jpg
macbook-herstel-leuven-batterij.jpg
samsung-reparatie-service.jpg
```

**Alt Text with Keyword:**
```html
<img 
  src="/gsm-reparatie-leuven-winkel.jpg" 
  alt="GSM reparatie Leuven - 5G Phones winkel Bondgenotenlaan" 
/>
<img 
  src="/iphone-reparatie-leuven.jpg" 
  alt="Professionele iPhone gsm reparatie service Leuven" 
/>
```

---

### 9. MOBILE SITEMAP
**Issue:**
- ❌ No mobile sitemap found

**Solution:**
Create mobile-specific sitemap:

```xml
<!-- public/sitemap-mobile.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  <url>
    <loc>https://www.5gphones.be/nl</loc>
    <mobile:mobile/>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.5gphones.be/nl/repairs</loc>
    <mobile:mobile/>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- ... all pages -->
</urlset>
```

**Add to robots.txt:**
```
Sitemap: https://www.5gphones.be/sitemap.xml
Sitemap: https://www.5gphones.be/sitemap-mobile.xml
```

---

### 10. INTERNAL LINKING
**Issue:**
- ❌ Keyword not in anchor text

**Current:**
```html
<a href="/repairs">Onze diensten</a>
<a href="/contact">Contact</a>
```

**Fixed with Keywords:**
```html
<a href="/repairs">GSM reparatie diensten</a>
<a href="/contact">GSM reparatie Leuven contact</a>
<a href="/repairs/iphone">iPhone gsm reparatie</a>
<a href="/repairs/samsung">Samsung reparatie service</a>
```

---

## ✅ WHAT'S ALREADY GOOD

### Speed
- ✅ Number of requests acceptable (40)

### URL
- ✅ SEO-friendly URL
- ✅ No underscores in URL
- ✅ Close to top-level domain

### Code
- ✅ No Flash found
- ✅ Schema markup found
- ✅ Sitemap.xml found

### Mobile
- ✅ Compression enabled
- ✅ Apple icon found
- ✅ Viewport meta tag found

---

## 📋 IMPLEMENTATION CHECKLIST

### Week 1 (Immediate Fixes):
- [ ] Update homepage title tag
- [ ] Update meta description
- [ ] Update H1 with keyword
- [ ] Add keyword to first 100 words
- [ ] Bold keyword 2-3 times
- [ ] Update 5 image filenames
- [ ] Add keyword to image alt text
- [ ] Fix duplicate headings

### Week 2 (Content Expansion):
- [ ] Add detailed service pages (4 pages)
- [ ] Expand homepage content to 2000+ words
- [ ] Add 10 more FAQ questions
- [ ] Create location page
- [ ] Add customer guide section

### Week 3 (Technical SEO):
- [ ] Create mobile sitemap
- [ ] Optimize images (WebP conversion)
- [ ] Implement lazy loading
- [ ] Add internal links with keywords
- [ ] Remove inline CSS
- [ ] Enable text compression

### Week 4 (Performance):
- [ ] Optimize bundle size
- [ ] Implement service worker
- [ ] Add CDN for static assets
- [ ] Optimize font loading
- [ ] Reduce HTTP requests

---

## 🎯 EXPECTED RESULTS

### After Week 1:
- PageScore: 53 → 68 (+15 points)
- Title/Meta: Fixed
- Keyword density: Improved

### After Week 2:
- PageScore: 68 → 78 (+10 points)
- Content length: 2000+ words
- Heading structure: Optimized

### After Week 3:
- PageScore: 78 → 85 (+7 points)
- Technical SEO: Complete
- Mobile: Optimized

### After Week 4:
- PageScore: 85 → 90+ (+5 points)
- Speed: <3 seconds
- All green checks

---

## 🚀 QUICK WINS (Do These First)

1. **Title Tag** (5 minutes)
   - Change to start with "GSM reparatie Leuven"

2. **Meta Description** (5 minutes)
   - Shorten to 158 characters
   - Add keyword at start

3. **H1 Tag** (2 minutes)
   - Add "GSM reparatie" to H1

4. **First Paragraph** (10 minutes)
   - Rewrite to include keyword 2 times
   - Bold keyword once

5. **Image Alt Text** (15 minutes)
   - Update 5 main images
   - Add keyword to alt text

**Total Time: 37 minutes**
**Score Improvement: +10-15 points**

---

*Last Updated: November 9, 2025*
*Current Score: 53/100*
*Target Score: 85+/100*
