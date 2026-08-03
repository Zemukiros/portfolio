# CLAUDE.md — Developer Portfolio (Zemariam K. Haftegebriel)

Personal engineering portfolio site. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · deployed on Vercel as fully static output.

**Live:** https://portfolio-lac-psi-kunu1cmuxj.vercel.app
See `README.md` for the full overview and `DESIGN.md` for the design system.

## Commands

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production static build — run before pushing
npm run lint
```

## Architecture rules

- **All content lives in `src/data/*.ts`** (profile, skills, experience, education, projects). Content updates must never touch layout/component code, and vice versa.
- Components in `src/components/`; pages in `src/app/` (home + `/projects/intelliroute` case study).
- Project statuses are a typed system: `Live` / `Completed locally` / `In development` / `Planned`. Use them honestly.
- Fonts are self-hosted via Fontsource — do not add Google Fonts or other external font/network dependencies.
- Keep the static-output guarantee: no server runtime features (no API routes, no server actions requiring a runtime).

## Content accuracy policy (strict)

Every claim on the site must map to verifiable evidence (repositories, test output, CI runs, recorded benchmarks). Planned work is always labeled "Planned" and never presented as completed. Do not add or inflate claims when editing content.

## Accessibility standards to preserve

Semantic landmarks, skip link, keyboard-visible focus styles, `prefers-reduced-motion` support, accessible contrast on dark surfaces. Any new component must meet the same bar.

## Related projects (same machine, `C:\Users\zemar\projects\`)

- `meridian-website` — Django internship project (has its own CLAUDE.md); featured on this portfolio pending employer permission for the live link + company name
- `intelliroute` — case-study subject, live at https://intelliroute-theta.vercel.app

## Maintenance notes

- Add `verifyUrl` in `src/data/education.ts` when the AWS/Credly verification link is available
- Each project's `liveUrl` in `src/data/projects.ts` drives the "Live demo" slot; unset shows "Live demo · soon"
