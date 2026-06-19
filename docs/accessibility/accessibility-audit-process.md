# Accessibility Audit Process

**Purpose:** Ensure WCAG 2.1 Level AA compliance across all pages and components.

**When to Use:** Before every deployment, after creating/updating pages, for regression testing.

---

## Quick Reference

**Target Standard:** WCAG 2.1 Level AA
**Primary Tool:** axe DevTools (Chrome/Firefox extension)
**Secondary Tools:** Lighthouse, WAVE, Keyboard testing
**Goal:** 0 violations, 0 critical issues

---

## Accessibility Audit Workflow

```
New Page/Update
    ↓
1. Automated Scan (axe DevTools)
    ↓
2. Manual Keyboard Testing
    ↓
3. Screen Reader Testing
    ↓
4. Color Contrast Validation
    ↓
5. Semantic HTML Review
    ↓
6. ARIA Implementation Check
    ↓
7. Form Accessibility Audit
    ↓
8. Focus Management Review
    ↓
9. Documentation & Sign-Off
    ↓
Accessibility Compliant
```

---

## 1. Automated Accessibility Scan

### Tool: axe DevTools

**Installation:**
- Chrome: https://chrome.google.com/webstore (search "axe DevTools")
- Firefox: https://addons.mozilla.org/firefox/ (search "axe DevTools")

**Running a Scan:**

1. Open page in browser
2. Open DevTools (F12 or Cmd+Option+I)
3. Navigate to "axe DevTools" tab
4. Click "Scan ALL of my page"
5. Review results

**Pass Criteria:**
- ✅ 0 violations (Critical, Serious)
- ⚠️ Review "Needs Review" items (may require manual testing)
- ℹ️ Document "Best Practices" items (optional improvements)

### Tool: Lighthouse

**Running Lighthouse:**

1. Open Chrome DevTools
2. Navigate to "Lighthouse" tab
3. Select "Accessibility" category
4. Click "Analyze page load"

**Pass Criteria:**
- ✅ Accessibility Score ≥95
- ✅ All audits passed or marked as "Not Applicable"

**Key Lighthouse Audits:**
- [ ] `[aria-*]` attributes are valid
- [ ] `[role]` values are valid
- [ ] `button`, `link`, and `menuitem` elements have accessible names
- [ ] Image elements have `[alt]` attributes
- [ ] Form elements have associated labels
- [ ] Heading elements appear in sequentially-descending order
- [ ] `<html>` element has a `[lang]` attribute
- [ ] Lists contain only `<li>` elements
- [ ] Background and foreground colors have sufficient contrast ratio

---

## 2. Manual Keyboard Testing

**Goal:** Ensure all interactive elements are keyboard accessible.

### Keyboard Navigation Checklist

**Basic Navigation:**
- [ ] `Tab` moves focus forward through all interactive elements
- [ ] `Shift+Tab` moves focus backward
- [ ] `Enter` activates buttons and links
- [ ] `Space` toggles checkboxes, activates buttons
- [ ] `Esc` closes modals, dropdowns, menus
- [ ] `Arrow keys` navigate menus, tabs, carousels

**Focus Indicators:**
- [ ] Focus outline visible on all interactive elements
- [ ] Focus outline has sufficient contrast (3:1 minimum)
- [ ] Focus outline not removed by CSS (`outline: none` only if custom alternative provided)
- [ ] Focus order is logical (follows visual layout)

**Skip Links:**
- [ ] "Skip to main content" link present (optional but recommended)
- [ ] Skip link functional and navigates to `<main>` landmark

**Keyboard Traps:**
- [ ] No focus traps (user can navigate out of all components)
- [ ] Modals trap focus within (user can't tab outside)
- [ ] Modals release focus when closed

### Component-Specific Keyboard Testing

**Navigation Menu:**
- [ ] Arrow keys navigate menu items
- [ ] `Enter` activates menu items
- [ ] `Esc` closes dropdown menus
- [ ] Submenu opens on `Enter` or `Arrow Right`
- [ ] Submenu closes on `Esc` or `Arrow Left`

**Accordions:**
- [ ] `Enter` or `Space` toggles accordion panels
- [ ] `Arrow Up/Down` navigates between headers (optional)
- [ ] Focus moves to opened panel content (optional)

**Tabs:**
- [ ] `Arrow Left/Right` navigate between tabs
- [ ] `Home/End` navigate to first/last tab
- [ ] `Tab` moves focus into tab panel content

**Modals/Dialogs:**
- [ ] Focus moves to modal when opened
- [ ] `Tab` cycles through modal elements only
- [ ] `Esc` closes modal
- [ ] Focus returns to trigger element when closed

**Carousels/Sliders:**
- [ ] `Arrow Left/Right` navigate slides
- [ ] Play/Pause button keyboard accessible
- [ ] Auto-play can be paused

---

## 3. Screen Reader Testing

**Goal:** Ensure content is understandable and navigable with assistive technology.

### Screen Reader Tools

**macOS:**
- **VoiceOver** (built-in): `Cmd+F5` to enable
- Guide: https://www.apple.com/voiceover/info/guide/

**Windows:**
- **NVDA** (free): https://www.nvaccess.org/download/
- **JAWS** (commercial): https://www.freedomscientific.com/products/software/jaws/

**Mobile:**
- **VoiceOver** (iOS): Settings → Accessibility → VoiceOver
- **TalkBack** (Android): Settings → Accessibility → TalkBack

### Screen Reader Testing Checklist

**Content Structure:**
- [ ] Page title announced correctly
- [ ] Headings announced with correct level (h1, h2, h3)
- [ ] Landmarks announced (header, nav, main, footer)
- [ ] Lists announced as lists with item count
- [ ] Tables announced with row/column structure

**Interactive Elements:**
- [ ] Buttons announced as "button"
- [ ] Links announced as "link"
- [ ] Form controls announced with labels and type
- [ ] Current state announced (expanded, collapsed, checked, selected)
- [ ] Error messages associated with form fields

**Images:**
- [ ] Decorative images ignored (`alt=""` or `role="presentation"`)
- [ ] Informative images have descriptive alt text
- [ ] Complex images have extended descriptions

**Custom Components:**
- [ ] ARIA roles announced correctly
- [ ] ARIA states communicated (aria-expanded, aria-selected)
- [ ] Live regions announce dynamic changes
- [ ] Custom controls have clear instructions

---

## 4. Color Contrast Validation

**Goal:** Ensure text is readable for users with low vision or color blindness.

### WCAG 2.1 Contrast Requirements

**Level AA (Required):**
- **Normal text** (< 24px): 4.5:1 minimum
- **Large text** (≥ 24px or ≥ 19px bold): 3:1 minimum
- **UI components and graphical objects**: 3:1 minimum

**Level AAA (Recommended):**
- **Normal text**: 7:1 minimum
- **Large text**: 4.5:1 minimum

### Contrast Testing Tools

**Browser Extensions:**
- **axe DevTools:** Includes automated contrast checking
- **WAVE:** Highlights contrast errors inline
- **Color Contrast Analyzer:** https://www.tpgi.com/color-contrast-checker/

**Manual Testing:**
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Coolors Contrast Checker:** https://coolors.co/contrast-checker

### Contrast Audit Checklist

**Text Elements:**
- [ ] Body text (16px, rgba(255,255,255,0.8) on navy): **Check ratio**
- [ ] Headings (various sizes, white on navy): **Check ratio**
- [ ] Button text (white on violet gradient): **Check ratio**
- [ ] Link text (violet on white): **Check ratio**
- [ ] Muted text (rgba(255,255,255,0.6) on navy): **Check ratio**
- [ ] Badge text (white on violet): **Check ratio**

**UI Components:**
- [ ] Form input borders: **3:1 minimum**
- [ ] Button borders: **3:1 minimum**
- [ ] Focus indicators: **3:1 minimum**
- [ ] Icons: **3:1 minimum**

**Common Issues in This Project:**
- `--light-muted` (rgba(255,255,255,0.6)) may fail on dark backgrounds
- Gradient text (`.serif-italic`) requires contrast check on all gradient stops
- Glassmorphism effects may create unpredictable contrast ratios

---

## 5. Semantic HTML Review

**Goal:** Use native HTML elements for better accessibility and SEO.

### Semantic HTML Checklist

**Document Structure:**
- [ ] One `<h1>` per page
- [ ] Headings in sequential order (h1 → h2 → h3, no skipping)
- [ ] Proper landmark elements (`<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`)
- [ ] `<section>` elements have headings or `aria-label`

**Interactive Elements:**
- [ ] Buttons for actions: `<button>` not `<div onclick>`
- [ ] Links for navigation: `<a href>` not `<span onclick>`
- [ ] Form controls: Native `<input>`, `<select>`, `<textarea>` (not custom)

**Content Elements:**
- [ ] Lists use `<ul>`, `<ol>`, `<li>` (not `<div>` with bullets)
- [ ] Tables use `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`
- [ ] Quotes use `<blockquote>` or `<q>`
- [ ] Code uses `<code>` or `<pre>`

**Common Anti-Patterns to Avoid:**
- ❌ `<div class="button">` → ✅ `<button>`
- ❌ `<span onclick="...">` → ✅ `<a href>` or `<button>`
- ❌ `<div class="heading">` → ✅ `<h2>` (or appropriate level)
- ❌ `<div><div>• Item</div></div>` → ✅ `<ul><li>Item</li></ul>`

---

## 6. ARIA Implementation Check

**Goal:** Use ARIA attributes correctly to enhance accessibility (not replace semantic HTML).

### ARIA Golden Rules

1. **No ARIA is better than bad ARIA**
2. **Always prefer native HTML elements**
3. **Don't change native semantics** (e.g., `<button role="heading">` is wrong)
4. **All interactive ARIA controls must be keyboard accessible**
5. **All interactive elements must have accessible names**

### Common ARIA Patterns in This Project

**Accordion (Privacy Hub):**
```html
<div class="accordion-item">
  <button class="accordion-header"
          aria-expanded="false"
          aria-controls="panel-1"
          id="header-1">
    Heading
  </button>
  <div class="accordion-content"
       id="panel-1"
       role="region"
       aria-labelledby="header-1">
    Content
  </div>
</div>
```

**Tabs:**
```html
<div class="tabs" role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">Tab 2</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">Content 1</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>Content 2</div>
```

**Navigation Dropdowns:**
```html
<button aria-expanded="false" aria-controls="menu-1" aria-haspopup="true">
  Product
</button>
<ul id="menu-1" role="menu" hidden>
  <li role="menuitem"><a href="#">Item 1</a></li>
  <li role="menuitem"><a href="#">Item 2</a></li>
</ul>
```

### ARIA Audit Checklist

**Required Attributes:**
- [ ] `role` attributes are valid ARIA roles
- [ ] `aria-label` or `aria-labelledby` on all interactive elements without visible labels
- [ ] `aria-describedby` for additional instructions/errors
- [ ] `aria-expanded` on all expandable elements (buttons, dropdowns)
- [ ] `aria-selected` on tabs
- [ ] `aria-checked` on checkboxes (if custom)
- [ ] `aria-live` on dynamic content regions

**Forbidden Patterns:**
- [ ] No redundant roles (e.g., `<button role="button">`)
- [ ] No conflicting roles (e.g., `<a role="button">`)
- [ ] No role on decorative elements (use `aria-hidden="true"` instead)
- [ ] No `tabindex` > 0 (breaks natural tab order)

---

## 7. Form Accessibility Audit

**Goal:** Ensure all forms are accessible, with clear labels, instructions, and error handling.

### Form Accessibility Checklist

**Labels:**
- [ ] All inputs have associated `<label>` elements
- [ ] Labels use `for` attribute matching input `id`
- [ ] Labels are visible (not placeholder-only)
- [ ] Labels clearly describe expected input

**Instructions:**
- [ ] Required fields marked with `required` attribute
- [ ] Required fields indicated visually (not color-only)
- [ ] Format requirements communicated (e.g., "MM/DD/YYYY")
- [ ] Instructions programmatically associated (`aria-describedby`)

**Error Handling:**
- [ ] Error messages clearly state what's wrong
- [ ] Errors programmatically associated with inputs (`aria-describedby`)
- [ ] Errors announced to screen readers (`aria-live` or focus management)
- [ ] Error state indicated visually (border, icon, text)
- [ ] Success state communicated to screen readers

**Keyboard & Focus:**
- [ ] All inputs keyboard accessible
- [ ] Tab order follows visual layout
- [ ] Focus moves to first error on submit
- [ ] Submit button keyboard accessible

**Example Accessible Form Field:**
```html
<div class="form-group">
  <label for="email">Email Address <span aria-label="required">*</span></label>
  <input type="email"
         id="email"
         name="email"
         required
         aria-describedby="email-hint email-error"
         aria-invalid="false">
  <span id="email-hint" class="hint">We'll never share your email</span>
  <span id="email-error" class="error" hidden>Please enter a valid email address</span>
</div>
```

---

## 8. Focus Management Review

**Goal:** Ensure focus is visible, logical, and managed correctly in dynamic UIs.

### Focus Visibility Checklist

**Visual Indicators:**
- [ ] Focus outline visible on all interactive elements
- [ ] Focus outline has 3:1 contrast ratio minimum
- [ ] Focus outline not obscured by other elements
- [ ] Focus outline thickness at least 2px (recommended)

**Custom Focus Styles:**
```css
/* Good: Custom focus style with sufficient contrast */
.btn:focus-visible {
    outline: 3px solid #a855f7;
    outline-offset: 2px;
}

/* Bad: Focus removed without replacement */
button:focus {
    outline: none; /* ❌ Never do this alone */
}
```

### Focus Order Checklist

**Tab Order:**
- [ ] Focus order matches visual layout (top to bottom, left to right)
- [ ] No `tabindex` values > 0 (breaks natural order)
- [ ] Hidden elements not in tab order (`display: none` or `visibility: hidden`)
- [ ] Off-screen elements removed from tab order (`tabindex="-1"` or hidden)

**Dynamic Content:**
- [ ] Focus moves to new content when revealed (modals, accordions)
- [ ] Focus returns to trigger when content dismissed
- [ ] Focus not lost when content updated (AJAX, SPA navigation)

### Focus Management Patterns

**Opening a Modal:**
```javascript
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const previousFocus = document.activeElement;

    modal.removeAttribute('hidden');
    modal.querySelector('button, [href], input').focus();

    modal.addEventListener('close', () => {
        modal.setAttribute('hidden', '');
        previousFocus.focus(); // Return focus
    }, { once: true });
}
```

**Accordion Expansion:**
```javascript
function toggleAccordion(button) {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);

    const panel = document.getElementById(button.getAttribute('aria-controls'));
    panel.hidden = expanded;

    // Optional: Move focus to panel content
    if (!expanded) {
        panel.querySelector('a, button, input, [tabindex="0"]')?.focus();
    }
}
```

---

## 9. Severity Classification

### P0 - Critical (Blocks Deployment)
**Impact:** Page unusable for assistive technology users

- Keyboard-only users cannot access core functionality (nav, forms, CTA)
- Screen reader users cannot understand page structure or content
- Severe color contrast failures (< 3:1 on critical text)
- Missing alt text on critical images
- Form cannot be submitted accessibly
- ARIA errors breaking assistive technology
- Auto-playing media without pause control

**Action:** Must fix before deployment

### P1 - High (Fix Before Deploy)
**Impact:** Significant accessibility barriers

- Some interactive elements not keyboard accessible
- Heading structure broken (skipped levels, multiple h1s)
- Missing form labels
- Insufficient color contrast on non-critical text (3:1 - 4.5:1)
- Missing ARIA states on interactive components
- Focus order illogical
- Missing landmarks (nav, main, footer)

**Action:** Fix before deployment unless blocking launch

### P2 - Medium (Fix Soon)
**Impact:** Minor accessibility issues

- Inconsistent focus indicators
- Missing skip links
- Non-critical images missing alt text
- Minor ARIA improvements (aria-describedby, aria-label)
- Redundant or incorrect ARIA attributes
- Tables without proper headers
- Language attribute missing on page

**Action:** Fix in next sprint or deployment cycle

### P3 - Low (Fix When Possible)
**Impact:** Accessibility enhancements, best practices

- Enhanced keyboard shortcuts (beyond Tab/Enter)
- Additional ARIA live regions
- Improved focus management (beyond requirements)
- AAA color contrast (7:1)
- Enhanced error messaging
- Additional descriptive text

**Action:** Backlog, nice-to-have improvements

---

## 10. Remediation Templates

### Issue Template

```markdown
## Accessibility Issue: [Brief Description]

**Severity:** P0/P1/P2/P3
**WCAG Criterion:** [e.g., 1.4.3 Contrast (Minimum)]
**Tool:** [axe DevTools, Lighthouse, Manual]
**Page(s):** [Page name(s)]
**Element:** [CSS selector or description]

**Issue Description:**
[What is wrong]

**User Impact:**
[How this affects users with disabilities]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Expected vs Actual behavior]

**Recommendation:**
[How to fix the issue]

**Code Example:**
```html
<!-- Before (incorrect) -->
<div onclick="submit()">Submit</div>

<!-- After (correct) -->
<button type="submit">Submit</button>
```

**Verification:**
- [ ] axe DevTools passes
- [ ] Lighthouse passes
- [ ] Keyboard accessible
- [ ] Screen reader announces correctly
```

---

## 11. Documentation & Sign-Off

### Accessibility Report Template

```markdown
# Accessibility Audit Report

**Date:** [Date]
**Auditor:** [Name/AI Agent]
**Pages Tested:** [List of pages]
**WCAG Version:** 2.1 Level AA

## Summary

- **Total Issues:** [Count]
- **P0 Critical:** [Count]
- **P1 High:** [Count]
- **P2 Medium:** [Count]
- **P3 Low:** [Count]

## Automated Testing

### axe DevTools Results
- **Violations:** [Count]
- **Needs Review:** [Count]
- **Passed:** [Count]

### Lighthouse Accessibility Score
- **Score:** [0-100]
- **Failed Audits:** [List]

## Manual Testing

### Keyboard Navigation
- **Status:** ✅ Pass / ❌ Fail
- **Issues:** [List issues or "None"]

### Screen Reader Testing
- **Tool:** [VoiceOver, NVDA, JAWS]
- **Status:** ✅ Pass / ❌ Fail
- **Issues:** [List issues or "None"]

### Color Contrast
- **Status:** ✅ Pass / ❌ Fail
- **Issues:** [List issues or "None"]

## Issues Found

[Use issue template for each issue]

## Recommendations

[High-level recommendations for improving accessibility]

## Sign-Off

- [ ] All P0 issues resolved
- [ ] All P1 issues resolved or documented
- [ ] axe DevTools: 0 violations
- [ ] Lighthouse: ≥95 score
- [ ] Keyboard navigation functional
- [ ] Screen reader accessible
- [ ] Color contrast compliant

**Ready for Deployment:** ✅ Yes / ❌ No (pending fixes)
```

---

## AI Agent Quick Start

### Running Complete Accessibility Audit

```bash
# 1. Start dev server
npx @11ty/eleventy --serve

# 2. Open page in Chrome
open http://localhost:8080/pages/[page-name]/

# 3. Open DevTools (Cmd+Option+I)
# Navigate to "axe DevTools" tab → Click "Scan ALL of my page"

# 4. Review violations and document

# 5. Run Lighthouse audit
# DevTools → Lighthouse → Accessibility → Analyze page load

# 6. Manual keyboard testing
# - Tab through all interactive elements
# - Verify focus indicators visible
# - Test all keyboard interactions (Enter, Space, Esc, Arrows)

# 7. Test with VoiceOver (macOS)
# Cmd+F5 to enable → Navigate with VO+Arrow keys

# 8. Document issues using issue template

# 9. Fix issues and re-audit

# 10. Sign off when all P0/P1 issues resolved
```

### Quick Accessibility Check (Minor Changes)

For small CSS/text changes:

1. Run axe DevTools scan (ensure 0 new violations)
2. Tab through affected interactive elements
3. Verify color contrast if colors changed
4. Verify keyboard accessibility if JS changed

---

## Tools & Resources

### Browser Extensions
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **WAVE:** https://wave.webaim.org/extension/
- **Color Contrast Analyzer:** https://www.tpgi.com/color-contrast-checker/
- **Accessibility Insights:** https://accessibilityinsights.io/

### Screen Readers
- **VoiceOver** (macOS): Built-in (Cmd+F5)
- **NVDA** (Windows): https://www.nvaccess.org/
- **JAWS** (Windows): https://www.freedomscientific.com/products/software/jaws/
- **TalkBack** (Android): Built-in
- **VoiceOver** (iOS): Built-in

### Testing Tools
- **Lighthouse:** Chrome DevTools (built-in)
- **Pa11y:** https://pa11y.org/ (command-line tool)
- **Axe-core:** https://github.com/dequelabs/axe-core (npm package)

### WCAG Resources
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM:** https://webaim.org/
- **A11y Project:** https://www.a11yproject.com/
- **MDN Accessibility:** https://developer.mozilla.org/en-US/docs/Web/Accessibility

---

## Related Documentation

- [Accessibility Standards](./accessibility-standards.md) - Component-level requirements
- [QA Process](../testing/qa-process.md) - Complete QA workflow
- [Visual Testing Checklist](../testing/visual-testing-checklist.md) - Visual testing

---

**Last Updated:** Session 16 (December 2025)
