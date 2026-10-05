# Plan: Editorial rebrand + minimalist 3D object

Status: **Approved 2026-10-04** on `feat/editorial-rebrand` — Phases 1–5 done (contract, home rebuild, 3D ring, case-study restyle, verification); next: Phase 6 PR → approval → merge

## Decisions (2026-10-04)
- Direction: follow the reference's light editorial look closely (user: Signal Violet / gradient cards felt cliché).
  The reference site (zickrian.me, repo `zickrian/zickrian.github.io`) has **no license** — only its open fonts and general
  style vocabulary are reused; code, copy, images, and exact composition are original. (`zickrian/motionfolio` is MIT but is a
  different, dark/lime design.)
- Fonts: **Instrument Serif** (headings, as in the reference) + Inter + JetBrains Mono. Bricolage dropped.
- Palette: paper `#f4f2ea`, ink `#18211a`, forest green `#2f6a3b` — all text pairs WCAG AA (checked).
- **Projects: restyle only.** Keep every function: Case study, GitHub, Live site / Live demo, Demo, Simulator →,
  "· soon" placeholders, status badges, metrics, case-study routes.
- 3D: Mini-S3 hash ring in the About portrait slot, React Three Fiber + SVG fallback.
- Hero image: deferred to Phase 2; generated via Higgsfield only after cost is stated and approved, else own photo.
- GitHub heatmap: public data at build time, no token.
- Download CV: Oct 1 résumé (B.S. expected **May 2027**).
- AI chat assistant: later, separate plan.

## Goal
Replace the dark "Signal Violet" system with a light, editorial portfolio: calm paper
background, a high-contrast serif for headings, hairline structure, restrained motion. The
reference video (`~/design-refs/Reference.mp4`, Firdaus's portfolio) informs structure and
feel only — palette, fonts, copy, imagery, and layout details are our own. The portrait slot
in About becomes a minimalist, product-true 3D object. No AI chatbot in this plan.

## Non-goals
- No pixel copy of the reference (its green/cream palette, its serif, its wording, its photo hero).
- No server runtime: no API routes, server actions, or contact-form backend. Site stays fully static.
- No AI chat assistant (separate later plan with costs + guardrails).
- No change to facts, statuses, or metrics. Existing copy is reused; new copy follows the accuracy policy.

## Direction (to confirm)
**Working name: "Paper & Ink."** An engineering notebook, not a template.

| Token | Proposal | Note |
|---|---|---|
| Ground | warm paper, e.g. `#f6f3ec` | Distinct from the reference's green-cream |
| Ink | near-black, e.g. `#16141c` | Violet-black undertone ties to the old brand |
| Accent | **deep ink-violet**, e.g. `#5b3fd0` (recommended) | Keeps brand continuity; alternatives: terracotta `#b4532a`, ink-blue `#2b4bb3` |
| Hairline | ink at ~10–14% | Borders, not shadows |

Fonts (Fontsource, self-hosted, $0):
- Headings: **Newsreader Variable** (recommended) or **Fraunces Variable** — thin, high-contrast editorial serif.
- Body: Inter Variable (keep). Data/meta: JetBrains Mono (keep). Drop Bricolage + Space Grotesk.

## Page structure (home)
| # | Section | Built from | New data needed |
|---|---|---|---|
| — | Floating pill nav (bottom) | replaces `Nav` | — |
| 0 | Hero: full-bleed calm image, centered serif greeting, 3 pill links | `profile.ts` | **Hero image decision** (see Q3) |
| 01 | About: bio + **3D object** + "Landmarks" + location + live local time (America/New_York) | `profile.ts`, `education.ts` | Landmarks list — only verifiable items (Dean's List, Phi Theta Kappa, AWS SAA, GPA) |
| 02 | Selected work: table rows (thumb · name/one-liner · stack · year · arrow) → detail modal; modal links to case study | `projects.ts` | `year` per project |
| 03 | Experience: accordion (Role @ Org, dates, bullets, tags) | `experience.ts` | — |
| 04 | Stack: category cards with tool chips (brand marks stay true color) | `skills.ts` | — |
| 05 | GitHub: repos / contributions / followers + 12-month heatmap, fetched **at build time** | GitHub public data | See Q5 (token vs public page) |
| 06 | Capabilities: numbered hairline grid | new `capabilities.ts` | Copy — claims must map to repos |
| 07 | Contact: closing heading, sitemap, **Download CV**, "Let's talk" popover (copy email / mailto / LinkedIn / GitHub) | `profile.ts` | Résumé PDF in `public/` (see Q6) |

Case studies (`/projects/intelliroute`, `/meridian`, `/mini-s3`) are restyled in a **separate phase**:
their SVG mockups, diagrams, simulator, and hash-ring explorer were drawn for a dark ground.

## 3D object (About section) — technology choice
- **Purpose:** a quiet signature object in place of a portrait; slow idle rotation, subtle pointer response.
- **Product-true options:** (a) Mini-S3 hash ring — thin ring, node beads, a key arc hopping to its replicas (reuses `src/lib/hashRing.ts`); (b) IntelliRoute route graph as a small wireframe node cluster. Recommend **(a)**.
- **Library:** `three` + `@react-three/fiber` + `@react-three/drei` (MIT, $0). Fit: React 19 / Next 16 client component, lazy-loaded after first paint. Cost: ~150–250 KB gz, only on capable devices.
- **Your experience:** to confirm (Q4). To learn: scene / camera / mesh / material basics.
- **Simpler free alternative:** SVG + CSS 3D transforms (`perspective`, `rotateX/Y`) — ~0 KB extra, looks 2.5D, no real lighting. Good fallback either way.
- **Fallbacks:** static SVG render under `prefers-reduced-motion`, no WebGL, or before load.

## Phases (each waits for approval)
1. **Design contract** — rewrite `DESIGN.md` (tokens, type scale, named rules for editorial + 3D) and swap `@theme` tokens + fonts in `globals.css` / `layout.tsx`. Branch `feat/editorial-rebrand`.
2. **Home rebuild** — new components: `FloatingNav`, `EditorialHero`, `ProjectTable` + `ProjectModal`, `ExperienceAccordion`, `StackCards`, `GithubActivity`, `CapabilityGrid`, `ContactPopover`. Retire `HeroScene`, `ProjectCarousel`, `ExperienceTabs`, `IntroLoader`, `Typewriter`, `WordReveal` once unused.
3. **3D object** — `HashRingObject` (R3F) + static fallback.
4. **Case-study restyle** — three pages + visuals re-tokened for the light ground.
5. **Verify** — build, lint, tsc; screenshots 1440 / 390; reduced-motion + keyboard + contrast checks; Lighthouse; Impeccable detector; independent reviewer subagent; `review-animations` skill on motion.
6. **Ship** — PR → your approval → merge to `main` (Vercel deploy) → update README, CLAUDE.md, CHANGELOG.

## Costs
$0. All fonts and libraries are open source; GitHub data is free. Optional Higgsfield hero
image would spend credits — stated and approved before generation.

## Risks
- Light editorial portfolios are common; distinctiveness must come from the 3D object, product-true visuals, and copy.
- Losing the avatar hero removes the current signature moment.
- Case-study visuals need real redraw work, not just color swaps.
- Contrast on paper backgrounds (accent text ≥ 4.5:1).
- 3D bundle weight on phones — mitigated by lazy load + fallback.

## Open questions
1. Accent: deep ink-violet (recommended), terracotta, ink-blue, or other?
2. Heading serif: Newsreader (recommended) or Fraunces?
3. Hero image: (a) authored SVG landscape/scene, (b) your own photograph, (c) Higgsfield-generated image (credits). The reference uses a photo; current rules only allow authored SVG.
4. Have you used Three.js / WebGL before?
5. GitHub heatmap: build-time fetch with a read-only token stored in Vercel env (exact numbers), or public-data only (no secret; heatmap may be less exact)?
6. Which résumé PDF goes behind "Download CV" — the Oct 1 May-2027 version?
