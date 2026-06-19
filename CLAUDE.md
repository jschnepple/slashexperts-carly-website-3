# CLAUDE.md — SlashExperts Carly Website 3.0 (Redesign)

This is the **redesign/restructure** of slashexperts.com into a deliberate **two-product, Carly-forward** marketing site. It is a clean fork of "Slashexperts Website 2.0" (Eleventy/11ty). Do not touch the 2.0 repo from here.

## 🧠 Read this first, every session

The single source of truth for this project is the **`_project/`** folder. At the start of every session, read in this order:
1. `_project/PROJECT_BRAIN.md` — mission, two-product positioning, convergence story, committees, principles.
2. `_project/STATUS.md` — where we are right now, what's next, blockers.
3. `_project/DECISIONS.md` — locked decisions (do not relitigate).
4. The newest file in `_project/SESSION_LOG/` — what last session did + the kickoff for this one.
5. `_project/PAGE_TRACKER.md` — per-page content-production status.

Then activate the committees per `_project/committees/` and propose the session's focus before acting.

## 🔒 Non-negotiable brand rules
- Always write **SlashExperts** (one word, capital S/E).
- **Never** use "advocacy / advocate / advocates" — use "customers," "experts," or "champions."
- The platform tool is a **booking system**, never a "directory."
- AI terminology follows `docs/ai-terminology-glossary.md` (ExpertScore AI, 50+ data points, Agentic).

## 🎯 Positioning in one paragraph
SlashExperts is **The Trust Layer for B2B Sales**, delivered through **two products**: the **Booking System** (the trust *infrastructure* — verified customers, matched and bookable, embedded everywhere, CRM-synced) and **Carly** (the trust *agent* — an AI teammate that watches active deals and proactively delivers the right proof/expert/reference at the decisive moment). They sell separately and compound together. **Peer Matching** and **AI Outbound** are *features within* these products, not separate products. Carly leads the story; the Booking System is the foundation she stands on.

## 🛠 Technical conventions (inherited from 2.0)
Full technical reference: `_project/reference/2.0_TECHNICAL_CLAUDE.md` and `docs/INDEX.md`. Key rules:
- Eleventy + Nunjucks. All pages use `{% extends "layouts/base.njk" %}` + `{% block content %}…{% endblock %}`. **Never** mix `layout:` front matter with block tags (silent render failure). Never put `<nav>`/`<footer>` in page bodies.
- Build: `npm run dev` (serve on :8080) / `npm run build` (→ `_site`).
- Forms post to n8n + Customer.io; tracking via GTM (see technical reference).
- 8 responsive breakpoints; WCAG 2.1 AA; Lighthouse targets in `docs/`.

## 🔁 Session protocol
- **Start:** use `_project/KICKOFF_PROMPT.md` (paste-ready). It orients you and activates the committees.
- **End:** run **`/wrapup`**. For this project, wrapup MUST update `_project/STATUS.md`, append to `_project/DECISIONS.md` (any new locks), update `_project/PAGE_TRACKER.md`, write a new `_project/SESSION_LOG/<date>_session-NN.md`, and regenerate `_project/KICKOFF_PROMPT.md` so the next session starts cold with full context.

## 🚫 Git
The sandbox cannot commit inside this mounted folder (`.git/index.lock` EPERM). Hand Jeff a command block to run native git on his Mac for any commit/remote/push.
