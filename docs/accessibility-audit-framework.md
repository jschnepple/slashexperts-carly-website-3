# Accessibility Audit Framework & Guidelines

**Project:** SlashExperts Website Modernization
**Date:** December 9, 2025
**Standard:** WCAG 2.1 Level AA
**Author:** Claude AI Agent (Session 10)

---

## Executive Summary

This document establishes the accessibility testing framework and guidelines for the SlashExperts website. It outlines WCAG 2.1 Level AA compliance requirements, testing procedures, and remediation strategies.

### Compliance Target
- **Standard:** Web Content Accessibility Guidelines (WCAG) 2.1
- **Level:** AA (Target) with some AAA best practices
- **Tools:** axe DevTools, Lighthouse, WAVE, Manual Testing
- **Screen Readers:** VoiceOver (macOS), NVDA (Windows)

---

## WCAG 2.1 Principles (POUR)

### 1. Perceivable
Information and user interface components must be presentable to users in ways they can perceive.

### 2. Operable
User interface components and navigation must be operable.

### 3. Understandable
Information and the operation of user interface must be understandable.

### 4. Robust
Content must be robust enough to be interpreted reliably by assistive technologies.

---

## Automated Testing Checklist

### Tools to Use

**1. axe DevTools**
- Browser extension (Chrome/Firefox)
- Tests 57 accessibility rules
- Provides detailed remediation guidance

**2. Lighthouse**
- Built into Chrome DevTools
- Comprehensive accessibility score
- Tests 14 accessibility metrics

**3. WAVE (WebAIM)**
- Browser extension
- Visual feedback on page
- Identifies errors, alerts, and features

---

## Page-by-Page Automated Testing Protocol

### For Each of the 12 Pages:

**Step 1: Run axe DevTools**
```
1. Open page in browser
2. Open DevTools → axe DevTools tab
3. Click "Scan ALL of my page"
4. Document:
   - Critical issues (violations)
   - Needs review items
   - Passed items count
```

**Step 2: Run Lighthouse**
```
1. Open DevTools → Lighthouse tab
2. Select "Accessibility" category
3. Generate report
4. Document:
   - Accessibility score (0-100)
   - Failed audits
   - Manual checks needed
```

**Step 3: Run WAVE**
```
1. Click WAVE browser extension
2. Review:
   - Errors (red)
   - Alerts (yellow)
   - Features (green)
   - Structural elements
   - ARIA usage
```

---

## Common Accessibility Issues & Solutions

### 1. Images Without Alt Text ⚠️ WCAG 1.1.1 (Level A)

**Issue:** `<img>` tags missing `alt` attribute

**Example Violation:**
```html
<img src="/assets/images/expert-photo.jpg">
```

**Solution:**
```html
<!-- Meaningful images -->
<img src="/assets/images/expert-photo.jpg" alt="Sarah Johnson, VP of Sales at TechCorp">

<!-- Decorative images -->
<img src="/assets/images/decorative-bg.svg" alt="" role="presentation">
```

**Test:**
```javascript
// Check for missing alt attributes
document.querySelectorAll('img:not([alt])').length === 0
```

---

### 2. Insufficient Color Contrast ⚠️ WCAG 1.4.3 (Level AA)

**Requirements:**
- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18pt+):** Minimum 3:1 contrast ratio
- **UI components:** Minimum 3:1 contrast ratio

**Common Violations:**
```css
/* ❌ Insufficient contrast (2.8:1) */
.text-muted {
  color: #999; /* on white background */
}

/* ✅ Sufficient contrast (7.5:1) */
.text-muted {
  color: #666; /* on white background */
}
```

**Testing Tools:**
- Chrome DevTools → Color Picker (shows contrast ratio)
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

**Priority Areas to Check:**
- Navigation links
- Button text
- Form labels
- Muted/secondary text
- Placeholder text

---

### 3. Missing Form Labels ⚠️ WCAG 1.3.1, 3.3.2 (Level A)

**Issue:** Form inputs without associated labels

**Example Violation:**
```html
<input type="email" placeholder="Enter your email">
```

**Solution:**
```html
<!-- Explicit label -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" required>

<!-- Or with aria-label -->
<input type="email" aria-label="Email Address" required>
```

**Newsletter Form Example:**
```html
<form class="newsletter-form" role="search" aria-label="Newsletter signup">
  <label for="newsletter-email" class="visually-hidden">Email Address</label>
  <input
    type="email"
    id="newsletter-email"
    name="email"
    placeholder="Enter your email"
    aria-required="true"
    aria-describedby="newsletter-hint"
  >
  <span id="newsletter-hint" class="visually-hidden">
    Enter your email to subscribe to our newsletter
  </span>
  <button type="submit">Subscribe</button>
</form>
```

---

### 4. Missing Skip Navigation Link ⚠️ WCAG 2.4.1 (Level A)

**Purpose:** Allow keyboard users to skip repetitive navigation

**Implementation:**
```html
<!-- Add as first element in <body> -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- CSS -->
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--navy);
  color: var(--white);
  padding: 8px 16px;
  text-decoration: none;
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}

<!-- Add ID to main content -->
<main id="main-content" tabindex="-1">
  <!-- Page content -->
</main>
```

---

### 5. Insufficient Focus Indicators ⚠️ WCAG 2.4.7 (Level AA)

**Issue:** Focus states not visible or not sufficiently contrasted

**Example Violation:**
```css
/* ❌ No visible focus */
button:focus {
  outline: none;
}
```

**Solution:**
```css
/* ✅ Clear focus indicator */
button:focus-visible {
  outline: 2px solid var(--violet);
  outline-offset: 2px;
}

/* For links */
a:focus-visible {
  outline: 2px solid var(--violet);
  outline-offset: 4px;
  border-radius: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  button:focus-visible,
  a:focus-visible {
    outline-width: 3px;
  }
}
```

---

### 6. Improper Heading Hierarchy ⚠️ WCAG 1.3.1 (Level A)

**Issue:** Skipping heading levels or improper nesting

**Example Violation:**
```html
<h1>Page Title</h1>
<h3>Section Title</h3> <!-- ❌ Skipped h2 -->
```

**Solution:**
```html
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

<!-- If visual style doesn't match semantic level, use CSS -->
<h2 class="h3-style">Visually looks like h3, semantically h2</h2>
```

**Testing:**
```javascript
// Check heading levels
const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
const levels = headings.map(h => parseInt(h.tagName.substring(1)));
// Verify no level is skipped
```

---

### 7. Missing ARIA Labels for Interactive Elements ⚠️ WCAG 4.1.2 (Level A)

**Navigation Dropdown Example:**
```html
<div class="nav-item">
  <button
    class="nav-link"
    aria-expanded="false"
    aria-haspopup="true"
    aria-controls="product-menu"
  >
    Product
    <svg aria-hidden="true">...</svg>
  </button>
  <div class="nav-dropdown" id="product-menu" role="menu">
    <a href="#" role="menuitem">Expert Network</a>
    <a href="#" role="menuitem">Smart Matching</a>
  </div>
</div>
```

**Icon Button Example:**
```html
<!-- ❌ No accessible name -->
<button>
  <svg>...</svg>
</button>

<!-- ✅ With aria-label -->
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>
```

---

### 8. Insufficient Touch Target Size ⚠️ WCAG 2.5.5 (Level AAA - Best Practice)

**Requirement:** Minimum 44x44 CSS pixels for touch targets

**Example Violation:**
```css
/* ❌ Too small */
.nav-link {
  padding: 4px 8px; /* Results in ~30px tall target */
}
```

**Solution:**
```css
/* ✅ Sufficient size */
.nav-link {
  padding: 12px 16px; /* Results in ~48px tall target */
  min-height: 44px;
}

/* For icon buttons */
.icon-button {
  min-width: 44px;
  min-height: 44px;
  padding: 10px;
}
```

---

## Manual Keyboard Navigation Testing

### Testing Protocol

**Test All Interactive Elements:**

1. **Tab Key Navigation**
   ```
   - Press Tab to navigate forward
   - Press Shift+Tab to navigate backward
   - Verify logical tab order (left-to-right, top-to-bottom)
   - Ensure all interactive elements focusable
   - No keyboard traps (can Tab out of everything)
   ```

2. **Enter/Space Activation**
   ```
   - Enter key activates links and buttons
   - Space key activates buttons and checkboxes
   - Arrow keys navigate within dropdowns/carousels
   ```

3. **Escape Key Behavior**
   ```
   - Esc closes modals and dropdowns
   - Returns focus to trigger element
   ```

---

### Page-Specific Keyboard Testing Checklist

#### Homepage
- [ ] Tab through navigation dropdowns
- [ ] Tab through CTA buttons
- [ ] Tab through testimonial carousel controls
- [ ] Verify floating cards don't trap focus
- [ ] Test metric counter interactions

#### Pricing Page
- [ ] Tab through pricing tier cards
- [ ] Tab through calculator inputs
- [ ] Toggle switches accessible via keyboard
- [ ] Monthly/Annual toggle works with Space key

#### Forms (Newsletter, Contact, Expert Signup)
- [ ] Tab through all form fields
- [ ] Enter submits form
- [ ] Error messages announced
- [ ] Success messages announced

---

## Screen Reader Testing

### VoiceOver (macOS) Testing Commands

**Basic Navigation:**
- `Cmd + F5` - Turn VoiceOver on/off
- `Ctrl` - Stop speaking
- `Ctrl + Option + →` - Next item
- `Ctrl + Option + ←` - Previous item
- `Ctrl + Option + Space` - Activate item

**Rotor Navigation:**
- `Ctrl + Option + U` - Open rotor
- `← →` - Change rotor category
- `↑ ↓` - Navigate within category

**Test Cases:**

1. **Navigate by Headings**
   ```
   - Use rotor to list all headings
   - Verify heading hierarchy makes sense
   - Verify no important sections missing heading
   ```

2. **Navigate by Links**
   ```
   - Use rotor to list all links
   - Verify link text is descriptive
   - Avoid "click here" or "read more" without context
   ```

3. **Navigate by Forms**
   ```
   - Use rotor to list form controls
   - Verify all inputs have labels
   - Verify required fields announced
   - Verify error messages associated with inputs
   ```

4. **Navigate by Landmarks**
   ```
   - Verify proper landmark regions (header, nav, main, footer)
   - Verify regions have accessible names if multiple of same type
   ```

---

### NVDA (Windows) Testing Commands

**Basic Navigation:**
- `Ctrl + Alt + N` - Start NVDA
- `Insert + Q` - Quit NVDA
- `Insert + ↓` - Say all (read entire page)
- `H` - Next heading
- `K` - Next link
- `F` - Next form field
- `B` - Next button

---

## Accessibility Testing Results Template

### Per-Page Results Document

```markdown
## [Page Name] Accessibility Audit

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Tools Used:** axe DevTools, Lighthouse, WAVE, VoiceOver

### Automated Testing Results

**axe DevTools:**
- Violations: [count]
- Needs Review: [count]
- Passed: [count]

**Lighthouse:**
- Accessibility Score: [0-100]
- Failed Audits: [count]

**WAVE:**
- Errors: [count]
- Alerts: [count]
- Features: [count]

### Issues Found

#### Critical (WCAG Level A)
1. [Issue description]
   - **WCAG Criterion:** [number]
   - **Location:** [CSS selector or description]
   - **Remediation:** [How to fix]

#### Serious (WCAG Level AA)
1. [Issue description]
   - **WCAG Criterion:** [number]
   - **Location:** [CSS selector or description]
   - **Remediation:** [How to fix]

#### Moderate (Best Practices)
1. [Issue description]
   - **Recommendation:** [How to improve]

### Manual Testing Results

**Keyboard Navigation:**
- ✅ All interactive elements focusable
- ✅ Logical tab order
- ✅ No keyboard traps
- ⚠️ [Any issues found]

**Screen Reader:**
- ✅ Proper heading hierarchy
- ✅ Descriptive link text
- ✅ Form labels present
- ⚠️ [Any issues found]

### Overall Assessment
[Summary of page accessibility]

### Recommended Fixes (Priority Order)
1. [High priority fix]
2. [Medium priority fix]
3. [Low priority fix]
```

---

## Remediation Priority Matrix

| Severity | WCAG Level | User Impact | Priority | Timeline |
|----------|------------|-------------|----------|----------|
| Critical | A | High | 🔴 P0 | Fix immediately |
| Serious | AA | High | 🔴 P1 | Fix within 1 week |
| Serious | AA | Medium | 🟡 P2 | Fix within 2 weeks |
| Moderate | AAA | Medium | 🟢 P3 | Fix when possible |
| Minor | Best Practice | Low | 🔵 P4 | Nice to have |

---

## Accessibility Statement Template

**For inclusion on website:**

```html
<div class="accessibility-statement">
  <h2>Accessibility Statement</h2>
  <p><strong>SlashExperts</strong> is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>

  <h3>Conformance Status</h3>
  <p>The <a href="https://www.w3.org/WAI/WCAG21/quickref/">Web Content Accessibility Guidelines (WCAG)</a> defines requirements for designers and developers to improve accessibility for people with disabilities. We aim to conform to WCAG 2.1 Level AA.</p>

  <h3>Feedback</h3>
  <p>We welcome your feedback on the accessibility of this site. Please contact us:</p>
  <ul>
    <li>Email: <a href="mailto:accessibility@slashexperts.com">accessibility@slashexperts.com</a></li>
  </ul>

  <h3>Technical Specifications</h3>
  <p>Accessibility of this site relies on the following technologies:</p>
  <ul>
    <li>HTML</li>
    <li>WAI-ARIA</li>
    <li>CSS</li>
    <li>JavaScript</li>
  </ul>

  <p><strong>Last Updated:</strong> December 9, 2025</p>
</div>
```

---

## Next Steps

### Session 11: Full Accessibility Audit
1. Run automated tests on all 12 pages
2. Document all violations
3. Create remediation plan
4. Fix high-priority issues

### Session 12: Remediation & Verification
1. Implement fixes from audit
2. Re-test all pages
3. Manual keyboard and screen reader testing
4. Publish accessibility statement

---

**Document Status:** ✅ Complete - Testing Framework Established
**Next Action:** Conduct full accessibility audit in Session 11
**Compliance Target:** WCAG 2.1 Level AA
**Testing Tools Ready:** axe DevTools, Lighthouse, WAVE, VoiceOver/NVDA
