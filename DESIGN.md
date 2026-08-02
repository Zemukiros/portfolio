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
  chip-action-white:
    backgroundColor: "#ffffff"
    textColor: "{colors.accent-deep}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
---

# Design System: Zemariam Haftegebriel — Portfolio

## Overview

**Creative North Star: "The Signal-Violet Stage"**

A studio-dark engineering world where one engineer's systems perform. The
ground is a near-black violet (#07060c), and a single committed violet
(#8b5cf6) carries everything that matters in the UI chrome: primary CTAs,
glow atmospheres, indicators, and the accent period that closes every
heading. The build explicitly refuses two clichés named in its direction
contract: the résumé-pasted-into-a-dark-template page, and the
terminal-costume page. The tone is confident, warm, and product-true — the
hero is an authored polychrome avatar scene: the engineer himself at his
desk, waving, his monitor running the IntelliRoute route graph, pastel UI
cards floating around him on a three-layer pointer parallax. Polychrome is
deliberate and contained: the avatar scene, brand tech marks, and
per-project gradient identities are its only homes.

Density is generous: full-viewport hero (min-height 94svh), 96px section
rhythm, 24px-radius panels with 32-40px internal padding. Depth comes from
layered violet-tinted surfaces and hairline borders, not shadows — except
on the gradient showcase cards, where tilted mockup windows sit on a deep
ambient drop. Motion is a small sanctioned set: the orchestrated hero
entrance with its idle float and parallax, section-heading reveals, and
gentle hover lifts; everything else is still.

**Key Characteristics:**
- One committed violet in UI chrome; polychrome lives only in three sanctioned zones — the hero avatar scene, brand tech marks, and project gradient identities
- Bricolage Grotesque display at heavy weights; Inter body; JetBrains Mono strictly for data, meta, and labels
- Product-true authored SVG illustration — line-work vignettes, dark mockup windows, and the avatar scene — never stock imagery or gradient stand-ins
- One orchestrated hero entrance plus a quiet sanctioned interaction set (heading reveals, hover lifts, idle float, pointer parallax)
- Honest status language everywhere (verified metrics, truthful badges, "· soon" placeholder slots for missing links)

## Colors

A monochrome violet UI over three stacked dark surfaces, with three ink
strengths, one accent in three intensities — and three sanctioned
polychrome zones that never leak into chrome.

### Primary
- **Signal Violet** (`accent`, #8b5cf6): the one committed accent. Carries the computed route in illustrations, primary CTA fill, the heading-closing period, tab-active fill, the active carousel dot, bullet arrows, focus glow. If it is violet, it is the signal.
- **Lifted Violet** (`accent-strong`, #a78bfa): the legible violet for text on dark — accent words inside headings, meta text, big graph nodes, hover-state link and arrow color.
- **Deep Violet** (`accent-deep`, #6d28d9): pressed/hover fill for primary buttons, text color on white action chips, and the dense end of glow atmospheres (`rgba(109,40,217,0.28)`).

### Secondary (project gradient identities)
Each showcase project owns one fixed gradient, used only on its identity
surfaces (carousel card, case-study hero and closing panel):
- **IntelliRoute** (featured): `linear-gradient(135deg, #37167f 0%, #6d28d9 55%, #8b5cf6 115%)` — the house violet.
- **Rhythmiq**: `linear-gradient(135deg, #4a1268 0%, #86198f 60%, #d946ef 130%)` — magenta.
- **QueryGuard**: `linear-gradient(135deg, #1e1b5e 0%, #4338ca 60%, #818cf8 130%)` — indigo.

Text on gradients is white (white/80 body, white/70 meta); UI on gradients
is white glass (`bg-white/12`-`/15`, `border-white/25`) or solid white chips.

### Neutral
- **Stage Black** (`bg`, #07060c): the page ground. Near-black with a violet undertone; never pure #000. At 45% alpha + blur it is the carousel-card footer bar.
- **Raised Stage** (`bg-raised`, #0d0b16): first elevation — cards, chips, panels sitting on the ground.
- **Panel Violet** (`bg-panel`, #131022): second elevation — nested surfaces, tags on cards, illustration chip fills.
- **Hairline** (`border`, #221d33): default 1px border on every raised surface.
- **Hairline Strong** (`border-strong`, #322a4a): emphasized borders — ghost buttons, icon buttons, arrow buttons, inactive carousel dots — and the gray edges of every graph illustration.
- **Ink** (`ink`, #f1eef9): headings and emphasized body text.
- **Ink Dim** (`ink-dim`, #a49dbd): default body/paragraph text and nav links.
- **Ink Faint** (`ink-faint`, #837da6): meta lines, footnotes, tile captions, the carousel counter — the quietest text allowed on the page.

### Tertiary (illustration-only)
- **Amber** (#e8b45a) and **Rose** (#f472b6): window-chrome dots in mockup windows; rose also draws the hero scene's cursor. **Mint** (#34d399 — a recurring raw literal, not a theme token): the "verified" check marks in mockups, the green window-chrome dot, and the hero plant. **Cyan** (#22d3ee) remains a defined but unused token — reserved, no role yet.
- The hero avatar scene carries its own contained palette: warm skin tones (#96603c, #8a5a3b), near-black curls (#1b1526), cream sweater (#f3efe9), violet furniture (#5b21b6, #6d28d9, #4c1d95), pastel floating-card fills (#efeafd, #fbe7f5, #f6f4fd) and a five-swatch palette pill. These stay inside the scene; none may migrate into UI chrome.
- The line-work layer keeps a recurring dim-violet sub-palette (see Components → Illustrations).

### Named Rules
**The One Committed Violet Rule (amended).** Violet is the only accent in
UI chrome — buttons, links, borders, badges, headings, indicators.
Polychrome is sanctioned in exactly three zones: brand tech marks, the hero
avatar scene, and the per-project gradient identities on carousel cards. No
fourth zone without an explicit, user-approved amendment.

**The Brand-Marks Exception.** Official technology logos (simple-icons
brand hex values, AWS orange #FF9900) keep their true colors. Marks too
dark for the dark ground are lifted to near-ink (`TechIcon` LIFT map); on
light surfaces (the white floating chips on gradient cards) they render
their true brand hex via `noLift`. Never recolor a brand mark to violet.

**The Accent Period Rule.** Display and section headings end with a violet
period (`<span class="text-accent">.</span>`). It is the signature
punctuation of the world; one per heading, never mid-sentence. On gradient
surfaces, where violet would vanish, the closing period renders
`text-white/50` instead.

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
- **Title** (700, 1.25-1.875rem): card and panel titles — project names (1.875rem, white on gradient cards), role titles, school names (1.25rem).
- **Body** (400, 15px-1.125rem, leading-relaxed, ink-dim; white/80 on gradients): paragraphs, bullets, ledes (1.125rem). Hero subtitle runs larger (1.25-1.5rem). Emphasis = `font-semibold text-ink`, never a color change.
- **Label** (mono, 500, 0.75rem, +0.2em, UPPERCASE): skill-group labels. Non-uppercase mono meta at 10.5-14px: hero greeting, date/location lines, status chips, headline metrics, carousel counter, footnotes inside illustrations.

### Named Rules
**The Mono-Means-Data Rule.** JetBrains Mono appears only where content is
data or metadata — dates, locations, metrics, statuses, group labels, code
strings inside illustrations. Never for headings, paragraphs, or buttons.

## Layout

Single centered column: `max-w-6xl` (72rem) container, `px-5` gutters
rising to `px-8` at `sm`. Section rhythm is `py-24` (96px; contact runs
`py-28`), each section opening with a `max-w-2xl` heading block and content
following at `mt-12` (48px; the carousel starts tighter at `mt-6`). The
hero is a full-viewport (`min-h-[94svh]`) two-column grid, `1.05fr /
0.95fr` at `lg` — text left, avatar scene right; below `lg` the same scene
re-renders full-width beneath the hero copy. The hero meta line carries
location and degree only — the AWS certification lives solely in
Education. The projects carousel breaks out of the container full-bleed
(`-mx-5 sm:-mx-8` with matching scroll padding): a `snap-x snap-mandatory`
scroll track with hidden scrollbar, featured card at `88vw`/max-860px,
others `85vw`/max-560px. Card grids elsewhere: 3-up (`lg:grid-cols-3`) for
education/certification. The nav is a fixed 4.5rem bar (transparent at
top; `bg/85` + blur + border after 12px of scroll), with
`scroll-padding-top: 5.5rem` compensating anchor jumps. Spacing steps
observed: 8/12/16/24px within components, 28-32/40px card padding, 48px
heading-to-content, 96px between sections. One atmosphere flourish: an
oversized rotated "ENGINEER" watermark at `text-ink/[0.045]`, `xl`-only,
aria-hidden.

## Elevation & Depth

Flat by conviction on the dark ground: depth is tonal — three stacked
surface colors (bg → bg-raised → bg-panel), each step bounded by a 1px
hairline border — plus atmosphere: large radial glows (`.hero-glow`,
blur(90px), violet at 14-28% alpha) behind the hero and contact sections,
and faint violet contour lines in the hero corner. The gradient showcase
cards are the exception zone: their tilted mockup windows and floating
tech-mark chips cast real shadows against the gradient.

### Shadow Vocabulary
- **CTA glow** (`box-shadow: 0 8px 30px rgba(139,92,246,0.35)`): primary buttons only; intensifies to `0.5` alpha on hover. Light emission from the violet fill, not elevation.
- **Mockup drop** (`box-shadow: 0 24px 60px rgba(7,6,12,0.55)`): under the tilted mockup window on each gradient carousel card. The case-study page hero mockup uses a deeper cut of the same shadow (`0 30px 80px rgba(7,6,12,0.6)`).
- **Floating chip** (Tailwind `shadow-lg`): under the white circular tech-mark chips floating on gradient cards.

### Named Rules
**The Borders-Not-Shadows Rule (amended).** On the dark ground, surfaces
separate by background step + hairline border — no card shadows, no drop
shadows on text. Shadows are sanctioned only as the CTA glow and, on the
gradient carousel cards, the mockup drop and floating-chip shadows.

## Shapes

Soft, generous geometry on a strict ladder: **24px** (`rounded-3xl`) for
section panels, project carousel cards, and education cards; **16px**
(`rounded-2xl`) for nested insets (mockup windows, side vignette panels);
**12px** (`rounded-xl`) for buttons, skill chips, and inset wells; **8px**
(`rounded-lg`) for icon buttons, white action chips, the nav logo tile,
and nav GitHub button; **full pill** for tags, tabs, fact chips, status
chips, carousel dots, and arrow buttons. Rule of thumb: radius shrinks
with nesting depth — container 24 → inset 16 → control 12 → icon 8 — and
anything text-sized-and-standalone is a pill. Illustration rects echo the
ladder at SVG scale (rx 6-16). One signature gesture: **the tilted
mockup** — carousel mockup windows rotate `+5deg` from a bottom-left
origin, deepening to `6.5deg` with a `1.015` scale on card hover (500ms).

## Components

### Buttons
- **Shape:** softly rounded (12px)
- **Primary:** Signal Violet fill, white semibold 15px text, `px-7 py-3.5` (28×14px), CTA glow shadow. Hover: Deep Violet fill + stronger glow, `transition-all`.
- **Ghost (secondary):** transparent, 1px Hairline Strong border, ink medium text, same padding. Hover: border and text shift to violet (`hover:border-accent hover:text-accent-strong`).
- **White action chip (on gradients):** solid white, Deep Violet medium 14px text, 8px radius, `px-4 py-2`. Hover: `bg-white/85`. Placeholder variant for missing links: `border-white/25 text-white/75` with a "· soon" label.
- **Arrow button (carousel):** 44px circle, Hairline Strong border, ink-dim chevron; hover to violet border + Lifted Violet; disabled at track ends via `opacity-35` with hover styles suppressed.
- **Text link:** ink-dim medium, hover to ink (white/90 → white on gradients); external links suffixed "↗".

### Chips (species — do not merge)
- **Skill chip:** 12px radius, bg-raised, hairline border, brand icon (22px) + 14px medium ink label. Hover: border upgrades to Hairline Strong and the chip lifts `-translate-y-0.5` (200ms).
- **Stack tag (dark):** full pill, bg-panel, hairline border, 12px ink-dim text. Static.
- **Stack tag (gradient):** full pill, `bg-white/12`, mono 10.5px `text-white/85`. Static.
- **Fact chip (About):** full pill, bg-raised, Hairline Strong border, 14px medium ink-dim, `px-5 py-2.5`.
- **Featured pill:** solid white pill, mono 11px semibold Deep Violet text — marks the featured carousel card.

### Status Badge (signature)
Honest-status pill in two variants. **On dark surfaces:** mono 11px,
tracking-wide, 1.5px colored dot, tinted per status — **Live** and **Built
& verified · deploying** in violet tint (`text-accent-strong
border-accent/40 bg-accent/10`), **In development** fainter
(`border-accent/30 bg-accent/5`), **Up next** neutral (ink-dim, Hairline
Strong border, no fill). **On gradient cards:** white glass
(`bg-white/15 backdrop-blur-sm`, white mono 11px, white dot). **The Honest
Status Rule.** Labels never overstate: "Planned" renders as "Up next",
never as done; a metric appears only when verified; missing case-study,
GitHub, or live links render visible "· soon" placeholder slots rather
than disappearing or faking a destination.

### Cards / Containers
- **Corner Style:** 24px
- **Background:** bg-raised default; carousel cards use their project gradient identity
- **Shadow Strategy:** none on dark cards; gradient cards per Elevation
- **Border:** 1px Hairline on dark cards; gradient cards are borderless
- **Internal Padding:** `p-8` (32px), `sm:p-10` (40px) on hero-level panels; carousel headers `p-7 sm:p-8`
- **Hover behavior:** interactive cards lift `-translate-y-1.5` (300ms)
- **Gradient panels:** reserved for identity — the three project carousel cards, each project's case-study hero and closing CTA panel (same identity gradient), and the AWS certification card (`linear-gradient(140deg, #2a1758 0%, #6d28d9 70%, #8b5cf6 110%)`, white text). Do not spawn gradient panels for anything without an identity of its own.

### Project Carousel (signature)
Full-bleed scroll-snap showcase: each project is one gradient-identity
card containing a header row (white title + one-liner + mono headline
metric), a tilted dark mockup window pushed to the right edge, floating
white tech-mark chips (`lg`-only, float-bob idle, true brand colors via
`noLift`), and a glassy footer bar (`bg-[#07060c]/45` + backdrop-blur)
holding stack tags and the action row. Position UI sits above the track:
pill-shaped dots (active dot stretches to `w-8` violet; inactive `w-2.5`
Hairline Strong) with a mono `n / total` counter, plus the arrow buttons.
Active-index tracking is saturation-aware — at scroll end the last card
counts as active even when a nearer snap point exists. Dots are a
`role="tablist"`; the track is a labeled `region`.

### Hero Scene (signature)
The authored avatar illustration (`HeroScene`): a friendly Black developer
at his desk, waving, monitor running the IntelliRoute route graph, laptop
sparkline, plant, and floating pastel UI cards (image card, play card,
ranking chip, palette pill, sparkles). Pure authored SVG — no stock
assets — with a meaningful `role="img"` description. Three parallax layers
respond to pointer position over the hero section via `--px`/`--py` custom
properties: back atmosphere moves `-14/-10px`, character/desk `+6/+4px`,
floating cards `+16/+12px`, each with a spring-like ease
(`cubic-bezier(0.22,1,0.36,1)`, 250-350ms). Floating cards idle on
`float-bob` (5.5s, ±7px, staggered delays). Parallax and bob are disabled
under `(hover: none)` and `prefers-reduced-motion`.

### Case-Study Surfaces (signature)
Project case-study pages (`/projects/intelliroute` is the template) extend
the system with a fixed set of conventions:
- **Gradient page hero:** the project's gradient identity fills the hero, then fades into the page ground via a bottom overlay (`h-40 bg-gradient-to-b from-transparent to-bg`); a `rotate-[2deg]` hero mockup (16px radius, deep mockup shadow) bleeds across the seam into the first section. Hero text is white; actions reuse the white action chip and "· soon" placeholder; stack tags are the gradient (white/12) variant.
- **Metric strip:** a single hairline `rounded-2xl` bg-raised `dl` row — mono semibold 1.25rem Lifted Violet value beside a 12px ink-dim label. This inline pairing is the sanctioned metric presentation on case studies; big-number stat cards are not.
- **Decision cards:** titles voiced as a tradeoff — "X over Y" plus an em-dashed tradeoff phrase in medium Lifted Violet ("— isolation over convenience"). The keystone decision gets the accent-tinted wide panel (`border-accent/30 bg-accent/5`, `md:col-span-2`); the rest are standard bg-raised cards with hover border upgrade. Callout asides use the same accent tint (`border-accent/25 bg-accent/5`).
- **Diagram suite:** large schematic SVG diagrams — the architecture diagram with its glowing featured node (violet stroke + gaussian-blur glow filter), violet marker arrows, dashed Lifted Violet fallback arc, mint CI status dots; and the three-beat fallback sequence (dashed border = unreachable beat, hot `#1c1533` accent-stroked final beat). Diagrams sit inside `overflow-x-auto` rounded-3xl panels with a `min-w-[640px]` inner wrapper so mobile scrolls instead of shrinking.
- **Evidence blocks:** test-suite bars (6px full-pill track in bg-panel, violet fill) and benchmark tables (mono Lifted Violet data cells, hairline row borders, mono ink-faint headers, `sr-only` caption) present only recorded numbers.
- **Roadmap timeline:** a `border-l` hairline list, 32px indent, absolute 16px dots — current item `border-accent bg-accent/30`, future items `border-border-strong bg-bg` — with mono uppercase tracked "when" labels in Signal Violet.
- **Motion:** one `Reveal` wraps the hero block; all body sections arrive static (headings via the shared `SectionHeading` reveal).

### Illustrations
Two authored families, both product-true. **Line-work vignettes** (hero
monitor graph, experience side panels): gray edges in Hairline Strong
(#322a4a, 1.3-1.6px), highlighted route in Signal Violet (2.4-3.5px,
round caps), big nodes Lifted Violet, dim-violet sub-palette — **#584b85**
(dim nodes), **#3d3358** (skeleton bars), **#1c1533** ("hot"/selected
fills) — with mono captions in ink-dim/ink-faint. **Mockup windows**
(`ProjectMockups`): dark app windows (#0b0916 fill, #3b3157 frame,
rose/amber/mint chrome dots, mono title pill) drawing each product's real
or planned interface — ranked route lists, playlist rows, guarded SQL with
mint check marks and a violet confidence bar. Meaningful graphics get
`role="img"` + `aria-label`; decorative ones `aria-hidden`. **The
Product-True Illustration Rule.** Every illustration depicts a real
mechanism or interface of the system it represents — never stock imagery,
screenshots faked as UI, or gradient stand-ins.

### Motion (system-wide)
One authored entrance plus a small sanctioned interaction set:
- **Hero entrance:** `hero-rise` (rise-in: 26px lift + fade, 0.9s `cubic-bezier(0.16,1,0.3,1)`, five stagger steps at 0.05-0.5s). The graph draw/pop keyframes (`draw-edge`, `node-pop`, `pulse-route`) remain defined for graph illustrations.
- **Hero idle:** `float-bob` (5.5s ease-in-out, ±7px, staggered) on floating cards and carousel tech chips; three-layer pointer parallax (see Hero Scene).
- **Section-heading reveals:** the `Reveal` wrapper (IntersectionObserver, threshold 0.1, `-40px` bottom margin, one-shot) applies `.reveal` — 16px lift + fade over 0.6s ease — to section headings and the case-study page hero block only; section bodies arrive static.
- **Hover set:** card lift `-translate-y-1.5` (300ms), skill-chip lift `-translate-y-0.5` (200ms), mockup tilt deepen (500ms), and `transition-colors` everywhere else.

`prefers-reduced-motion` collapses all of it to final state instantly
(opacity 1, transforms none, universal 0.01ms override); parallax and bob
are additionally skipped on touch (`hover: none`). **The One Authored
Moment Rule (amended).** Orchestrated entrance animation lives in the hero;
scroll entrances exist only as the single per-section heading reveal and
the case-study hero block — never on card grids, lists, or body content.

## Do's and Don'ts

### Do:
- **Do** keep violet (#8b5cf6 family) as the only accent in UI chrome, with polychrome confined to the three sanctioned zones (hero avatar scene, brand marks, project gradient identities).
- **Do** step dark surfaces bg → bg-raised → bg-panel with 1px hairline borders instead of shadows.
- **Do** follow the radius ladder: 24px panels, 16px insets, 12px controls, 8px icon/action buttons, pills for tags/badges/dots.
- **Do** hold the section rhythm: `max-w-6xl`, `px-5 sm:px-8`, `py-24`, heading block then `mt-12` content (carousel `mt-6`, full-bleed track).
- **Do** give each new showcase project one fixed gradient identity and a product-true dark mockup window in the shared Window frame.
- **Do** end display and section headings with the violet period, and render heading accent words in Lifted Violet.
- **Do** ship reduced-motion and touch fallbacks and full aria wiring (skip link, `focus-visible` outline `2px accent-strong / 3px offset`, labeled SVGs, tablist/region semantics) with every new surface.
- **Do** keep statuses and metrics honest — badges, metrics, and "· soon" placeholder slots state only verified facts; let Education own the AWS certification (the hero meta line carries location and degree only).

### Don't:
- **Don't** introduce polychrome outside the three sanctioned zones, recolor brand marks to violet, or use the unused cyan token without first assigning it a documented role.
- **Don't** add box shadows on the dark ground — shadows live only as the CTA glow and the gradient-card mockup/chip shadows.
- **Don't** use JetBrains Mono for headings, paragraphs, or buttons; mono means data.
- **Don't** spread scroll reveals beyond section headings and the case-study hero — one `Reveal` per heading; body content arrives static.
- **Don't** create gradient panels without an identity to carry; project identity surfaces (carousel cards, case-study hero and close) and the certification card are the set.
- **Don't** replace authored SVG illustration with stock imagery, emoji, glyph-font icons, or abstract gradient blobs.

