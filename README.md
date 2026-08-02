# Developer Portfolio — Zemariam K. Haftegebriel

Personal engineering portfolio: backend, AI-enabled systems, and cloud
architecture. Built with Next.js (App Router), TypeScript, and Tailwind CSS v4,
deployed on Vercel.

**Live:** _URL added after first deployment_

## Highlights

- Fully static output (no server runtime needed) — fast and free to host.
- Structured content model: all profile, skills, experience, education, and
  project data lives in `src/data/*.ts`, so content updates never touch layout code.
- Honest project statuses (`Live` / `Completed locally` / `In development` /
  `Planned`) enforced by a typed status system.
- IntelliRoute case study with architecture diagram (inline SVG), verified test
  counts, and CI-recorded benchmarks.
- Self-hosted variable fonts (Fontsource) — no Google Fonts network dependency.
- Accessibility: semantic landmarks, skip link, keyboard-visible focus styles,
  `prefers-reduced-motion` support, accessible contrast on dark surfaces.

## ⚠️ Before deploying

1. **LinkedIn URL placeholder** — edit `src/data/profile.ts` and replace
   `REPLACE_WITH_LINKEDIN_URL` with your real LinkedIn profile URL. Until then
   the site intentionally shows "LinkedIn — coming soon" instead of a broken link.
2. **AWS certification verify link** — optionally add `verifyUrl` in
   `src/data/education.ts` when the Credly/AWS verification link is at hand.

## Local development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build (static)
npm run lint
```

## Structure

```
src/
  data/        # all content (profile, skills, education, experience, projects)
  components/  # Nav, Footer, Section, Reveal, ProjectCard, StatusBadge
  app/         # layout, home page, /projects/intelliroute case study
```

## Content accuracy policy

Every claim on this site maps to verifiable evidence (repositories, test
output, CI runs, recorded benchmarks). Planned work is always labeled
"Planned" and never presented as completed.
