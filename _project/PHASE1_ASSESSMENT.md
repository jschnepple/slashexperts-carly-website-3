# SlashExperts Website Redesign — Phase 1: Current-Site Assessment & Proof Inventory

**Date:** 2026-06-19 · **Status:** Draft v0.1 for Jeff's review
**Scope:** The modernized Eleventy site (`src/`) — 35 marketing pages + 221-post blog.
**Purpose:** Establish a shared, exhaustive baseline of where the site stands today, with a verdict on every page, before we design the redesign.

---

## 1. Executive snapshot

The current site is a **strong one-product site mid-pivot**. Its bones, copy, and IA were built to sell the **Expert Booking System**. Over the last week a "Trust Layer / Carly-forward" repositioning was layered on top — but only on the highest-leverage surfaces (homepage, Carly page, global meta/footer, a few solution metas). The result today: a visitor who lands on the homepage meets Carly and the Trust Layer category; a visitor who lands on almost any interior page still experiences a single-product booking tool.

**The redesign's core job:** finish and systematize that pivot into a deliberate **two-product** site — Carly-forward, each product with its own clear story, and an explicit, persuasive convergence narrative (how they make each other better) — with a simple conversion surface over a deep authority library.

**Good news:** the category ("The Trust Layer for B2B Sales"), the Carly hero, the "Why Now" narrative, the "Four products. One platform." frame, and the designer's signature animations are **already built and locally shipped**. We are elevating an in-flight repositioning, not starting cold.

---

## 2. Where we stand — the half-finished pivot

**Already repositioned (locally, unpushed in the live repo):**
- Global: title/meta/JSON-LD/footer now lead with "The Trust Layer for B2B Sales."
- Homepage: Carly leads the hero; new "Why Now" trust-narrative section; new "Four products. One platform." band; designer's `carly-hero.html` + `why-now.html` animations wired in; mobile treatments done.
- Carly page (`carly-ai-agent.njk`): elevated to "The AI Agent at the Core of Your Trust Layer," new `carly-showcase.html` 6-tab animation, same-day onboarding copy, four-products band. (Known open: showcase animation breaks ≤1024px.)
- Terminology: `experts.njk` retitled "Expert Booking System" (was "Directory"); "advocacy/advocate" scrubbed on two pages.

**Not yet touched by the pivot (still read single-product):**
- How It Works, Expert Booking, CRM Integration, Analytics & ROI, Integrations — booking-mechanics framing, no Carly/Trust-Layer thread.
- Solutions for Marketing, Customer Success, By Use Case — meta updated, body copy not.
- About, Pricing tiers, Case Studies, ROI/Pipeline calculators — no two-product story.

**Structural debt:**
- Nav "Solutions → For Sales Teams" still points to `#`; "Sign In" CTA is `#`.
- Nav has no Carly entry and no Pricing/positioning of two distinct products — IA is single-product.
- Same 8 research stats are reused across homepage/analytics/booking with no single source of truth.
- CTA strategy is undifferentiated ("Book a Demo" everywhere; secondary CTAs vary with no logic).

---

## 3. Page inventory & verdicts

Verdict legend: **KEEP** (on-message, minor polish) · **EVOLVE** (good bones, re-thread for two products) · **REWORK** (substantial rewrite) · **CREATE** (net-new) · **CUT/MERGE** (candidate to remove or fold).

### Core / homepage
| Page | Product today | Verdict | Note |
|---|---|---|---|
| `/` Homepage | Carly + platform | **EVOLVE** | Best surface already; needs the explicit two-product split + convergence beat, cleaner path into each product. |

### Product pages (currently all "Product" dropdown)
| Page | Product today | Verdict | Note |
|---|---|---|---|
| `/carly-ai-agent/` | Carly | **EVOLVE** | The Carly flagship. Fix ≤1024 animation; deepen into the persuasive Carly core + supplemental. |
| `/how-it-works/` | Booking System | **REWORK** | Currently booking-only. Decide: per-product "how it works," or split. |
| `/expert-booking/` | Booking System | **EVOLVE** | The Booking System flagship. Strong; re-thread as one of two products + show Carly synergy. |
| `/crm-integration/` | Booking System | **EVOLVE** | Capability page; applies to both products — reframe. |
| `/analytics-roi/` | Cross | **EVOLVE** | Proof/ROI engine; serves both products. |
| `/integrations/` | Cross | **KEEP** | Catalog; light reframe. |

### Solutions (by role)
| Page | Product today | Verdict | Note |
|---|---|---|---|
| `/solutions-sales/` | Booking + Carly | **EVOLVE** | Already references agentic matching; closest to two-product. |
| `/solutions-marketing/` | Booking | **REWORK** | Body not repositioned. |
| `/solutions-customer-success/` | Booking | **REWORK** | Body not repositioned. |
| `/solutions-by-use-case/` | Multi | **REWORK** | Could become the convergence showcase. |

### Conversion & tools
| Page | Verdict | Note |
|---|---|---|
| `/pricing/` | **REWORK** | Must clearly present two products (buy either / buy both) — today Carly isn't an explicit line. |
| `/book-a-demo/` | **EVOLVE** | Primary conversion endpoint; align to two-product routing. |
| `/roi-calculator/`, `/pipeline-calculator/` | **EVOLVE** | High-value lead magnets; keep, re-skin, connect to story. |
| `/product-tour/`, `/platform-demo/` | **REVIEW** | Confirm purpose; possible merge. |

### Company
| Page | Verdict | Note |
|---|---|---|
| `/about/` | **EVOLVE** | Add the "why now / trust layer" founding narrative. |
| `/become-an-expert/` (+ apply) | **KEEP/EVOLVE** | Expert-supply funnel; important to the flywheel story. |
| `/case-studies/` | **EVOLVE** | Proof engine — central to "length implies strength." |
| `/careers/`, `/contact/` | **KEEP** | Light touch. |

### Resources & supplemental (the authority library)
| Page | Verdict | Note |
|---|---|---|
| `/resources-blog/` + 221 posts | **KEEP/EVOLVE** | Major SEO/authority asset; audit for legacy "directory/advocacy" terms + two-product alignment over time. |
| `/download-report-2026/`, `/download-asset-template/` | **KEEP** | Lead magnets; on-strategy. |
| `/documentation/` | **EVOLVE** | Deep authority surface; expand per "length implies strength." |

### Legal / compliance
| `/privacy/`, `/privacy-hub/`, `/terms/`, `/gdpr/`, `/ccpa/`, `/dpa/` | **KEEP** | Reuse as-is; reskin to new shell. |

---

## 4. Information-architecture analysis

**Today's top nav:** Product ▾ · Solutions ▾ · Become an Expert · Pricing · About · Resources ▾ — a single-product structure where "Product" = the booking system's feature pages.

**The problem:** there is nowhere in the IA that says "we have two products." Carly hides inside the Product dropdown as a peer of "CRM Integration." A visitor cannot form the mental model you want (two distinct, synergistic products) from the navigation alone.

**Direction (hybrid, per your call):** keep the overall shape and reuse interior/supplemental/legal pages, but restructure the **top of the story** so the two products are unmistakable and Carly leads. Candidate move (to design in Phase 3): a **Products** menu that splits cleanly into **Carly** and **Booking System**, each with its own short persuasive spine + supplemental children, plus a shared "How they work together" convergence page. Solutions (by role/use-case) and Resources stay. This is a wireframe-stage decision — flagged, not yet locked.

---

## 5. Strategic gaps & opportunities

1. **No convergence page.** The single biggest missing asset: a page that makes the "distinct but synergistic — each makes the other better" argument vivid. This is where your differentiation lives and where the "four products, one platform" deck story should land for a website visitor.
2. **Interior pages still single-product.** Every EVOLVE/REWORK page needs the Trust-Layer thread and a two-product frame.
3. **Proof is scattered, not systematized.** Stats/quotes/mockups are duplicated and un-sourced. A single proof inventory (Section 7) prevents drift and inconsistency.
4. **CTA logic is flat.** Opportunity to design a deliberate conversion ladder (primary "Book a Demo," product-specific secondaries, lead-magnet tertiaries) tied to awareness stage.
5. **Supplemental depth is thin outside the blog.** To execute "length implies strength," the deep per-product and documentation surfaces need real expansion — that's an authority moat, not filler.
6. **Pricing doesn't yet sell two products.** Needs to communicate buy-either / buy-both and the synergy incentive.

---

## 6. The two-product convergence model — proposal + the one decision to resolve first

**Proposed visitor mental model:**
- **Booking System** = the trust *infrastructure*. Your verified customers, matched and bookable, embedded everywhere, CRM-synced. (Passive/on-demand: proof when a prospect seeks it.)
- **Carly** = the trust *agent*. Watches active deals and proactively delivers the right proof/expert/reference at the decisive moment. (Active/autonomous: proof pushed when the deal needs it.)
- **Convergence:** the Booking System gives Carly her supply (experts + proof library + booking rails); Carly makes the Booking System proactive instead of waiting to be used. Infrastructure + agent = the Trust Layer. Either alone is valuable; together they compound.

**⚠️ Decision to resolve before any messaging is written — "two products" vs. "four products":**
Your brief frames this as **two products** (Booking System + Carly). The seed deck and the already-shipped homepage frame it as **"Four products. One platform."** (Carly · Booking System · Peer Matching · AI Outbound). These need reconciling, because the entire IA and copy inherit from the answer. Most likely resolution (for your confirmation): **two *purchasable products* (Booking System, Carly), with Peer Matching and AI Outbound presented as capabilities/pillars rather than separately-sold products** — but this is your call and it's the first thing the Messaging Bible must lock. (Investor deck can keep "four products" framing; the website's commercial story can be "two products" — or we align both. Your call.)

---

## 7. Proof & asset inventory (starter — to be completed in build)

**Reusable, on-strategy (keep):**
- Designer animations: `carly-hero.html`, `why-now.html`, `carly-showcase.html` (optimized). Signature assets.
- Research stat set (8 stats, GTM 2026 / Heinz benchmark, 450 leaders). Needs a single canonical source-of-truth file.
- Customer logos (Sendoso, Warmly, Spara, Udemy, etc.) and 3 named quotes.
- Dashboard/mockup UI visuals across booking/analytics pages.
- 221 blog posts; 2026 GTM Report; sales-enablement playbook.

**Stale / needs fixing:**
- Carly showcase animation responsive break ≤1024px.
- Legacy "directory/advocacy" terms lingering in blog + a base64-heavy About page (perf).
- Reused stats with no citation discipline.

**Likely net-new (for the designer — to be specified in Phase 6):**
- Convergence visual ("how Carly + Booking System compound").
- Carly product imagery/screens beyond the showcase (for supplemental depth).
- Two-product nav/menu visual system.
- Per-product hero treatments that make the two products feel distinct yet kin.
- Updated product icons for Carly / Booking System / (Peer Matching / AI Outbound if retained).

---

## 8. Open decisions (carry into Phase 2)

1. **Two products vs. four** (Section 6) — *blocks the Messaging Bible.* **First to resolve.**
2. **Nav/IA shape** — split "Products → Carly / Booking System" + a convergence page? (Phase 3 wireframes.)
3. **"How It Works"** — one shared page, or per-product?
4. **Pricing model** for two products — buy-either/buy-both presentation + synergy incentive.
5. **Supplemental depth targets** — how deep do we go per product to earn "length implies strength" without bloat?

---

*Next: this becomes the input to the Positioning & Messaging Bible (Phase 2). Nothing here is built or final — it's the shared map.*
