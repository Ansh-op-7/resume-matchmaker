import { motion } from "framer-motion";
import type { AnalysisResult } from "@/lib/analyzer";
import { CheckCircle, AlertTriangle, Lightbulb, BarChart3 } from "lucide-react";

interface ResultsDisplayProps {
  result: AnalysisResult;
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

function SkillBadge({ skill, variant }: { skill: string; variant: "found" | "missing" }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium transition-colors
        ${variant === "found"
          ? "bg-accent text-accent-foreground"
          : "bg-destructive/10 text-destructive"
        }`}
    >
      {skill}
    </span>
  );
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const scoreColor = result.score >= 70
    ? "hsl(var(--success))"
    : result.score >= 40
    ? "hsl(var(--warning))"
    : "hsl(var(--danger))";

  const groupedDetected = result.detectedSkills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s.skill);
    return acc;
  }, {} as Record<string, string[]>);

  const groupedMissing = result.missingSkills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s.skill);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Scores */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" /> Match Scores
        </h3>
        <div className="flex justify-center gap-12">
          <ScoreRing score={result.score} label="Match Score" color={scoreColor} />
          <ScoreRing score={result.atsScore} label="ATS Score" color="hsl(var(--primary))" />
        </div>
      </div>

      {/* Detected Skills */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" /> Detected Skills ({result.detectedSkills.length})
        </h3>
        {Object.entries(groupedDetected).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(groupedDetected).map(([category, skills]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <SkillBadge key={s} skill={s} variant="found" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No matching skills detected.</p>
        )}
      </div>

      {/* Missing Skills */}
      {result.missingSkills.length > 0 && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" /> Missing Skills ({result.missingSkills.length})
          </h3>
          <div className="space-y-3">
            {Object.entries(groupedMissing).map(([category, skills]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <SkillBadge key={s} skill={s} variant="missing" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warning" /> Suggestions
          </h3>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
