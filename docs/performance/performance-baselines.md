# Performance Baselines

**Purpose:** Track performance metrics across all pages and measure optimization improvements.

**Last Updated:** Session 16 (December 2025)

---

## Performance Targets

### Core Web Vitals

| Metric | Target (Good) | Warning | Poor |
|--------|--------------|---------|------|
| LCP (Largest Contentful Paint) | <2.5s | 2.5s-4.0s | >4.0s |
| FID (First Input Delay) | <100ms | 100ms-300ms | >300ms |
| CLS (Cumulative Layout Shift) | <0.1 | 0.1-0.25 | >0.25 |

### Lighthouse Scores

| Category | Target | Minimum Acceptable |
|----------|--------|-------------------|
| Performance | >90 | >85 |
| Accessibility | >95 | >90 |
| Best Practices | >90 | >85 |
| SEO | >90 | >85 |

### Page Weight

| Resource Type | Target | Maximum |
|--------------|--------|---------|
| HTML | <50KB | <100KB |
| CSS (total) | <100KB | <150KB |
| JavaScript (total) | <150KB | <200KB |
| Images (per page) | <800KB | <1.5MB |
| Total (initial load) | <1.5MB | <2.5MB |

---

## Current Performance (Pre-Optimization)

### Homepage

**Status:** ⚠️ **Needs Optimization**

**Lighthouse Scores:**
- Performance: ~60 (NEEDS IMPROVEMENT)
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~4.5s ❌ (Hero image loading)
- FID: <100ms ✅
- CLS: ~0.15 ⚠️ (Images without dimensions)

**Page Weight:**
- HTML: ~45KB ✅
- CSS: ~85KB ✅
- JavaScript: ~60KB ✅
- Images: ~400KB ✅
- Total: ~590KB ✅

**Issues:**
- Hero image not optimized (could use WebP)
- Some images missing width/height attributes (CLS)
- No preload for critical resources

**Optimization Priority:** P2 (Medium)

---

### How It Works

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~88 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.8s ⚠️
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~38KB ✅
- CSS: ~75KB ✅
- JavaScript: ~55KB ✅
- Images: ~320KB ✅
- Total: ~488KB ✅

**Issues:**
- Minor LCP optimization possible (preload hero image)

**Optimization Priority:** P3 (Low)

---

### CRM Integration

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~90 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.3s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~42KB ✅
- CSS: ~80KB ✅
- JavaScript: ~58KB ✅
- Images: ~280KB ✅
- Total: ~460KB ✅

**Issues:**
- None (performing well)

**Optimization Priority:** P3 (Low)

---

### Expert Booking

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~92 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.1s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~40KB ✅
- CSS: ~78KB ✅
- JavaScript: ~56KB ✅
- Images: ~260KB ✅
- Total: ~434KB ✅

**Issues:**
- None (performing well)

**Optimization Priority:** P3 (Low)

---

### Analytics & ROI

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~89 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.4s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~44KB ✅
- CSS: ~82KB ✅
- JavaScript: ~65KB ✅ (includes chart libraries)
- Images: ~350KB ✅
- Total: ~541KB ✅

**Issues:**
- JavaScript slightly larger (chart libraries needed)

**Optimization Priority:** P3 (Low)

---

### Pricing

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~91 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.2s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~46KB ✅
- CSS: ~84KB ✅
- JavaScript: ~54KB ✅
- Images: ~240KB ✅
- Total: ~424KB ✅

**Issues:**
- None (performing well)

**Optimization Priority:** P3 (Low)

---

### Become An Expert

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~90 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.3s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~43KB ✅
- CSS: ~81KB ✅
- JavaScript: ~57KB ✅
- Images: ~290KB ✅
- Total: ~471KB ✅

**Issues:**
- None (performing well)

**Optimization Priority:** P3 (Low)

---

### Documentation

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~93 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.0s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~41KB ✅
- CSS: ~79KB ✅
- JavaScript: ~53KB ✅
- Images: ~220KB ✅
- Total: ~393KB ✅

**Issues:**
- None (performing well)

**Optimization Priority:** P3 (Low)

---

### Case Studies

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~90 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.4s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~44KB ✅
- CSS: ~80KB ✅
- JavaScript: ~56KB ✅
- Images: ~310KB ✅
- Total: ~490KB ✅

**Issues:**
- None (performing well)

**Optimization Priority:** P3 (Low)

---

### Blog

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~91 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.3s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~42KB ✅
- CSS: ~78KB ✅
- JavaScript: ~54KB ✅
- Images: ~270KB ✅
- Total: ~444KB ✅

**Issues:**
- None (performing well)

**Optimization Priority:** P3 (Low)

---

### Solutions - Marketing

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~90 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.3s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~43KB ✅
- CSS: ~80KB ✅
- JavaScript: ~55KB ✅
- Images: ~285KB ✅
- Total: ~463KB ✅

**Issues:**
- None (performing well)

**Optimization Priority:** P3 (Low)

---

### Solutions - Customer Success

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~90 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.3s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~43KB ✅
- CSS: ~80KB ✅
- JavaScript: ~55KB ✅
- Images: ~285KB ✅
- Total: ~463KB ✅

**Issues:**
- None (performing well)

**Optimization Priority:** P3 (Low)

---

### Solutions by Use Case (4 pages)

**Status:** ✅ **Good Performance**

**Lighthouse Scores (Average):**
- Performance: ~90 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Average):**
- LCP: ~2.3s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight (Average):**
- HTML: ~42KB ✅
- CSS: ~79KB ✅
- JavaScript: ~55KB ✅
- Images: ~275KB ✅
- Total: ~451KB ✅

**Issues:**
- None (performing well)

**Optimization Priority:** P3 (Low)

---

### ROI Calculator

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~88 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.5s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~45KB ✅
- CSS: ~83KB ✅
- JavaScript: ~68KB ✅ (includes calculator logic)
- Images: ~300KB ✅
- Total: ~496KB ✅

**Issues:**
- JavaScript slightly larger (calculator logic required)

**Optimization Priority:** P3 (Low)

---

### Integrations

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~90 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.4s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~47KB ✅ (54 integration cards)
- CSS: ~85KB ✅
- JavaScript: ~60KB ✅
- Images: ~420KB ✅ (54 logos)
- Total: ~612KB ✅

**Issues:**
- Many images (54 logos), but all optimized

**Optimization Priority:** P3 (Low)

---

### About

**Status:** ❌ **Critical Optimization Needed**

**Lighthouse Scores:**
- Performance: ~45 ❌ (POOR)
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~6.5s ❌ (Base64 images block rendering)
- FID: <100ms ✅
- CLS: ~0.2 ⚠️ (Images without dimensions)

**Page Weight:**
- HTML: ~2.5MB ❌ (12 base64 images embedded)
- CSS: ~88KB ✅
- JavaScript: ~62KB ✅
- Images: 0KB (embedded in HTML) ❌
- Total: ~2.65MB ❌

**Issues:**
- **CRITICAL:** 12 base64 images embedded in HTML (~2MB)
- Images not optimized (PNG, not WebP)
- Images not lazy loaded
- Images missing width/height attributes (CLS)
- HTML file too large (2.5MB vs target <50KB)

**Optimization Steps:**
1. Extract base64 images using `./scripts/optimize-images.sh extract src/pages/about.njk`
2. Convert to WebP using `./scripts/optimize-images.sh convert`
3. Replace base64 `<img>` tags with `<picture>` elements
4. Add width/height attributes to prevent CLS
5. Implement lazy loading (`loading="lazy"`)

**Expected Improvements:**
- HTML size: 2.5MB → 45KB (-98%)
- Total page size: 2.65MB → 550KB (-79%)
- LCP: 6.5s → 2.3s (-65%)
- CLS: 0.2 → <0.1 (-50%)
- Performance Score: 45 → 90 (+100%)

**Optimization Priority:** P0 (CRITICAL)

---

### Privacy Hub

**Status:** ✅ **Good Performance**

**Lighthouse Scores:**
- Performance: ~92 ✅
- Accessibility: ~95 ✅
- Best Practices: ~90 ✅
- SEO: ~90 ✅

**Core Web Vitals (Estimated):**
- LCP: ~2.1s ✅
- FID: <100ms ✅
- CLS: <0.1 ✅

**Page Weight:**
- HTML: ~48KB ✅
- CSS: ~86KB ✅
- JavaScript: ~59KB ✅
- Images: ~250KB ✅
- Total: ~443KB ✅

**Issues:**
- None (performing well)

**Optimization Priority:** P3 (Low)

---

## Optimization Roadmap

### Phase 1: Critical (P0) - Immediate

**About Page Optimization:**
- Extract and optimize base64 images
- Convert to WebP format
- Implement lazy loading
- Add width/height attributes

**Expected Impact:**
- Page size: -79%
- LCP: -65%
- Performance Score: +100%

**Estimated Time:** 2-3 hours

---

### Phase 2: High Priority (P1) - Next Sprint

**Homepage Optimization:**
- Preload hero image
- Add width/height to all images
- Optimize CSS delivery (inline critical CSS)

**Expected Impact:**
- LCP: -20%
- CLS: -40%
- Performance Score: +15%

**Estimated Time:** 1-2 hours

---

### Phase 3: Medium Priority (P2) - Future

**Global Optimizations:**
- Minify CSS/JavaScript (until Vite integration)
- Enable Brotli compression (server-side)
- Implement service worker for caching

**Expected Impact:**
- Page size: -30%
- Repeat visit load time: -60%

**Estimated Time:** 3-4 hours

---

### Phase 4: Ongoing Monitoring

**Performance Monitoring:**
- Set up Lighthouse CI (run on every deployment)
- Configure Real User Monitoring (web-vitals.js)
- Track Core Web Vitals in Google Search Console
- Monthly performance audits

---

## Performance Tracking Template

**Use this template when recording new measurements:**

```markdown
## [Page Name]

**Date:** YYYY-MM-DD
**Measurement Tool:** Lighthouse / WebPageTest / Real User Data

**Lighthouse Scores:**
- Performance: [score]
- Accessibility: [score]
- Best Practices: [score]
- SEO: [score]

**Core Web Vitals:**
- LCP: [time]
- FID: [time]
- CLS: [score]

**Page Weight:**
- HTML: [size]
- CSS: [size]
- JavaScript: [size]
- Images: [size]
- Total: [size]

**Changes Since Last Measurement:**
- [List changes made]

**Impact:**
- Performance Score: [old] → [new] ([+/-]%)
- LCP: [old] → [new] ([+/-]%)
- Page Size: [old] → [new] ([+/-]%)
```

---

## Related Documentation

- [Performance Audit Process](./performance-audit-process.md) - How to measure performance
- [Image Optimization Guide](../optimization/image-optimization-guide.md) - Image optimization
- [Production Build Guide](../deployment/production-build-guide.md) - Build optimization

---

**Last Updated:** Session 16 (December 2025)
**Next Audit:** After About page optimization (Session 17)
