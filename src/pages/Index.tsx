import { useState } from "react";
import { motion } from "framer-motion";
import { FileSearch, Loader2 } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ResultsDisplay from "@/components/ResultsDisplay";
import { extractTextFromFile } from "@/lib/fileParser";
import { analyzeResume, type AnalysisResult } from "@/lib/analyzer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!file) return toast({ title: "Please upload a resume", variant: "destructive" });
    if (!jobDesc.trim()) return toast({ title: "Please enter a job description", variant: "destructive" });

    setLoading(true);
    setResult(null);
    try {
      const text = await extractTextFromFile(file);
      const analysis = analyzeResume(text, jobDesc);
      setResult(analysis);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-4xl py-6 flex items-center gap-3">
          <div className="rounded-xl bg-primary p-2.5">
            <FileSearch className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Smart Resume Analyzer
            </h1>
            <p className="text-sm text-muted-foreground">
              Match your resume against any job description instantly
            </p>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl py-8 space-y-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 space-y-5"
        >
          <FileUpload file={file} onFileSelect={setFile} onClear={() => setFile(null)} />

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Job Description
            </label>
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Results */}
        {result && <ResultsDisplay result={result} />}
      </main>
    </div>
  );
}
