export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  dates: string;
  summary: string;
  bullets: string[];
  stack: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "Meridian Medical Associates",
    role: "Software Engineering Intern",
    location: "Oxon Hill, MD",
    dates: "Jul 2026 – Present",
    summary:
      "One of a 3-intern team building a commercial drone-based medication delivery platform end-to-end: custom drone hardware, a secure web platform, and a modernized database replacing legacy healthcare IT systems. The platform is now in pre-launch testing.",
    bullets: [
      "Developed delivery-routing logic that orders dispatch queues by priority tier, request time, and geographic drop-point distance for optimized dispatch.",
      "Built order, checkout, confirmation, and delivery-status workflows with real-time tracking, alongside internal tools that streamline patient-related workflows and clinical operations.",
      "Implemented authentication, authorization, and server-side ownership checks so users can only access their own records.",
      "Prototyped system-design architecture and automated workflow documentation for the cross-functional team using LLM tools (Anthropic Claude, OpenAI Codex).",
      "Assembled and integrated the drone's physical hardware, building custom circuits and a secure medical storage payload for safe medication transport.",
    ],
    stack: ["Django", "Python", "PostgreSQL", "REST APIs", "LLM tooling"],
  },
  {
    company: "Mundy Base Technologies",
    role: "Software Engineering Intern",
    location: "Addis Ababa, Ethiopia",
    dates: "May 2024 – Aug 2024",
    summary:
      "Backend engineering on a production Java/Spring Boot application, shipping in Agile/Scrum sprints.",
    bullets: [
      "Shipped production features for a Java/Spring Boot application, strengthening API behavior and data-flow consistency across user-facing workflows.",
      "Designed and optimized RESTful API endpoints to streamline data retrieval and communication between backend services.",
      "Diagnosed and fixed defects using structured logging and profiling while shipping in Agile/Scrum sprints.",
      "Applied AI-assisted development workflows for documentation, debugging support, and test planning while maintaining code-quality standards.",
    ],
    stack: ["Java", "Spring Boot", "REST APIs", "Structured logging", "Agile/Scrum"],
  },
];
