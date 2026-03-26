import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { motion } from "framer-motion";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  onClear: () => void;
}

export default function FileUpload({ onFileSelect, file, onClear }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const f = e.dataTransfer.files[0];
      if (f && (f.name.endsWith(".pdf") || f.name.endsWith(".docx"))) {
        onFileSelect(f);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileSelect(f);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <label className="block text-sm font-semibold text-foreground mb-2">
        Upload Resume
      </label>
      {file ? (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-accent p-4">
          <Upload className="h-5 w-5 text-primary" />
          <span className="flex-1 text-sm font-medium text-foreground truncate">
            {file.name}
          </span>
          <button
            onClick={onClear}
            className="rounded-full p-1 hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer
            ${dragActive ? "border-primary bg-accent" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-1">
            Drag & drop your resume here
          </p>
          <p className="text-xs text-muted-foreground">PDF or DOCX (max 10MB)</p>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      )}
    </motion.div>
  );
}
