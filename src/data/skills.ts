export type Tech = {
  name: string;
  /** simple-icons export key, or "aws" for the custom AWS mark, or none for a text chip */
  icon?: string;
};

export type SkillGroup = {
  title: string;
  items: Tech[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    items: [
      { name: "Java", icon: "siOpenjdk" },
      { name: "Python", icon: "siPython" },
      { name: "TypeScript", icon: "siTypescript" },
      { name: "JavaScript", icon: "siJavascript" },
      { name: "SQL", icon: "siPostgresql" },
      { name: "C", icon: "siC" },
      { name: "R", icon: "siR" },
      { name: "HTML5", icon: "siHtml5" },
      { name: "CSS", icon: "siCss" },
    ],
  },
  {
    title: "Backend & Frameworks",
    items: [
      { name: "Spring Boot", icon: "siSpringboot" },
      { name: "FastAPI", icon: "siFastapi" },
      { name: "Django", icon: "siDjango" },
      { name: "React", icon: "siReact" },
      { name: "Next.js", icon: "siNextdotjs" },
      { name: "Tailwind CSS", icon: "siTailwindcss" },
      { name: "Maven", icon: "siApachemaven" },
      { name: "REST APIs" },
      { name: "Design patterns" },
    ],
  },
  {
    title: "Data & AI",
    items: [
      { name: "PostgreSQL", icon: "siPostgresql" },
      { name: "NumPy", icon: "siNumpy" },
      { name: "Pandas", icon: "siPandas" },
      { name: "Apache Spark", icon: "siApachespark" },
      { name: "Anthropic API" },
      { name: "OpenAI API" },
      { name: "LLM integration" },
    ],
  },
  {
    title: "Cloud, DevOps & Testing",
    items: [
      { name: "AWS", icon: "aws" },
      { name: "Docker", icon: "siDocker" },
      { name: "GitHub Actions", icon: "siGithubactions" },
      { name: "Vercel", icon: "siVercel" },
      { name: "Linux", icon: "siLinux" },
      { name: "Git", icon: "siGit" },
      { name: "JUnit 5", icon: "siJunit5" },
      { name: "Pytest", icon: "siPytest" },
      { name: "Mockito" },
      { name: "Benchmarking" },
    ],
  },
];
