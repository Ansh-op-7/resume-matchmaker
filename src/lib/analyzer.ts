import { allSkills, getSkillCategory } from "./skills";

export interface AnalysisResult {
  score: number;
  atsScore: number;
  detectedSkills: { skill: string; category: string }[];
  missingSkills: { skill: string; category: string }[];
  suggestions: string[];
}

function preprocess(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.#+/\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSkills(text: string): string[] {
  const processed = preprocess(text);
  return allSkills.filter((skill) => {
    const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    return pattern.test(processed);
  });
}

function tfidfCosineSimilarity(textA: string, textB: string): number {
  const tokenize = (t: string) => preprocess(t).split(/\s+/).filter(Boolean);
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  const vocab = new Set([...tokensA, ...tokensB]);
  const df: Record<string, number> = {};
  vocab.forEach((w) => {
    df[w] = (tokensA.includes(w) ? 1 : 0) + (tokensB.includes(w) ? 1 : 0);
  });

  const numDocs = 2;
  const tfidf = (tokens: string[]) => {
    const tf: Record<string, number> = {};
    tokens.forEach((t) => (tf[t] = (tf[t] || 0) + 1));
    const vec: number[] = [];
    vocab.forEach((w) => {
      const tfVal = (tf[w] || 0) / tokens.length;
      const idf = Math.log(numDocs / (df[w] || 1)) + 1;
      vec.push(tfVal * idf);
    });
    return vec;
  };

  const vecA = tfidf(tokensA);
  const vecB = tfidf(tokensB);

  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] ** 2;
    magB += vecB[i] ** 2;
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

export function analyzeResume(resumeText: string, jobDescription: string): AnalysisResult {
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);

  const detectedSkills = resumeSkills.map((s) => ({ skill: s, category: getSkillCategory(s) }));
  const missingSkills = jobSkills
    .filter((s) => !resumeSkills.includes(s))
    .map((s) => ({ skill: s, category: getSkillCategory(s) }));

  const cosineSim = tfidfCosineSimilarity(resumeText, jobDescription);
  const skillOverlap = jobSkills.length > 0
    ? jobSkills.filter((s) => resumeSkills.includes(s)).length / jobSkills.length
    : 0;

  const score = Math.round((cosineSim * 0.4 + skillOverlap * 0.6) * 100);

  // ATS score based on keyword presence, formatting
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /[\d\-().+\s]{7,}/.test(resumeText);
  const wordCount = resumeText.split(/\s+/).length;
  let atsScore = Math.min(score + 10, 100);
  if (hasEmail) atsScore = Math.min(atsScore + 3, 100);
  if (hasPhone) atsScore = Math.min(atsScore + 2, 100);
  if (wordCount > 200) atsScore = Math.min(atsScore + 5, 100);

  const suggestions: string[] = [];
  if (missingSkills.length > 0) {
    suggestions.push(`Add these key skills to your resume: ${missingSkills.slice(0, 5).map((s) => s.skill).join(", ")}`);
  }
  if (wordCount < 200) suggestions.push("Your resume seems short. Consider adding more detail about your experience.");
  if (!hasEmail) suggestions.push("Include your email address for contact information.");
  if (!hasPhone) suggestions.push("Include a phone number for contact information.");
  if (score < 50) suggestions.push("Tailor your resume more closely to the job description for better results.");
  if (score >= 70) suggestions.push("Good match! Focus on quantifying your achievements to stand out further.");

  return { score, atsScore, detectedSkills, missingSkills, suggestions };
}
