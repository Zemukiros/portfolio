export type ProjectStatus = "Live" | "Completed locally" | "In development" | "Planned";

export type Project = {
  slug: string;
  name: string;
  oneLiner: string;
  status: ProjectStatus;
  stack: string[];
  github?: string;
  liveUrl?: string;
  caseStudyPath?: string;
  headlineMetric?: string; // verified evidence only
  highlights: string[];
};

/**
 * Public-claims rule (from the project roadmap):
 * Live = deployed, tested, publicly usable.
 * Completed locally = working and verified but not yet publicly deployed.
 * In development = implementation started, evidence exists.
 * Planned = roadmap only — never presented as completed work.
 */
export const projects: Project[] = [
  {
    slug: "intelliroute",
    name: "IntelliRoute",
    oneLiner:
      "Route intelligence platform that computes and ranks alternative routes against natural-language preferences.",
    status: "Live",
    stack: [
      "Java",
      "Spring Boot",
      "Python",
      "FastAPI",
      "Next.js",
      "TypeScript",
      "Docker",
      "GitHub Actions",
    ],
    github: "https://github.com/Zemukiros/intelliroute",
    liveUrl: "https://intelliroute-theta.vercel.app",
    caseStudyPath: "/projects/intelliroute",
    headlineMetric: "125 automated tests · Dijkstra 4.05 ms @ 5,000 nodes",
    highlights: [
      "Dijkstra's shortest path + Yen's K-shortest loopless paths over an adjacency-list road graph with rich road metadata (speeds, tolls, safety, closures).",
      "Deterministic Python/FastAPI preference-ranking service (synonym parsing, combined preferences, confidence scores, explanations) with graceful Java-local fallback when the service is down.",
      "Interactive Next.js comparison UI: preference input, ranked route cards, badges, graph highlighting, and offline states.",
      "62 Java, 54 Python, and 9 frontend tests; benchmarks recorded in CI; Docker Compose smoke-tested; 4-job GitHub Actions pipeline green.",
    ],
  },
  {
    slug: "rhythmiq",
    name: "Rhythmiq",
    oneLiner:
      "Music library and playlist-management platform focused on strong backend architecture and relational data modeling.",
    status: "Planned",
    stack: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Spring Security",
      "Next.js",
      "TypeScript",
      "Docker",
      "GitHub Actions",
    ],
    highlights: [
      "Secure authentication with user-owned libraries and playlists, and authorization that isolates each user's private resources.",
      "Relational domain model across songs, artists, albums, genres, and playlists with search, filtering, and sorting.",
      "Planned advanced work: Strategy-pattern sorting/recommendation modes, collaborative playlists, and query benchmarks.",
    ],
  },
  {
    slug: "queryguard",
    name: "QueryGuard AI",
    oneLiner:
      "Secure text-to-SQL analytics with guardrails and hallucination detection over a read-only PostgreSQL database.",
    status: "Planned",
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "Next.js",
      "TypeScript",
      "Docker",
      "GitHub Actions",
    ],
    highlights: [
      "Schema-aware SQL generation with a swappable LLM-provider interface — never hard-coded to one vendor.",
      "Guardrails: read-only execution, blocked write/DDL operations, row limits, and back-translation checks that verify the SQL matches the question.",
      "Planned evaluation on a human-verified golden dataset measuring accuracy, guardrail block rate, and hallucination detection.",
    ],
  },
];

export const projectFootnote =
  "A fourth project will be selected and built after QueryGuard AI ships, targeting whichever capability the portfolio still lacks.";

export const statusStyles: Record<ProjectStatus, { label: string; className: string }> = {
  Live: { label: "Live", className: "text-accent-strong border-accent/40 bg-accent/10" },
  "Completed locally": {
    label: "Built & verified · deploying",
    className: "text-accent-strong border-accent/40 bg-accent/10",
  },
  "In development": {
    label: "In development",
    className: "text-accent-strong border-accent/30 bg-accent/5",
  },
  Planned: {
    label: "Up next",
    className: "text-ink-dim border-border-strong bg-transparent",
  },
};
