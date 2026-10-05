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
    detail: "Graph search and K-shortest paths over real road metadata, benchmarked in CI rather than estimated.",
    evidence: "IntelliRoute",
  },
  {
    title: "Product web apps",
    detail: "Auth, ownership checks at the query level, order workflows, and live status tracking for real users.",
    evidence: "Meridian",
  },
  {
    title: "Testing & verification",
    detail: "Unit, integration, and end-to-end suites with pipelines that stay green — numbers on this site come from them.",
    evidence: "IntelliRoute · Meridian · Mini-S3",
  },
  {
    title: "Delivery & DevOps",
    detail: "Docker Compose stacks, GitHub Actions pipelines, and deploys to Vercel and Render, designed with AWS architecture in mind.",
    evidence: "IntelliRoute · Meridian",
  },
];
