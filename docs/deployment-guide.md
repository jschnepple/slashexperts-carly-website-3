# Deployment Guide - SlashExperts Website

**Project:** SlashExperts Website Modernization
**Date:** December 9, 2025
**Platform:** Cloudflare Pages (Recommended)
**Author:** Claude AI Agent (Session 10)

---

## Overview

This guide provides step-by-step instructions for deploying the SlashExperts website to production using Cloudflare Pages, along with alternative deployment options.

---

## Pre-Deployment Checklist

### Before deploying, ensure:

- [ ] All 12 pages build successfully (`npm run build`)
- [ ] Production build tested locally (`npm run build:prod`)
- [ ] All tests pass (QA, responsive, cross-browser)
- [ ] Accessibility audit complete (WCAG 2.1 AA)
- [ ] Performance targets met (Lighthouse 85+)
- [ ] Images optimized (WebP, lazy loading)
- [ ] CSS/JS minified
- [ ] Analytics configured
- [ ] 404 page created
- [ ] Sitemap generated
- [ ] robots.txt configured

---

## Option 1: Cloudflare Pages (Recommended)

### Advantages
- Free tier: Unlimited sites, unlimited requests
- Global CDN (200+ data centers)
- Automatic HTTPS
- Git integration
- Preview deployments
- Fast builds
- Edge functions support

### Step-by-Step Deployment

#### 1. Prepare Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Website ready for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/slashexperts-website.git
git branch -M main
git push -u origin main
```

#### 2. Connect to Cloudflare Pages

1. Go to https://dash.cloudflare.com/
2. Click "Pages" in sidebar
3. Click "Create a project"
4. Click "Connect to Git"
5. Authorize GitHub access
6. Select your repository
7. Click "Begin setup"

#### 3. Configure Build Settings

```
Production branch: main
Build command: npm run build:prod
Build output directory: _site
Root directory: (leave empty)
Environment variables: (none required)
```

#### 4. Advanced Build Settings

```yaml
Node version: 18
Build timeout: 10 minutes
```

#### 5. Deploy

Click "Save and Deploy"

First build takes ~2-3 minutes.

#### 6. Custom Domain Setup

1. Go to Pages project → Custom domains
2. Click "Set up a custom domain"
3. Enter: `slashexperts.com`
4. Follow DNS instructions:
   - Add CNAME record: `www` → `[your-project].pages.dev`
   - Add CNAME record: `@` → `[your-project].pages.dev`
5. Wait for DNS propagation (~5-60 minutes)
6. SSL automatically provisioned

---

## Option 2: Netlify

### Advantages
- Generous free tier
- Form handling
- Split testing
- Deploy previews
- Netlify Functions

### Deployment Steps

#### 1. Create `netlify.toml`

```toml
[build]
  command = "npm run build:prod"
  publish = "_site"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### 2. Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

---

## Option 3: Vercel

### Advantages
- Excellent performance
- Edge functions
- Analytics
- Preview deployments

### Deployment Steps

#### 1. Create `vercel.json`

```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "_site",
  "framework": "other",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### 2. Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## Environment Setup

### Production Environment Variables

```bash
# None required for static site
# If adding analytics or forms later:
NODE_ENV=production
ANALYTICS_ID=your-analytics-id
```

---

## Post-Deployment Configuration

### 1. Setup Analytics

**Google Analytics 4:**
```html
<!-- Add to src/_includes/partials/head.njk -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Cloudflare Web Analytics (Privacy-friendly):**
```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "your-token"}'></script>
```

### 2. Setup Performance Monitoring

**Cloudflare Speed Test:**
- Enable in Cloudflare Dashboard → Speed → Optimization

**Real User Monitoring (RUM):**
- Cloudflare Browser Insights (free)
- Or use Google PageSpeed Insights API

### 3. Configure Caching

**Cloudflare Page Rules:**
```
slashexperts.com/assets/*
Cache Level: Cache Everything
Edge Cache TTL: 1 month
Browser Cache TTL: 1 month
```

### 4. Setup Error Tracking

**Sentry (Optional):**
```bash
npm install @sentry/browser
```

```javascript
// In main.js
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

---

## Build Verification Checklist

After deployment, verify:

### Functionality
- [ ] All 12 pages load correctly
- [ ] Navigation works between pages
- [ ] Forms submit (if applicable)
- [ ] Interactive elements work (carousels, calculators, etc.)
- [ ] Images load and display correctly
- [ ] SVG icons render properly

### Performance
- [ ] Lighthouse Performance 85+
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] All assets loading from CDN
- [ ] Gzip/Brotli compression enabled

### SEO
- [ ] Meta tags present on all pages
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] robots.txt accessible
- [ ] Canonical URLs set

### Security
- [ ] HTTPS enforced
- [ ] Security headers present (X-Frame-Options, CSP, etc.)
- [ ] No mixed content warnings
- [ ] SSL certificate valid

---

## Rollback Procedures

### Cloudflare Pages Rollback

```
1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click "Deployments" tab
3. Find previous working deployment
4. Click three dots (•••) → "Rollback to this deployment"
5. Confirm rollback
```

### Git-Based Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push origin main --force  # Use with caution!
```

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Site is online and accessible
- [ ] No error pages (404, 500)
- [ ] Forms working (if applicable)

### Weekly Checks
- [ ] Review analytics data
- [ ] Check performance metrics
- [ ] Review error logs
- [ ] Check SSL certificate expiration

### Monthly Checks
- [ ] Run full accessibility audit
- [ ] Run Lighthouse audit on all pages
- [ ] Update dependencies (`npm outdated`)
- [ ] Review and optimize images
- [ ] Check broken links

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Solution: Install dependencies
npm install
```

**Error: "Command failed: npm run build:prod"**
```bash
# Check build locally
npm run build:prod

# Review error messages
# Common issues:
# - Missing files
# - Syntax errors in templates
# - Missing images/assets
```

### Site Not Updating

**Issue: Changes not visible**
```
1. Clear Cloudflare cache:
   Dashboard → Caching → Purge Cache → Purge Everything

2. Hard refresh browser:
   Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

3. Check deployment status:
   Ensure latest commit deployed successfully
```

### Performance Issues

**Issue: Slow page load**
```
1. Run Lighthouse audit
2. Check image sizes (should be optimized)
3. Verify CSS/JS minified
4. Check CDN is serving assets
5. Review Cloudflare caching rules
```

---

## CI/CD Automation (Advanced)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build:prod

      - name: Run tests
        run: npm test

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: slashexperts
          directory: _site
```

---

## Domain & DNS Configuration

### DNS Records (Cloudflare)

```
Type    Name    Content                         TTL     Proxy
CNAME   www     slashexperts.pages.dev          Auto    Proxied
CNAME   @       slashexperts.pages.dev          Auto    Proxied
```

### Subdomain Setup (Optional)

```
Type    Name    Content                         TTL     Proxy
CNAME   blog    slashexperts.pages.dev          Auto    Proxied
CNAME   docs    slashexperts.pages.dev          Auto    Proxied
```

---

## Security Best Practices

### 1. Enable Security Headers

In Cloudflare:
```
Dashboard → Rules → Transform Rules → Modify Response Header

X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 2. Configure CSP (Content Security Policy)

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'
```

### 3. Enable Bot Protection

```
Dashboard → Security → Bots
Enable: Bot Fight Mode
```

---

## Backup & Disaster Recovery

### Automated Backups

```bash
# Git is your backup
# Every commit is a restore point

# To backup build artifacts:
npm run build:prod
tar -czf backup-$(date +%Y%m%d).tar.gz _site/
```

### Recovery Time Objective (RTO)

- **Git rollback:** < 5 minutes
- **Full redeployment:** < 10 minutes
- **Domain restoration:** < 60 minutes

---

## Launch Checklist

### Pre-Launch (T-24 hours)
- [ ] All content finalized
- [ ] All images optimized
- [ ] All tests passed
- [ ] Staging site reviewed by stakeholders
- [ ] DNS records prepared
- [ ] SSL certificate ready
- [ ] Analytics configured
- [ ] Error tracking configured

### Launch Day (T-0)
- [ ] Deploy to production
- [ ] Verify build successful
- [ ] Update DNS records
- [ ] Wait for DNS propagation
- [ ] Test production site
- [ ] Monitor error logs
- [ ] Send launch announcement

### Post-Launch (T+24 hours)
- [ ] Monitor traffic and errors
- [ ] Run performance audit
- [ ] Check analytics data
- [ ] Review user feedback
- [ ] Document any issues

---

## Contact & Support

**Cloudflare Support:**
- Dashboard: https://dash.cloudflare.com/
- Community: https://community.cloudflare.com/
- Docs: https://developers.cloudflare.com/pages/

**Eleventy Support:**
- Docs: https://www.11ty.dev/docs/
- Discord: https://www.11ty.dev/blog/discord/

---

**Document Status:** ✅ Complete
**Platform:** Cloudflare Pages (Primary), Netlify/Vercel (Alternatives)
**Deployment Ready:** Yes (after installing prod dependencies)
**Next Action:** Install dependencies, test production build, deploy to staging
