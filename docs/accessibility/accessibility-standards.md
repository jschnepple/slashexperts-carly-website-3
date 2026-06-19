# Accessibility Standards

**Purpose:** Component-level accessibility requirements and implementation patterns for SlashExperts website.

**Target:** WCAG 2.1 Level AA compliance for all components and pages.

---

## Quick Reference

**Standard:** WCAG 2.1 Level AA
**Color Contrast:** 4.5:1 (normal text), 3:1 (large text, UI components)
**Keyboard:** All interactive elements must be keyboard accessible
**Screen Readers:** All content must be programmatically determinable

---

## Component Standards

### 1. Navigation

#### Requirements

**Keyboard Navigation:**
- `Tab` - Move between nav links
- `Enter` - Activate link/button
- `Arrow Down/Up` - Navigate dropdown menu items (when open)
- `Esc` - Close dropdown menus
- `Shift+Tab` - Navigate backwards

**ARIA Attributes:**
```html
<nav role="navigation" aria-label="Main navigation">
  <button aria-expanded="false"
          aria-controls="product-menu"
          aria-haspopup="true"
          id="product-trigger">
    Product
  </button>
  <ul id="product-menu" role="menu" hidden>
    <li role="none">
      <a href="#" role="menuitem">Expert Network</a>
    </li>
  </ul>
</nav>
```

**Focus Management:**
- Focus indicator visible on all nav items (3px solid outline)
- Focus trapped in dropdown when open
- Focus returns to trigger when dropdown closes
- Skip link to main content (optional)

**Color Contrast:**
- Nav links (white on navy): ≥ 4.5:1 ✅
- CTA button (white on violet): ≥ 4.5:1 ✅
- Dropdown items (navy on white): ≥ 4.5:1 ✅

**Screen Reader:**
- Navigation labeled with `aria-label="Main navigation"`
- Dropdown state announced (`aria-expanded`)
- Current page marked with `aria-current="page"`

#### Implementation Checklist

- [ ] All links keyboard accessible
- [ ] Dropdowns open/close with Enter/Esc
- [ ] `aria-expanded` toggles correctly
- [ ] Focus visible on all items
- [ ] Screen reader announces nav structure
- [ ] Mobile menu accessible (burger button has label)

---

### 2. Buttons

#### Requirements

**Keyboard Navigation:**
- `Tab` - Focus button
- `Enter` or `Space` - Activate button
- `Shift+Tab` - Navigate backwards

**Semantic HTML:**
```html
<!-- ✅ Correct: Use <button> for actions -->
<button class="btn btn-primary">Book a Demo</button>

<!-- ✅ Correct: Use <a> for navigation -->
<a href="/pricing" class="btn btn-outline">View Pricing</a>

<!-- ❌ Incorrect: Don't use <div> for buttons -->
<div class="btn" onclick="submit()">Submit</div>
```

**ARIA Requirements:**
- Buttons must have accessible names (visible text or `aria-label`)
- Icon-only buttons require `aria-label`
- Loading state should use `aria-busy="true"`
- Disabled state should use `disabled` attribute (not `aria-disabled` alone)

**Color Contrast:**
- Primary button (white on violet): ≥ 4.5:1 ✅
- Outline button (navy on transparent): ≥ 3:1 border ✅
- Ghost button (white on transparent): ≥ 4.5:1 ✅
- Focus indicator: ≥ 3:1 ✅

**Focus States:**
```css
.btn:focus-visible {
    outline: 3px solid #a855f7;
    outline-offset: 2px;
}
```

#### Implementation Checklist

- [ ] Use `<button>` for actions, `<a>` for navigation
- [ ] All buttons keyboard accessible (Tab, Enter, Space)
- [ ] Focus indicator visible (3px outline)
- [ ] Icon-only buttons have `aria-label`
- [ ] Color contrast ≥ 4.5:1 (text), ≥ 3:1 (border/UI)
- [ ] Disabled state communicated (`disabled` attribute)

---

### 3. Forms

#### Requirements

**Labels:**
```html
<!-- ✅ Correct: Every input has a label -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" required>

<!-- ❌ Incorrect: Placeholder is not a label -->
<input type="email" placeholder="Email Address">
```

**Required Fields:**
```html
<label for="name">
  Full Name
  <span aria-label="required">*</span>
</label>
<input type="text" id="name" required aria-required="true">
```

**Instructions:**
```html
<label for="password">Password</label>
<input type="password"
       id="password"
       aria-describedby="password-hint">
<span id="password-hint">Must be at least 8 characters</span>
```

**Error Handling:**
```html
<label for="email">Email Address</label>
<input type="email"
       id="email"
       aria-invalid="true"
       aria-describedby="email-error">
<span id="email-error" role="alert">
  Please enter a valid email address
</span>
```

**Keyboard Navigation:**
- `Tab` - Move between form fields
- `Shift+Tab` - Navigate backwards
- `Enter` - Submit form (when on submit button)
- `Space` - Toggle checkboxes/radio buttons

**Color Contrast:**
- Input text (navy on white): ≥ 4.5:1 ✅
- Placeholder text: ≥ 4.5:1 (current: rgba(0,0,0,0.4) may fail)
- Error text (red): ≥ 4.5:1, not color-only
- Border: ≥ 3:1 ✅

#### Implementation Checklist

- [ ] All inputs have associated `<label>` elements
- [ ] Labels use `for` attribute matching input `id`
- [ ] Required fields marked with `required` and visual indicator
- [ ] Instructions associated with `aria-describedby`
- [ ] Errors associated with `aria-describedby`
- [ ] `aria-invalid` set when validation fails
- [ ] Error messages use `role="alert"` for screen readers
- [ ] Form submittable via Enter key
- [ ] Focus moves to first error on failed submit

---

### 4. Accordions (Privacy Hub)

#### Requirements

**ARIA Pattern:**
```html
<div class="accordion-item">
  <button class="accordion-header"
          aria-expanded="false"
          aria-controls="panel-1"
          id="header-1">
    Data Collection & Usage
  </button>
  <div class="accordion-content"
       id="panel-1"
       role="region"
       aria-labelledby="header-1"
       hidden>
    <p>Content goes here...</p>
  </div>
</div>
```

**Keyboard Navigation:**
- `Tab` - Move between accordion headers
- `Enter` or `Space` - Toggle panel open/closed
- `Arrow Down/Up` - Navigate between headers (optional)
- `Home/End` - First/last header (optional)

**JavaScript Behavior:**
```javascript
function toggleAccordion(button) {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    const panelId = button.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);

    // Toggle state
    button.setAttribute('aria-expanded', !expanded);
    panel.hidden = expanded;

    // Single-active pattern (optional)
    if (!expanded) {
        document.querySelectorAll('.accordion-item').forEach(item => {
            const otherButton = item.querySelector('.accordion-header');
            const otherPanel = document.getElementById(
                otherButton.getAttribute('aria-controls')
            );
            if (otherButton !== button) {
                otherButton.setAttribute('aria-expanded', 'false');
                otherPanel.hidden = true;
            }
        });
    }
}
```

**Focus Management:**
- Focus remains on accordion header after toggle
- Focus indicator visible on headers (3px outline)
- No focus trap (user can tab out)

**Screen Reader:**
- Header announced as "button"
- State announced ("expanded" or "collapsed")
- Panel labeled by header (`aria-labelledby`)

#### Implementation Checklist

- [ ] Headers use `<button>` element
- [ ] `aria-expanded` toggles on open/close
- [ ] `aria-controls` points to panel `id`
- [ ] Panel uses `role="region"` and `aria-labelledby`
- [ ] Keyboard accessible (Tab, Enter, Space)
- [ ] Focus indicator visible
- [ ] Screen reader announces state correctly

---

### 5. Tabs (Integrations Page)

#### Requirements

**ARIA Pattern:**
```html
<div class="tabs">
  <div role="tablist" aria-label="Integration Categories">
    <button role="tab"
            aria-selected="true"
            aria-controls="panel-all"
            id="tab-all"
            tabindex="0">
      All Integrations
    </button>
    <button role="tab"
            aria-selected="false"
            aria-controls="panel-crm"
            id="tab-crm"
            tabindex="-1">
      CRM
    </button>
  </div>
  <div role="tabpanel"
       id="panel-all"
       aria-labelledby="tab-all">
    <!-- Content -->
  </div>
  <div role="tabpanel"
       id="panel-crm"
       aria-labelledby="tab-crm"
       hidden>
    <!-- Content -->
  </div>
</div>
```

**Keyboard Navigation:**
- `Tab` - Focus into tablist, then out to panel content
- `Arrow Left/Right` - Navigate between tabs
- `Home` - First tab
- `End` - Last tab
- `Enter` or `Space` - Activate focused tab (optional, automatic on focus)

**JavaScript Behavior:**
```javascript
function switchTab(newTab) {
    const tablist = newTab.closest('[role="tablist"]');
    const tabs = tablist.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');

    // Deactivate all tabs
    tabs.forEach(tab => {
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
    });

    // Hide all panels
    panels.forEach(panel => panel.hidden = true);

    // Activate selected tab
    newTab.setAttribute('aria-selected', 'true');
    newTab.setAttribute('tabindex', '0');
    newTab.focus();

    // Show associated panel
    const panelId = newTab.getAttribute('aria-controls');
    document.getElementById(panelId).hidden = false;
}
```

**Focus Management:**
- Only active tab in tab order (`tabindex="0"`)
- Inactive tabs removed from tab order (`tabindex="-1"`)
- Arrow keys move focus and activate tabs
- Focus visible on active tab

**Screen Reader:**
- Tablist labeled with `aria-label`
- Selected tab announced ("selected")
- Panel labeled by tab (`aria-labelledby`)

#### Implementation Checklist

- [ ] Tablist uses `role="tablist"` with `aria-label`
- [ ] Tabs use `role="tab"` with `aria-selected`
- [ ] Panels use `role="tabpanel"` with `aria-labelledby`
- [ ] Only active tab has `tabindex="0"`
- [ ] Arrow keys navigate between tabs
- [ ] Active panel visible, others hidden
- [ ] Focus indicator visible on tabs
- [ ] Screen reader announces tab selection

---

### 6. Modals/Dialogs

#### Requirements

**ARIA Pattern:**
```html
<div role="dialog"
     aria-modal="true"
     aria-labelledby="modal-title"
     aria-describedby="modal-description"
     hidden>
  <h2 id="modal-title">Confirm Action</h2>
  <p id="modal-description">Are you sure you want to proceed?</p>
  <button>Cancel</button>
  <button>Confirm</button>
</div>
```

**Keyboard Navigation:**
- `Tab` - Cycle through modal elements only (focus trapped)
- `Shift+Tab` - Navigate backwards within modal
- `Esc` - Close modal
- `Enter` - Activate focused button

**JavaScript Behavior:**
```javascript
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const previousFocus = document.activeElement;

    // Show modal
    modal.removeAttribute('hidden');

    // Focus first focusable element
    const firstFocusable = modal.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    // Trap focus
    trapFocus(modal);

    // Close handlers
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal(modal, previousFocus);
    });
}

function closeModal(modal, returnFocus) {
    modal.setAttribute('hidden', '');
    returnFocus?.focus(); // Return focus to trigger
}

function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}
```

**Focus Management:**
- Focus moves to modal when opened
- Focus trapped within modal (can't tab outside)
- Focus returns to trigger element when closed
- Esc key closes modal

**Screen Reader:**
- Modal announced as "dialog"
- `aria-modal="true"` indicates modal context
- Modal labeled by title (`aria-labelledby`)
- Modal described by content (`aria-describedby`)

**Overlay:**
- Background inert (not interactive)
- Overlay click closes modal (optional)
- Background content not announced by screen readers (`aria-hidden="true"` on `<body>` children)

#### Implementation Checklist

- [ ] Modal uses `role="dialog"` and `aria-modal="true"`
- [ ] Modal labeled with `aria-labelledby` and `aria-describedby`
- [ ] Focus moves to modal when opened
- [ ] Focus trapped within modal (Tab cycles inside)
- [ ] Esc key closes modal
- [ ] Focus returns to trigger when closed
- [ ] Background content inert (`aria-hidden` on siblings)
- [ ] Close button keyboard accessible

---

### 7. Carousels/Sliders

#### Requirements

**ARIA Pattern:**
```html
<div class="carousel" role="region" aria-label="Testimonials">
  <div class="carousel-inner" aria-live="polite">
    <div class="carousel-item" aria-label="Slide 1 of 3">
      <!-- Content -->
    </div>
  </div>
  <button aria-label="Previous slide">‹</button>
  <button aria-label="Next slide">›</button>
  <button aria-label="Pause carousel">⏸</button>
</div>
```

**Keyboard Navigation:**
- `Tab` - Focus into carousel controls
- `Enter` or `Space` - Activate button (prev/next/pause)
- `Arrow Left/Right` - Navigate slides (optional)

**Auto-play Controls:**
- Auto-play must be pausable
- Pause button always visible or appears on focus
- Auto-play pauses on hover/focus
- No auto-play > 5 seconds without pause control

**Focus Management:**
- Focus on carousel region when navigating
- Focus indicator visible on control buttons
- Focus does not move when slide changes automatically

**Screen Reader:**
- Carousel labeled with `aria-label` or `aria-labelledby`
- Slide changes announced (`aria-live="polite"`)
- Current slide indicated ("Slide 2 of 5")
- Control buttons labeled (`aria-label`)

#### Implementation Checklist

- [ ] Carousel uses `role="region"` with `aria-label`
- [ ] Auto-play is pausable
- [ ] Pause button labeled ("Pause carousel")
- [ ] Previous/Next buttons labeled
- [ ] Slide changes announced (`aria-live="polite"`)
- [ ] Current slide indicated (e.g., "2 of 5")
- [ ] Keyboard accessible (Tab, Enter, optional Arrows)
- [ ] Focus indicator visible on controls

---

### 8. Images

#### Requirements

**Decorative Images:**
```html
<!-- Decorative: Hide from screen readers -->
<img src="gradient-blob.png" alt="" role="presentation">

<!-- Or use CSS background-image for decorative graphics -->
<div style="background-image: url(gradient-blob.png)"></div>
```

**Informative Images:**
```html
<!-- Informative: Provide descriptive alt text -->
<img src="expert-profile.jpg" alt="Sarah Chen, CRM Integration Expert">
```

**Complex Images (Charts, Diagrams):**
```html
<!-- Complex: Provide extended description -->
<figure>
  <img src="roi-chart.png"
       alt="ROI Calculator Results"
       aria-describedby="chart-description">
  <figcaption id="chart-description">
    Bar chart showing projected ROI over 12 months.
    Month 1: $5,000, Month 6: $25,000, Month 12: $50,000.
  </figcaption>
</figure>
```

**Icons:**
```html
<!-- Icon with adjacent text: Hide icon from screen readers -->
<button>
  <svg aria-hidden="true" focusable="false">...</svg>
  Book a Demo
</button>

<!-- Icon-only: Label the button -->
<button aria-label="Close menu">
  <svg aria-hidden="true" focusable="false">
    <path d="..."/> <!-- X icon -->
  </svg>
</button>
```

**Alt Text Guidelines:**
- Describe the image content and function, not "image of..."
- Keep alt text concise (< 150 characters)
- Don't include "image" or "graphic" (screen readers announce this)
- For logos: Use company name ("SlashExperts")
- For decorative images: Use empty alt (`alt=""`)

#### Implementation Checklist

- [ ] All `<img>` elements have `alt` attribute
- [ ] Decorative images have `alt=""` or `role="presentation"`
- [ ] Informative images have descriptive alt text
- [ ] Complex images have extended descriptions (`aria-describedby`)
- [ ] Icons hidden from screen readers (`aria-hidden="true"`)
- [ ] Icon-only buttons have `aria-label`
- [ ] SVGs use `focusable="false"` to prevent tab stops

---

### 9. Links

#### Requirements

**Semantic Links:**
```html
<!-- ✅ Correct: Links for navigation -->
<a href="/pricing">View Pricing</a>

<!-- ❌ Incorrect: Don't use links for actions -->
<a href="#" onclick="openModal()">Open</a>
<!-- Use <button> instead -->
<button onclick="openModal()">Open</button>
```

**Descriptive Link Text:**
```html
<!-- ✅ Correct: Descriptive link text -->
<a href="/blog/roi-calculator">Learn how to calculate your ROI</a>

<!-- ❌ Incorrect: Generic link text -->
<a href="/blog/roi-calculator">Click here</a>
<a href="/blog/roi-calculator">Read more</a>
```

**External Links:**
```html
<!-- External link: Indicate it opens in new window -->
<a href="https://example.com"
   target="_blank"
   rel="noopener noreferrer">
  Example
  <span class="sr-only">(opens in new window)</span>
</a>
```

**Skip Links:**
```html
<!-- Skip to main content (first focusable element) -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<main id="main-content">
  <!-- Page content -->
</main>
```

**Color Contrast:**
- Link text (violet on white): ≥ 4.5:1 ✅
- Link text (white on navy): ≥ 4.5:1 ✅
- Underline or other non-color indicator required

**Focus States:**
```css
a:focus-visible {
    outline: 3px solid #a855f7;
    outline-offset: 2px;
}
```

#### Implementation Checklist

- [ ] Links use `<a href>` (not `<div onclick>`)
- [ ] Link text is descriptive (not "click here")
- [ ] External links indicate new window
- [ ] Links distinguishable without color (underline, icon)
- [ ] Color contrast ≥ 4.5:1
- [ ] Focus indicator visible (3px outline)
- [ ] Skip link present (recommended)

---

### 10. Headings

#### Requirements

**Heading Hierarchy:**
```html
<!-- ✅ Correct: Sequential heading levels -->
<h1>About SlashExperts</h1>
<h2>Our Mission</h2>
<h3>Vision Statement</h3>
<h3>Core Values</h3>
<h2>Our Team</h2>

<!-- ❌ Incorrect: Skipped heading levels -->
<h1>About SlashExperts</h1>
<h3>Our Mission</h3> <!-- Skipped h2 -->
```

**Heading Rules:**
- One `<h1>` per page (page title)
- Headings in sequential order (h1 → h2 → h3)
- Don't skip heading levels
- Don't use headings for styling (use CSS classes)
- All sections should have headings (or `aria-label`)

**Screen Reader Navigation:**
- Screen reader users navigate by headings
- Headings provide document outline/structure
- Heading level indicates hierarchy (h2 is subsection of h1)

**Visual vs. Semantic:**
```html
<!-- ✅ Correct: Visual styling separate from semantic level -->
<h2 class="text-large">Large Text</h2>

<!-- ❌ Incorrect: Don't choose heading level for size -->
<h4>This looks the right size</h4> <!-- But should be h2 -->
```

#### Implementation Checklist

- [ ] One `<h1>` per page
- [ ] Headings in sequential order (no skipped levels)
- [ ] All sections have headings or `aria-label`
- [ ] Headings describe content (not styled for size)
- [ ] Heading hierarchy logical

---

## Color Contrast Standards

### WCAG 2.1 Level AA Requirements

**Normal Text (< 24px or < 19px bold):**
- Minimum contrast ratio: **4.5:1**
- Large text: ≥ 24px or ≥ 19px bold

**Large Text (≥ 24px or ≥ 19px bold):**
- Minimum contrast ratio: **3:1**

**UI Components (borders, icons, focus indicators):**
- Minimum contrast ratio: **3:1**

**Graphical Objects (charts, diagrams, meaningful graphics):**
- Minimum contrast ratio: **3:1**

### Color Palette Contrast Audit

**Text Combinations:**

| Text Color | Background | Use Case | Ratio | Pass AA |
|------------|------------|----------|-------|---------|
| `--white` | `--navy` | Body text on dark | 15.3:1 | ✅ |
| `--navy` | `--white` | Body text on light | 15.3:1 | ✅ |
| `rgba(255,255,255,0.8)` | `--navy` | Muted text on dark | 12.2:1 | ✅ |
| `rgba(255,255,255,0.6)` | `--navy` | Light muted on dark | 9.1:1 | ✅ |
| `--violet` (#8167ea) | `--white` | Links on light | 4.7:1 | ✅ |
| `--violet` (#8167ea) | `--navy` | Accent on dark | 3.3:1 | ⚠️ (Large text only) |

**UI Components:**

| Element | Colors | Ratio | Pass |
|---------|--------|-------|------|
| Button border | Violet on white | 4.7:1 | ✅ |
| Focus outline | Violet on navy | 3.3:1 | ✅ |
| Form input border | Navy on white | 15.3:1 | ✅ |
| Divider lines | rgba(255,255,255,0.1) on navy | 1.1:1 | ❌ (Decorative only) |

**Gradient Text (`.serif-italic`):**
- Check contrast at all gradient stops
- Ensure minimum 4.5:1 at darkest color
- Current gradient: `#a78bfa → #c084fc → #e879f9 → #f472b6 → #fb923c`
  - Lightest (#fb923c on navy): ~5.2:1 ✅
  - Darkest (#a78bfa on navy): ~3.1:1 ⚠️ (Large text only)

### Non-Color Indicators

**Links:**
- Underline or icon required (not color-only)
- 3:1 contrast between link and surrounding text (if no underline)

**Form Errors:**
- Icon + text + border color (not color-only)
- `aria-invalid` for screen readers

**Required Fields:**
- Asterisk + "required" label (not color-only)
- `required` attribute for screen readers

---

## Keyboard Navigation Patterns

### Standard Keyboard Shortcuts

**Global Navigation:**
- `Tab` - Move focus forward
- `Shift+Tab` - Move focus backward
- `Enter` - Activate link or button
- `Space` - Activate button, toggle checkbox
- `Esc` - Close modal, menu, or cancel action

**Component-Specific:**
- **Dropdown menus:** `Arrow Up/Down`, `Esc`
- **Tabs:** `Arrow Left/Right`, `Home/End`
- **Accordions:** `Enter/Space` to toggle
- **Carousels:** `Arrow Left/Right` (optional)
- **Modals:** `Esc` to close

### Focus Order

**Visual Tab Order:**
1. Skip link (if present)
2. Logo/Home link
3. Main navigation
4. Search (if present)
5. Main content
6. Sidebar (if present)
7. Footer

**Focus Management Rules:**
- Focus order matches visual layout (left to right, top to bottom)
- Hidden elements removed from tab order (`display: none`, `visibility: hidden`, or `tabindex="-1"`)
- No `tabindex` > 0 (breaks natural order)
- Focus visible at all times (3px outline minimum)

---

## Screen Reader Testing Guidelines

### Testing Process

1. **Enable Screen Reader:**
   - macOS: VoiceOver (`Cmd+F5`)
   - Windows: NVDA (free) or JAWS
   - Mobile: VoiceOver (iOS), TalkBack (Android)

2. **Navigate Page:**
   - Use heading navigation (`H` key in NVDA/JAWS)
   - Use landmark navigation (`D` key for landmarks)
   - Tab through interactive elements
   - Read full page content (`Down Arrow` in NVDA/JAWS)

3. **Test Components:**
   - Forms: Verify labels announced
   - Buttons: Verify action announced
   - Links: Verify link destination clear
   - Images: Verify alt text describes content
   - Accordions/Tabs: Verify state changes announced

### What Screen Readers Should Announce

**Page Load:**
- Page title
- Main heading (h1)
- Number of headings, landmarks, links

**Interactive Elements:**
- Element type (button, link, heading, etc.)
- Element label/name
- Current state (expanded, collapsed, checked)
- Instructions (if `aria-describedby` present)

**Form Fields:**
- Label text
- Field type (text input, email, password)
- Required status
- Validation errors

**Dynamic Changes:**
- Live regions (`aria-live="polite"` or `"assertive"`)
- Modal opening/closing
- Accordion expanding/collapsing
- Tab switching

---

## WCAG 2.1 Level AA Quick Checklist

### Perceivable

- [ ] **1.1.1** All images have alt text
- [ ] **1.3.1** Semantic HTML used (headings, lists, tables)
- [ ] **1.3.2** Meaningful sequence (logical reading order)
- [ ] **1.4.3** Color contrast ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- [ ] **1.4.4** Text resizable to 200% without loss of content
- [ ] **1.4.10** No horizontal scrolling at 320px width
- [ ] **1.4.11** UI component contrast ≥ 3:1

### Operable

- [ ] **2.1.1** All functionality keyboard accessible
- [ ] **2.1.2** No keyboard trap
- [ ] **2.4.1** Skip link or landmarks present
- [ ] **2.4.2** Page title descriptive
- [ ] **2.4.3** Focus order logical
- [ ] **2.4.4** Link purpose clear from text
- [ ] **2.4.6** Headings and labels descriptive
- [ ] **2.4.7** Focus indicator visible

### Understandable

- [ ] **3.1.1** Language declared (`<html lang="en">`)
- [ ] **3.2.3** Navigation consistent across pages
- [ ] **3.2.4** Components identified consistently
- [ ] **3.3.1** Error identification clear
- [ ] **3.3.2** Form labels or instructions provided
- [ ] **3.3.3** Error suggestions provided

### Robust

- [ ] **4.1.1** Valid HTML (no parsing errors)
- [ ] **4.1.2** Name, role, value for all UI components
- [ ] **4.1.3** Status messages programmatically determinable

---

## Related Documentation

- [Accessibility Audit Process](./accessibility-audit-process.md) - How to run audits
- [QA Process](../testing/qa-process.md) - Complete QA workflow
- [Visual Testing Checklist](../testing/visual-testing-checklist.md) - Visual testing

---

**Last Updated:** Session 16 (December 2025)
