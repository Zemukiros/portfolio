---
name: Zemariam Haftegebriel — Portfolio
description: Signal-violet studio-dark stage where one engineer's systems perform
colors:
  bg: "#07060c"
  bg-raised: "#0d0b16"
  bg-panel: "#131022"
  border: "#221d33"
  border-strong: "#322a4a"
  ink: "#f1eef9"
  ink-dim: "#a49dbd"
  ink-faint: "#837da6"
  accent: "#8b5cf6"
  accent-strong: "#a78bfa"
  accent-deep: "#6d28d9"
  amber: "#e8b45a"
  rose: "#f472b6"
  cyan: "#22d3ee"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8vw, 5.75rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, SF Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.2em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "9999px"
spacing:
  chip-gap: "12px"
  card-pad: "32px"
  card-pad-lg: "40px"
  section-gap-heading: "48px"
  section-rhythm: "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
  card-panel:
    backgroundColor: "{colors.bg-raised}"
    rounded: "{rounded.xl}"
    padding: "{spacing.card-pad}"
  chip-skill:
    backgroundColor: "{colors.bg-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 16px 10px 12px"
  tag-stack:
    backgroundColor: "{colors.bg-panel}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  tab-active:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  tab-inactive:
    backgroundColor: "transparent"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
---

# Design System: Zemariam Haftegebriel — Portfolio

## Overview

**Creative North Star: "The Signal-Violet Stage"**

A studio-dark engineering world where one engineer's systems perform. The
ground is a near-black violet (#07060c), and a single committed violet
(#8b5cf6) carries everything that matters: the computed route in the hero
graph, the primary CTAs, the glow atmospheres, and the accent period that
closes every heading. The build explicitly refuses two clichés named in its
direction contract: the résumé-pasted-into-a-dark-template page, and the
terminal-costume page. The tone is confident and product-true — the hero
does not decorate, it *computes*: a route graph draws itself on arrival and
a ranking chip lands last, dramatizing the actual mechanism of the featured
project (K-shortest paths + preference ranking).

Density is generous: full-viewport hero (min-height 94svh), 96px section
rhythm, 24px-radius panels with 32-40px internal padding. Depth comes from
layered violet-tinted surfaces and hairline borders, not shadows. Motion is
concentrated into one authored entrance moment; the rest of the page is
still.

**Key Characteristics:**
- One committed violet on a near-black violet ground; brand tech marks are the only polychrome
- Bricolage Grotesque display at heavy weights; Inter body; JetBrains Mono strictly for data, meta, and labels
- Product-true violet line-work SVG illustrations, never stock imagery or gradient stand-ins
- One orchestrated hero entrance; no scattered scroll reveals
- Honest status language everywhere (verified metrics, truthful badges, "in · soon" placeholders)

## Colors

A monochrome violet world: three stacked dark surfaces, three ink strengths,
one accent in three intensities, and a reserved trio of illustration accents.

### Primary
- **Signal Violet** (`accent`, #8b5cf6): the one committed accent. Carries the computed route in graph illustrations, primary CTA fill, the heading-closing period, tab-active fill, bullet arrows, focus glow. If it is violet, it is the signal.
- **Lifted Violet** (`accent-strong`, #a78bfa): the legible violet for text on dark — accent words inside headings, metric values, kicker/meta text, big graph nodes, hover-state link color.
- **Deep Violet** (`accent-deep`, #6d28d9): pressed/hover fill for primary buttons and the dense end of glow atmospheres (`rgba(109,40,217,0.28)`).

### Neutral
- **Stage Black** (`bg`, #07060c): the page ground. Near-black with a violet undertone; never pure #000.
- **Raised Stage** (`bg-raised`, #0d0b16): first elevation — cards, chips, panels sitting on the ground.
- **Panel Violet** (`bg-panel`, #131022): second elevation — nested surfaces, tags on cards, illustration chip fills.
- **Hairline** (`border`, #221d33): default 1px border on every raised surface.
- **Hairline Strong** (`border-strong`, #322a4a): emphasized borders — featured cards, ghost buttons, icon buttons — and the gray edges of every graph illustration.
- **Ink** (`ink`, #f1eef9): headings and emphasized body text.
- **Ink Dim** (`ink-dim`, #a49dbd): default body/paragraph text and nav links.
- **Ink Faint** (`ink-faint`, #837da6): meta lines, footnotes, tile captions — the quietest text allowed on the page.

### Tertiary (illustration-only)
- **Amber** (#e8b45a), **Rose** (#f472b6): appear only inside SVG vignettes (window-chrome dots). **Cyan** (#22d3ee) is a defined token currently unused on the homepage — reserved, no role yet; do not reach for it in UI chrome.
- The illustration layer also uses a recurring dim-violet sub-palette (see Components → Illustrations).

### Named Rules
**The One Committed Violet Rule.** Violet is the only UI accent. No second
hue may enter buttons, links, borders, badges, or headings. The exceptions
are the brand tech marks (see below) and the illustration-only amber/rose
window dots.

**The Brand-Marks Exception.** Official technology logos (simple-icons brand
hex values, AWS orange #FF9900) are the only polychrome on the page. Marks
too dark for the ground are lifted to near-ink (`TechIcon` LIFT map); never
recolor a brand mark to violet to force harmony.

**The Accent Period Rule.** Display and section headings end with a violet
period (`<span class="text-accent">.</span>`). It is the signature
punctuation of the world; one per heading, never mid-sentence.

## Typography

**Display Font:** Bricolage Grotesque Variable (with ui-sans-serif, system-ui)
**Body Font:** Inter Variable (with ui-sans-serif, system-ui)
**Label/Mono Font:** JetBrains Mono Variable (with ui-monospace, SF Mono)

**Character:** A heavy, characterful grotesque doing the talking over a
neutral workhorse body, with a monospace strictly rationed to data. The
pairing reads engineering-confident, not terminal-costumed.

### Hierarchy
- **Display** (800, clamp(3rem, 8vw, 5.75rem), lh 0.98, ls -0.03em): the hero name only — two lines plus the violet period. Contact closer runs a smaller display clamp (800, clamp(2.5rem, 6vw, 4.5rem)).
- **Headline** (700, 2.25rem → 3rem at `sm`, tracking-tight): section headings; last word rendered in Lifted Violet + violet period. The About statement uses a mid clamp (600, clamp(1.5rem, 3.2vw, 2.25rem)) with a two-tone ink → ink-faint sentence split.
- **Title** (700, 1.25-1.875rem): card and panel titles — project names (1.875rem featured / 1.5rem secondary), role titles, school names (1.25rem).
- **Body** (400, 15px-1.125rem, leading-relaxed, ink-dim): paragraphs, bullets, ledes (1.125rem). Hero subtitle runs larger (1.25-1.5rem). Emphasis = `font-semibold text-ink`, never a color change.
- **Label** (mono, 500, 0.75rem, +0.2em, UPPERCASE): skill-group labels. Non-uppercase mono meta at 11-14px: hero greeting, date/location lines, status badges, footnotes inside illustrations.

### Named Rules
**The Mono-Means-Data Rule.** JetBrains Mono appears only where content is
data or metadata — dates, locations, metrics, statuses, group labels, code
strings inside illustrations. Never for headings, paragraphs, or buttons.

## Layout

Single centered column: `max-w-6xl` (72rem) container, `px-5` gutters
rising to `px-8` at `sm`. Section rhythm is `py-24` (96px; contact runs
`py-28`), each section opening with a `max-w-2xl` heading block and content
following at `mt-12` (48px). The hero is a full-viewport
(`min-h-[94svh]`) two-column grid, `1.05fr / 0.95fr` at `lg` — text left,
animated graph right; below `lg` the graph collapses to a compact static
`RouteStrip` card. Card grids: 3-up (`lg:grid-cols-3`) for
education/certification, 2-up (`md:grid-cols-2`) for secondary projects.
The nav is a fixed 4.5rem bar (transparent at top; `bg/85` + blur + border
after 12px of scroll), with `scroll-padding-top: 5.5rem` compensating
anchor jumps. Spacing steps observed: 8/12/16/24px within components, 32/40px
card padding, 48px heading-to-content, 96px between sections. One
atmosphere flourish: an oversized rotated "ENGINEER" watermark at
`text-ink/[0.045]`, `xl`-only, aria-hidden.

## Elevation & Depth

Flat by conviction. Depth is tonal — three stacked surface colors
(bg → bg-raised → bg-panel), each step bounded by a 1px hairline border —
plus atmosphere: large radial glows (`.hero-glow`, blur(90px), violet at
14-28% alpha) behind the hero and contact sections, and faint violet
contour lines in the hero corner. The single box-shadow in the system is the
primary CTA's accent glow.

### Shadow Vocabulary
- **CTA glow** (`box-shadow: 0 8px 30px rgba(139,92,246,0.35)`): primary buttons only; intensifies to `0.5` alpha on hover. It reads as light emission from the violet fill, not as elevation.

### Named Rules
**The Borders-Not-Shadows Rule.** Surfaces separate by background step +
hairline border. No card shadows, no drop shadows on text or illustrations.
The only permitted shadow is the CTA glow above.

## Shapes

Soft, generous geometry on a strict ladder: **24px** (`rounded-3xl`) for
section panels and project/education cards; **16px** (`rounded-2xl`) for
nested insets (visual wells, side vignette panels, mobile route strip);
**12px** (`rounded-xl`) for buttons, skill chips, and metric tiles; **8px**
(`rounded-lg`) for icon buttons, the nav logo tile, and nav GitHub button;
**full pill** for tags, tabs, fact chips, and status badges. Rule of thumb:
radius shrinks with nesting depth — container 24 → inset 16 → control 12 →
icon 8 — and anything text-sized-and-standalone is a pill. Illustration
rects echo the ladder at SVG scale (rx 6-14).

## Components

### Buttons
- **Shape:** softly rounded (12px)
- **Primary:** Signal Violet fill, white semibold 15px text, `px-7 py-3.5` (28×14px), CTA glow shadow. Hover: Deep Violet fill + stronger glow, `transition-all`.
- **Ghost (secondary):** transparent, 1px Hairline Strong border, ink medium text, same padding. Hover: border and text shift to violet (`hover:border-accent hover:text-accent-strong`).
- **Text link:** ink-dim medium, hover to ink; external links suffixed "↗".

### Chips (three distinct species — do not merge)
- **Skill chip:** 12px radius, bg-raised, hairline border, brand icon (22px) + 14px medium ink label. Hover: border upgrades to Hairline Strong. Fallback icon: 8px violet dot.
- **Stack tag:** full pill, bg-panel, hairline border, 12px ink-dim text. Static, non-interactive.
- **Fact chip (About):** full pill, bg-raised, Hairline Strong border, 14px medium ink-dim, `px-5 py-2.5`.

### Status Badge (signature)
Honest-status pill: mono 11px, tracking-wide, 1.5px colored dot, full pill,
tinted per status. Statuses map to a public-claims rule — **Live** and
**Built & verified · deploying** get violet tint (`text-accent-strong
border-accent/40 bg-accent/10`), **In development** a fainter violet
(`border-accent/30 bg-accent/5`), **Up next** stays neutral (ink-dim,
Hairline Strong border, no fill). **The Honest Status Rule.** Badge labels
never overstate: "Planned" renders as "Up next", never as done; a metric
appears only when verified.

### Cards / Containers
- **Corner Style:** 24px
- **Background:** bg-raised default; featured project card uses a subtle surface gradient (`from-bg-panel via-bg-raised to-bg-raised`) with Hairline Strong border
- **Shadow Strategy:** none (see Elevation)
- **Border:** 1px Hairline; hover on interactive cards upgrades to Hairline Strong
- **Internal Padding:** `p-8` (32px), `sm:p-10` (40px) on hero-level panels
- **Signature variant — Certification card:** the one gradient-filled panel in the system: `linear-gradient(140deg, #2a1758 0%, #6d28d9 70%, #8b5cf6 110%)`, white text. Reserved for the AWS certification; do not spawn more gradient cards.

### Metric tiles
Inside project cards: 12px radius, `bg/60` well, hairline border, centered —
value in display font (1.25rem bold, Lifted Violet) over a 10.5px ink-faint
caption. Values are verified evidence only.

### Navigation
Fixed bar, transparent → `bg/85` + `backdrop-blur-md` + bottom hairline
after 12px scroll (300ms color transition). Logo: 36px violet tile with
display-bold "Z" + display-semibold name (hidden below `md`). Links: 14px
medium ink-dim → ink on hover. GitHub button: ghost style at 8px radius.
Mobile: 40px bordered hamburger toggling a stacked menu (`aria-expanded`,
`aria-controls`); mobile GitHub link colored Lifted Violet.

### Tabs (Experience)
Proper `role="tablist"` pills: active = violet fill + white text; inactive =
Hairline Strong border + ink-dim, hover to violet border. Panel wired with
`aria-controls` / `aria-labelledby`.

### Social icon buttons
44px square, 8px radius, Hairline Strong border, inline SVG line icons
(currentColor, ink-dim), hover → violet border + Lifted Violet icon.
Missing links render as honest placeholders ("in · soon"), never dead links.

### Illustrations (signature)
Violet line-work SVG vignettes drawing the products' real mechanisms: the
hero route graph (K-shortest-paths ranked-route dramatization), ranked route
chips, playlist rows, guarded-query strings, drone-delivery and service-stack
diagrams. Shared vocabulary: gray edges in Hairline Strong (#322a4a,
1.3-1.5px), highlighted route in Signal Violet (2.4-3.5px, round caps),
big nodes Lifted Violet, and a recurring dim-violet sub-palette — **#584b85**
(dim nodes), **#3d3358** (skeleton bars), **#1c1533** ("hot"/selected fills)
— with mono captions in ink-dim/ink-faint. Meaningful graphics get
`role="img"` + `aria-label`; decorative ones `aria-hidden`. **The
Product-True Illustration Rule.** Every vignette depicts a real mechanism of
the system it represents — never stock imagery, screenshots faked as UI, or
gradient stand-ins.

### Motion (system-wide)
One authored moment: the hero entrance. `hero-rise` (rise-in: 26px lift +
fade, 0.9s `cubic-bezier(0.16,1,0.3,1)`, five stagger steps at 0.05-0.5s),
graph edges drawing via stroke-dashoffset (1.6s `cubic-bezier(0.65,0,0.35,1)`,
per-edge 50ms stagger), nodes popping (0.5s `cubic-bezier(0.22,1,0.36,1)`,
delay keyed to graph depth), ranking chip landing last (2s), then a slow
route pulse (3.4s ease-in-out, infinite). Everything else is hover-level
`transition-colors`/`transition-all`. `prefers-reduced-motion` collapses all
of it to final-state instantly (opacity 1, dashoffset 0, universal 0.01ms
override). **The One Authored Moment Rule.** Entrance animation lives in the
hero only; new sections arrive static — no scattered scroll reveals.

## Do's and Don'ts

### Do:
- **Do** keep violet (#8b5cf6 family) as the only UI accent, with official brand marks as the sole polychrome.
- **Do** step surfaces bg → bg-raised → bg-panel with 1px hairline borders instead of shadows.
- **Do** follow the radius ladder: 24px panels, 16px insets, 12px controls, 8px icon buttons, pills for tags/badges.
- **Do** hold the section rhythm: `max-w-6xl`, `px-5 sm:px-8`, `py-24`, heading block then `mt-12` content.
- **Do** draw new project visuals as violet line-work SVGs of the real mechanism, using the shared edge/node/hot-fill vocabulary.
- **Do** end display and section headings with the violet period, and render heading accent words in Lifted Violet.
- **Do** ship reduced-motion fallbacks and full aria wiring (skip link, `focus-visible` outline `2px accent-strong / 3px offset`, labeled SVGs, tablist semantics) with every new surface.
- **Do** keep statuses and metrics honest — badge labels and metric tiles state only verified facts.

### Don't:
- **Don't** introduce a second accent hue, recolor brand marks to violet, or use the unused cyan token without first assigning it a documented role.
- **Don't** add box shadows to cards, text, or illustrations — the CTA glow is the only shadow.
- **Don't** use JetBrains Mono for headings, paragraphs, or buttons; mono means data.
- **Don't** add scroll-triggered reveals to homepage sections; the `.reveal` class is legacy, kept only for the old case-study page.
- **Don't** create new gradient-filled panels; the certification card owns that device.
- **Don't** replace product-true SVG vignettes with stock imagery, emoji, glyph-font icons, or abstract gradient blobs.

---

*Known boundary: `/projects/intelliroute` (the case-study page) predates this
system — it still uses the legacy `.reveal` scroll-reveal and simpler styling
and is scheduled for redesign. Do not treat that page as a source of system
rules; this document describes the homepage system it will be migrated to.*
