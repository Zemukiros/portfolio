---
name: Zemariam Haftegebriel — Portfolio
description: Paper & Field — a light editorial engineering notebook
colors:
  bg: "#f4f2ea"
  bg-raised: "#efece2"
  bg-panel: "#e7e3d6"
  border: "#dcd8ca"
  border-strong: "#c4bfae"
  ink: "#18211a"
  ink-dim: "#485148"
  ink-faint: "#5a6258"
  accent: "#2f6a3b"
  accent-strong: "#285d33"
  accent-deep: "#1f4a29"
  amber: "#b7791f"
  rose: "#c2416b"
  cyan: "#1f7a8c"
  mint: "#2f855a"
typography:
  display:
    fontFamily: "Instrument Serif, ui-serif, Georgia, serif"
    fontSize: "clamp(3rem, 7vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Instrument Serif, ui-serif, Georgia, serif"
    fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Instrument Serif, ui-serif, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, SF Mono, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.16em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  pill: "9999px"
spacing:
  section-rhythm: "128px"
  heading-to-content: "56px"
  row-pad-y: "20px"
  card-pad: "28px"
components:
  button-primary:
    backgroundColor: "{colors.accent-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  nav-floating:
    backgroundColor: "{colors.bg-raised}"
    rounded: "{rounded.pill}"
    padding: "6px"
  modal:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.xl}"
    padding: "40px"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.sm}"
    padding: "3px 8px"
---

# Design System: Zemariam Haftegebriel — Portfolio

> Replaces "Signal Violet" (dark, violet, 2026-03 → 2026-10). Adopted 2026-10-04 on
> `feat/editorial-rebrand`. Plan: `docs/plans/2026-10-editorial-rebrand.md`.

## Overview

**Creative North Star: "Paper & Field."** An engineering notebook: warm paper, dark
ink, one forest-green accent, and a thin editorial serif doing the talking. The page is
quiet so the work reads clearly. It refuses the dark-gradient-card portfolio cliché
the previous system drifted toward. Density is low and the rhythm is slow:
generous whitespace, hairline rules, and lists and tables instead of card mosaics.

It belongs to the light editorial genre that the reference (`~/design-refs/Reference.mp4`)
works in. **Inspiration, not copy:** we share its open-licensed fonts and its general
vocabulary (serif headlines, hairlines, table-style project list, accordion, modal
details, floating nav). All code, copy, imagery, and exact composition are ours. The
reference site is not licensed for reuse.

**Key characteristics**
- Paper ground, ink type, **one** forest-green accent. Nothing else in UI chrome.
- Instrument Serif headlines at regular weight (never bold), with Inter for body and JetBrains Mono for data.
- Hairline rules and paper tones separate surfaces. Shadows are reserved for floating layers.
- A numbered mono eyebrow above each section heading (`01 — About`).
- One signature object: a minimalist, product-true 3D form (the Mini-S3 hash ring) in About.
- Honest status language everywhere, unchanged from the previous system.

## Colors

### Accent
- **Field Green** (`accent`, #2f6a3b): links, active states, the heading accent words, focus ring, heatmap scale top.
- **Field Green Text** (`accent-strong`, #285d33): accent used as small text. It is ≥ 6:1 on every paper surface.
- **Deep Field** (`accent-deep`, #1f4a29): primary button fill (white text 10:1) and hover/pressed state.

### Paper and ink
- **Paper** (`bg`, #f4f2ea): page ground. Never pure white.
- **Paper Raised** (`bg-raised`, #efece2): row hover, nav pill, chips.
- **Paper Panel** (`bg-panel`, #e7e3d6): nested wells, heatmap empty cells.
- **Hairline** (`border`, #dcd8ca) / **Hairline Strong** (`border-strong`, #c4bfae): every divider, table rule, and card edge.
- **Ink** (#18211a) headings · **Ink Dim** (#485148) body · **Ink Faint** (#5a6258) meta. All pass WCAG AA on all three paper tones.

### Tertiary (illustration and status only)
Amber, rose, mint, and cyan carry status inside the Mini-S3 console and diagrams, never in chrome.

### Named rules
**The One Green Rule.** Field Green is the only accent in UI chrome. Brand tech marks keep
their true colors (`TechIcon noLift`); project imagery lives inside its frame. There are no
per-project gradient panels.

**The Accent Close Rule.** Section headings set their last phrase in Field Green and end
with a green period: `<span class="text-accent">phrase.</span>`. One per heading.

## Typography

- **Display** (Instrument Serif 400, clamp 3–5.5rem, lh 0.95): hero greeting only.
- **Headline** (Instrument Serif 400, clamp 2.25–3.5rem, lh 1.0): section headings, set on two lines.
- **Title** (Instrument Serif 400, 1.25–1.75rem): project names, roles, modal titles. Italic is allowed for the "@ Org" part of a role line.
- **Body** (Inter 400, 15–17px, lh 1.65, ink-dim). Emphasis is `font-medium text-ink`, never color.
- **Label** (JetBrains Mono 500, 11px, +0.16em, uppercase): section eyebrows, table headers, dates, tags, stats captions.

**The Serif-Never-Bold Rule.** Instrument Serif ships one weight. Never fake-bold it; hierarchy comes from size and color.
**The Mono-Means-Data Rule.** Mono is only for data and metadata, as before.

## Layout

- `max-w-6xl` container, `px-5 sm:px-8`. Sections run `py-32` (128px) with heading → content `mt-14`.
- **Section opening:** mono eyebrow `0N — Name`, then a two-line serif headline on the left and an optional short ink-dim paragraph on the right (`lg:grid-cols-[1.4fr_1fr]`).
- **Hero:** full-viewport framed image with a centered greeting, a one-line role, and three pill links. On scroll, the frame insets (scale ~0.94, radius 0 → 20px) as the paper page rises over it.
- **Project list:** a table (thumbnail · name + one-liner · stack tags · year · arrow) with hairline row rules. It collapses to stacked rows under `md`.
- **Navigation:** a floating pill nav fixed to the bottom center, shown after the hero, with section links and a primary "Let's talk".

## Elevation & Depth

Flat by default: paper tone steps plus hairlines.
- **Floating layer shadow** (`0 12px 40px rgba(24,33,26,0.12)`): floating nav, modal, contact popover only.
- **Scrim:** `rgba(24,33,26,0.35)` plus a 2px backdrop blur behind modals and popovers.

**The Floating-Only Shadow Rule.** Only floating layers cast shadows. Cards, rows, and chips never do.

## Shapes

Radius ladder: 20px modals and the hero frame → 16px cards and stack panels → 12px thumbnails and wells → 8px tags and icon buttons → pills for buttons, nav, and status badges.

## Components

- **Buttons:** primary is a Deep Field pill with white text. Ghost is a pill with a 1px Hairline Strong border and ink text, turning to a green border on hover. Text links get an animated underline in Field Green.
- **Projects (restyle only; behavior is fixed).** The link logic from `ProjectCarousel` is preserved exactly. **Case study** goes to `caseStudyPath`. **GitHub** goes to `github`. **Live site** / **Live demo** go to `liveUrl`. **Demo** / **View demo** go to `demoUrl`. **Simulator →** goes to `simulatorPath` when there is no deployment. Every missing link renders its "· soon" placeholder. Featured project, status badges, headline metrics, and the three case-study pages keep their current content and routes. Only the presentation changes: a minimal row (thumbnail · name + one-liner · stack tags · status · arrow) with hairline rules. Hover tints the row Paper Raised and turns the arrow green, rotated −45°. A click opens the **project modal** with the same link set as visible actions, plus the headline metric and stack. The modal closes with Esc, the scrim, or the ✕; focus is trapped and returns to the row.
- **Experience accordion:** a row with "Role *@ Org*", mono dates, and a chevron. It expands to bullets and tags. One open at a time, using `button[aria-expanded]` with a region.
- **Stack panels:** 16px hairline cards per group. The mono label, serif title, and one sentence sit above brand-mark chips.
- **GitHub activity:** stat cells (repos, contributions, followers, joined) plus a 53×7 heatmap in 4 green steps over Paper Panel, generated **at build time**. Numbers are real or the block is hidden.
- **Capabilities grid:** a numbered hairline grid, with mono numbers, a serif title, and one ink-dim line. Every capability maps to a shipped repo.
- **Contact:** a two-line headline, a short line, a Download CV primary button, a sitemap column, and a links column. "Let's talk" opens a popover with Copy email, Email, LinkedIn, and GitHub. There is no form backend.
- **Status badge:** a mono 11px pill with a hairline border and a dot. Live / Built & verified use green, In development uses ink-dim, Up next uses faint. **The Honest Status Rule** is unchanged.

## Signature: the 3D object

A minimalist **Mini-S3 hash ring** sits in About where a portrait would go. It is a thin ink torus with five node beads, and one green key arc travels to its replica nodes. Preference lists come from `src/lib/hashRing.ts`, so it is true to the product. It is rendered with React Three Fiber in matte ink and paper tones, with no gradients or glow. It rotates slowly at idle and tilts ≤ 8° toward the pointer.
- It loads lazily after first paint and only renders when on screen.
- The fallback is a static authored SVG of the same ring, used for `prefers-reduced-motion`, missing WebGL, `(hover: none)` low-power devices, and while loading.
- `role="img"` with a description of what the ring shows.

**The One Object Rule.** One 3D object on the site. It is never decorative-only, and no other WebGL.

## Imagery

- The **hero image** is the only photographic or rendered image allowed. It must be the owner's own photo, a licensed asset, or a generated image approved with its cost stated. Never reuse the reference's image.
- Project thumbnails are real screenshots of the real product, or the existing authored mockups re-rendered for paper.
- Diagrams remain authored SVG and product-true (**The Product-True Illustration Rule** stands).

## Motion

A small, calm set. Everything collapses under `prefers-reduced-motion`.
- Hero frame inset on scroll, plus a one-time greeting fade/rise (0.8s, `cubic-bezier(0.16,1,0.3,1)`).
- Section heading reveal: 12px rise and fade, once, headings only.
- Row hover tint and arrow rotate (200ms). Accordion height via `grid-template-rows` (250ms). Modal and popover: scale 0.98 → 1 plus fade (200ms in, 150ms out).
- The 3D ring idle rotation, paused when off screen.

**The Calm Motion Rule.** No scroll-jacking, no smooth-scroll libraries, no parallax outside the hero frame.

## Accessibility (unchanged bar)
Landmarks, skip link, visible `focus-visible` ring (2px Field Green, 3px offset), labeled SVGs, dialog semantics with focus trap, keyboard-operable accordion and table rows, AA contrast on every paper surface, reduced-motion and touch fallbacks.

## Do / Don't
- **Do** keep one green accent, hairlines, the serif at regular weight, numbered eyebrows, and honest statuses.
- **Do** ship fallbacks with every motion or 3D surface.
- **Don't** add gradients, glow, card shadows, a second accent, bold serif, or a second 3D object.
- **Don't** copy the reference's code, wording, or images.
