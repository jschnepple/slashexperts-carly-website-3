# Asset Download Template Guide

**Version:** 1.0
**Created:** December 15, 2025
**Purpose:** Comprehensive guide for duplicating and customizing the asset download template for lead magnet pages

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start (5 Steps)](#quick-start-5-steps)
3. [Front Matter Configuration Reference](#front-matter-configuration-reference)
4. [PDF File Management](#pdf-file-management)
5. [Customization Options](#customization-options)
6. [N8N Webhook Integration](#n8n-webhook-integration)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)
9. [Examples](#examples)

---

## Overview

### Purpose

The Asset Download Template (`src/pages/download-asset-template.njk`) is a **reusable template** designed to create lead magnet download pages in **5 minutes or less**. It provides a consistent, conversion-optimized design while allowing easy customization through front matter variables.

### Use Cases

- **Guides & Playbooks:** Step-by-step tutorials and frameworks
- **Reports & Research:** Industry data and insights
- **Templates & Toolkits:** Ready-to-use resources
- **Case Studies:** Success stories and customer examples
- **Whitepapers:** In-depth technical content
- **Ebooks:** Long-form educational content

### Benefits

✅ **Fast Setup:** 5-minute duplication process
✅ **Consistent Design:** Matches SlashExperts brand
✅ **N8N Integration:** Automatic webhook submission to HubSpot
✅ **PDF Download:** Instant delivery on form submit
✅ **Responsive:** Mobile-first design
✅ **Accessible:** WCAG 2.1 Level AA compliant
✅ **SEO Optimized:** Proper meta tags and structure

---

## Quick Start (5 Steps)

### Step 1: Copy the Template File

```bash
# From the project root directory
cp src/pages/download-asset-template.njk src/pages/download-sales-playbook.njk
```

**Naming Convention:** `download-[resource-name].njk` (use lowercase with hyphens)

### Step 2: Update Front Matter

Edit the front matter at the top of your new file:

```yaml
---
title: Download Sales Playbook | SlashExperts
description: Get instant access to our sales playbook with proven strategies.
pageCSS: download-asset
pageJS: download-asset
lightNav: true

resourceType: guide
resourceIcon: file-text
resourceTitle: Sales Enablement Playbook
resourceSubtitle: A comprehensive guide to accelerating your B2B sales process
resourcePages: 42
resourceReadTime: 25 min
resourceSurveyed: 350+ companies

pdfUrl: /assets/pdfs/sales-enablement-playbook.pdf
pdfFilename: Sales-Enablement-Playbook-2025.pdf

takeaways:
  - Framework for building repeatable sales processes
  - 15+ proven templates and scripts
  - Case studies from high-growth B2B companies
  - Metrics dashboard for tracking performance

# Optional: Remove if not needed
relatedResources:
  - title: ROI Calculator
    description: Calculate your potential revenue impact
    url: /pages/roi-calculator/
---
```

### Step 3: Upload PDF File

**Option A: Local Storage (Recommended for Small Files)**

```bash
# Place PDF in assets folder
cp ~/Downloads/your-file.pdf src/assets/pdfs/sales-enablement-playbook.pdf

# Update front matter pdfUrl
pdfUrl: /assets/pdfs/sales-enablement-playbook.pdf
```

**Option B: External CDN (Recommended for Large Files >5MB)**

```yaml
# Use full CDN URL in front matter
pdfUrl: https://cdn.slashexperts.com/assets/sales-playbook-2025.pdf
```

### Step 4: Build and Test

```bash
# Build the site
npx @11ty/eleventy

# Start dev server
npx @11ty/eleventy --serve

# Test at: http://localhost:8080/pages/download-sales-playbook/
```

**Visual Checklist:**
- ✅ Resource badge displays correctly
- ✅ Title and subtitle are formatted
- ✅ Meta information shows (pages, read time, surveyed)
- ✅ Takeaways list renders with checkmarks
- ✅ Preview mockup displays
- ✅ Form card is sticky on desktop
- ✅ Related resources section shows (if configured)

**Functional Checklist:**
- ✅ Form validation works (required fields, email format)
- ✅ Form submits to N8N webhook
- ✅ PDF downloads on success
- ✅ Success modal displays
- ✅ "Download Again" button works

### Step 5: Deploy

```bash
# Production build
npx @11ty/eleventy

# Deploy via your preferred method:
# - Netlify/Vercel (auto-deploy from git)
# - Cloudflare Pages
# - Manual FTP/SFTP
```

---

## Front Matter Configuration Reference

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | String | Page title (shown in browser tab, SEO) | `Download Sales Playbook \| SlashExperts` |
| `description` | String | Meta description for SEO (150-160 chars) | `Get instant access to our comprehensive sales playbook...` |
| `pageCSS` | String | Must be `download-asset` | `download-asset` |
| `pageJS` | String | Must be `download-asset` | `download-asset` |
| `lightNav` | Boolean | Use light navigation variant | `true` |
| `resourceType` | String | Type of resource | `guide`, `report`, `template`, `case-study`, `whitepaper`, `toolkit`, `ebook` |
| `resourceIcon` | String | Icon for badge | `file-text`, `document`, `chart`, `book` |
| `resourceTitle` | String | Main heading | `Sales Enablement Playbook` |
| `resourceSubtitle` | String | Subheading/description | `A comprehensive guide to...` |
| `pdfUrl` | String | Path to PDF file | `/assets/pdfs/file.pdf` or `https://cdn.url/file.pdf` |
| `pdfFilename` | String | Download filename | `Sales-Playbook-2025.pdf` |
| `takeaways` | Array | Key benefits (3-5 items) | See example below |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `resourcePages` | Number | Number of pages | `42` |
| `resourceReadTime` | String | Estimated read time | `25 min`, `1 hour`, `30-45 min` |
| `resourceSurveyed` | String | Number of companies/people surveyed | `350+ companies`, `1,200 respondents` |
| `relatedResources` | Array | Related pages (3 max recommended) | See example below |

### Takeaways Array Example

```yaml
takeaways:
  - Framework for building repeatable sales processes
  - 15+ proven templates and scripts
  - Case studies from high-growth B2B companies
  - Metrics dashboard for tracking performance
  - Step-by-step implementation guide
```

**Best Practices:**
- Use 3-5 takeaways (optimal for conversion)
- Start with action verbs or nouns
- Be specific (numbers, frameworks, templates)
- Focus on outcomes, not features

### Related Resources Array Example

```yaml
relatedResources:
  - title: ROI Calculator
    description: Calculate your potential revenue impact
    url: /pages/roi-calculator/
  - title: Case Studies
    description: See how teams are winning with proof
    url: /pages/case-studies/
  - title: Book a Demo
    description: Get a personalized walkthrough
    url: /pages/book-a-demo/
```

**Best Practices:**
- Limit to 2-3 resources (avoid overwhelming users)
- Use clear, benefit-driven descriptions
- Link to complementary content (not competing)

---

## PDF File Management

### Local Storage

**Path:** `src/assets/pdfs/[filename].pdf`

**Advantages:**
- Simple deployment (included in build)
- No external dependencies
- Faster for small files (<5MB)

**Disadvantages:**
- Increases repository size
- Git tracking for large files (use `.gitignore` if >10MB)
- CDN caching may be slower

**File Naming Convention:**
- Use lowercase with hyphens: `sales-enablement-playbook.pdf`
- Include year/version if applicable: `sales-playbook-2025.pdf`
- Avoid spaces and special characters

**Gitignore Large PDFs:**

```bash
# Add to .gitignore
src/assets/pdfs/*.pdf
!src/assets/pdfs/README.md
```

### External CDN

**Recommended Services:**
- **AWS S3 + CloudFront:** Enterprise-grade, global CDN
- **Cloudflare R2:** Zero egress fees
- **Netlify Large Media:** Git LFS integration
- **Custom CDN:** cdn.slashexperts.com

**Configuration Example:**

```yaml
pdfUrl: https://cdn.slashexperts.com/assets/sales-playbook-2025.pdf
pdfFilename: Sales-Enablement-Playbook-2025.pdf
```

**Advantages:**
- Faster downloads (global CDN)
- Smaller git repository
- Easy to update PDFs independently

**Disadvantages:**
- External dependency
- Requires CDN setup and management
- Potential for broken links if CDN down

### Size Optimization Guidelines

**Target:** < 5MB per PDF (optimal for web delivery)

**Optimization Tools:**
- **Adobe Acrobat:** File > Save As Other > Reduced Size PDF
- **Preview (Mac):** Export > Quartz Filter > Reduce File Size
- **Online:** Smallpdf.com, iLovePDF.com
- **Command Line:** `gs` (Ghostscript)

**Compression Command (Ghostscript):**

```bash
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=output-compressed.pdf input-original.pdf
```

**Compression Levels:**
- `/screen` - Lowest quality (72 dpi), smallest size
- `/ebook` - Medium quality (150 dpi), balanced
- `/printer` - High quality (300 dpi), larger size
- `/prepress` - Highest quality (300+ dpi), largest size

**Recommended:** `/ebook` for web delivery (balances quality and size)

---

## Customization Options

### Changing Colors/Styling

**File:** `src/assets/css/pages/download-asset.css`

**Common Customizations:**

```css
/* Change primary color */
.resource-badge {
    background: linear-gradient(135deg, rgba(YOUR_COLOR, 0.1) 0%, rgba(YOUR_COLOR, 0.08) 100%);
    border: 1px solid rgba(YOUR_COLOR, 0.2);
}

/* Change button color */
.btn-submit {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 50%, #YOUR_COLOR_3 100%);
}

/* Change preview mockup background */
.preview-mockup {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 50%, #YOUR_COLOR_3 100%);
}
```

**Best Practice:** Only modify page-specific styles, not global variables in `base/variables.css`.

### Adding/Removing Sections

**Sections in Template:**
1. Resource Badge
2. Title & Subtitle
3. Resource Meta (pages, read time, surveyed)
4. Takeaways List
5. Preview Mockup
6. Form Card (sticky)
7. Success State
8. Related Resources (optional)

**To Remove a Section:**

Edit `src/pages/download-[your-resource].njk` and delete/comment out the section:

```html
<!-- Remove Resource Meta -->
<!-- <div class="resource-meta">...</div> -->

<!-- Remove Preview Mockup -->
<!-- <div class="asset-preview">...</div> -->

<!-- Remove Related Resources -->
{% if false %} <!-- Disable without deleting -->
<section class="related-resources">...</section>
{% endif %}
```

**To Add a Section:**

Insert after existing sections, following the template's HTML structure:

```html
<!-- Add custom section -->
<div class="custom-section">
    <h3>Custom Heading</h3>
    <p>Custom content here</p>
</div>
```

Then add corresponding CSS in `download-asset.css`:

```css
.custom-section {
    margin-bottom: 40px;
    padding: 24px;
    background: var(--off-white);
    border-radius: 12px;
}
```

### Custom Form Fields

**Default Fields:**
- First Name (required)
- Last Name (required)
- Work Email (required)
- Company Name (required)
- Job Title (optional)

**To Add a Field:**

Edit the form in `download-[your-resource].njk`:

```html
<div class="form-group">
    <label for="industry">Industry <span class="required">*</span></label>
    <select id="industry" name="industry" required>
        <option value="">Select Industry</option>
        <option value="saas">SaaS</option>
        <option value="ecommerce">E-commerce</option>
        <option value="services">Services</option>
    </select>
</div>
```

**Important:** Custom fields will be sent to N8N webhook in the payload. Ensure your HubSpot fields are configured to receive them.

---

## N8N Webhook Integration

### Webhook URL

```
https://slashexperts.app.n8n.cloud/webhook/bb775099-ce62-4d01-a95e-b77552e6ca46
```

**Important:** This URL is shared across all form pages. Do not modify unless setting up a new webhook.

### Payload Structure

When a user submits the form, the following JSON payload is sent to the webhook:

```json
{
  "email": "user@company.com",
  "firstname": "John",
  "lastname": "Doe",
  "company": "Acme Corp",
  "jobtitle": "VP of Sales",
  "timestamp": "2025-12-15T14:30:00.000Z",
  "page": "/pages/download-sales-playbook/",
  "referrer": "https://google.com/search",
  "leadSource": "Asset Download Template",
  "resourceType": "GUIDE",
  "assetTitle": "Sales Enablement Playbook"
}
```

### HubSpot Field Mapping

The N8N workflow maps form fields to HubSpot contact properties:

| Form Field | HubSpot Property | Required |
|------------|------------------|----------|
| `email` | `email` | Yes |
| `firstname` | `firstname` | Yes |
| `lastname` | `lastname` | Yes |
| `company` | `company` | Yes |
| `jobtitle` | `jobtitle` | No |
| `leadSource` | `hs_lead_source` | Auto |
| `resourceType` | `asset_type` | Auto |
| `assetTitle` | `last_asset_downloaded` | Auto |
| `page` | `last_page_visited` | Auto |

**Custom Fields:** If you add custom form fields, create matching properties in HubSpot and update the N8N workflow mapping.

### Slack Notification Format

When a form is submitted, a Slack notification is sent to #leads channel:

```
🎉 New Asset Download!

📄 Asset: Sales Enablement Playbook (GUIDE)
👤 Name: John Doe
🏢 Company: Acme Corp
📧 Email: user@company.com
💼 Title: VP of Sales
🌐 Source: /pages/download-sales-playbook/

View in HubSpot: [Link]
```

### Email Delivery

The N8N workflow triggers an email sent to the user:

**Subject:** Your Sales Enablement Playbook is Ready!

**Body:**
- Thank you message
- Download link (PDF URL)
- Additional resources
- SlashExperts branding

**PDF Delivery:** The PDF is delivered in two ways:
1. **Instant download:** Triggered by JavaScript on form success
2. **Email link:** Backup delivery method via N8N workflow

---

## Testing Checklist

### Pre-Launch Testing

Before deploying a new asset download page, complete this checklist:

#### 1. Visual Testing (8 Breakpoints)

Test at these standard breakpoints (from docs/testing/visual-testing-checklist.md):

- [ ] **1920px** (Desktop XL): All sections aligned, no overflow
- [ ] **1440px** (Desktop L): Two-column layout intact
- [ ] **1024px** (Desktop): Sticky form working
- [ ] **768px** (Tablet): Single column layout, form unsticky
- [ ] **480px** (Mobile L): Content readable, buttons full-width
- [ ] **375px** (Mobile M): All text legible, no horizontal scroll
- [ ] **360px** (Mobile S): Form fields sized correctly
- [ ] **320px** (Mobile XS): Minimum width supported

**How to Test:**
```bash
npx @11ty/eleventy --serve
# Open DevTools (Cmd+Option+M on Mac, F12 on Windows)
# Use Responsive Design Mode
# Test each breakpoint manually
```

#### 2. Functional Testing

- [ ] **Form Validation:**
  - [ ] Required fields prevent submission when empty
  - [ ] Email validation (must include @)
  - [ ] Submit button disabled during submission

- [ ] **PDF Download:**
  - [ ] PDF downloads instantly on form success
  - [ ] Correct filename used
  - [ ] PDF opens without errors

- [ ] **N8N Webhook:**
  - [ ] Form data sent to webhook
  - [ ] HubSpot contact created/updated
  - [ ] Slack notification received
  - [ ] Email sent to user

- [ ] **Success State:**
  - [ ] Success modal displays after submission
  - [ ] "Download Again" button works
  - [ ] Close button/click outside closes modal

- [ ] **Animations:**
  - [ ] Preview mockup hover effect smooth
  - [ ] Form card sticky on desktop
  - [ ] Transitions on all interactive elements

#### 3. Accessibility Audit

Use axe DevTools and Lighthouse (from docs/accessibility/accessibility-audit-process.md):

- [ ] **axe DevTools:** 0 violations
- [ ] **Lighthouse Accessibility:** >95 score
- [ ] **Keyboard Navigation:**
  - [ ] Tab through all form fields
  - [ ] Enter submits form
  - [ ] Escape closes success modal

- [ ] **Screen Reader:**
  - [ ] Form labels announced correctly
  - [ ] Error messages announced
  - [ ] Success message announced

- [ ] **Color Contrast:**
  - [ ] Normal text: 4.5:1 minimum
  - [ ] Large text: 3:1 minimum
  - [ ] Form inputs: 3:1 minimum

#### 4. Performance Testing

Run Lighthouse Performance audit:

- [ ] **Lighthouse Performance:** >90 score
- [ ] **LCP (Largest Contentful Paint):** <2.5s
- [ ] **FID (First Input Delay):** <100ms
- [ ] **CLS (Cumulative Layout Shift):** <0.1
- [ ] **Total Page Size:** <1.5MB
- [ ] **PDF Size:** <5MB (recommended)

**Optimization Tips:**
- Compress PDF if >5MB
- Add width/height to preview mockup image
- Lazy load related resources images
- Minimize CSS/JS (production build)

#### 5. Cross-Browser Testing

Test in major browsers:

- [ ] **Chrome** (latest): Full functionality
- [ ] **Firefox** (latest): Full functionality
- [ ] **Safari** (latest): Full functionality, backdrop-filter
- [ ] **Edge** (latest): Full functionality

**Known Issues:**
- Older browsers (<2020) may not support `backdrop-filter` - graceful degradation

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Form Not Submitting

**Symptoms:** Form submit button does nothing, no console errors

**Possible Causes:**
- FormHandler not initialized
- JavaScript file not loaded
- Form ID mismatch

**Solutions:**

```bash
# Check console for errors
# DevTools → Console → Look for errors

# Verify JavaScript loaded
console.log('Form handler active:', document.getElementById('assetForm') ? 'Yes' : 'No');

# Check form ID matches
# In download-[resource].njk: id="assetForm"
# In download-asset.js: getElementById('assetForm')
```

#### 2. PDF Not Downloading

**Symptoms:** Form submits, success shows, but no PDF download

**Possible Causes:**
- PDF URL incorrect
- PDF file missing
- Browser blocking download

**Solutions:**

```yaml
# Check PDF URL in front matter
pdfUrl: /assets/pdfs/your-file.pdf  # Correct path?

# Verify file exists
ls -la src/assets/pdfs/your-file.pdf

# Test URL directly in browser
http://localhost:8080/assets/pdfs/your-file.pdf

# Check browser downloads/blocked popups
```

#### 3. Styling Broken

**Symptoms:** Page renders but looks unstyled or broken

**Possible Causes:**
- CSS file not loaded
- `pageCSS` front matter incorrect
- Missing CSS classes

**Solutions:**

```yaml
# Verify front matter
pageCSS: download-asset  # Must match exactly

# Check CSS file exists
ls -la src/assets/css/pages/download-asset.css

# Check browser network tab
# DevTools → Network → Look for download-asset.css (should be 200, not 404)

# Rebuild site
npx @11ty/eleventy
```

#### 4. Build Errors

**Symptoms:** `npx @11ty/eleventy` fails with error

**Possible Causes:**
- YAML syntax error in front matter
- Missing closing tag in template
- Invalid Nunjucks syntax

**Solutions:**

```bash
# Check error message carefully
npx @11ty/eleventy 2>&1 | grep -i error

# Common YAML issues:
# - Indentation (use 2 spaces, not tabs)
# - Missing quotes around special characters
# - Unclosed arrays/objects

# Validate YAML syntax
# Use online YAML validator: yamllint.com

# Check Nunjucks syntax
# Ensure all {% %} blocks are closed
# {% if %} must have {% endif %}
# {% for %} must have {% endfor %}
```

#### 5. N8N Webhook Not Receiving Data

**Symptoms:** Form submits, PDF downloads, but no HubSpot/Slack activity

**Possible Causes:**
- Webhook URL incorrect
- Network blocking request
- N8N workflow inactive

**Solutions:**

```bash
# Test webhook directly with curl
curl -X POST https://slashexperts.app.n8n.cloud/webhook/bb775099-ce62-4d01-a95e-b77552e6ca46 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstname": "Test",
    "lastname": "User",
    "company": "Test Corp"
  }'

# Check browser console network tab
# DevTools → Network → Look for webhook POST request
# Status should be 200

# Verify webhook URL in forms.js
cat src/assets/js/components/forms.js | grep webhook

# Check N8N workflow status (contact admin)
```

---

## Examples

### Example 1: Sales Enablement Guide (Full Configuration)

```yaml
---
title: Download Sales Enablement Playbook | SlashExperts
description: Get instant access to our comprehensive sales enablement playbook with proven frameworks, templates, and strategies from 350+ B2B companies.
pageCSS: download-asset
pageJS: download-asset
lightNav: true

resourceType: guide
resourceIcon: file-text
resourceTitle: Sales Enablement Playbook
resourceSubtitle: A comprehensive guide to accelerating your B2B sales process and closing deals faster
resourcePages: 42
resourceReadTime: 25 min
resourceSurveyed: 350+ companies

pdfUrl: /assets/pdfs/sales-enablement-playbook.pdf
pdfFilename: Sales-Enablement-Playbook-2025.pdf

takeaways:
  - Framework for building repeatable sales processes
  - 15+ proven templates and scripts
  - Case studies from high-growth B2B companies
  - Metrics dashboard for tracking performance
  - Step-by-step implementation timeline

relatedResources:
  - title: ROI Calculator
    description: Calculate your potential revenue impact
    url: /pages/roi-calculator/
  - title: Case Studies
    description: See how teams are winning with proof
    url: /pages/case-studies/
  - title: Book a Demo
    description: Get a personalized walkthrough
    url: /pages/book-a-demo/
---
```

### Example 2: Case Study Download (Minimal Configuration)

```yaml
---
title: Download Acme Corp Case Study | SlashExperts
description: See how Acme Corp increased close rates by 73% using SlashExperts proof-ready sales approach.
pageCSS: download-asset
pageJS: download-asset
lightNav: true

resourceType: case-study
resourceIcon: chart
resourceTitle: Acme Corp Success Story
resourceSubtitle: How this SaaS company achieved 73% faster deal velocity with proof-ready sales
resourcePages: 8
resourceReadTime: 10 min
# No resourceSurveyed field (not applicable for case study)

pdfUrl: /assets/pdfs/acme-corp-case-study.pdf
pdfFilename: Acme-Corp-Case-Study-2025.pdf

takeaways:
  - 73% faster deal velocity in 90 days
  - 2.3x higher close rates year-over-year
  - 89% reduction in time spent finding proof
  - $2.4M in additional annual revenue

# No relatedResources (simpler page)
---
```

### Example 3: Whitepaper with External CDN PDF

```yaml
---
title: Download 2026 B2B Sales Trends Report | SlashExperts
description: Breaking research on the future of B2B sales from 1,200 sales leaders across 34 industries.
pageCSS: download-asset
pageJS: download-asset
lightNav: true

resourceType: whitepaper
resourceIcon: document
resourceTitle: 2026 B2B Sales Trends Report
resourceSubtitle: Exclusive research from 1,200 sales leaders on the future of B2B selling
resourcePages: 56
resourceReadTime: 45 min
resourceSurveyed: 1,200 sales leaders

# External CDN URL for large file
pdfUrl: https://cdn.slashexperts.com/reports/2026-b2b-sales-trends.pdf
pdfFilename: 2026-B2B-Sales-Trends-SlashExperts.pdf

takeaways:
  - AI's impact on sales productivity (2026 predictions)
  - Buyer behavior shifts across 34 industries
  - Emerging sales technologies and adoption rates
  - Top performers' strategies and tactics
  - Implementation roadmap for 2026

relatedResources:
  - title: 2026 GTM Report
    description: Companion report on go-to-market strategy
    url: /pages/download-report-2026/
  - title: ROI Calculator
    description: Calculate impact of new strategies
    url: /pages/roi-calculator/
---
```

---

## Quick Reference Card

### Duplication Commands

```bash
# 1. Copy template
cp src/pages/download-asset-template.njk src/pages/download-YOUR-RESOURCE.njk

# 2. Edit front matter (update all REQUIRED fields)

# 3. Add PDF
cp ~/Downloads/your-file.pdf src/assets/pdfs/YOUR-FILE.pdf

# 4. Build & test
npx @11ty/eleventy --serve

# 5. Deploy
npx @11ty/eleventy  # Production build
```

### Front Matter Template (Copy/Paste)

```yaml
---
title: Download [Resource Name] | SlashExperts
description: [SEO description 150-160 characters]
pageCSS: download-asset
pageJS: download-asset
lightNav: true

resourceType: [guide|report|template|case-study|whitepaper|toolkit|ebook]
resourceIcon: [file-text|document|chart|book]
resourceTitle: [Main Heading]
resourceSubtitle: [Subheading/Description]
resourcePages: [Number]
resourceReadTime: [Time]
resourceSurveyed: [Optional: "X+ companies"]

pdfUrl: /assets/pdfs/[filename].pdf
pdfFilename: [Download-Filename-2025.pdf]

takeaways:
  - [Takeaway 1]
  - [Takeaway 2]
  - [Takeaway 3]
  - [Takeaway 4]

# Optional: Remove if not needed
relatedResources:
  - title: [Resource 1]
    description: [Description]
    url: /pages/[page-slug]/
---
```

---

## Support & Feedback

**Questions:** Check troubleshooting section first
**Bugs:** Create issue at https://github.com/anthropics/claude-code/issues
**Feature Requests:** Same as bugs

**Last Updated:** December 15, 2025
**Version:** 1.0
