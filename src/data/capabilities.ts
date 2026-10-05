/**
 * What I can build, each backed by a repository you can open.
 * Every `evidence` entry must point at shipped or verified work — never at planned work.
 */
export type Capability = {
  title: string;
  detail: string;
  evidence: string;
};

export const capabilities: Capability[] = [
  {
    title: "Backend services & APIs",
    detail: "Spring Boot and FastAPI services with typed contracts, validation, and graceful fallbacks between them.",
    evidence: "IntelliRoute · Mini-S3",
  },
  {
    title: "Distributed storage",
    detail: "Replication, quorum writes, failure detection, and self-repair — proven with a recorded node-kill drill.",
    evidence: "Mini-S3",
  },
  {
    title: "Algorithms & performance",
    detail: "Dijkstra and Yen's K-shortest paths over a road graph with speeds, tolls, safety, and closures — benchmarked in CI, not estimated.",
    evidence: "IntelliRoute",
  },
  {
    title: "Product web apps",
    detail: "Auth, ownership checks at the query level, order workflows, and live status tracking — demoed on synthetic data.",
    evidence: "Meridian",
  },
  {
    title: "Testing & verification",
    detail: "Unit, integration, and end-to-end suites — 121 tests in a green CI pipeline for IntelliRoute, 69 for Meridian, plus a recorded failure drill for Mini-S3.",
    evidence: "IntelliRoute · Meridian · Mini-S3",
  },
  {
    title: "Delivery & DevOps",
    detail: "Docker Compose stacks, a four-job GitHub Actions pipeline, and live deploys to Vercel and Render.",
    evidence: "IntelliRoute · Meridian · Mini-S3",
  },
];
