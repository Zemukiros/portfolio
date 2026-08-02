export type SkillCategory = {
  title: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["Java", "Python", "TypeScript", "JavaScript", "SQL", "C", "R", "HTML/CSS"],
  },
  {
    title: "Backend & APIs",
    skills: [
      "Spring Boot",
      "FastAPI",
      "Django",
      "REST API design",
      "Maven",
      "Object-oriented design",
      "Design patterns",
    ],
  },
  {
    title: "Frontend",
    skills: ["Next.js", "React", "Tailwind CSS", "Responsive design", "Accessibility"],
  },
  {
    title: "Databases & Data",
    skills: ["PostgreSQL", "Relational modeling", "NumPy", "Pandas", "Apache Spark"],
  },
  {
    title: "AI Engineering",
    skills: [
      "LLM API integration (Anthropic, OpenAI)",
      "AI-assisted development workflows",
      "Prompt design",
    ],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      "AWS (Solutions Architect – Associate)",
      "Docker",
      "GitHub Actions",
      "CI/CD",
      "Linux",
    ],
  },
  {
    title: "Testing & Engineering Tools",
    skills: [
      "JUnit",
      "Mockito",
      "Pytest",
      "Frontend component testing",
      "Benchmarking",
      "Git/GitHub",
      "Structured logging",
      "Profiling",
      "Agile/Scrum",
    ],
  },
];
