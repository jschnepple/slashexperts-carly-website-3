# Visual Testing Checklist

**Purpose:** Ensure all pages render correctly across all devices and breakpoints.

**When to Use:** After creating/updating any page, before deployment.

---

## Breakpoint Matrix

Test all pages at these 8 standard breakpoints:

| Breakpoint | Width | Device Category | Priority |
|------------|-------|-----------------|----------|
| Desktop XL | 1920px | Large monitors | Medium |
| Desktop L  | 1440px | Standard monitors | High |
| Desktop    | 1024px | Small monitors/tablets landscape | High |
| Tablet     | 768px  | Tablet portrait | Critical |
| Mobile L   | 480px  | Large phones | Critical |
| Mobile M   | 375px  | Standard phones (iPhone) | Critical |
| Mobile S   | 360px  | Android standard | High |
| Mobile XS  | 320px  | Small phones | Medium |

---

## Per-Page Testing Checklist

### For Each Breakpoint:

#### Layout & Structure
- [ ] Navigation renders correctly (no overlap, proper alignment)
- [ ] Hero section maintains proper proportions
- [ ] All sections are visible and properly spaced
- [ ] Footer renders correctly
- [ ] No horizontal scroll appears (except intentional carousels)
- [ ] Grid layouts adapt correctly (column count changes as expected)
- [ ] Masonry layouts maintain proper flow

#### Typography
- [ ] All headings are readable (not too large/small)
- [ ] Body text is readable (min 14px on mobile)
- [ ] Line lengths are appropriate (45-75 characters)
- [ ] No text overflow or truncation
- [ ] `.serif-italic` gradients render correctly

#### Images & Media
- [ ] All images load and display
- [ ] Images maintain aspect ratio
- [ ] Base64 images render (if present)
- [ ] SVG icons render correctly
- [ ] Background images position correctly
- [ ] Lazy loading works (if implemented)

#### Interactive Elements
- [ ] All buttons are tappable/clickable (min 44x44px touch target)
- [ ] Hover states work correctly (desktop)
- [ ] Active states visible (mobile)
- [ ] Form inputs are usable
- [ ] Dropdowns/modals render correctly
- [ ] Accordions expand/collapse properly
- [ ] Carousels/sliders work smoothly

#### Spacing & Alignment
- [ ] Consistent padding/margins
- [ ] Content centered properly
- [ ] Cards aligned in grids
- [ ] Text alignment correct (left/center/right)
- [ ] No awkward gaps or overlaps

#### Colors & Gradients
- [ ] Brand colors render correctly
- [ ] Gradients display smoothly (no banding)
- [ ] Background colors/images visible
- [ ] Text contrast is sufficient
- [ ] Dark mode (if applicable) works

---

## Page-Specific Checks

### Homepage
- [ ] 13 sections all render
- [ ] Animated counters trigger on scroll
- [ ] Hero gradient mesh visible
- [ ] Floating profile cards animate
- [ ] Testimonial carousel functions
- [ ] Logo marquee scrolls smoothly

### How It Works
- [ ] Step cards display in grid
- [ ] Journey timeline flows correctly
- [ ] Integration icons visible
- [ ] CTA sections prominent

### CRM Integration
- [ ] Integration cards in grid
- [ ] Code snippets readable
- [ ] Connection diagram visible
- [ ] Parallax effects work (desktop)

### Expert Booking
- [ ] Booking flow cards visible
- [ ] Calendar mock-up displays
- [ ] Feature list readable
- [ ] Expert profile cards animate

### Analytics & ROI
- [ ] Dashboard screenshots visible
- [ ] Metric cards in grid
- [ ] Chart visualizations clear
- [ ] ROI calculator inputs usable

### Pricing
- [ ] Pricing cards aligned
- [ ] Feature comparison table readable
- [ ] Toggle switches work
- [ ] CTA buttons prominent

### Become An Expert
- [ ] Application steps clear
- [ ] Benefit cards in grid
- [ ] Testimonials readable
- [ ] Payment graphics visible

### Documentation
- [ ] Documentation grid layout
- [ ] Search bar visible
- [ ] Category cards clickable
- [ ] Code examples readable

### Case Studies
- [ ] Case study cards in grid
- [ ] Stat visualizations visible
- [ ] Testimonial quotes readable
- [ ] Industry filter tabs work

### Blog
- [ ] Featured article prominent
- [ ] Article grid layout correct
- [ ] Category filters work
- [ ] Blog card images display

### Solutions (Marketing, Customer Success)
- [ ] Hero sections render
- [ ] Feature cards in grid
- [ ] Use case examples visible
- [ ] Integration logos display

### Solutions by Use Case
- [ ] Use case cards in grid
- [ ] Workflow diagrams visible
- [ ] Benefit lists readable
- [ ] CTA sections prominent

### ROI Calculator
- [ ] Calculator inputs usable
- [ ] Sliders function smoothly
- [ ] Results display correctly
- [ ] Chart visualizations work
- [ ] Formulas calculate correctly

### Integrations
- [ ] 54 integration cards display
- [ ] Category tabs function
- [ ] Filter animations smooth
- [ ] Floating icons animate
- [ ] Logos visible and crisp

### About
- [ ] Experts Wall masonry layout works
- [ ] Images grayscale → color on hover
- [ ] Problem visualization displays
- [ ] Mission orbs animate
- [ ] Values cards in grid
- [ ] Journey timeline flows
- [ ] Trust badges visible
- [ ] Team carousel functions

### Privacy Hub
- [ ] Hero shield animation works
- [ ] Trust badges display
- [ ] Compliance cards in grid
- [ ] Shield with orbitals animates
- [ ] Accordion single-active works
- [ ] Document cards in grid
- [ ] All sections properly spaced

---

## Common Issues to Watch For

### Layout Issues
- **Horizontal scroll:** Check for elements with fixed widths or negative margins
- **Overlapping elements:** Verify z-index values and positioning
- **Broken grids:** Check media query breakpoints match grid column counts
- **Masonry collapse:** Ensure column-count changes at correct breakpoints

### Typography Issues
- **Text too small:** Min 14px on mobile, 16px on desktop
- **Text overflow:** Use ellipsis or wrap properly
- **Poor contrast:** Check WCAG AA standards (4.5:1 for body, 3:1 for large text)
- **Gradient not showing:** Verify browser support for background-clip: text

### Image Issues
- **Missing images:** Check file paths and base64 encoding
- **Distorted images:** Verify object-fit and aspect-ratio properties
- **Slow loading:** Implement lazy loading for below-fold images
- **Blurry on retina:** Provide 2x resolution images

### Interactive Issues
- **Touch targets too small:** Min 44x44px for mobile
- **Hover not working:** Check for pointer-events: none
- **Buttons not clickable:** Verify z-index and positioning
- **Smooth scrolling broken:** Check for scroll-behavior issues

---

## Screenshot Comparison Process

1. **Baseline Screenshots**
   - Take screenshots at all 8 breakpoints
   - Store in `docs/testing/screenshots/[page-name]/baseline/`
   - Include date in filename: `homepage-1920-2025-12-15.png`

2. **Regression Testing**
   - Take new screenshots after changes
   - Store in `docs/testing/screenshots/[page-name]/current/`
   - Compare side-by-side with baseline
   - Document differences

3. **Visual Diff Tools**
   - Use browser DevTools for quick checks
   - Consider Playwright for automated visual regression
   - Percy.io or similar for CI/CD integration

---

## Browser Testing Matrix

### Desktop Browsers (Priority)
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers (Priority)
- [ ] Safari iOS (iPhone)
- [ ] Chrome Android
- [ ] Samsung Internet

### Legacy Support (Optional)
- [ ] Chrome (2 versions back)
- [ ] Firefox (2 versions back)
- [ ] Safari (1 version back)

---

## Tools

### Browser DevTools
- **Chrome DevTools:** Device mode for breakpoint testing
- **Firefox Responsive Design Mode:** Additional device presets
- **Safari Web Inspector:** iOS-specific testing

### Browser Extensions
- **Responsive Viewer:** Test multiple breakpoints simultaneously
- **Window Resizer:** Quick breakpoint switching
- **Grid Overlay:** Verify layout alignment

### Screenshot Tools
- **Full Page Screen Capture:** Chrome extension
- **Fireshot:** Firefox extension
- **Playwright:** Automated screenshot testing

---

## AI Agent Quick Start

### Testing a New Page
```bash
# 1. Start dev server
npx @11ty/eleventy --serve

# 2. Open page in browser
open http://localhost:8080/pages/[page-name]/

# 3. Test each breakpoint using DevTools
# Chrome: Cmd+Option+M → Select device → Test
# Firefox: Cmd+Option+M → Enter width → Test

# 4. Check all items in checklist above

# 5. Document any issues found

# 6. Fix issues and retest
```

### After Making Changes
1. Test affected breakpoints (usually 768px, 375px minimum)
2. Verify no regressions on adjacent breakpoints
3. Check similar pages for consistency
4. Update baseline screenshots if design changed intentionally

---

## Related Documentation

- [QA Process](./qa-process.md) - Complete QA workflow
- [Accessibility Audit Process](../accessibility/accessibility-audit-process.md) - Accessibility testing
- [Performance Audit Process](../performance/performance-audit-process.md) - Performance testing

---

**Last Updated:** Session 16 (December 2025)
