export type ProjectStatus = "Live" | "Completed locally" | "In development" | "Planned";

export type Project = {
  slug: string;
  name: string;
  oneLiner: string;
  status: ProjectStatus;
  stack: string[];
  github?: string;
  liveUrl?: string;
  /** Interactive demo deployment. Shown alongside liveUrl, or as the primary "View demo" link when no liveUrl is set. */
  demoUrl?: string;
  caseStudyPath?: string;
  /** In-portfolio interactive simulation (not a deployment). Shown when there is no liveUrl or demoUrl. */
  simulatorPath?: string;
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
    headlineMetric: "121 automated tests · Dijkstra 4.05 ms @ 5,000 nodes",
    highlights: [
      "Dijkstra's shortest path + Yen's K-shortest loopless paths over an adjacency-list road graph with rich road metadata (speeds, tolls, safety, closures).",
      "Deterministic Python/FastAPI preference-ranking service (synonym parsing, combined preferences, confidence scores, explanations) with graceful Java-local fallback when the service is down.",
      "Interactive Next.js comparison UI: preference input, ranked route cards, badges, graph highlighting, and offline states.",
      "58 Java, 54 Python, and 9 frontend tests; benchmarks recorded in CI; Docker Compose smoke-tested; 4-job GitHub Actions pipeline green.",
    ],
  },
  {
    slug: "mini-s3",
    name: "Mini-S3",
    oneLiner:
      "Self-healing distributed object store: 3× replication placed by consistent hashing, quorum writes, and automatic repair when a storage node dies.",
    status: "Completed locally",
    stack: ["Java 21", "Spring Boot", "PostgreSQL", "Docker Compose", "JUnit"],
    github: "https://github.com/Zemukiros/mini-s3",
    caseStudyPath: "/projects/mini-s3",
    simulatorPath: "/projects/mini-s3#simulator",
    headlineMetric: "Node-kill drill: 13 copies rebuilt · SHA-256 match, no object lost",
    highlights: [
      "Replicated object store: every object is stored 3× across four storage nodes, placed by a SHA-256 hash ring with 200 virtual nodes per server.",
      "Quorum writes (N = 3, W = 2) with checksum-verified reads and read repair; Postgres holds metadata only, enforced by a partial unique index and per-key advisory locks.",
      "Heartbeat failure detection and a level-triggered repair worker that claims work with FOR UPDATE SKIP LOCKED; a garbage collector trims tombstones and surplus copies.",
      "Recorded failure drill: node stopped mid-run, 13 copies rebuilt in one repair pass, download SHA-256 matched byte for byte; consistent hashing moves ~19% of keys on growth vs ~80% for hash % N.",
    ],
  },
  {
    slug: "meridian",
    name: "Meridian Patient Website",
    oneLiner:
      "Drone medication-delivery platform where patients order and track deliveries live while staff drive the pipeline from an operations dashboard.",
    status: "Live",
    stack: [
      "Python",
      "Django",
      "MariaDB",
      "PostgreSQL",
      "Passenger",
      "Render",
      "WhiteNoise",
    ],
    github: "https://github.com/Zemukiros/meridian-website",
    demoUrl: "https://meridian-website-8dmx.onrender.com/",
    caseStudyPath: "/projects/meridian",
    headlineMetric: "69/69 automated tests · live on the company's own domain",
    highlights: [
      "Built during my software engineering internship at Meridian Medical Associates: a nine-page patient platform with Django-auth accounts, plan-based ordering with strict server-side validation — including a 2,500 g cap matching the drone's real payload limit — simulated checkout, and a live four-stage delivery tracker.",
      "“Meridian Operations”: Django admin customized into a staff dashboard with pipeline filters and search; one-click status actions appear on the patient's tracker immediately.",
      "Ownership enforced at the query level so no patient can read another's order, zero secrets in the repo, and production hardening (HTTPS redirect, HSTS, secure cookies) — with synthetic data only and HIPAA readiness tracked as a launch prerequisite.",
      "69 automated tests across four Django apps plus a scripted Chromium end-to-end walkthrough. Production runs on the company's own domain (cPanel + Passenger + MariaDB, with an env-driven database engine); a separate interactive demo copy deploys as code (render.yaml) to Render + Neon PostgreSQL.",
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
    name: "QueryGuard",
    oneLiner:
      "Text-to-SQL with guardrails, hallucination detection and calibrated confidence. Zero writes possible.",
    status: "Live",
    stack: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Claude API",
      "Vercel",
    ],
    github: "https://github.com/Zemukiros/queryguard",
    liveUrl: "https://queryguard-livid.vercel.app",
    caseStudyPath: "/projects/queryguard",
    headlineMetric: "99.0% of wrong answers flagged · 7.6% false flags · 39/40 answerable correct",
    highlights: [
      "Two independent safety layers: a sqlparse-token guardrail (one SELECT, no DML anywhere, LIMIT added; 81 tests) in front of a read-only executor — a SELECT-only Postgres role in a READ ONLY transaction that is always rolled back.",
      "Three detectors check every answer: blind back-translation (the SQL is turned back into a question by a model that never saw the original), an independent second query whose results must agree, and result sanity checks.",
      "Their signals feed a logistic confidence model calibrated with grouped cross-validation. On the frozen eval set it flags 99.0% (103/104) of known-wrong queries, with 7.6% (6/79) false flags and Brier 0.051 → 0.038.",
      "Live on Vercel with Neon Postgres and Upstash Redis: the real model runs within a $0.50 daily spend ceiling, falling back to a $0 demo mode; median $0.0135 and at most 4 API calls per question.",
    ],
  },
];

export const statusStyles: Record<ProjectStatus, { label: string; className: string }> = {
  Live: { label: "Live", className: "text-accent-strong border-accent/40 bg-accent/10" },
  "Completed locally": {
    label: "Built & verified",
    className: "text-accent-strong border-accent/40 bg-accent/10",
  },
  "In development": {
    label: "In development",
    className: "text-ink-dim border-border-strong bg-transparent",
  },
  Planned: {
    label: "Up next",
    className: "text-ink-faint border-border bg-transparent",
  },
};
