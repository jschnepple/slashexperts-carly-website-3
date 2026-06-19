# PROJECT BRAIN — SlashExperts Carly Website 3.0

**This is the master context document.** Every new session and every committee agent reads this first. It is a *living* document — update it whenever strategy, positioning, or structure changes (the `/wrapup` skill enforces this).

Last updated: 2026-06-19 (Session 01)

---

## 1. Why this project exists

SlashExperts is launching its second product, **Carly**, within weeks. We are mid-fundraise. The website must stop reading like a one-product (Booking System) site and become a deliberate **two-product, Carly-forward** site that:
- Makes it unmistakable that there are **two distinct products** that can be bought together or separately.
- Tells a clear, persuasive story for **each** product, then converges them into the bigger **Trust Layer** narrative — showing how each makes the other better.
- Puts maximum momentum and attention on **Carly** (launch + fundraising asset).
- Functions as a **lead-generation engine**: a simple, intuitive surface that moves a visitor to "Book a Demo" in as few pages as possible, backed by a **deep supplemental library** that establishes SlashExperts as the industry authority ("length implies strength").

## 2. The two products

**Booking System** — the trust *infrastructure*.
- What: prospects book live calls with your verified customer-experts, matched by ExpertScore AI (50+ data points), embedded everywhere (site, CRM, email), fully CRM-synced.
- Mode: **passive / on-demand** — delivers proof when a prospect seeks it.
- Contains the features: **Peer Matching** (ExpertScore AI surfacing the highest-signal customers).
- The original product; the foundation.

**Carly** — the trust *agent*.
- What: an AI teammate that watches active deals and proactively delivers the right customer proof — a case study, an expert, or a reference — at the exact moment a buyer needs confidence to move.
- Mode: **active / autonomous** — pushes proof when the deal needs it.
- Contains the features: **AI Outbound** (AI-orchestrated distribution of customer proof to the right accounts), 24/7 conversation handling, transcript + sentiment + deal-readiness scoring.
- The new flagship; leads the story.

> "Four products. One platform." was investor-deck framing. On the **website** we sell **two products**; Peer Matching and AI Outbound are **features within** them.

## 3. The convergence story (must appear explicitly on the site)

- The **Booking System gives Carly her supply** — the verified experts, the proof library, the booking rails.
- **Carly makes the Booking System proactive** — instead of waiting to be used, the trust layer now reaches into every open deal at the right moment.
- **Infrastructure + Agent = the Trust Layer.** Either alone is valuable; together they compound. This convergence is our core differentiation and needs its own page/section (see PAGE_TRACKER / IA).

## 4. Category & narrative spine

- **Category:** *The Trust Layer for B2B Sales.*
- **Why Now:** AI made information infinite → trust became scarce → real customer proof is the only thing buyers believe → Carly + the Booking System deliver it at the decisive moment.
- Proven hooks retained as *proof*, not the headline: the "invisible competition / backchannel conversations" problem, deal acceleration, ROI.

## 5. Strategic principles (the lens for every decision)

1. **Carly-forward.** Carly leads; the Booking System is the foundation she stands on.
2. **Two products, one converging story.** Distinct stories that meet in the Trust Layer.
3. **Simple surface, deep library.** Few pages to conviction; vast supplemental depth for authority. "Length implies strength" — depth must be *useful*, never padding.
4. **Persuasion-grade copy.** Modeled on the copywriting committee (§7). Authority without hype (trust pitch can't sound like hype).
5. **Effortless flow.** Every section earns the next (Sugarman's slippery slide).
6. **Lead-gen discipline.** A deliberate CTA ladder and conversion instrumentation, designed into the IA.

## 6. Brand & voice rules

- Always **SlashExperts**; never "advocacy/advocate"; "**booking system**," not "directory"; AI terms per `docs/ai-terminology-glossary.md`.
- Voice: confident, clear, evidence-led, warm, never gimmicky. (Voice will be fully codified in the Messaging Bible, Phase 2.)

## 7. The committees (our modeled experts)

Two standing groups produce the site. Full definitions in `_project/committees/`.

**Copywriting Committee** (`committees/COPYWRITING_COMMITTEE.md`):
- **Eugene Schwartz** — awareness/sophistication; decides surface vs. depth.
- **David Ogilvy** — authority, proof, headline discipline.
- **Joseph Sugarman** — flow / slippery slide.
- **Joanna Wiebe** — modern SaaS conversion, voice-of-customer, CTAs.
- **April Dunford** — positioning; owns the two-product split + convergence; arbitrates.
- **Ann Handley** — supplemental authority library.

**UX / Marketing-Design Group** (`committees/UX_COMMITTEE.md`):
- **Apple-marketing clarity** — product-as-hero, breathtaking restraint.
- **Stripe / Linear craft** — modern B2B/SaaS feel, beautiful long-form supplemental.
- **Luke Wroblewski** — conversion flow, mobile-first, forms.
- **Edward Tufte** — data/proof presentation without clutter.

They operate the **Production Loop** (`committees/PRODUCTION_LOOP.md`): positioning brief → UX wireframe with copy-slots + target word counts → copy committee drafts → one structured critique → revision → wireframe-for-approval → Jeff approves.

## 8. The doc system (how context persists)

| File | Role |
|---|---|
| `PROJECT_BRAIN.md` | This hub — mission, positioning, committees, principles. |
| `STATUS.md` | Live status: current phase, in-progress, next, blockers. |
| `DECISIONS.md` | Append-only log of locked decisions (don't relitigate). |
| `BACKLOG.md` | Prioritized to-dos by phase. |
| `PAGE_TRACKER.md` | Per-page production status. |
| `PHASE1_ASSESSMENT.md` | The current-site assessment + proof inventory. |
| `committees/*` | Copywriting + UX personas and the production loop. |
| `KICKOFF_PROMPT.md` | Paste-ready prompt to start any session cold. |
| `SESSION_LOG/*` | One file per session (what shipped + next kickoff). |
| `reference/*` | Frozen history (2.0 messaging plan, changelog, technical CLAUDE). |

## 9. How a session runs

- **Start:** paste `KICKOFF_PROMPT.md`. The session reads the brain/status/decisions/log, orients in 5 lines, activates the committees, proposes focus, waits for go.
- **Work:** committees run the Production Loop per page; Jeff approves at the gates.
- **End:** `/wrapup` updates STATUS, DECISIONS, PAGE_TRACKER, writes a SESSION_LOG entry, and regenerates KICKOFF_PROMPT.

## 10. Current phase

See `STATUS.md`. (As of Session 01: Phase 0 infra ✅ local / Phase 1 assessment drafted → next is Phase 2 Positioning & Messaging Bible.)
