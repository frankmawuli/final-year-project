"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, FileText, Link as LinkIcon, Loader2, Sparkles, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput, FormLabel } from "@/components/jobs/profile/form-controls";
import { useApplicantAuth } from "@/context/applicant-auth-context";
import { applicantAuthService, type CvAutofillSuggestion } from "@/services/applicant-auth.service";

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;

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
  maxSize = DEFAULT_MAX_FILE_SIZE,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  accept: string;
  acceptLabel: string;
  acceptedTypes: string[];
  maxSize?: number;
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
    if (selected.size > maxSize) {
      setError(`File must be smaller than ${formatFileSize(maxSize)}.`);
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
      <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
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
        className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#D1D5DB] px-3 py-6 text-center hover:border-primary"
      >
        <UploadCloud className="size-6 text-muted-foreground" />
        <span className="text-[13px] font-medium text-foreground">Click to upload or drag and drop</span>
        <span className="text-[12px] text-muted-foreground">
          {acceptLabel} (max {formatFileSize(maxSize)})
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-1.5 text-[12.5px] text-destructive">{error}</p>}
    </div>
  );
}

function AutofillReview({
  suggestion,
  onApply,
  onDismiss,
  applying,
}: {
  suggestion: CvAutofillSuggestion;
  onApply: () => void;
  onDismiss: () => void;
  applying: boolean;
}) {
  return (
    <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
      <div className="flex items-center gap-1.5">
        <Sparkles className="size-4 text-primary" />
        <h4 className="text-[13.5px] font-semibold text-foreground">Suggested profile from your CV</h4>
      </div>
      <p className="mt-1 text-[12.5px] text-muted-foreground">
        Review before applying — this replaces your current about, skills, experience and education.
      </p>

      {suggestion.about && (
        <p className="mt-2.5 rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] leading-relaxed text-foreground">
          {suggestion.about}
        </p>
      )}

      {suggestion.skills.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {suggestion.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-primary/10 px-2 py-1 text-[12px] font-medium text-primary"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {suggestion.experience.length > 0 && (
        <ul className="mt-2.5 space-y-1">
          {suggestion.experience.map((e, i) => (
            <li key={i} className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px]">
              <span className="font-semibold text-foreground">{e.role}</span>
              <span className="text-muted-foreground">
                {" "}
                — {e.company}
                {e.duration ? ` · ${e.duration}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}

      {suggestion.education.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {suggestion.education.map((e, i) => (
            <li key={i} className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px]">
              <span className="font-semibold text-foreground">{e.degree}</span>
              <span className="text-muted-foreground">
                {" "}
                — {e.school}
                {e.year ? ` · ${e.year}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex justify-end gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary/5"
          onClick={onDismiss}
          disabled={applying}
        >
          Dismiss
        </Button>
        <Button size="sm" onClick={onApply} disabled={applying}>
          {applying ? (
            <>
              <Loader2 className="size-3.5 animate-spin" /> Applying…
            </>
          ) : (
            "Apply to profile"
          )}
        </Button>
      </div>
    </div>
  );
}

export function CvPortfolioCoverTab() {
  const { profile, accessToken, refreshProfile, updateProfile } = useApplicantAuth();

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [hasCvText, setHasCvText] = useState<boolean | null>(null);

  const [suggestion, setSuggestion] = useState<CvAutofillSuggestion | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [applying, setApplying] = useState(false);

  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  async function handleUploadCv() {
    if (!cvFile || !accessToken) return;
    setCvError(null);
    setUploading(true);
    try {
      const res = await applicantAuthService.uploadCv(accessToken, cvFile);
      setHasCvText(res.data.hasCvText);
      setCvFile(null);
      await refreshProfile();
    } catch (err) {
      setCvError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleAutofill() {
    if (!accessToken) return;
    setCvError(null);
    setAnalysing(true);
    try {
      const res = await applicantAuthService.autofillFromCv(accessToken);
      setSuggestion(res.data);
    } catch (err) {
      setCvError(err instanceof Error ? err.message : "Could not analyse your CV.");
    } finally {
      setAnalysing(false);
    }
  }

  async function handleApplySuggestion() {
    if (!suggestion) return;
    setCvError(null);
    setApplying(true);
    try {
      await updateProfile({
        ...(suggestion.about ? { about: suggestion.about } : {}),
        skills: suggestion.skills,
        experience: suggestion.experience.map((e) => ({
          role: e.role,
          company: e.company,
          duration: e.duration,
          responsibilities: e.responsibilities ?? undefined,
        })),
        education: suggestion.education.map((e) => ({
          degree: e.degree,
          school: e.school,
          year: e.year,
          description: e.description ?? undefined,
        })),
      });
      setSuggestion(null);
    } catch (err) {
      setCvError(err instanceof Error ? err.message : "Failed to update your profile.");
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="bg-white rounded-b-xl border border-[#E5E7EB] divide-y divide-[#F3F4F6]">
      <div className="px-5 py-5">
        <h3 className="text-[15px] font-semibold text-foreground">CV / Portfolio / Cover Letter</h3>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
          Upload the documents employers will see when reviewing your application.
        </p>
      </div>

      <div className="px-5 py-5">
        <FormLabel required>CV / Resume</FormLabel>
        <p className="mt-1 mb-2.5 text-[12.5px] text-muted-foreground leading-relaxed">
          Upload your most recent resume as a PDF — it&apos;s attached automatically when you apply
          with your profile, and we can use it to fill in your profile for you.
        </p>

        {profile?.cvUrl && !cvFile && (
          <div className="mb-2.5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-medium text-foreground">
                  {profile.cvName ?? "CV on file"}
                </p>
                <p className="text-[12px] text-emerald-700">Saved on your profile</p>
              </div>
            </div>
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View CV"
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-4" />
            </a>
          </div>
        )}

        <DocumentDropzone
          file={cvFile}
          onChange={setCvFile}
          accept=".pdf"
          acceptLabel="PDF"
          acceptedTypes={["application/pdf"]}
          maxSize={5 * 1024 * 1024}
        />

        {cvFile && (
          <div className="mt-2.5 flex justify-end">
            <Button size="sm" onClick={handleUploadCv} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Uploading…
                </>
              ) : profile?.cvUrl ? (
                "Replace CV"
              ) : (
                "Save CV"
              )}
            </Button>
          </div>
        )}

        {cvError && <p className="mt-1.5 text-[12.5px] text-destructive">{cvError}</p>}

        {profile?.cvUrl && !suggestion && hasCvText !== false && (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-[13px] text-foreground">
              <Sparkles className="size-4 text-primary" />
              Fill in your profile from this CV
            </div>
            <Button size="sm" variant="outline" onClick={handleAutofill} disabled={analysing}>
              {analysing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Analysing…
                </>
              ) : (
                "Autofill profile"
              )}
            </Button>
          </div>
        )}

        {suggestion && (
          <AutofillReview
            suggestion={suggestion}
            onApply={handleApplySuggestion}
            onDismiss={() => setSuggestion(null)}
            applying={applying}
          />
        )}
      </div>

      <div className="px-5 py-5">
        <FormLabel>Portfolio</FormLabel>
        <p className="mt-1 mb-2.5 text-[12.5px] text-muted-foreground leading-relaxed">
          Share a link to your portfolio website, or upload a portfolio document.
        </p>
        <div className="relative mb-3">
          <LinkIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <FormInput
            placeholder="https://your-portfolio.com"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            className="pl-8"
          />
        </div>
        <DocumentDropzone
          file={portfolioFile}
          onChange={setPortfolioFile}
          accept=".pdf,image/jpeg,image/png"
          acceptLabel="PDF, JPG or PNG"
          acceptedTypes={["application/pdf", "image/jpeg", "image/png"]}
        />
      </div>

      <div className="px-5 py-5">
        <FormLabel>Cover Letter</FormLabel>
        <p className="mt-1 mb-2.5 text-[12.5px] text-muted-foreground leading-relaxed">
          Add a cover letter to introduce yourself to potential employers.
        </p>
        <DocumentDropzone
          file={coverLetterFile}
          onChange={setCoverLetterFile}
          accept=".pdf"
          acceptLabel="PDF"
          acceptedTypes={["application/pdf"]}
        />
      </div>
    </div>
  );
}
