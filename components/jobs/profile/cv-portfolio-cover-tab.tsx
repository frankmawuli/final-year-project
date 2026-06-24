"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Link as LinkIcon, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput, FormLabel } from "@/components/jobs/profile/form-controls";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentDropzone({
  file,
  onChange,
  accept,
  acceptLabel,
  acceptedTypes,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  accept: string;
  acceptLabel: string;
  acceptedTypes: string[];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFile(selected: File | undefined) {
    if (!selected) return;
    if (!acceptedTypes.includes(selected.type)) {
      setError(`Only ${acceptLabel} files are supported.`);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError("File must be smaller than 10MB.");
      return;
    }
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(selected.type.startsWith("image/") ? URL.createObjectURL(selected) : null);
    onChange(selected);
  }

  function handleRemove() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange(null);
  }

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {preview ? (
            <img src={preview} alt={file.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <FileText className="size-5" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium text-foreground">{file.name}</p>
            <p className="text-[12px] text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Remove file"
          onClick={handleRemove}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D1D5DB] px-4 py-8 text-center hover:border-primary"
      >
        <UploadCloud className="size-6 text-muted-foreground" />
        <span className="text-[13px] font-medium text-foreground">Click to upload or drag and drop</span>
        <span className="text-[12px] text-muted-foreground">{acceptLabel} (max 10MB)</span>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-2 text-[12.5px] text-destructive">{error}</p>}
    </div>
  );
}

export function CvPortfolioCoverTab() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  function handleCancel() {
    setCvFile(null);
    setPortfolioFile(null);
    setPortfolioLink("");
    setCoverLetterFile(null);
  }

  function handleSave() {
    console.log("cv/portfolio/cover letter saved", {
      cvFile,
      portfolioFile,
      portfolioLink,
      coverLetterFile,
    });
  }

  return (
    <div className="bg-white rounded-b-xl border border-[#E5E7EB] divide-y divide-[#F3F4F6]">
      <div className="px-6 py-6">
        <h3 className="text-[15px] font-semibold text-foreground">CV / Portfolio / Cover Letter</h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
          Upload the documents employers will see when reviewing your application.
        </p>
      </div>

      <div className="px-6 py-6">
        <FormLabel required>CV / Resume</FormLabel>
        <p className="mt-1 mb-3 text-[12.5px] text-muted-foreground leading-relaxed">
          Upload your most recent resume so employers can review your background.
        </p>
        <DocumentDropzone
          file={cvFile}
          onChange={setCvFile}
          accept=".pdf,.doc,.docx"
          acceptLabel="PDF, DOC or DOCX"
          acceptedTypes={[
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]}
        />
      </div>

      <div className="px-6 py-6">
        <FormLabel>Portfolio</FormLabel>
        <p className="mt-1 mb-3 text-[12.5px] text-muted-foreground leading-relaxed">
          Share a link to your portfolio website, or upload a portfolio document.
        </p>
        <div className="relative mb-4">
          <LinkIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <FormInput
            placeholder="https://your-portfolio.com"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            className="pl-10"
          />
        </div>
        <DocumentDropzone
          file={portfolioFile}
          onChange={setPortfolioFile}
          accept=".pdf,.doc,.docx,image/jpeg,image/png"
          acceptLabel="PDF, DOC, DOCX, JPG or PNG"
          acceptedTypes={[
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/png",
          ]}
        />
      </div>

      <div className="px-6 py-6">
        <FormLabel>Cover Letter</FormLabel>
        <p className="mt-1 mb-3 text-[12.5px] text-muted-foreground leading-relaxed">
          Add a cover letter to introduce yourself to potential employers.
        </p>
        <DocumentDropzone
          file={coverLetterFile}
          onChange={setCoverLetterFile}
          accept=".pdf,.doc,.docx"
          acceptLabel="PDF, DOC or DOCX"
          acceptedTypes={[
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]}
        />
      </div>

      <div className="flex justify-end gap-3 px-6 py-4">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/5"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
