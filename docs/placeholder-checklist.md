# Placeholder Links Checklist

This document lists ALL placeholder links (`href="#"`) in the SlashExperts website that need to be connected to actual pages or assets.

**Last Updated:** December 30, 2025 (Session 36)

---

## Summary

| Category | Count | Priority |
|----------|-------|----------|
| Global Navigation | 1 | HIGH |
| Global Footer | 8 | HIGH |
| Page-specific CTAs | ~45 | MEDIUM-HIGH |
| **TOTAL** | **~54** | - |

---

## 1. GLOBAL COMPONENTS (Affects All Pages)

### Navigation (`src/_includes/components/nav.njk`)

| Line | Link Text | Current | Action Needed |
|------|-----------|---------|---------------|
| 164 | **Sign In** | `href="#"` | Create sign-in page OR link to external auth |

### Footer (`src/_includes/components/footer.njk`)

| Line | Link Text | Column | Current | Action Needed |
|------|-----------|--------|---------|---------------|
| 15 | **Features** | Product | `href="#"` | Create features page OR link to how-it-works |
| 18 | **What's New** | Product | `href="#"` | Create changelog/updates page |
| 22 | **Deal Acceleration** | Solutions | `href="#"` | Create solution page OR remove |
| 23 | **Website Conversion** | Solutions | `href="#"` | Create solution page OR remove |
| 24 | **PLG Conversion** | Solutions | `href="#"` | Create solution page OR remove |
| 25 | **ABM** | Solutions | `href="#"` | Create solution page OR remove |
| 29 | **Research** | Resources | `href="#"` | Create research page OR remove |
| 39 | **Contact** | Company | `href="#"` | Create contact page |

---

## 2. PAGE-SPECIFIC PLACEHOLDER LINKS

### ~~Pricing Page (`src/pages/pricing.njk`)~~ ✅ COMPLETED (Session 36)

~~| Line | Link Text | Context | Action Needed |~~
~~|------|-----------|---------|---------------|~~
~~| 109 | **Start Free Trial** | Starter plan CTA | Link to signup/trial page |~~
~~| 179 | **Start Free Trial** | Professional plan CTA | Link to signup/trial page |~~
~~| 742 | **Start Free Trial** | Bottom CTA section | Link to signup/trial page |~~

**Resolution:** Changed to "Talk to Sales" buttons that open a modal with RevenueHero integration. Modal uses same calendar booking as book-a-demo page (Router ID 4693). Customer.io tracking added. Subtext "Start with a free trial" added below buttons.

### Become an Expert Page (`src/pages/become-an-expert.njk`)

| Line | Link Text | Context | Action Needed |
|------|-----------|---------|---------------|
| ~45 | **Apply to Become an Expert** | Hero CTA | Link to application form/page |
| ~47 | **Watch Expert Stories** | Hero secondary | Link to video OR video modal |
| ~200 | **Browse Active Programs** | Programs section | Link to programs page |
| ~350 | **Start Your Application** | Final CTA | Link to application form/page |

### Documentation Page (`src/pages/documentation.njk`)

| Lines | Link Text | Context | Action Needed |
|-------|-----------|---------|---------------|
| 135, 142, 149 | Getting Started articles | Quick-start section | Link to actual docs OR create |
| 172, 179, 186 | Dashboard articles | Dashboard section | Link to actual docs OR create |
| 210, 217, 224 | Expert Network articles | Network section | Link to actual docs OR create |
| 246, 253, 260 | Integration articles | Integrations section | Link to actual docs OR create |
| 289, 296, 303 | Expert Booking articles | Booking section | Link to actual docs OR create |
| 325, 332, 339 | API articles | API section | Link to actual docs OR create |
| 357 | **View all articles** | Popular section | Link to full docs index |
| 524 | **Join Community** | CTA button | Link to community/Slack/Discord |

**Note:** ~19 article links total on this page

### How It Works Page (`src/pages/how-it-works.njk`)

| Line | Link Text | Context | Action Needed |
|------|-----------|---------|---------------|
| 46 | **Watch Product Tour** | Hero secondary CTA | Link to video OR video modal |

### Solutions Pages

**solutions-sales.njk, solutions-marketing.njk, solutions-customer-success.njk:**

| Link Text | Context | Action Needed |
|-----------|---------|---------------|
| Play button (SVG) | Use case card CTA | Link to video OR video modal |

### Case Studies Page (`src/pages/case-studies.njk`)

| Line | Link Text | Context | Action Needed |
|------|-----------|---------|---------------|
| 106 | **Read Full Story** | Featured case study | Link to individual case study page |

### Expert Booking Page (`src/pages/expert-booking.njk`)

| Line | Link Text | Context | Action Needed |
|------|-----------|---------|---------------|
| 507 | **Learn More** | Use case card 1 | Link to relevant detail page |
| 628 | **Learn More** | Use case card 2 | Link to relevant detail page |

### About Page (`src/pages/about.njk`)

| Line | Link Text | Context | Action Needed |
|------|-----------|---------|---------------|
| ~middle | **Join us** | Team section text | Link to careers page |

### Analytics & ROI Page (`src/pages/analytics-roi.njk`)

| Line | Link Text | Context | Action Needed |
|------|-----------|---------|---------------|
| 863 | **Privacy Policy** | Form disclaimer | Change to `/pages/privacy/` |

### Blog Page (`src/pages/resources-blog.njk`)

| Lines | Link Text | Context | Action Needed |
|-------|-----------|---------|---------------|
| 38-42 | **Category pills** (5) | Filter navigation | Implement JS filtering OR link to filtered views |

Category pills:
- All Articles
- Win More Deals
- Build Trust
- Scale Connection
- Research & Data

---

## 3. ADDITIONAL ISSUES FOUND

### ~~TODO Comment (Incomplete Implementation)~~ ✅ COMPLETED (Session 35)

**File:** `src/assets/js/pages/blog-post.js:155`
~~```javascript
// TODO: Replace with actual newsletter API endpoint
// For now, simulate success after 1 second
```~~

**Resolution:** Connected to Customer.io using JavaScript SDK. Newsletter subscribers are identified with `newsletter_subscriber: true` attribute. User needs to create a segment in Customer.io filtered by this attribute.

---

## 4. DECISION POINTS

Before fixing these placeholders, decisions are needed:

### Authentication
- [ ] Will you use an external auth provider (Auth0, Clerk, etc.)?
- [ ] Will there be a dedicated sign-in page or modal?

### Missing Pages to Create
- [ ] **Contact page** - Required (footer link)
- [ ] **Features page** - Or can link to How It Works?
- [ ] **What's New / Changelog page** - Required for product updates
- [ ] **Expert Application form/page** - For Become an Expert flow
- [ ] **Individual documentation articles** - ~18 articles needed
- [ ] **Individual case study pages** - At least 1 for featured story

### Pages to Potentially Remove from Footer
- [ ] Deal Acceleration, Website Conversion, PLG Conversion, ABM - Do these need pages or remove links?
- [ ] Research - Does this need a page or remove link?

### Video Modals
- [ ] Will "Watch Product Tour", "Watch Expert Stories", and play buttons open video modals or link to YouTube/Vimeo?

---

## 5. QUICK FIXES (No New Pages Needed)

These can be fixed immediately by linking to existing pages:

| File | Current | Fix To |
|------|---------|--------|
| analytics-roi.njk | `href="#"` (Privacy) | `/pages/privacy/` |
| about.njk | `href="#"` (Join us) | `/pages/careers/` |
| footer.njk | Features | `/pages/how-it-works/` (if acceptable) |

---

## 6. PRIORITY RECOMMENDATION

### P0 - Critical (Global, visible on every page)
1. Footer: Contact link
2. Navigation: Sign In button

### P1 - High (Key conversion paths)
3. ~~Pricing: Start Free Trial buttons (3)~~ ✅ COMPLETED
4. Become an Expert: Application CTAs (4)
5. Analytics ROI: Privacy link fix

### P2 - Medium (Content pages)
6. Documentation: All article links (~19)
7. Case Studies: Read Full Story link
8. About: Join us link

### P3 - Lower (Enhancement)
9. Footer: Remaining placeholder links (7)
10. Blog: Category filter pills (5)
11. Video CTAs: Product tour, Expert stories (4)
12. Expert Booking: Learn More links (2)

---

## Files to Modify

```
src/_includes/components/nav.njk          # 1 link
src/_includes/components/footer.njk       # 8 links
src/pages/pricing.njk                     # 3 links
src/pages/become-an-expert.njk            # 4 links
src/pages/documentation.njk               # ~19 links
src/pages/how-it-works.njk                # 1 link
src/pages/solutions-sales.njk             # 1 link
src/pages/solutions-marketing.njk         # 1 link
src/pages/solutions-customer-success.njk  # 1 link
src/pages/case-studies.njk                # 1 link
src/pages/expert-booking.njk              # 2 links
src/pages/about.njk                       # 1 link
src/pages/analytics-roi.njk               # 1 link
src/pages/resources-blog.njk              # 5 links (category pills)
```

---

## Progress Tracking

Use this section to track which links have been fixed:

### Completed (Session 35 - December 29, 2025)

**Global Components:**
- [x] nav.njk: Sign In → `https://www.slashexperts.com/logins`
- [x] footer.njk: Features → `/pages/how-it-works/`
- [x] footer.njk: What's New → **REMOVED**
- [x] footer.njk: Deal Acceleration → `/pages/solutions-by-use-case/#deal-acceleration`
- [x] footer.njk: Website Conversion → `/pages/solutions-by-use-case/#website-conversion`
- [x] footer.njk: PLG Conversion → `/pages/solutions-by-use-case/#plg-conversion`
- [x] footer.njk: ABM → `/pages/solutions-by-use-case/#abm`
- [x] footer.njk: Research → **REMOVED**
- [x] footer.njk: Contact → `/pages/contact/` (fixed in Session 34)

**Page-Specific:**
- [x] pricing.njk: Start Free Trial (3x) → "Talk to Sales" modal with RevenueHero (Session 36)
- [x] become-an-expert.njk: Apply to Become an Expert → Expert signup URL
- [x] become-an-expert.njk: Browse Active Programs → Expert signup URL
- [x] become-an-expert.njk: Start Your Application → Expert signup URL
- [x] documentation.njk: All ~18 article links → `https://help.slashexperts.com/`
- [x] documentation.njk: View all articles → `https://help.slashexperts.com/`
- [x] expert-booking.njk: Learn More (2x) → `/pages/book-a-demo/`
- [x] about.njk: Join us → `/pages/careers/`
- [x] analytics-roi.njk: Privacy Policy → `/pages/privacy/`

### Remaining Placeholders (Skipped per user decision)
- [x] become-an-expert.njk: Watch How It Works → Video modal (Vimeo 1063730109)
- [x] documentation.njk: Join Community → "See All Articles" → `https://help.slashexperts.com`
- [ ] how-it-works.njk: Watch Product Tour (video not ready)
- [ ] case-studies.njk: Read Full Story (individual case study pages not created)
- [ ] resources-blog.njk: Category filter pills (5) (JS filtering not implemented)
- [ ] solutions-*.njk: Video play button CTAs (videos not ready)
