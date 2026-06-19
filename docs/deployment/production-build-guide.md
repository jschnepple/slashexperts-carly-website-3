# Production Build Guide

**Purpose:** Complete guide to building, testing, and deploying the SlashExperts website to production.

**Goal:** Deploy an optimized, performant, accessible website with zero downtime.

---

## Quick Reference

**Build Command:** `npm run build:prod` (when fully configured)
**Current Build:** `npx @11ty/eleventy`
**Output Directory:** `_site/`
**Testing:** Local server on port 8000

---

## Build Process Overview

```
Development
    ↓
1. Pre-build Validation
    ↓
2. Run Production Build
    ↓
3. Post-build Optimization
    ↓
4. Local Testing
    ↓
5. Performance Audit
    ↓
6. Deploy to Staging
    ↓
7. Final QA
    ↓
8. Deploy to Production
    ↓
Production Live
```

---

## 1. Pre-build Validation

### Code Quality Checks

**Validate HTML/Nunjucks:**
```bash
# Check for template errors
npx @11ty/eleventy --dryrun

# Validate template syntax
npx nunjucks-precompile src/_includes/
```

**Check for Console Logs:**
```bash
# Find console.log statements (should be removed)
grep -r "console\.log" src/assets/js/

# Find TODO comments (should be addressed)
grep -r "TODO" src/
```

**Validate CSS:**
```bash
# Check for CSS errors (if stylelint configured)
npx stylelint "src/assets/css/**/*.css"

# Check for unused CSS (manual review)
# Review src/assets/css/ for unused rules
```

**Validate JavaScript:**
```bash
# Check for JS errors (if eslint configured)
npx eslint "src/assets/js/**/*.js"

# Check for syntax errors
node --check src/assets/js/main.js
```

### Content Validation

**Check Links:**
```bash
# Build site first
npx @11ty/eleventy

# Check for broken internal links
# (Manual: Test all nav links, footer links)
```

**Verify Images:**
```bash
# Check all images exist and are optimized
find src/assets/images/ -name "*.png" -o -name "*.jpg" | while read file; do
    size=$(wc -c < "$file")
    if [ $size -gt 204800 ]; then  # > 200KB
        echo "Large image: $file ($(($size / 1024))KB)"
    fi
done
```

**Review Content:**
- [ ] All text proofread (no typos)
- [ ] All images have descriptive alt text
- [ ] Copyright year current
- [ ] Contact information accurate
- [ ] No placeholder content ("Lorem ipsum", "Coming soon")

---

## 2. Run Production Build

### Current Build System (Eleventy)

**Build command:**
```bash
npx @11ty/eleventy
```

**What gets built:**
- Nunjucks templates → HTML files in `_site/`
- Assets copied to `_site/assets/`
- No minification (CSS/JS served as-is)

**Build output:**
```
[11ty] Writing _site/index.html from ./src/pages/index.njk
[11ty] Writing _site/pages/how-it-works/index.html from ./src/pages/how-it-works.njk
[11ty] Writing _site/pages/crm-integration/index.html from ./src/pages/crm-integration.njk
...
[11ty] Wrote 18 files in 1.23 seconds (v3.0.0)
```

**Verify build:**
```bash
# Check output directory
ls -lh _site/

# Check file count (should be 18 pages + assets)
find _site/ -name "*.html" | wc -l

# Check for errors in output
tail -n 20 .eleventy.log  # If logging enabled
```

### Future Build System (Vite + Eleventy)

**When Vite integration complete:**
```bash
npm run build:prod
```

**What will get built:**
- Nunjucks templates → HTML
- CSS minified and bundled
- JavaScript minified, bundled, tree-shaken
- Images optimized automatically
- Source maps generated
- Cache-busting hashes added to filenames

**Vite config example:**
```javascript
// vite.config.js (future)
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '_site',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['lib1', 'lib2'],
        },
      },
    },
  },
  css: {
    minify: true,
  },
});
```

---

## 3. Post-build Optimization

### Minify CSS (Manual, Until Vite Integration)

**Using `clean-css-cli`:**
```bash
npm install -g clean-css-cli

# Minify main.css
cleancss -o _site/assets/css/main.min.css _site/assets/css/main.css

# Minify page-specific CSS
for file in _site/assets/css/pages/*.css; do
    cleancss -o "${file%.css}.min.css" "$file"
done
```

**Update HTML to reference minified CSS:**
```html
<!-- Before -->
<link rel="stylesheet" href="/assets/css/main.css">

<!-- After -->
<link rel="stylesheet" href="/assets/css/main.min.css">
```

### Minify JavaScript (Manual, Until Vite Integration)

**Using `terser`:**
```bash
npm install -g terser

# Minify main.js
terser _site/assets/js/main.js -o _site/assets/js/main.min.js -c -m

# Minify page-specific JS
for file in _site/assets/js/pages/*.js; do
    terser "$file" -o "${file%.js}.min.js" -c -m
done
```

**Update HTML to reference minified JS:**
```html
<!-- Before -->
<script type="module" src="/assets/js/main.js"></script>

<!-- After -->
<script type="module" src="/assets/js/main.min.js"></script>
```

### Optimize Images

**Check for unoptimized images:**
```bash
# Run image optimization script
./scripts/optimize-images.sh optimize _site/assets/images/

# Convert to WebP if not already done
./scripts/optimize-images.sh convert _site/assets/images/
```

### Generate Gzip/Brotli (Optional)

**Pre-compress static assets:**
```bash
# Gzip compression
find _site -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -exec gzip -9 -k {} \;

# Brotli compression (if available)
find _site -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -exec brotli -q 11 -k {} \;
```

---

## 4. Local Testing

### Serve Production Build

**Start local server:**
```bash
cd _site
python3 -m http.server 8000
```

**Or with Node.js:**
```bash
npx serve _site -p 8000
```

**Open browser:**
```
http://localhost:8000
```

### Test Critical Functionality

**Homepage:**
- [ ] Hero section renders
- [ ] Navigation works (all links)
- [ ] CTA buttons functional
- [ ] Animations play
- [ ] No console errors

**ROI Calculator:**
- [ ] Inputs accept values
- [ ] Sliders work
- [ ] Calculations execute correctly
- [ ] Results display
- [ ] Chart renders
- [ ] Reset button works

**Privacy Hub:**
- [ ] Accordion items toggle
- [ ] Single-active pattern works
- [ ] Shield animation plays
- [ ] All sections visible

**Integrations:**
- [ ] Category tabs filter correctly
- [ ] All 54 cards display
- [ ] Animations smooth (60ms delay)

**Cross-Page Testing:**
- [ ] Navigation works on all pages
- [ ] Footer links work
- [ ] Page transitions smooth
- [ ] No 404 errors

### Browser DevTools Checks

**Console:**
- [ ] No JavaScript errors
- [ ] No 404 errors (missing resources)
- [ ] No CORS errors

**Network:**
- [ ] All resources load successfully
- [ ] CSS/JS minified (check file sizes)
- [ ] Images optimized (WebP served if supported)
- [ ] Total page size acceptable (< 2MB per page)

**Lighthouse:**
- [ ] Performance >90
- [ ] Accessibility >95
- [ ] Best Practices >90
- [ ] SEO >90

---

## 5. Performance Audit

### Run Lighthouse Audit

**Chrome DevTools:**
1. Open DevTools (F12 or Cmd+Option+I)
2. Navigate to "Lighthouse" tab
3. Select "Production" environment
4. Click "Analyze page load"

**Target Scores:**
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

### Check Core Web Vitals

**LCP (Largest Contentful Paint):**
- Target: <2.5s
- Check: Lighthouse report or Network tab

**FID (First Input Delay):**
- Target: <100ms
- Check: Real user metrics (can't test locally)

**CLS (Cumulative Layout Shift):**
- Target: <0.1
- Check: Lighthouse report or Layout Shift regions

**Fixes if targets not met:**
- LCP: Optimize hero image, preload critical resources
- CLS: Add width/height to images, reserve space for dynamic content
- FID: Defer non-critical JavaScript, reduce main thread work

### Check File Sizes

**Acceptable ranges:**
- HTML: <50KB per page
- CSS (total): <100KB minified
- JavaScript (total): <150KB minified
- Images: <200KB per image (hero), <100KB per image (content)
- Total page size: <1.5MB (initial load)

**Measure:**
```bash
# HTML files
find _site -name "*.html" -exec wc -c {} + | tail -1

# CSS files
find _site/assets/css -name "*.css" -exec wc -c {} + | tail -1

# JavaScript files
find _site/assets/js -name "*.js" -exec wc -c {} + | tail -1

# Images
du -sh _site/assets/images/
```

---

## 6. Deploy to Staging

### Staging Environment Setup

**Options:**
- **Netlify:** Connect GitHub repo, auto-deploy on push to `staging` branch
- **Vercel:** Similar to Netlify, auto-deploy on push
- **AWS S3 + CloudFront:** Manual upload or CI/CD pipeline
- **GitHub Pages:** Push to `gh-pages` branch

**Netlify deployment (example):**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to staging
netlify deploy --dir=_site

# Deploy to production (after QA)
netlify deploy --prod --dir=_site
```

**Vercel deployment (example):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to staging
vercel --cwd=_site

# Deploy to production
vercel --prod --cwd=_site
```

### Staging URL Testing

**Access staging site:**
```
https://staging.slashexperts.com
```

**Test on real devices:**
- [ ] iPhone (Safari iOS)
- [ ] Android (Chrome Android)
- [ ] Tablet (iPad)
- [ ] Desktop (Chrome, Firefox, Safari)

**Test from different networks:**
- [ ] Office WiFi
- [ ] Home WiFi
- [ ] Mobile data (4G/5G)
- [ ] Slow connection (throttle in DevTools)

---

## 7. Final QA on Staging

### Complete QA Checklist

Follow [QA Process](../testing/qa-process.md) for full checklist:

1. **Visual Testing:** All breakpoints (1920px → 320px)
2. **Functional Testing:** All interactive elements
3. **Accessibility Audit:** axe DevTools, keyboard nav, screen readers
4. **Performance Testing:** Lighthouse, Core Web Vitals
5. **Cross-Browser Testing:** Chrome, Firefox, Safari, Edge
6. **Regression Testing:** All 18 pages

### Sign-Off Criteria

**Before deploying to production:**
- [ ] All P0 issues resolved
- [ ] All P1 issues resolved or documented
- [ ] Lighthouse Performance >90
- [ ] Lighthouse Accessibility >95
- [ ] All browsers tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile devices tested (iOS, Android)
- [ ] No console errors
- [ ] No broken links
- [ ] All content proofread

---

## 8. Deploy to Production

### Pre-deployment Checklist

**Backups:**
- [ ] Backup current production site (if replacing existing site)
- [ ] Tag current Git commit: `git tag v1.0.0`
- [ ] Push tag: `git push origin v1.0.0`

**DNS/CDN:**
- [ ] DNS records configured correctly
- [ ] SSL certificate valid
- [ ] CDN cache purged (if using CDN)

**Monitoring:**
- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Analytics tracking configured (Google Analytics, Plausible, etc.)
- [ ] Uptime monitoring configured (Pingdom, UptimeRobot, etc.)

### Deployment Methods

**Method 1: Netlify/Vercel (Recommended)**

```bash
# Deploy to production
netlify deploy --prod --dir=_site

# Or with Vercel
vercel --prod --cwd=_site
```

**Automatic deployment:**
- Push to `main` branch triggers production deploy
- Staging URL available for PR previews
- Automatic HTTPS with SSL
- Global CDN distribution

**Method 2: AWS S3 + CloudFront**

```bash
# Upload to S3
aws s3 sync _site/ s3://slashexperts-production/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"
```

**Method 3: GitHub Pages**

```bash
# Build site
npx @11ty/eleventy

# Push to gh-pages branch
git subtree push --prefix _site origin gh-pages

# Or use gh-pages npm package
npx gh-pages -d _site
```

**Method 4: Manual FTP/SFTP Upload**

```bash
# Using rsync
rsync -avz --delete _site/ user@server:/var/www/slashexperts/
```

### Post-deployment Verification

**Smoke Tests (5 minutes):**
- [ ] Homepage loads without errors
- [ ] Navigation works
- [ ] One CTA button works (doesn't have to submit, just loads form)
- [ ] No console errors
- [ ] SSL certificate valid (HTTPS)

**Full QA (30 minutes):**
- [ ] Test all 18 pages load
- [ ] Test critical user flows (expert booking, pricing, contact)
- [ ] Verify analytics tracking (check dashboard)
- [ ] Check Core Web Vitals (real user data in Search Console)

---

## 9. Rollback Procedure

### If Critical Issue Found

**Option 1: Revert to Previous Version (Fast)**

**Netlify/Vercel:**
```bash
# Rollback to previous deployment (instant)
netlify rollback

# Or via web UI: Deploys → Select previous → Publish
```

**AWS S3:**
```bash
# Restore from backup
aws s3 sync s3://slashexperts-backup-20250101/ s3://slashexperts-production/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"
```

**Option 2: Fix and Redeploy (If issue is minor)**

1. Fix issue locally
2. Test fix in staging
3. Redeploy to production

---

## 10. Performance Monitoring

### Post-deployment Monitoring (First 24 hours)

**Check:**
- [ ] Error rate (should be <0.1%)
- [ ] Performance metrics (LCP, FID, CLS)
- [ ] Uptime (should be 100%)
- [ ] User feedback (support tickets, social media)

**Tools:**
- **Google Search Console:** Core Web Vitals data (real users)
- **Lighthouse CI:** Automated performance testing
- **Sentry/LogRocket:** Error tracking
- **Google Analytics/Plausible:** Traffic, bounce rate, conversions

### Long-term Monitoring

**Weekly:**
- [ ] Check Core Web Vitals in Search Console
- [ ] Review error logs
- [ ] Check uptime reports

**Monthly:**
- [ ] Run full Lighthouse audit on all pages
- [ ] Review performance trends
- [ ] Check for security updates (dependencies)

**Quarterly:**
- [ ] Full accessibility audit
- [ ] Content review (update copyright year, outdated content)
- [ ] Dependency updates (npm update)

---

## Build Configuration Files

### .eleventy.js (Current)

```javascript
module.exports = function(eleventyConfig) {
  // Copy assets to output
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "data"
    }
  };
};
```

### package.json (Build Scripts)

```json
{
  "scripts": {
    "build": "npx @11ty/eleventy",
    "build:prod": "npm run build",
    "serve": "npx @11ty/eleventy --serve",
    "clean": "rm -rf _site",
    "deploy:netlify": "netlify deploy --prod --dir=_site",
    "deploy:vercel": "vercel --prod --cwd=_site"
  }
}
```

**Future with Vite:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "npx @11ty/eleventy && vite build",
    "build:prod": "npm run clean && npm run build",
    "preview": "vite preview",
    "clean": "rm -rf _site dist"
  }
}
```

---

## Deployment Checklist

### Pre-deployment
- [ ] Run full QA process
- [ ] All P0/P1 issues resolved
- [ ] Performance audit passes
- [ ] Accessibility audit passes
- [ ] Content proofread
- [ ] Backup current site
- [ ] Tag Git commit

### Deployment
- [ ] Build production version
- [ ] Test locally
- [ ] Deploy to staging
- [ ] QA on staging
- [ ] Deploy to production
- [ ] Verify deployment

### Post-deployment
- [ ] Smoke test production site
- [ ] Monitor error logs (first 1 hour)
- [ ] Check analytics tracking
- [ ] Verify Core Web Vitals
- [ ] Update documentation
- [ ] Notify team

---

## Related Documentation

- [QA Process](../testing/qa-process.md) - Complete QA workflow
- [Performance Audit Process](../performance/performance-audit-process.md) - Performance testing
- [Image Optimization Guide](../optimization/image-optimization-guide.md) - Image optimization

---

**Last Updated:** Session 16 (December 2025)
