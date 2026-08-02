/**
 * Single source of truth for personal/contact info.
 *
 */
export const profile = {
  name: "Zemariam K. Haftegebriel",
  shortName: "Zemariam Haftegebriel",
  headline: "Software Engineer — Backend, AI-Enabled Systems & Cloud",
  tagline:
    "I build reliable backend and AI-enabled systems with measurable evidence: tested, benchmarked, documented, and shipped.",
  location: "Silver Spring, MD",
  email: "zemariamkiros@gmail.com",
  github: "https://github.com/Zemukiros",
  githubUser: "Zemukiros",
  linkedin: "https://www.linkedin.com/in/zemariam-kiros-haftegebriel-882544240/", // TODO: replace before deploy
  focusAreas: [
    "Backend & API engineering",
    "AI-enabled systems",
    "Cloud architecture (AWS)",
    "Full-stack product delivery",
  ],
  about: [
    "I'm a Computer Science student at Bowie State University (B.S. expected May 2027) focused on backend, AI-enabled, cloud, and full-stack engineering. I care about building systems that are reliable and provable — with automated tests, benchmarks, CI pipelines, and honest documentation behind every claim.",
    "My day-to-day stack spans Java and Spring Boot on the backend, Python with FastAPI and Django for services, TypeScript and Next.js on the frontend, and PostgreSQL for data. I package with Docker, automate with GitHub Actions, and design for the cloud as an AWS Certified Solutions Architect – Associate.",
    "I've interned on two engineering teams — building a drone-based medication delivery platform at Meridian Medical Associates and shipping production Java/Spring Boot features at Mundy Base Technologies — and I direct AI tools aggressively in my workflow while owning the architecture, review, verification, and final quality of everything I ship.",
  ],
} as const;

export const isLinkedInPlaceholder = () =>
  profile.linkedin.includes("REPLACE");
