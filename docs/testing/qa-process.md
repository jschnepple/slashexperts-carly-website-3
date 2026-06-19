# QA Process

**Purpose:** Comprehensive quality assurance workflow for all pages before deployment.

**When to Use:** Before every deployment, after significant changes, for regression testing.

---

## QA Workflow Overview

```
New Page/Update
    ↓
1. Visual Testing (All Breakpoints)
    ↓
2. Functional Testing (Interactive Elements)
    ↓
3. Accessibility Audit
    ↓
4. Performance Testing
    ↓
5. Cross-Browser Testing
    ↓
6. Regression Testing
    ↓
7. Production Build Test
    ↓
8. Final Sign-Off
    ↓
Ready for Deployment
```

---

## 1. Visual Testing

**Goal:** Verify visual correctness across all breakpoints and devices.

**Process:**
1. Follow [Visual Testing Checklist](./visual-testing-checklist.md)
2. Test at all 8 breakpoints (1920px → 320px)
3. Document any visual issues
4. Fix issues and retest
5. Take baseline screenshots if new page

**Critical Checkpoints:**
- 768px (tablet)
- 375px (mobile)
- 320px (small mobile)

**Pass Criteria:**
- ✅ No horizontal scroll
- ✅ All content visible and readable
- ✅ Proper alignment and spacing
- ✅ Images display correctly
- ✅ Gradients and colors render properly

---

## 2. Functional Testing

**Goal:** Verify all interactive elements work correctly.

### Navigation Testing
- [ ] All nav links work
- [ ] Dropdowns expand/collapse
- [ ] Mobile menu toggles
- [ ] Active states correct
- [ ] Scroll behavior smooth
- [ ] Logo links to homepage

### Interactive Elements
- [ ] All buttons clickable
- [ ] Forms validate input
- [ ] Form submissions work
- [ ] Accordions expand/collapse (single-active behavior)
- [ ] Tabs switch content
- [ ] Modals open/close
- [ ] Tooltips appear on hover
- [ ] Carousels/sliders function
- [ ] Video players work

### Page-Specific Testing

**ROI Calculator:**
- [ ] All inputs accept valid values
- [ ] Sliders adjust smoothly
- [ ] Calculations execute correctly
- [ ] Results display properly
- [ ] Chart updates with new data
- [ ] Reset button clears form

**Integrations Page:**
- [ ] Category tabs filter correctly
- [ ] Animation timing correct (60ms delay per card)
- [ ] All 54 integration cards display
- [ ] Filter shows/hides correct cards
- [ ] Category descriptions update

**Privacy Hub:**
- [ ] Accordion items toggle correctly
- [ ] Only one accordion item active at a time
- [ ] Scroll animations trigger
- [ ] Shield animations play
- [ ] Document download links work

**About Page:**
- [ ] Experts Wall images load
- [ ] Grayscale → color hover effect works
- [ ] Timeline animates on scroll
- [ ] Team carousel auto-plays
- [ ] Counter animations trigger
- [ ] Trust badges display

### JavaScript Testing
- [ ] No console errors
- [ ] No console warnings (review and fix)
- [ ] Page-specific init functions execute
- [ ] Event listeners attach correctly
- [ ] Animations trigger on scroll
- [ ] Intersection Observer works

---

## 3. Accessibility Audit

**Goal:** Ensure WCAG 2.1 Level AA compliance.

**Process:** Follow [Accessibility Audit Process](../accessibility/accessibility-audit-process.md)

**Quick Checks:**
- [ ] Run axe DevTools (0 violations)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text on all images
- [ ] ARIA labels where needed
- [ ] Color contrast passes (4.5:1 for text)
- [ ] Heading hierarchy logical (h1 → h2 → h3)

---

## 4. Performance Testing

**Goal:** Ensure page loads quickly and performs well.

**Process:** Follow [Performance Audit Process](../performance/performance-audit-process.md)

**Quick Metrics:**
- [ ] Lighthouse Performance Score >90
- [ ] First Contentful Paint (FCP) <1.5s
- [ ] Largest Contentful Paint (LCP) <2.5s
- [ ] Cumulative Layout Shift (CLS) <0.1
- [ ] Time to Interactive (TTI) <3.5s
- [ ] Total Blocking Time (TBT) <200ms

**Performance Checks:**
- [ ] Images optimized (WebP + fallback)
- [ ] Lazy loading implemented
- [ ] CSS minified in production
- [ ] JavaScript minified in production
- [ ] No render-blocking resources
- [ ] Fonts load efficiently

---

## 5. Cross-Browser Testing

**Goal:** Ensure compatibility across major browsers.

### Desktop Browsers (Required)
- [ ] Chrome (latest) - 100% compatible
- [ ] Firefox (latest) - 100% compatible
- [ ] Safari (latest) - 100% compatible
- [ ] Edge (latest) - 100% compatible

### Mobile Browsers (Required)
- [ ] Safari iOS (iPhone) - Critical
- [ ] Chrome Android - Critical
- [ ] Samsung Internet - High priority

### Testing Matrix

| Feature | Chrome | Firefox | Safari | Edge | iOS Safari | Chrome Android |
|---------|--------|---------|--------|------|------------|----------------|
| Layout | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CSS Gradients | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| backdrop-filter | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| Intersection Observer | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ES6 Modules | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Known Issues:**
- Safari iOS: backdrop-filter may have performance issues
- Safari: -webkit- prefixes needed for gradients on text
- Firefox: Sometimes slower rendering of complex gradients

---

## 6. Regression Testing

**Goal:** Ensure existing pages still work after changes.

### When to Regression Test
- After updating shared components (nav, footer, buttons)
- After modifying base CSS (variables, typography, reset)
- After changing JavaScript modules
- Before major deployments
- After dependency updates

### Regression Test Scope

**Full Regression (All 18 Pages):**
- Before production deployment
- After major refactoring
- After dependency updates

**Partial Regression (Affected Pages):**
- After component updates (test pages using that component)
- After CSS variable changes (test pages using those variables)
- After specific bug fixes (test related pages)

### Regression Testing Process
1. Identify affected pages
2. Run visual testing on affected pages
3. Test interactive elements
4. Compare with baseline screenshots
5. Document any differences
6. Fix regressions or update baselines

---

## 7. Production Build Test

**Goal:** Verify site works correctly after minification and optimization.

**Process:** Follow [Production Build Guide](../deployment/production-build-guide.md)

### Build Testing Steps
1. **Run production build:**
   ```bash
   npm run build:prod
   ```

2. **Test minified output:**
   - Verify CSS minified correctly
   - Verify JavaScript minified correctly
   - Check for any console errors
   - Test ROI Calculator (formulas must still work)

3. **Serve production build:**
   ```bash
   cd _site && python3 -m http.server 8000
   ```

4. **Spot-check critical pages:**
   - Homepage
   - ROI Calculator (verify calculations work)
   - Privacy Hub (verify accordion works)
   - Integrations (verify filtering works)

5. **Test critical functionality:**
   - Navigation works
   - Forms submit
   - Animations play
   - No JavaScript errors

**Pass Criteria:**
- ✅ All pages load without errors
- ✅ All JavaScript functionality works
- ✅ CSS styles apply correctly
- ✅ No console errors or warnings
- ✅ File sizes reduced (minification worked)

---

## 8. Final Sign-Off Checklist

Before deployment, verify:

### Code Quality
- [ ] No console.log statements (except intentional)
- [ ] No TODO comments left
- [ ] Code follows project standards
- [ ] All files properly formatted

### Content
- [ ] All text reviewed (no typos)
- [ ] All links tested (no 404s)
- [ ] All images have alt text
- [ ] Copyright year correct
- [ ] Contact information accurate

### Technical
- [ ] All tests pass
- [ ] No accessibility violations
- [ ] Performance scores acceptable
- [ ] Cross-browser tested
- [ ] Production build tested
- [ ] No regressions found

### Documentation
- [ ] Session handoff created
- [ ] continuation-master-prompt.md updated
- [ ] CLAUDE.md updated if needed
- [ ] README.md updated if needed

---

## Issue Tracking

### Severity Levels

**P0 - Critical (Blocks Deployment)**
- Site doesn't load
- Core functionality broken (nav, forms, calculator)
- Accessibility violations that prevent use
- Security vulnerabilities
- Data loss bugs

**P1 - High (Fix Before Deploy)**
- Visual regressions on critical pages
- Interactive elements not working
- Mobile layout broken
- Performance degradation >20%
- SEO issues (missing meta tags, broken links)

**P2 - Medium (Fix Soon)**
- Minor visual issues
- Non-critical interactive elements not working
- Performance degradation 10-20%
- Accessibility improvements
- Browser compatibility issues (non-critical browsers)

**P3 - Low (Fix When Possible)**
- Visual polish
- Minor animation issues
- Performance optimization opportunities
- Nice-to-have features

### Issue Template

```markdown
## Issue: [Brief Description]

**Severity:** P0/P1/P2/P3
**Page:** [Page name or "All pages"]
**Breakpoint:** [e.g., 375px or "All"]
**Browser:** [e.g., Chrome, Safari iOS]

**Description:**
[Detailed description of the issue]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshot:**
[If applicable]

**Fix:**
[Description of fix applied]
```

---

## QA Tools & Resources

### Browser Testing
- **Chrome DevTools:** https://developer.chrome.com/docs/devtools/
- **Firefox DevTools:** https://firefox-dev.tools/
- **Safari Web Inspector:** https://webkit.org/web-inspector/

### Accessibility
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **WAVE:** https://wave.webaim.org/
- **Lighthouse:** Built into Chrome DevTools

### Performance
- **Lighthouse:** Built into Chrome DevTools
- **WebPageTest:** https://www.webpagetest.org/
- **Chrome User Experience Report:** https://developer.chrome.com/docs/crux/

### Cross-Browser
- **BrowserStack:** https://www.browserstack.com/ (if available)
- **LambdaTest:** https://www.lambdatest.com/ (if available)
- **Manual testing:** Use real devices when possible

---

## AI Agent Quick Start

### Running Complete QA
```bash
# 1. Start dev server
npx @11ty/eleventy --serve

# 2. Follow visual testing checklist
# docs/testing/visual-testing-checklist.md

# 3. Test functional elements
# Check all interactive elements on page

# 4. Run accessibility audit
# Use axe DevTools in browser

# 5. Run Lighthouse audit
# Chrome DevTools > Lighthouse > Run audit

# 6. Test production build
npm run build:prod
cd _site && python3 -m http.server 8000

# 7. Document any issues
# Create issue in format above

# 8. Fix issues and retest

# 9. Final sign-off
# Complete checklist above
```

### Quick QA (Minor Changes)
For small CSS/text changes:
1. Visual test at 768px and 375px
2. Test affected interactive elements
3. Quick accessibility check (keyboard nav, contrast)
4. Verify no console errors

---

## Related Documentation

- [Visual Testing Checklist](./visual-testing-checklist.md)
- [Accessibility Audit Process](../accessibility/accessibility-audit-process.md)
- [Performance Audit Process](../performance/performance-audit-process.md)
- [Production Build Guide](../deployment/production-build-guide.md)

---

**Last Updated:** Session 16 (December 2025)
