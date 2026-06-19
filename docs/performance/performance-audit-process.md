# Performance Audit Process

**Purpose:** Comprehensive guide to measuring, optimizing, and monitoring website performance.

**Goal:** Achieve excellent Core Web Vitals scores and provide fast, smooth user experience.

---

## Quick Reference

**Target Metrics:**
- Lighthouse Performance Score: >90
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1
- Total Page Size: <1.5MB (initial load)

**Tools:**
- Lighthouse (Chrome DevTools)
- WebPageTest
- Chrome User Experience Report
- Network tab (DevTools)

---

## Performance Audit Workflow

```
New Page/Update
    ↓
1. Baseline Measurement (Lighthouse)
    ↓
2. Core Web Vitals Analysis
    ↓
3. Resource Optimization
    ↓
4. Render Optimization
    ↓
5. JavaScript Optimization
    ↓
6. Re-measurement & Comparison
    ↓
7. Real User Monitoring Setup
    ↓
Performance Optimized
```

---

## 1. Baseline Measurement

### Run Lighthouse Audit

**Chrome DevTools:**
1. Open page in Chrome
2. Open DevTools (F12 or Cmd+Option+I)
3. Navigate to "Lighthouse" tab
4. Configuration:
   - Mode: **Navigation** (for page load)
   - Device: **Desktop** or **Mobile**
   - Categories: **Performance** (check all for full audit)
5. Click "Analyze page load"

**Lighthouse CLI:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit on page
lighthouse https://localhost:8080 --output html --output-path report.html

# Run audit on multiple pages
for page in "/" "/pages/how-it-works/" "/pages/pricing/"; do
    lighthouse "https://localhost:8080${page}" --output json --output-path "report${page//\//-}.json"
done
```

**CI/CD Integration (Lighthouse CI):**
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse CI
lhci autorun --config=lighthouserc.json
```

### Lighthouse Score Breakdown

**Performance Score (0-100):**
- 90-100: ✅ **Good**
- 50-89: ⚠️ **Needs Improvement**
- 0-49: ❌ **Poor**

**What affects the score:**
- **First Contentful Paint (FCP)** - 10%
- **Largest Contentful Paint (LCP)** - 25%
- **Total Blocking Time (TBT)** - 30%
- **Cumulative Layout Shift (CLS)** - 25%
- **Speed Index** - 10%

---

## 2. Core Web Vitals Analysis

### LCP (Largest Contentful Paint)

**What it measures:** Time until largest content element is rendered

**Target:** <2.5s (Good), 2.5s-4.0s (Needs Improvement), >4.0s (Poor)

**Common culprits:**
- Large unoptimized hero images
- Render-blocking CSS/JavaScript
- Slow server response times
- Multiple redirects

**How to measure:**
```javascript
// In browser console
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP:', entry.renderTime || entry.loadTime);
  }
}).observe({type: 'largest-contentful-paint', buffered: true});
```

**How to fix:**
1. **Optimize images:**
   - Use WebP format
   - Compress to 70-85% quality
   - Serve responsive images (`<picture>`)
   - Add `width` and `height` attributes

2. **Eliminate render-blocking resources:**
   - Defer non-critical JavaScript
   - Inline critical CSS
   - Use `async` or `defer` on scripts

3. **Improve server response time:**
   - Use CDN for static assets
   - Enable HTTP/2 or HTTP/3
   - Implement server-side caching

4. **Preload critical resources:**
   ```html
   <link rel="preload" href="/assets/images/hero.webp" as="image">
   <link rel="preload" href="/assets/css/main.css" as="style">
   ```

### FID (First Input Delay)

**What it measures:** Time from first user interaction to browser response

**Target:** <100ms (Good), 100ms-300ms (Needs Improvement), >300ms (Poor)

**Common culprits:**
- Heavy JavaScript execution blocking main thread
- Large JavaScript bundles
- Unoptimized third-party scripts

**How to measure:**
- Use Chrome User Experience Report (real user data)
- Use Lighthouse TBT (Total Blocking Time) as proxy
- Field data from real users (Google Search Console)

**How to fix:**
1. **Code splitting:**
   ```javascript
   // Load components on demand
   const module = await import('./heavy-component.js');
   ```

2. **Defer non-critical JavaScript:**
   ```html
   <script src="/assets/js/analytics.js" defer></script>
   ```

3. **Use Web Workers for heavy computations:**
   ```javascript
   const worker = new Worker('/assets/js/worker.js');
   worker.postMessage({task: 'calculate', data: values});
   ```

4. **Minimize main thread work:**
   - Break up long tasks (yield to main thread with `setTimeout` or `requestIdleCallback`)
   - Optimize event handlers (throttle/debounce)
   - Avoid layout thrashing

### CLS (Cumulative Layout Shift)

**What it measures:** Visual stability (unexpected layout shifts)

**Target:** <0.1 (Good), 0.1-0.25 (Needs Improvement), >0.25 (Poor)

**Common culprits:**
- Images without dimensions
- Ads/embeds/iframes without reserved space
- Web fonts causing FOIT (Flash of Invisible Text)
- Dynamic content injection

**How to measure:**
```javascript
// In browser console
let clsScore = 0;
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsScore += entry.value;
      console.log('CLS:', clsScore);
    }
  }
}).observe({type: 'layout-shift', buffered: true});
```

**How to fix:**
1. **Always specify image dimensions:**
   ```html
   <!-- ❌ Bad: No dimensions -->
   <img src="hero.jpg" alt="Hero">

   <!-- ✅ Good: Dimensions specified -->
   <img src="hero.jpg" alt="Hero" width="1920" height="1080">
   ```

2. **Reserve space for dynamic content:**
   ```css
   .ad-container {
     min-height: 250px; /* Reserve space for ad */
   }
   ```

3. **Preload fonts and use font-display:**
   ```html
   <link rel="preload" href="/fonts/plus-jakarta-sans.woff2" as="font" type="font/woff2" crossorigin>
   ```
   ```css
   @font-face {
     font-family: 'Plus Jakarta Sans';
     font-display: swap; /* Prevent FOIT */
   }
   ```

4. **Avoid inserting content above existing content:**
   - Use `transform` instead of `top/left` for animations
   - Add new elements at bottom of page, not top

---

## 3. Resource Optimization

### Image Optimization

**Current issues:**
- ⚠️ Base64 images in About page (12 images, ~2MB)
- ⚠️ Uncompressed PNG/JPG files
- ⚠️ No WebP format support

**Optimization steps:**

1. **Extract base64 images:**
   ```bash
   ./scripts/optimize-images.sh extract src/pages/about.njk
   ```

2. **Convert to WebP:**
   ```bash
   ./scripts/optimize-images.sh convert src/assets/images/experts/
   ```

3. **Implement lazy loading:**
   ```html
   <picture>
     <source srcset="/assets/images/expert.webp" type="image/webp">
     <img src="/assets/images/expert.png" alt="Expert" loading="lazy" width="400" height="400">
   </picture>
   ```

4. **Preload critical images:**
   ```html
   <link rel="preload" href="/assets/images/hero.webp" as="image">
   ```

**Expected improvements:**
- Page size: -60% to -80%
- LCP: -30% to -50%
- Bandwidth: -70% (WebP vs PNG/JPG)

### CSS Optimization

**Current issues:**
- CSS not minified (served as-is from source)
- No critical CSS inlined
- All CSS loaded on every page (no page-specific splitting)

**Optimization steps:**

1. **Minify CSS:**
   ```bash
   npm install -g clean-css-cli
   cleancss -o _site/assets/css/main.min.css _site/assets/css/main.css
   ```

2. **Extract critical CSS:**
   ```bash
   npm install -g critical

   critical src/pages/index.html --base _site --inline --minify > _site/index.html
   ```

3. **Load page-specific CSS asynchronously:**
   ```html
   <link rel="preload" href="/assets/css/pages/about.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
   ```

**Expected improvements:**
- CSS size: -30% to -50% (minification)
- FCP: -10% to -20% (critical CSS inlining)
- Render time: Faster (async loading)

### JavaScript Optimization

**Current issues:**
- JavaScript not minified
- All JavaScript loaded on every page
- No tree-shaking (unused code included)

**Optimization steps:**

1. **Minify JavaScript:**
   ```bash
   npm install -g terser
   terser _site/assets/js/main.js -o _site/assets/js/main.min.js -c -m
   ```

2. **Code splitting (with Vite):**
   ```javascript
   // Import only what's needed
   import { initHomepage } from './pages/home.js';

   if (document.querySelector('.homepage')) {
     initHomepage();
   }
   ```

3. **Defer non-critical scripts:**
   ```html
   <script src="/assets/js/analytics.js" defer></script>
   ```

**Expected improvements:**
- JS size: -40% to -60% (minification + tree-shaking)
- TBT: -20% to -40% (deferred loading)
- FID: -15% to -30% (less main thread work)

---

## 4. Render Optimization

### Critical Rendering Path

**Goal:** Minimize time to first render

**Steps:**

1. **Inline critical CSS:**
   ```html
   <style>
     /* Critical above-the-fold styles */
     body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
     .hero { /* hero styles */ }
   </style>
   ```

2. **Defer non-critical CSS:**
   ```html
   <link rel="preload" href="/assets/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
   <noscript><link rel="stylesheet" href="/assets/css/main.css"></noscript>
   ```

3. **Eliminate render-blocking resources:**
   - Move `<script>` tags to end of `<body>`
   - Use `defer` or `async` attributes
   - Inline small JavaScript snippets

4. **Preconnect to third-party domains:**
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   ```

### Font Loading Optimization

**Current implementation:**
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

**Optimized implementation:**

1. **Preconnect to Google Fonts:**
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   ```

2. **Use font-display: swap:**
   ```css
   @font-face {
     font-family: 'Plus Jakarta Sans';
     font-display: swap;
     /* ... */
   }
   ```

3. **Self-host fonts (optional):**
   - Download woff2 files from Google Fonts
   - Serve from `/assets/fonts/`
   - Preload font files

---

## 5. JavaScript Optimization

### Performance Patterns

**Use requestAnimationFrame for animations:**
```javascript
// ✅ Good
function animate() {
  element.style.transform = `translateX(${x}px)`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ❌ Bad
setInterval(() => {
  element.style.transform = `translateX(${x}px)`;
}, 16);
```

**Debounce expensive operations:**
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Use on scroll/resize
window.addEventListener('scroll', debounce(() => {
  // Expensive operation
}, 100));
```

**Use IntersectionObserver instead of scroll events:**
```javascript
// ✅ Good: IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

// ❌ Bad: Scroll event
window.addEventListener('scroll', () => {
  elements.forEach(el => {
    if (isInViewport(el)) {
      el.classList.add('visible');
    }
  });
});
```

### Avoid Layout Thrashing

**Bad (causes reflow on every iteration):**
```javascript
elements.forEach(el => {
  const height = el.offsetHeight; // Read
  el.style.height = height + 10 + 'px'; // Write
});
```

**Good (batch reads and writes):**
```javascript
const heights = elements.map(el => el.offsetHeight); // Read all
heights.forEach((height, i) => {
  elements[i].style.height = height + 10 + 'px'; // Write all
});
```

---

## 6. Network Optimization

### Enable Compression

**Gzip (server-side):**
```bash
# Nginx config
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
gzip_min_length 1000;
```

**Brotli (better compression):**
```bash
# Nginx config
brotli on;
brotli_types text/plain text/css application/json application/javascript text/xml;
```

### HTTP/2 or HTTP/3

**Benefits:**
- Multiplexing (multiple requests over single connection)
- Header compression
- Server push

**Enable HTTP/2 (Nginx):**
```nginx
listen 443 ssl http2;
```

### CDN Configuration

**Use CDN for static assets:**
- Cloudflare (free tier available)
- AWS CloudFront
- Netlify/Vercel (built-in CDN)

**Cache headers:**
```nginx
# Immutable assets (with content hash in filename)
location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

# HTML pages (short cache)
location / {
  add_header Cache-Control "public, max-age=3600, must-revalidate";
}
```

---

## 7. Performance Monitoring

### Lighthouse CI Setup

**Install Lighthouse CI:**
```bash
npm install -g @lhci/cli
```

**Configuration file (lighthouserc.json):**
```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:8080/",
        "http://localhost:8080/pages/pricing/",
        "http://localhost:8080/pages/about/"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Run Lighthouse CI:**
```bash
# Build site
npm run build

# Start local server
npx serve _site &

# Run Lighthouse CI
lhci autorun

# Stop server
kill %1
```

### Real User Monitoring

**Chrome User Experience Report:**
- Access via Google Search Console
- Shows real user Core Web Vitals data
- Categorized by device (mobile/desktop)

**Web Vitals JavaScript Library:**
```javascript
import {getCLS, getFID, getLCP} from 'web-vitals';

function sendToAnalytics({name, value}) {
  // Send to analytics service
  console.log(name, value);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

**Install web-vitals:**
```bash
npm install web-vitals
```

---

## 8. Performance Budget

### Define Budgets

**Page weight:**
- HTML: <50KB
- CSS: <100KB (minified, total)
- JavaScript: <150KB (minified, total)
- Images: <800KB (per page)
- Total: <1.5MB (initial load)

**Timing:**
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1
- Lighthouse Performance Score: >90

**Lighthouse Budget (budget.json):**
```json
[
  {
    "path": "/*",
    "resourceSizes": [
      {"resourceType": "document", "budget": 50},
      {"resourceType": "stylesheet", "budget": 100},
      {"resourceType": "script", "budget": 150},
      {"resourceType": "image", "budget": 800},
      {"resourceType": "total", "budget": 1500}
    ],
    "timings": [
      {"metric": "first-contentful-paint", "budget": 2000},
      {"metric": "largest-contentful-paint", "budget": 2500},
      {"metric": "cumulative-layout-shift", "budget": 0.1}
    ]
  }
]
```

**Enforce budget in Lighthouse CI:**
```json
{
  "ci": {
    "assert": {
      "budgetsFile": "./budget.json"
    }
  }
}
```

---

## AI Agent Quick Start

### Running Complete Performance Audit

```bash
# 1. Start dev server
npx @11ty/eleventy --serve

# 2. Open browser to page
open http://localhost:8080

# 3. Run Lighthouse audit
# Chrome DevTools → Lighthouse → Performance → Analyze

# 4. Review Core Web Vitals
# - LCP: <2.5s ✅
# - FID: <100ms ✅
# - CLS: <0.1 ✅

# 5. Check Network tab
# - Total page size: <1.5MB ✅
# - Number of requests: <50 ✅
# - No 404 errors ✅

# 6. Identify optimizations needed
# - Large images? Extract base64, convert to WebP
# - Slow LCP? Preload hero image, optimize CSS
# - High CLS? Add width/height to images

# 7. Apply optimizations

# 8. Re-run Lighthouse audit

# 9. Compare before/after scores

# 10. Document improvements in performance-baselines.md
```

### Quick Performance Check (Minor Changes)

For small CSS/JS changes:

1. Run Lighthouse audit (ensure score >90)
2. Check Network tab (ensure no new large resources)
3. Verify no layout shifts (check CLS score)
4. Test on slow connection (DevTools throttle to "Slow 3G")

---

## Related Documentation

- [Performance Baselines](./performance-baselines.md) - Current performance metrics
- [Image Optimization Guide](../optimization/image-optimization-guide.md) - Image optimization
- [Production Build Guide](../deployment/production-build-guide.md) - Build optimization
- [QA Process](../testing/qa-process.md) - Complete QA workflow

---

**Last Updated:** Session 16 (December 2025)
