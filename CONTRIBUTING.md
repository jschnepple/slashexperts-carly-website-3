# Contributing to SlashExperts Website

Thank you for contributing to the SlashExperts website! This document provides guidelines for contributing code, documentation, and other improvements.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation Requirements](#documentation-requirements)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [AI Agent Guidelines](#ai-agent-guidelines)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Modern web browser (Chrome recommended for DevTools)
- Text editor (VS Code recommended)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/slashexperts/website.git
cd website

# Install dependencies
npm install

# Start development server
npx @11ty/eleventy --serve

# Open browser to http://localhost:8080
```

### Project Structure

```
src/
├── _includes/         # Shared templates (nav, footer, layouts)
├── pages/             # Page templates (*.njk)
├── assets/
│   ├── css/           # Stylesheets (modular)
│   └── js/            # JavaScript (ES6 modules)
└── data/              # Site data (navigation, etc.)

docs/                  # Documentation
scripts/               # Automation scripts
```

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/page-name
# or
git checkout -b fix/issue-description
```

**Branch naming conventions:**
- `feature/` - New pages or features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `optimize/` - Performance/image optimizations
- `refactor/` - Code refactoring

### 2. Make Changes

- Follow code standards (see below)
- Test changes locally
- Run QA checklist
- Update documentation

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add pricing calculator"
```

See [Commit Message Format](#commit-message-format) for details.

### 4. Push and Create Pull Request

```bash
git push origin feature/page-name
```

Create pull request on GitHub with:
- Clear title and description
- Screenshots (for visual changes)
- Testing checklist completed
- Documentation updated

---

## Code Standards

### HTML/Nunjucks Templates

**CRITICAL: Template Inheritance Rules**

✅ **CORRECT:**
```njk
---
title: Page Title | SlashExperts
description: Meta description
pageCSS: page-slug
pageJS: page-slug
lightNav: false
---

{% extends "layouts/base.njk" %}

{% block content %}
<!-- Page content here -->
{% endblock %}
```

❌ **INCORRECT (will break page):**
```njk
---
layout: layouts/base.njk  # ❌ Don't use with block tags
---

{% block content %}
<!-- This will fail silently -->
{% endblock %}
```

**Rules:**
- Always use `{% extends %}` (not `layout:` in front matter)
- Always close `{% block %}` with `{% endblock %}`
- Never include `<nav>` or `<footer>` in page content (handled by base.njk)
- Set `lightNav: true` for pages with light-colored heroes

**Semantic HTML:**
- Use proper heading hierarchy (h1 → h2 → h3, no skipping)
- Use `<button>` for actions, `<a>` for navigation
- Use native form elements (not custom-styled divs)
- Use `<picture>` for images with WebP fallback

### CSS

**File Organization:**
```
src/assets/css/
├── base/             # Variables, reset, typography
├── components/       # Nav, footer, buttons, cards, sections
├── pages/            # Page-specific styles
├── utilities/        # Animations, helpers
└── main.css          # Main entry point (imports all)
```

**Naming Conventions:**
- Use BEM-like semantic classes: `.hero-content`, `.section-badge`, `.btn-primary`
- Prefix page-specific classes: `.about-experts-wall`, `.pricing-card`
- Use CSS custom properties for values that repeat

**Code Style:**
- Use 2-space indentation
- Group related properties (layout, typography, visual, animation)
- Use CSS variables from `base/variables.css`
- Mobile-first responsive design (min-width media queries)

**Example:**
```css
.hero-content {
    /* Layout */
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 40px 20px;

    /* Typography */
    text-align: center;
    color: var(--white);

    /* Responsive */
    @media (min-width: 768px) {
        padding: 80px 40px;
    }
}
```

### JavaScript

**Module System:**
- Use ES6 modules (`import`/`export`)
- Page-specific code in `assets/js/pages/[page-name].js`
- Export init functions: `export function initPagename() { ... }`

**Code Style:**
- Use `const` for values that don't change, `let` for values that do
- Use arrow functions for callbacks
- Use template literals for string concatenation
- Use async/await for promises

**Performance Patterns:**
- Use `requestAnimationFrame` for animations
- Use `IntersectionObserver` for scroll triggers (not scroll events)
- Debounce expensive operations
- Avoid layout thrashing (batch DOM reads/writes)

**Example:**
```javascript
// assets/js/pages/pricing.js
export function initPricing() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Observe elements
    document.querySelectorAll('.pricing-card').forEach(el => observer.observe(el));
}
```

---

## Testing Requirements

### Before Submitting a Pull Request

All changes must pass these tests:

#### 1. Visual Testing ✅

**File:** [docs/testing/visual-testing-checklist.md](./docs/testing/visual-testing-checklist.md)

- [ ] Test at 8 breakpoints (1920px → 320px)
- [ ] No horizontal scroll
- [ ] All content visible and readable
- [ ] Images display correctly
- [ ] Gradients and colors render properly

```bash
npx @11ty/eleventy --serve
# Test in Chrome DevTools Responsive Mode (Cmd+Option+M)
```

#### 2. Functional Testing ✅

- [ ] All links work (no 404s)
- [ ] All buttons clickable
- [ ] Forms validate input
- [ ] Interactive elements work (accordions, tabs, modals)
- [ ] No console errors
- [ ] No console warnings (review and fix)

#### 3. Accessibility Testing ✅

**File:** [docs/accessibility/accessibility-audit-process.md](./docs/accessibility/accessibility-audit-process.md)

- [ ] axe DevTools: 0 violations
- [ ] Lighthouse Accessibility: >95
- [ ] Keyboard navigation works (Tab, Enter, Esc, Arrows)
- [ ] Focus indicators visible
- [ ] Color contrast passes (4.5:1 for text, 3:1 for UI)
- [ ] Screen reader test (VoiceOver: Cmd+F5)

```bash
# Chrome DevTools → axe DevTools → "Scan ALL of my page"
# Chrome DevTools → Lighthouse → Accessibility → Analyze
```

#### 4. Performance Testing ✅

**File:** [docs/performance/performance-audit-process.md](./docs/performance/performance-audit-process.md)

- [ ] Lighthouse Performance: >90
- [ ] LCP (Largest Contentful Paint): <2.5s
- [ ] CLS (Cumulative Layout Shift): <0.1
- [ ] Total page size: <1.5MB
- [ ] Images optimized (WebP + fallback, lazy loading)

```bash
# Chrome DevTools → Lighthouse → Performance → Analyze
```

#### 5. Cross-Browser Testing ✅

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android

---

## Documentation Requirements

### Code Documentation

**When to document:**
- Creating new components
- Adding complex functionality
- Implementing accessibility patterns
- Making performance optimizations

**What to document:**
- Component purpose and usage
- ARIA patterns and keyboard navigation
- Browser compatibility notes
- Performance considerations

**Example:**
```javascript
/**
 * Accordion component with single-active pattern
 *
 * Keyboard navigation:
 * - Tab: Move between accordion headers
 * - Enter/Space: Toggle accordion panel
 *
 * ARIA:
 * - aria-expanded: Indicates panel state
 * - aria-controls: Links header to panel
 * - role="region": Identifies expandable region
 *
 * @param {HTMLElement} button - Accordion header button
 */
function toggleAccordion(button) {
    // Implementation
}
```

### Update Documentation

**When making changes, update:**

1. **CLAUDE.md** - If changing architecture, adding patterns, or modifying development commands
2. **continuation-master-prompt.md** - Add session summary, version history
3. **docs/INDEX.md** - If adding new documentation files
4. **Session handoff** - Create handoff document in `session-handoffs/`
5. **Performance baselines** - If optimizing performance

---

## Commit Message Format

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature or page
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: CSS/visual changes (no functionality change)
- `refactor`: Code refactoring (no functionality change)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, tooling, dependencies

### Examples

**New feature:**
```
feat(pricing): add interactive pricing calculator

- Add calculator component with input sliders
- Implement ROI calculation logic
- Add chart visualization
- Include reset button functionality
```

**Bug fix:**
```
fix(nav): correct dropdown menu z-index on mobile

Dropdown was appearing behind hero section on mobile devices.
Increased z-index from 100 to 1000.
```

**Performance optimization:**
```
perf(about): extract and optimize expert profile images

- Extract 12 base64 images from HTML (2MB → 45KB HTML)
- Convert to WebP format (PNG fallback)
- Implement lazy loading
- Add width/height attributes (prevent CLS)

Performance improvement:
- Page size: 2.65MB → 550KB (-79%)
- LCP: 6.5s → 2.3s (-65%)
- Performance score: 45 → 90 (+100%)
```

**Documentation:**
```
docs: add accessibility audit process guide

- Created docs/accessibility/accessibility-audit-process.md
- Includes WCAG 2.1 Level AA checklist
- Documents axe DevTools workflow
- Adds screen reader testing guidelines
```

---

## Pull Request Process

### 1. Create Pull Request

**Title:** Use commit message format
```
feat(pricing): add interactive pricing calculator
```

**Description template:**
```markdown
## Changes

- List changes made
- Include rationale for decisions
- Note any trade-offs

## Screenshots

[Include screenshots for visual changes]

## Testing Checklist

- [ ] Visual testing (8 breakpoints)
- [ ] Functional testing (all interactive elements)
- [ ] Accessibility audit (axe DevTools, keyboard, screen reader)
- [ ] Performance audit (Lighthouse)
- [ ] Cross-browser testing

## Performance Impact

Before:
- Page size: [size]
- Lighthouse score: [score]
- LCP: [time]

After:
- Page size: [size]
- Lighthouse score: [score]
- LCP: [time]

## Documentation

- [ ] CLAUDE.md updated (if needed)
- [ ] Session handoff created
- [ ] Relevant docs updated
```

### 2. Code Review

**Reviewer checks:**
- [ ] Code follows standards
- [ ] Tests pass
- [ ] Documentation complete
- [ ] Performance acceptable
- [ ] Accessibility compliant
- [ ] No console errors

### 3. Merge

- Squash commits if multiple small commits
- Use pull request title as commit message
- Delete branch after merge

---

## AI Agent Guidelines

**For AI agents working on this project:**

### Required Reading

1. **[CLAUDE.md](./CLAUDE.md)** - Project architecture and critical template rules
2. **[docs/INDEX.md](./docs/INDEX.md)** - Master documentation index
3. **[continuation-master-prompt.md](./continuation-master-prompt.md)** - Project status and history

### Workflow for AI Agents

**Creating a new page:**
1. Read CLAUDE.md template system rules (CRITICAL)
2. Create page using `{% extends "layouts/base.njk" %}` pattern
3. Follow visual testing checklist
4. Run accessibility audit
5. Run performance audit
6. Update session handoff

**Optimizing performance:**
1. Read docs/performance/performance-baselines.md for current metrics
2. Identify issues using Lighthouse
3. Follow optimization guides (images, CSS, JS)
4. Re-measure and document improvements

**Fixing accessibility issues:**
1. Run axe DevTools scan
2. Classify severity (P0/P1/P2/P3)
3. Reference docs/accessibility/accessibility-standards.md
4. Apply fix
5. Verify with axe DevTools (0 violations)

**Before completing session:**
1. Create session handoff in `session-handoffs/`
2. Update continuation-master-prompt.md
3. Update docs/INDEX.md if new documentation added
4. Verify all todos completed

---

## Getting Help

**Resources:**
- **[docs/INDEX.md](./docs/INDEX.md)** - Master documentation index (start here!)
- **[CLAUDE.md](./CLAUDE.md)** - Project architecture
- **[Session Handoffs](./session-handoffs/)** - Work completed in each session

**Common Issues:**
- Template not rendering: Check template inheritance (use `{% extends %}`, not `layout:`)
- Accessibility violations: Review docs/accessibility/accessibility-standards.md
- Performance issues: Review docs/performance/performance-audit-process.md
- Images too large: Use scripts/optimize-images.sh

---

## Code of Conduct

### Standards

- Be respectful and professional
- Focus on constructive feedback
- Prioritize user experience and accessibility
- Follow established patterns and conventions
- Document decisions and rationale

### Quality Standards

- **Accessibility:** WCAG 2.1 Level AA compliance (non-negotiable)
- **Performance:** Lighthouse >90, LCP <2.5s, CLS <0.1
- **Code Quality:** Clean, readable, well-documented
- **Testing:** All tests pass before merging
- **Documentation:** Keep docs up-to-date

---

## Questions?

For questions or clarifications:
- Review documentation in `docs/`
- Check session handoffs in `session-handoffs/`
- Reference CLAUDE.md for architecture
- Open GitHub issue for discussion

---

**Last Updated:** Session 16 (December 2025)
