# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal engineering portfolio for Zemariam K. Haftegebriel. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · deployed on Vercel.

**Live:** https://portfolio-lac-psi-kunu1cmuxj.vercel.app
See `README.md` for the overview and `DESIGN.md` for the full design system.

## Commands

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build — run before pushing
npm run lint   # eslint (flat config, next core-web-vitals + typescript)
```

There is no test runner in this repo — `npm run build` (type-checks + prerenders every route) and `npm run lint` are the verification gates.

## Architecture

**Content/presentation split is the central rule.** All content lives in `src/data/*.ts` (`profile`, `skills`, `experience`, `education`, `projects`); components in `src/components/`; routes in `src/app/`. Content updates must never touch layout/component code, and vice versa. `src/data/profile.ts` is the single source of truth for name/contact and is consumed by `layout.tsx` metadata.

**Routes:** home (`src/app/page.tsx`) plus one case study per shipped project — `/projects/intelliroute` and `/projects/meridian`. Case-study pages follow a fixed shape: read the project record with `projects.find((p) => p.slug === "…")!`, declare a local `GRADIENT` identity constant, and compose `Reveal` + `SectionHeading` with project-specific SVG visuals (`ProjectMockups.tsx`, `CaseStudyVisuals.tsx`, `MeridianVisuals.tsx`). Copy that pattern for a new case study rather than inventing a layout.

**Server/client split:** pages are server components. Only interaction-bearing components are `"use client"` (`Nav`, `HeroScene`, `ProjectCarousel`, `ExperienceTabs`, `Reveal`, `WordReveal`, `Typewriter`, `IntroLoader`). Keep it that way — no server runtime features (no API routes, no server actions), so every route prerenders and the deploy stays fully static.

**Project statuses** are a typed system in `src/data/projects.ts`: `Live` / `Completed locally` / `In development` / `Planned`, with display labels and badge classes in `statusStyles` (`Planned` renders as "Up next"). Use them honestly. `liveUrl` drives the "Live demo" slot; unset shows "Live demo · soon". Optional `demoUrl` (used by Meridian) marks a separate interactive demo copy when `liveUrl` is a real production site — cards then show "Live site" + "Demo".

**Styling:** Tailwind v4 CSS-first — there is no `tailwind.config`. Theme tokens (colors, fonts) are declared in the `@theme` block at the top of `src/app/globals.css` and used as ordinary utilities (`bg-bg-raised`, `text-ink-dim`, `border-border-strong`, `font-display`). Add a token there, never as an arbitrary hex in a component. Keyframes and the hero/reveal animation classes also live in `globals.css`.

**Icons:** tech marks come from `simple-icons` via `TechIcon`, keyed by the `icon` field in `src/data/skills.ts` (`"siPython"`, or `"aws"` for the custom mark). `TechIcon` has a `LIFT` map that lightens marks too dark for the dark ground, and a `noLift` prop for light surfaces. Never recolor a brand mark.

**Fonts** are self-hosted via Fontsource and imported in `layout.tsx` — do not add Google Fonts or other external font/network dependencies.

**Path alias:** `@/*` → `./src/*`.

The `dangerouslySetInnerHTML` block in `layout.tsx` is a hidden `impeccable:direction-contract` comment from the design tooling — leave it in place.

## Content accuracy policy (strict)

Every claim on the site must map to verifiable evidence (repositories, test output, CI runs, recorded benchmarks). Planned work is always labeled "Planned" and never presented as completed. Do not add or inflate claims when editing content. `headlineMetric` takes verified numbers only.

## Design system

`DESIGN.md` is a contract, not a description. Its named rules bind new work: one committed violet in UI chrome (polychrome only in the hero avatar scene, brand tech marks, and per-project gradient identities); borders and surface steps instead of shadows; JetBrains Mono only for data/metadata; the violet accent period closing display and section headings; the radius ladder (24px panels → 16px insets → 12px controls → 8px icon buttons → pills); one `Reveal` per section heading, body content static; authored SVG illustration only — no stock imagery or gradient stand-ins.

## Accessibility standards to preserve

Semantic landmarks, skip link, keyboard-visible focus styles, `prefers-reduced-motion` support (plus touch fallbacks for parallax/bob), labeled SVGs, accessible contrast on dark surfaces. Any new component must meet the same bar.

## Related projects (same machine, `~/projects/`)

- `meridian-website` — Django internship project (has its own CLAUDE.md); production live at https://meridianmobilehealth.com (company hosting), demo copy on Render; formal portfolio permission requested in the handoff email
- `intelliroute` — case-study subject, live at https://intelliroute-theta.vercel.app

## Maintenance notes

- Add `verifyUrl` in `src/data/education.ts` when the AWS/Credly verification link is available
- `.claude/`, `.agents/`, `.impeccable/`, `.mcp.json`, and `PRODUCT.md` are gitignored local tooling and are excluded from lint — not app code
