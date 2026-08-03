# Developer Portfolio — Zemariam K. Haftegebriel

Personal engineering portfolio: backend, AI-enabled systems, and cloud
architecture. Built with Next.js (App Router), TypeScript, and Tailwind CSS v4,
deployed on Vercel.

**Live:** https://portfolio-lac-psi-kunu1cmuxj.vercel.app

## Highlights

- Fully static output (no server runtime needed) — fast and free to host.
- Structured content model: all profile, skills, experience, education, and
  project data lives in `src/data/*.ts`, so content updates never touch layout code.
- Honest project statuses (`Live` / `Completed locally` / `In development` /
  `Planned`) enforced by a typed status system.
- IntelliRoute case study with architecture diagram (inline SVG), verified test
  counts, and CI-recorded benchmarks — linking to the
  [live app](https://intelliroute-theta.vercel.app) and its
  [repository](https://github.com/Zemukiros/intelliroute).
- Self-hosted variable fonts (Fontsource) — no Google Fonts network dependency.
- Accessibility: semantic landmarks, skip link, keyboard-visible focus styles,
  `prefers-reduced-motion` support, accessible contrast on dark surfaces.

## Maintenance notes

1. **AWS certification verify link** — optionally add `verifyUrl` in
   `src/data/education.ts` when the Credly/AWS verification link is at hand.
2. **Project links** — each project's `liveUrl` in `src/data/projects.ts` drives
   the "Live demo" slot; leave it unset and the card shows "Live demo · soon".

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
