# The Production Loop — how every page gets made

A bounded, repeatable sequence so quality and consistency are guaranteed and Jeff approves at clear gates. Runs per page (or per section for big pages). Designed to avoid endless debate and to keep full context.

## Inputs (must exist before starting a page)
- Locked positioning (`MESSAGING_BIBLE.md`) and the page's role in the IA/TOC.
- The page's verdict + notes from `PHASE1_ASSESSMENT.md`.
- Any reusable assets identified for this page.

## The loop

**1. Positioning brief (Dunford-led).**
A short brief for the page: its single job, the target visitor + awareness stage (Schwartz), where it sits in the two-product story, the desired next action, and the proof available. → *Gate: Jeff sees the brief if the page's intent is novel.*

**2. UX wireframe + slots (UX group).**
The UX group lays out the page: section order, the user-flow in and out, copy-slots with **target word counts**, asset placements, and the CTA. This is the contract copy writes to.

**3. Copy draft (copywriting committee).**
The committee drafts to the slots. Each member contributes their lens; Schwartz sets surface-vs-depth, Sugarman the flow, Ogilvy the proof/headlines, Wiebe the conversion + CTA, Handley any supplemental depth, Dunford guards positioning.

**4. One structured critique.**
A single, explicit critique pass against a fixed checklist:
- Positioning: two products clear? convergence served? Carly-forward?
- Awareness: meets the visitor where they are? surface vs. depth right?
- Proof: claims backed, specific, dignified?
- Flow: each section earns the next?
- Conversion: next action obvious; CTA ladder correct?
- Brand: SlashExperts; no "advocacy"; "booking system"; AI terms correct.
- Length: within slot targets; depth useful not padded.

**5. Revision.**
Fold the critique in. (Repeat 4–5 only if a hard issue remains — default is one round.)

**6. UX sign-off + wireframe-for-approval.**
The UX group confirms copy fits the layout; produce a clean wireframe/preview showing copy in place. → *Gate: Jeff reviews and approves, or sends notes.*

**7. Build.**
On Jeff's approval, implement in Eleventy (honoring template rules), update `PAGE_TRACKER.md`, and log any new asset needs for the designer.

## Status values (used in PAGE_TRACKER.md)
`TODO → Brief → Wireframe → Draft → Critique → Approved → Built`

## Principles
- **One real debate round, then converge.** The lens is the value, not theater.
- **Ask, don't guess.** Any genuine ambiguity or conflict → AskUserQuestion to Jeff in-session.
- **Update the brain.** New decisions → DECISIONS.md; new patterns/voice rules → MESSAGING_BIBLE.md.
