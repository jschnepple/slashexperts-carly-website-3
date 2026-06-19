# Image Optimization Guide

**Purpose:** Comprehensive guide to extracting, optimizing, and implementing images for maximum performance.

**Goal:** Reduce page load times, improve Core Web Vitals, and deliver optimal user experience.

---

## Quick Reference

**Target Formats:** WebP + PNG/JPG fallback
**Compression:** 80-85% quality for photos, lossless for logos/icons
**Lazy Loading:** All below-the-fold images
**CDN:** Optional (Cloudflare, AWS CloudFront)

**Expected Improvements:**
- Page size reduction: ~60-80% (from base64 inlining)
- LCP improvement: ~30-50% (with lazy loading)
- Bandwidth savings: ~70% (WebP vs PNG/JPG)

---

## Current Image Status

### Legacy Files (Base64 Embedded)

The original HTML files in `originals/` contain **base64-encoded images** embedded directly in the HTML:

```html
<!-- Example from originals/1_SlashExperts_Homepage_v42 (48).html -->
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..." alt="Expert">
```

**Problems with Base64 Inlining:**
1. **Massive file sizes**: Homepage HTML file is 4.9MB (mostly images)
2. **No caching**: Images re-downloaded on every page load
3. **Render blocking**: HTML can't parse until all images decoded
4. **No lazy loading**: All images load immediately
5. **No format optimization**: Stuck with PNG/JPG, can't use WebP

### Modernized System (External Images)

The migrated pages in `src/` should use external image files:

```html
<!-- Modern approach: External images with lazy loading -->
<picture>
  <source srcset="/assets/images/expert.webp" type="image/webp">
  <img src="/assets/images/expert.png" alt="Expert" loading="lazy">
</picture>
```

**Current Status:**
- ⚠️ **About page** (`src/pages/about.njk`): Uses base64 images in Experts Wall (12 images)
- ⚠️ **Other pages**: May have base64 images that need extraction
- ✅ **Target**: All images as external files in `src/assets/images/`

---

## Image Optimization Workflow

```
Base64 Image in HTML
    ↓
1. Extract Base64 Data
    ↓
2. Decode to PNG/JPG File
    ↓
3. Optimize Original Format
    ↓
4. Convert to WebP
    ↓
5. Implement with <picture> Element
    ↓
6. Add Lazy Loading
    ↓
7. Verify Performance Improvement
    ↓
Optimized Image Deployed
```

---

## Step 1: Extract Base64 Images

### Manual Extraction (Single Image)

1. **Find base64 image in HTML:**
   ```html
   <img src="data:image/png;base64,iVBORw0KGgo..." alt="Expert 1">
   ```

2. **Copy base64 string** (everything after `base64,`)

3. **Save to file:**
   ```bash
   # Create a text file with just the base64 string
   echo "iVBORw0KGgo..." > image_base64.txt

   # Decode to image file
   base64 --decode image_base64.txt > expert-1.png
   ```

### Automated Extraction (All Images)

**Using the automation script** (see `scripts/optimize-images.sh`):

```bash
# Extract all base64 images from a page
./scripts/optimize-images.sh extract src/pages/about.njk

# Output:
# - Creates src/assets/images/extracted/about/
# - Saves each image as image-001.png, image-002.png, etc.
# - Creates manifest.json with image metadata
```

**Manual extraction with Node.js:**

```javascript
// extract-images.js
const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync('src/pages/about.njk', 'utf-8');
const base64Regex = /data:image\/(png|jpe?g|gif|webp);base64,([A-Za-z0-9+/=]+)/g;

let match;
let imageCount = 0;

while ((match = base64Regex.exec(htmlContent)) !== null) {
    const imageType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    imageCount++;
    const filename = `image-${String(imageCount).padStart(3, '0')}.${imageType}`;

    fs.writeFileSync(
        path.join('src/assets/images/extracted', filename),
        buffer
    );

    console.log(`Extracted: ${filename} (${(buffer.length / 1024).toFixed(2)} KB)`);
}

console.log(`\nTotal images extracted: ${imageCount}`);
```

**Run extraction:**
```bash
mkdir -p src/assets/images/extracted
node extract-images.js
```

---

## Step 2: Optimize Original Format

### PNG Optimization

**Tool:** `pngquant` (lossy compression, 70-80% size reduction)

**Installation:**
```bash
# macOS
brew install pngquant

# Linux (Debian/Ubuntu)
sudo apt-get install pngquant

# Windows
# Download from https://pngquant.org/
```

**Usage:**
```bash
# Single image (80% quality)
pngquant --quality=80-85 expert-1.png -o expert-1-optimized.png

# Batch process all PNGs in directory
pngquant --quality=80-85 src/assets/images/extracted/*.png --ext -optimized.png

# Overwrite originals (destructive)
pngquant --quality=80-85 src/assets/images/extracted/*.png --ext .png --force
```

**Alternative:** `optipng` (lossless compression, 10-30% size reduction)

```bash
brew install optipng

# Optimize in-place (lossless)
optipng -o7 expert-1.png

# Batch process
optipng -o7 src/assets/images/extracted/*.png
```

### JPG Optimization

**Tool:** `jpegoptim` or `mozjpeg`

**Installation:**
```bash
# macOS
brew install jpegoptim mozjpeg

# Linux
sudo apt-get install jpegoptim
```

**Usage:**
```bash
# Single image (85% quality)
jpegoptim --max=85 expert-1.jpg

# Batch process
jpegoptim --max=85 src/assets/images/extracted/*.jpg

# With mozjpeg (better compression)
/opt/homebrew/bin/cjpeg -quality 85 -outfile expert-1-optimized.jpg expert-1.jpg
```

---

## Step 3: Convert to WebP

### Using `cwebp` (Official WebP Encoder)

**Installation:**
```bash
# macOS
brew install webp

# Linux
sudo apt-get install webp

# Windows
# Download from https://developers.google.com/speed/webp/download
```

**Usage:**
```bash
# Convert PNG to WebP (80% quality)
cwebp -q 80 expert-1.png -o expert-1.webp

# Convert JPG to WebP
cwebp -q 85 photo.jpg -o photo.webp

# Batch convert all PNGs
for file in src/assets/images/experts/*.png; do
    cwebp -q 80 "$file" -o "${file%.png}.webp"
done

# Batch convert all JPGs
for file in src/assets/images/photos/*.jpg; do
    cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done
```

**Quality Guidelines:**
- **Logos/Icons:** `-q 90-100` (high quality, small file size anyway)
- **Photos/Screenshots:** `-q 75-85` (good balance)
- **Thumbnails:** `-q 70-80` (acceptable quality, small size)

### Using Automated Script

```bash
# Convert all images in directory to WebP
./scripts/optimize-images.sh convert src/assets/images/experts/

# Output:
# - Creates .webp version of each image
# - Maintains original PNG/JPG as fallback
# - Reports file size savings
```

---

## Step 4: Organize Images

### Directory Structure

```
src/assets/images/
├── experts/              # Expert profile photos
│   ├── expert-1.webp
│   ├── expert-1.png      # Fallback
│   ├── expert-2.webp
│   └── expert-2.png
├── logos/                # Brand logos, partner logos
│   ├── logo-main.webp
│   ├── logo-main.svg     # Prefer SVG for logos
│   └── partners/
│       ├── salesforce.svg
│       └── hubspot.svg
├── screenshots/          # Product screenshots
│   ├── dashboard.webp
│   ├── dashboard.png
│   └── mobile-view.webp
├── backgrounds/          # Background images, gradients
│   ├── hero-gradient.webp
│   └── section-bg.webp
└── icons/                # UI icons
    ├── check-circle.svg  # Prefer SVG for icons
    └── arrow-right.svg
```

### Naming Conventions

**Pattern:** `{category}-{descriptor}-{variant}.{ext}`

**Examples:**
- `expert-sarah-chen.webp` (expert profile photo)
- `logo-partner-salesforce.svg` (partner logo)
- `screenshot-dashboard-light.webp` (product screenshot, light theme)
- `icon-check-circle.svg` (UI icon)
- `bg-hero-gradient.webp` (background image)

**Variants:**
- `-light` / `-dark` (theme variants)
- `-mobile` / `-desktop` (responsive variants)
- `-1x` / `-2x` (resolution variants for retina)

---

## Step 5: Implement Optimized Images

### Basic Implementation

**Single Image:**
```html
<img src="/assets/images/experts/expert-1.png"
     alt="Sarah Chen, CRM Integration Expert"
     width="400"
     height="400"
     loading="lazy">
```

**With WebP Support:**
```html
<picture>
  <source srcset="/assets/images/experts/expert-1.webp" type="image/webp">
  <img src="/assets/images/experts/expert-1.png"
       alt="Sarah Chen, CRM Integration Expert"
       width="400"
       height="400"
       loading="lazy">
</picture>
```

### Responsive Images

**Different sizes for different viewports:**
```html
<picture>
  <!-- WebP sources -->
  <source media="(min-width: 1024px)"
          srcset="/assets/images/hero-desktop.webp"
          type="image/webp">
  <source media="(min-width: 768px)"
          srcset="/assets/images/hero-tablet.webp"
          type="image/webp">
  <source srcset="/assets/images/hero-mobile.webp"
          type="image/webp">

  <!-- Fallback PNG sources -->
  <source media="(min-width: 1024px)"
          srcset="/assets/images/hero-desktop.png">
  <source media="(min-width: 768px)"
          srcset="/assets/images/hero-tablet.png">

  <!-- Default fallback -->
  <img src="/assets/images/hero-mobile.png"
       alt="Hero image"
       width="1920"
       height="1080"
       loading="lazy">
</picture>
```

### Retina Images

**2x resolution for high-DPI displays:**
```html
<picture>
  <source srcset="/assets/images/expert-1.webp 1x,
                  /assets/images/expert-1@2x.webp 2x"
          type="image/webp">
  <img srcset="/assets/images/expert-1.png 1x,
               /assets/images/expert-1@2x.png 2x"
       src="/assets/images/expert-1.png"
       alt="Expert"
       width="400"
       height="400"
       loading="lazy">
</picture>
```

### Lazy Loading

**Attributes:**
- `loading="lazy"` - Browser-native lazy loading
- `loading="eager"` - Load immediately (for above-the-fold images)

**Implementation:**
```html
<!-- Above-the-fold: Load immediately -->
<img src="/assets/images/hero.png" alt="Hero" loading="eager">

<!-- Below-the-fold: Lazy load -->
<img src="/assets/images/section-2.png" alt="Section" loading="lazy">
```

**JavaScript Fallback (for older browsers):**
```javascript
// Lazy load images with IntersectionObserver
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));
```

```html
<!-- Use data-src instead of src -->
<img data-src="/assets/images/lazy.png"
     src="/assets/images/placeholder.png"
     alt="Lazy loaded image">
```

---

## Step 6: Replace Base64 Images in HTML

### Before (Base64):
```html
<div class="wall-item wall-item-image">
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..." alt="Expert 1">
</div>
```

### After (Optimized):
```html
<div class="wall-item wall-item-image">
  <picture>
    <source srcset="/assets/images/experts/expert-1.webp" type="image/webp">
    <img src="/assets/images/experts/expert-1.png"
         alt="Sarah Chen, CRM Integration Expert"
         width="400"
         height="400"
         loading="lazy">
  </picture>
</div>
```

### Batch Replacement

**Using find-and-replace:**

1. Extract all base64 images (Step 1)
2. Note the order and alt text for each image
3. Create a mapping file:
   ```json
   {
     "image-001.png": {
       "name": "expert-1",
       "alt": "Sarah Chen, CRM Integration Expert",
       "width": 400,
       "height": 400
     },
     "image-002.png": {
       "name": "expert-2",
       "alt": "John Doe, Analytics Specialist",
       "width": 400,
       "height": 400
     }
   }
   ```

4. Use script to replace base64 with `<picture>` elements

---

## Step 7: Verify Performance Improvement

### Measure Before and After

**Before (Base64):**
```bash
# Measure page size
ls -lh src/pages/about.njk

# Example: 2.5MB (with embedded images)
```

**After (Optimized):**
```bash
# Measure page size
ls -lh src/pages/about.njk

# Example: 45KB (without embedded images)

# Measure image directory size
du -sh src/assets/images/experts/

# Example: 850KB (12 WebP images + 12 PNG fallbacks)
```

**Savings:**
- HTML size: 2.5MB → 45KB (~98% reduction)
- Total page size: 2.5MB → 895KB (~64% reduction)
- With WebP support: 2.5MB → 485KB (~81% reduction, WebP only)

### Lighthouse Performance Audit

**Before optimization:**
- LCP: ~5.0s (large base64 images block rendering)
- Performance Score: ~60

**After optimization:**
- LCP: ~2.0s (external images load asynchronously)
- Performance Score: ~95

**Run Lighthouse:**
```bash
# Chrome DevTools → Lighthouse → Performance → Analyze
```

---

## Performance Targets

### Core Web Vitals

**LCP (Largest Contentful Paint):**
- Target: < 2.5s
- Strategy: Optimize hero image, use WebP, preload critical images

**CLS (Cumulative Layout Shift):**
- Target: < 0.1
- Strategy: Always specify `width` and `height` attributes

**FID (First Input Delay):**
- Target: < 100ms
- Strategy: Defer non-critical images, lazy load below-fold

### Image Size Targets

**By Use Case:**
- **Logos:** < 10KB (SVG preferred, or PNG with transparency)
- **Icons:** < 5KB (SVG preferred)
- **Thumbnails:** < 20KB (WebP 400x400px)
- **Photos:** < 100KB (WebP 800x800px)
- **Screenshots:** < 150KB (WebP 1200x800px)
- **Hero images:** < 200KB (WebP 1920x1080px)

### Compression Quality

**WebP:**
- Logos/Icons: 90-100% (crisp details)
- Photos: 75-85% (good balance)
- Thumbnails: 70-80% (acceptable quality)

**PNG (fallback):**
- Use `pngquant` at 80-85% quality
- Or `optipng` for lossless compression

**JPG (fallback):**
- 85% quality for photos
- 90% quality for screenshots with text

---

## Automation Script Usage

### Script: `scripts/optimize-images.sh`

**Extract base64 images:**
```bash
./scripts/optimize-images.sh extract src/pages/about.njk
```

**Optimize images:**
```bash
./scripts/optimize-images.sh optimize src/assets/images/experts/
```

**Convert to WebP:**
```bash
./scripts/optimize-images.sh convert src/assets/images/experts/
```

**Full workflow:**
```bash
# Extract, optimize, and convert in one command
./scripts/optimize-images.sh all src/pages/about.njk src/assets/images/experts/
```

**See script documentation for full usage.**

---

## Best Practices

### DO:
- ✅ Use WebP + PNG/JPG fallback with `<picture>`
- ✅ Specify `width` and `height` attributes (prevents CLS)
- ✅ Lazy load all below-the-fold images
- ✅ Use `loading="eager"` for above-the-fold hero images
- ✅ Compress images to 70-85% quality
- ✅ Use SVG for logos, icons, and illustrations
- ✅ Organize images in logical directories
- ✅ Use descriptive file names and alt text

### DON'T:
- ❌ Embed base64 images in HTML (defeats caching)
- ❌ Omit `width`/`height` attributes (causes CLS)
- ❌ Lazy load above-the-fold images (delays LCP)
- ❌ Use JPG for images with transparency (use PNG or WebP)
- ❌ Use PNG for photos (use JPG or WebP)
- ❌ Upload uncompressed images directly from design tools
- ❌ Use generic alt text ("image", "photo", "screenshot")

---

## Troubleshooting

### Issue: WebP images not displaying

**Cause:** Browser doesn't support WebP
**Solution:** Ensure PNG/JPG fallback is provided

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.png" alt="Fallback"> <!-- This will load in old browsers -->
</picture>
```

### Issue: Images loading too slowly

**Cause:** Images too large, not optimized
**Solution:**
1. Check file sizes: `ls -lh src/assets/images/`
2. Re-optimize with lower quality: `cwebp -q 75` instead of `-q 85`
3. Resize images to actual display size (don't serve 4000x3000 for 400x300 display)

### Issue: Layout shift when images load

**Cause:** Missing `width` and `height` attributes
**Solution:** Always specify dimensions

```html
<!-- ❌ Bad: No dimensions -->
<img src="image.png" alt="Image">

<!-- ✅ Good: Dimensions specified -->
<img src="image.png" alt="Image" width="400" height="400">
```

### Issue: Images not lazy loading

**Cause:** `loading="lazy"` not supported in old browsers
**Solution:** Use IntersectionObserver JavaScript fallback (see Step 5)

---

## Related Documentation

- [Performance Audit Process](../performance/performance-audit-process.md) - Measuring performance
- [Production Build Guide](../deployment/production-build-guide.md) - Build optimization
- [QA Process](../testing/qa-process.md) - Testing workflow

---

**Last Updated:** Session 16 (December 2025)
