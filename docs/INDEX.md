# Documentation Index

**Purpose:** Comprehensive index of all documentation for SlashExperts website development, testing, optimization, and deployment.

**For AI Agents:** This is your starting point. All processes, standards, and guides are documented here for easy discovery and reuse.

---

## Quick Navigation

**I need to...**
- [Test a new page](#testing-qa) → Start with Visual Testing Checklist
- [Run accessibility audit](#accessibility) → Accessibility Audit Process
- [Optimize images](#optimization) → Image Optimization Guide
- [Check performance](#performance) → Performance Audit Process
- [Deploy to production](#deployment) → Production Build Guide
- [Manage the blog](#blog-management) → Blog Management Guide
- [Contribute to project](#contributing) → CONTRIBUTING.md

---

## Documentation Structure

```
docs/
├── INDEX.md (this file)
├── blog-management-guide.md          # CloudCannon CMS guide (Session 30)
├── testing/
│   ├── qa-process.md
│   └── visual-testing-checklist.md
├── accessibility/
│   ├── accessibility-audit-process.md
│   └── accessibility-standards.md
├── optimization/
│   └── image-optimization-guide.md
├── performance/
│   ├── performance-audit-process.md
│   └── performance-baselines.md
└── deployment/
    └── production-build-guide.md

scripts/
├── optimize-images.sh
└── migrate-webflow-blog.js           # Blog migration script (Session 30)
```

---

## Testing & QA

### Visual Testing

**File:** [testing/visual-testing-checklist.md](./testing/visual-testing-checklist.md)

**Purpose:** Ensure all pages render correctly across all devices and breakpoints.

**When to use:**
- After creating/updating any page
- Before deployment
- For regression testing

**Key sections:**
- 8-breakpoint testing matrix (1920px → 320px)
- Per-page testing checklists for all 18 pages
- Common issues and solutions
- Screenshot comparison process
- Browser testing matrix

**Quick start:**
```bash
npx @11ty/eleventy --serve
# Open http://localhost:8080
# Test at 1920px, 1440px, 1024px, 768px, 480px, 375px, 360px, 320px
```

---

### Complete QA Process

**File:** [testing/qa-process.md](./testing/qa-process.md)

**Purpose:** Comprehensive quality assurance workflow from start to deployment.

**When to use:**
- Before every deployment
- After significant changes
- For regression testing

**Workflow:**
1. Visual Testing (All Breakpoints)
2. Functional Testing (Interactive Elements)
3. Accessibility Audit
4. Performance Testing
5. Cross-Browser Testing
6. Regression Testing
7. Production Build Test
8. Final Sign-Off

**Quick start:**
```bash
# See QA Process → AI Agent Quick Start section
# Complete workflow with commands and checkpoints
```

---

## Accessibility

### Accessibility Audit Process

**File:** [accessibility/accessibility-audit-process.md](./accessibility/accessibility-audit-process.md)

**Purpose:** Ensure WCAG 2.1 Level AA compliance across all pages and components.

**When to use:**
- Before every deployment
- After creating/updating pages
- For regression testing

**Tools:**
- axe DevTools (primary)
- Lighthouse (Chrome DevTools)
- Keyboard testing
- Screen readers (VoiceOver, NVDA, JAWS)

**Quick start:**
```bash
npx @11ty/eleventy --serve
# Open DevTools → axe DevTools tab → "Scan ALL of my page"
# Review violations (target: 0)
# Run Lighthouse → Accessibility category (target: >95)
```

**Key sections:**
- Automated scanning with axe DevTools
- Manual keyboard testing
- Screen reader testing
- Color contrast validation (4.5:1 for text, 3:1 for UI)
- ARIA implementation check
- Form accessibility audit
- Focus management review
- Severity classification (P0-P3)
- Issue tracking templates

---

### Accessibility Standards

**File:** [accessibility/accessibility-standards.md](./accessibility/accessibility-standards.md)

**Purpose:** Component-level accessibility requirements and implementation patterns.

**When to use:**
- When creating new components
- When reviewing code for accessibility
- As reference for ARIA patterns

**Key sections:**
- Component standards (nav, buttons, forms, accordions, tabs, modals, carousels, images, links, headings)
- Color contrast standards
- Keyboard navigation patterns
- Screen reader testing guidelines
- WCAG 2.1 Level AA quick checklist

**Common patterns:**
- Navigation with dropdown menus
- Accordions (single-active pattern)
- Tabs with arrow key navigation
- Modal dialogs with focus trapping
- Forms with error handling

---

## Optimization

### Image Optimization Guide

**File:** [optimization/image-optimization-guide.md](./optimization/image-optimization-guide.md)

**Purpose:** Extract, optimize, and implement images for maximum performance.

**When to use:**
- When adding new images
- When base64 images found in HTML
- When page size is too large
- Before deployment

**Current status:**
- ⚠️ **About page**: 12 base64 images (~2MB embedded in HTML) → **CRITICAL P0**
- Target: All images as external files with WebP + PNG/JPG fallback

**Workflow:**
1. Extract base64 images from HTML
2. Optimize original format (pngquant, jpegoptim)
3. Convert to WebP (cwebp)
4. Implement with `<picture>` element
5. Add lazy loading
6. Verify performance improvement

**Quick start:**
```bash
# Extract base64 images
./scripts/optimize-images.sh extract src/pages/about.njk

# Optimize and convert to WebP
./scripts/optimize-images.sh all src/pages/about.njk src/assets/images/experts/

# Replace base64 in HTML with <picture> elements
```

**Expected improvements:**
- Page size reduction: ~60-80%
- LCP improvement: ~30-50%
- Bandwidth savings: ~70% (WebP vs PNG/JPG)

---

### Image Optimization Script

**File:** `scripts/optimize-images.sh`

**Purpose:** Automated tool for extracting, optimizing, and converting images.

**Commands:**
```bash
# Extract base64 images from HTML
./scripts/optimize-images.sh extract <file>

# Optimize PNG/JPG images
./scripts/optimize-images.sh optimize <dir>

# Convert images to WebP
./scripts/optimize-images.sh convert <dir>

# Full workflow (extract, optimize, convert)
./scripts/optimize-images.sh all <input_file> <output_dir>

# Help
./scripts/optimize-images.sh help
```

**Requirements:**
- pngquant (`brew install pngquant`)
- jpegoptim (`brew install jpegoptim`)
- webp (`brew install webp`)

---

## Performance

### Performance Audit Process

**File:** [performance/performance-audit-process.md](./performance/performance-audit-process.md)

**Purpose:** Measure, optimize, and monitor website performance.

**When to use:**
- Before deployment
- After optimization changes
- Monthly performance reviews

**Key metrics:**
- **LCP (Largest Contentful Paint):** <2.5s
- **FID (First Input Delay):** <100ms
- **CLS (Cumulative Layout Shift):** <0.1
- **Lighthouse Performance Score:** >90

**Workflow:**
1. Baseline measurement (Lighthouse)
2. Core Web Vitals analysis
3. Resource optimization (images, CSS, JavaScript)
4. Render optimization (critical CSS, font loading)
5. JavaScript optimization (code splitting, deferring)
6. Re-measurement & comparison
7. Real user monitoring setup

**Quick start:**
```bash
npx @11ty/eleventy --serve
# Open DevTools → Lighthouse → Performance → Analyze page load
# Review Core Web Vitals (LCP, FID, CLS)
# Identify optimizations needed
# Apply optimizations
# Re-run audit and compare
```

**Tools:**
- Lighthouse (Chrome DevTools)
- WebPageTest
- Chrome User Experience Report
- web-vitals.js library

---

### Performance Baselines

**File:** [performance/performance-baselines.md](./performance/performance-baselines.md)

**Purpose:** Track current performance metrics and measure optimization improvements.

**When to use:**
- Before starting optimization work (establish baseline)
- After optimization (measure impact)
- Monthly performance reviews

**Current status:**
- **About page:** Performance Score ~45 ❌ (CRITICAL - base64 images)
- **Homepage:** Performance Score ~60 ⚠️ (needs optimization)
- **All other pages:** Performance Score ~90 ✅

**Optimization roadmap:**
- **Phase 1 (P0 - Critical):** About page optimization (extract base64 images)
- **Phase 2 (P1 - High):** Homepage optimization (preload, dimensions)
- **Phase 3 (P2 - Medium):** Global optimizations (minify, compression)
- **Phase 4 (Ongoing):** Performance monitoring (Lighthouse CI, RUM)

**Performance tracking template included for recording new measurements.**

---

## Deployment

### Production Build Guide

**File:** [deployment/production-build-guide.md](./deployment/production-build-guide.md)

**Purpose:** Complete guide to building, testing, and deploying to production.

**When to use:**
- Before every production deployment
- When setting up CI/CD
- When configuring hosting

**Workflow:**
1. Pre-build validation (code quality, content checks)
2. Run production build
3. Post-build optimization (minify CSS/JS, optimize images)
4. Local testing (serve production build)
5. Performance audit (Lighthouse)
6. Deploy to staging
7. Final QA on staging
8. Deploy to production

**Build commands:**
```bash
# Current (Eleventy only)
npx @11ty/eleventy

# Future (Vite + Eleventy)
npm run build:prod
```

**Deployment options:**
- Netlify/Vercel (recommended - automatic HTTPS, CDN, CI/CD)
- AWS S3 + CloudFront
- GitHub Pages
- Manual FTP/SFTP

**Rollback procedure included for critical issues.**

---

## Blog Management

### Blog Management Guide

**File:** [blog-management-guide.md](./blog-management-guide.md)

**Purpose:** Complete guide for managing the SlashExperts blog through CloudCannon CMS.

**When to use:**
- When creating or editing blog posts
- When onboarding new content editors
- When troubleshooting CMS issues

**Key sections:**
- Accessing the CMS (CloudCannon login)
- Dashboard overview
- Creating and editing blog posts
- Managing authors and categories
- Working with images
- Publishing workflow (draft → review → publish)
- SEO best practices
- Troubleshooting common issues

**Quick start:**
1. Go to [app.cloudcannon.com](https://app.cloudcannon.com)
2. Sign in and select SlashExperts project
3. Navigate to Collections → Blog Posts
4. Click + Add to create a new post
5. Fill in required fields, write content, publish

**Blog URLs:**
- Blog listing: `/blog/`
- Individual posts: `/post/{slug}/`
- Pagination: `/blog/page/2/`

---

## Contributing

### CONTRIBUTING.md

**File:** [CONTRIBUTING.md](../CONTRIBUTING.md) (to be created)

**Purpose:** Guidelines for contributing to the project.

**Contents:**
- Code style and standards
- Commit message format
- Branch naming conventions
- Pull request process
- Testing requirements
- Documentation requirements

---

## Project Overview

### CLAUDE.md

**File:** [CLAUDE.md](../CLAUDE.md)

**Purpose:** Project instructions and architecture overview for Claude Code AI agents.

**Contents:**
- Project overview and tech stack
- Development commands
- Architecture and folder structure
- Component patterns
- Design system
- Navigation structure
- Template system (CRITICAL rules for Nunjucks)

**Recent additions (Session 16):**
- Testing & QA section
- Optimization section
- Performance section

---

### Continuation Master Prompt

**File:** [continuation-master-prompt.md](../continuation-master-prompt.md)

**Purpose:** Master project status document for AI agents across sessions.

**Contents:**
- Project overview
- Version history (all 16 sessions)
- Current status (18 pages, modernized architecture)
- Critical context for new AI agents
- Next session priorities

---

## Session Handoffs

**Directory:** `session-handoffs/`

**Purpose:** Detailed documentation of work completed in each session.

**Files:**
- `session-01-handoff.md` through `session-15-handoff.md`
- `session-16-handoff.md` (to be created)

**Contents:**
- Session overview
- Pages created/updated
- Files modified
- Code changes
- Build status
- Next session recommendations

---

## Automation Scripts

### Current Scripts

**optimize-images.sh**
- Extract base64 images from HTML
- Optimize PNG/JPG files
- Convert to WebP format
- Full automation workflow

### Planned Scripts (Future)

**test-new-page.sh**
- Run complete QA process on new page
- Visual testing across breakpoints
- Accessibility audit
- Performance audit
- Report generation

**audit-accessibility.sh**
- Run axe DevTools via CLI
- Keyboard navigation tests
- Generate accessibility report

**performance-snapshot.sh**
- Run Lighthouse on all pages
- Record Core Web Vitals
- Update performance-baselines.md
- Generate trend report

---

## AI Agent Workflows

### Creating a New Page

1. **Read:** [CLAUDE.md](../CLAUDE.md) for template system rules
2. **Create:** Page using `{% extends "layouts/base.njk" %}` pattern
3. **Test:** Visual testing checklist (8 breakpoints)
4. **Audit:** Accessibility audit process (axe DevTools, keyboard, screen reader)
5. **Measure:** Performance audit process (Lighthouse)
6. **Document:** Update session handoff

### Optimizing Performance

1. **Read:** [performance/performance-baselines.md](./performance/performance-baselines.md) for current metrics
2. **Identify:** Issues using Lighthouse audit
3. **Optimize:** Following relevant guides (images, CSS, JavaScript)
4. **Measure:** Re-run Lighthouse, compare before/after
5. **Document:** Update performance baselines with new metrics

### Fixing Accessibility Issues

1. **Scan:** Run axe DevTools on page
2. **Classify:** Severity (P0/P1/P2/P3) using accessibility-audit-process.md
3. **Reference:** accessibility-standards.md for correct implementation
4. **Fix:** Apply remediation
5. **Verify:** Re-scan with axe DevTools (target: 0 violations)
6. **Test:** Keyboard navigation and screen reader

### Deploying to Production

1. **QA:** Complete qa-process.md workflow
2. **Build:** Run production build
3. **Test:** Local testing on production build
4. **Audit:** Final performance and accessibility audits
5. **Deploy:** Follow production-build-guide.md deployment steps
6. **Verify:** Post-deployment smoke tests
7. **Monitor:** Check Core Web Vitals and error logs

---

## Common Tasks

### "I need to test a page across all breakpoints"

→ [testing/visual-testing-checklist.md](./testing/visual-testing-checklist.md)

1. Start dev server: `npx @11ty/eleventy --serve`
2. Open in Chrome: `http://localhost:8080/pages/[page-name]/`
3. Open DevTools: `Cmd+Option+M` (Responsive Design Mode)
4. Test at: 1920px, 1440px, 1024px, 768px, 480px, 375px, 360px, 320px
5. Check layout, typography, images, interactive elements, spacing

### "I need to run a complete QA process"

→ [testing/qa-process.md](./testing/qa-process.md)

Follow 8-step workflow:
1. Visual Testing → 2. Functional Testing → 3. Accessibility Audit → 4. Performance Testing → 5. Cross-Browser Testing → 6. Regression Testing → 7. Production Build Test → 8. Final Sign-Off

### "I found base64 images in HTML and need to optimize them"

→ [optimization/image-optimization-guide.md](./optimization/image-optimization-guide.md)

```bash
# Extract, optimize, and convert in one command
./scripts/optimize-images.sh all src/pages/about.njk src/assets/images/experts/

# Then replace base64 <img> tags with <picture> elements
# See guide for implementation pattern
```

### "Page is loading slowly, need to improve performance"

→ [performance/performance-audit-process.md](./performance/performance-audit-process.md)

1. Run Lighthouse audit in Chrome DevTools
2. Identify issues (LCP, CLS, TBT)
3. Apply optimizations:
   - LCP: Optimize images, preload critical resources
   - CLS: Add width/height to images
   - TBT: Defer JavaScript, code splitting
4. Re-run Lighthouse, verify improvements

### "Need to check if page is accessible"

→ [accessibility/accessibility-audit-process.md](./accessibility/accessibility-audit-process.md)

1. Install axe DevTools extension
2. Open page, run scan (target: 0 violations)
3. Test keyboard navigation (Tab, Enter, Space, Esc, Arrows)
4. Test with screen reader (VoiceOver: Cmd+F5)
5. Verify color contrast (4.5:1 for text, 3:1 for UI)

### "Ready to deploy to production"

→ [deployment/production-build-guide.md](./deployment/production-build-guide.md)

1. Complete QA process (all P0/P1 issues resolved)
2. Run production build: `npx @11ty/eleventy`
3. Test locally: `cd _site && python3 -m http.server 8000`
4. Deploy to staging, run final QA
5. Deploy to production: `netlify deploy --prod --dir=_site`
6. Verify deployment with smoke tests

---

## Priority Optimizations

### Critical (P0) - Do Now

**About Page Image Optimization**
- Status: ❌ 12 base64 images embedded (~2MB)
- Impact: Performance Score 45 → 90, LCP 6.5s → 2.3s
- Guide: [optimization/image-optimization-guide.md](./optimization/image-optimization-guide.md)
- Script: `./scripts/optimize-images.sh all src/pages/about.njk src/assets/images/experts/`

### High Priority (P1) - Next Sprint

**Homepage Performance Optimization**
- Status: ⚠️ Performance Score ~60
- Impact: Performance Score 60 → 85, LCP 4.5s → 2.8s
- Guide: [performance/performance-audit-process.md](./performance/performance-audit-process.md)
- Tasks: Preload hero image, add dimensions, inline critical CSS

### Medium Priority (P2) - Future

**Global Optimizations**
- Minify CSS/JavaScript (until Vite integration complete)
- Enable Brotli compression
- Implement service worker for caching

---

## File Statistics

**Total documentation files:** 9 (Session 16)
**Total automation scripts:** 1 (Session 16)
**Documentation coverage:** Testing, Accessibility, Optimization, Performance, Deployment

**Line counts:**
- visual-testing-checklist.md: ~315 lines
- qa-process.md: ~448 lines
- accessibility-audit-process.md: ~550 lines
- accessibility-standards.md: ~750 lines
- image-optimization-guide.md: ~650 lines
- performance-audit-process.md: ~700 lines
- performance-baselines.md: ~550 lines
- production-build-guide.md: ~650 lines
- optimize-images.sh: ~450 lines
- **Total:** ~5,063 lines of comprehensive documentation

---

## Version History

**Session 30 (December 2025):**
- Added blog-management-guide.md for CloudCannon CMS
- Updated documentation structure with blog folder
- Added migrate-webflow-blog.js to scripts

**Session 16 (December 2025):**
- Created comprehensive documentation infrastructure
- Testing: visual-testing-checklist.md, qa-process.md
- Accessibility: accessibility-audit-process.md, accessibility-standards.md
- Optimization: image-optimization-guide.md, optimize-images.sh script
- Performance: performance-audit-process.md, performance-baselines.md
- Deployment: production-build-guide.md
- Created this master INDEX.md for easy documentation discovery

---

## Related Files

- [CLAUDE.md](../CLAUDE.md) - Project instructions for AI agents
- [continuation-master-prompt.md](../continuation-master-prompt.md) - Master project status
- [cloudcannon.config.yml](../cloudcannon.config.yml) - CloudCannon CMS configuration
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines (to be created)
- [README.md](../README.md) - Project README (to be created/updated)

---

**Last Updated:** Session 30 (December 2025)
**Maintained By:** AI agents working on SlashExperts website
**Purpose:** Ensure all knowledge is documented, discoverable, and reusable across sessions
