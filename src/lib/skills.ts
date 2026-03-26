export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Programming Languages",
    skills: [
      "python", "javascript", "typescript", "java", "c++", "c#", "ruby", "go",
      "rust", "swift", "kotlin", "php", "scala", "r", "matlab", "perl", "dart",
      "objective-c", "shell", "bash", "powershell", "sql", "html", "css"
    ],
  },
  {
    name: "Frameworks & Libraries",
    skills: [
      "react", "angular", "vue", "next.js", "node.js", "express", "django",
      "flask", "spring", "spring boot", "rails", "laravel", "fastapi",
      ".net", "asp.net", "jquery", "bootstrap", "tailwind", "svelte",
      "gatsby", "nuxt", "flutter", "react native", "electron"
    ],
  },
  {
    name: "Data & AI",
    skills: [
      "machine learning", "deep learning", "natural language processing", "nlp",
      "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn",
      "pandas", "numpy", "data analysis", "data science", "data engineering",
      "big data", "hadoop", "spark", "tableau", "power bi", "statistics",
      "neural networks", "ai", "artificial intelligence", "llm", "gpt"
    ],
  },
  {
    name: "Cloud & DevOps",
    skills: [
      "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "jenkins",
      "ci/cd", "terraform", "ansible", "linux", "git", "github", "gitlab",
      "bitbucket", "nginx", "apache", "serverless", "microservices", "devops",
      "cloud computing", "heroku", "vercel", "netlify"
    ],
  },
  {
    name: "Databases",
    skills: [
      "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra",
      "dynamodb", "firebase", "supabase", "sqlite", "oracle", "sql server",
      "neo4j", "graphql", "rest api", "api design"
    ],
  },
  {
    name: "Soft Skills",
    skills: [
      "leadership", "communication", "teamwork", "problem solving",
      "critical thinking", "project management", "agile", "scrum",
      "time management", "collaboration", "adaptability", "creativity",
      "mentoring", "presentation", "negotiation", "decision making",
      "strategic thinking", "conflict resolution"
    ],
  },
  {
    name: "Tools & Platforms",
    skills: [
      "jira", "confluence", "slack", "figma", "sketch", "adobe",
      "photoshop", "illustrator", "vs code", "intellij", "postman",
      "swagger", "webpack", "vite", "npm", "yarn", "pip"
    ],
  },
];

export const allSkills: string[] = skillCategories.flatMap((c) => c.skills);

export function getSkillCategory(skill: string): string {
  for (const cat of skillCategories) {
    if (cat.skills.includes(skill.toLowerCase())) return cat.name;
  }
  return "Other";
}
