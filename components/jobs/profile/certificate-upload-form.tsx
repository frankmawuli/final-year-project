"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput, FormLabel, FormSelect } from "@/components/jobs/profile/form-controls";
import { MONTHS, YEARS } from "@/components/jobs/profile/constants";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface CertificateEntry {
  title: string;
  issuer: string;
  issueMonth: string;
  issueYear: string;
  expirationMonth: string;
  expirationYear: string;
  doesNotExpire: boolean;
  credentialId: string;
  credentialUrl: string;
  file: File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CertificateUploadForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (entry: CertificateEntry) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueMonth, setIssueMonth] = useState("");
  const [issueYear, setIssueYear] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [doesNotExpire, setDoesNotExpire] = useState(false);
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFile(selected: File | undefined) {
    if (!selected) return;
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setFileError("Only PDF, JPG, or PNG files are supported.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFileError("File must be smaller than 10MB.");
      return;
    }
    setFileError("");
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function handleRemoveFile() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  }

  function handleSave() {
    if (!file) {
      setFileError("Please upload a certificate file.");
      return;
    }
    onSave({
      title,
      issuer,
      issueMonth,
      issueYear,
      expirationMonth,
      expirationYear,
      doesNotExpire,
      credentialId,
      credentialUrl,
      file,
    });
  }

  return (
    <div>
      <div className="px-6 py-6">
        <h3 className="text-[15px] font-semibold text-foreground">Add Certificate</h3>
      </div>

      <div className="border-t border-[#F3F4F6] px-6 py-6">
        <FormLabel required>Certificate File</FormLabel>
        {file ? (
          <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              {file.type.startsWith("image/") && preview ? (
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
              onClick={handleRemoveFile}
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
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
            <span className="text-[12px] text-muted-foreground">PDF, JPG or PNG (max 10MB)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/jpeg,image/png"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        )}
        {fileError && <p className="mt-2 text-[12.5px] text-destructive">{fileError}</p>}
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#F3F4F6] px-6 py-6 sm:grid-cols-2">
        <div>
          <FormLabel required>Certificate / Award Title</FormLabel>
          <FormInput
            placeholder="e.g. AWS Certified Solutions Architect"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <FormLabel required>Issuing Organization</FormLabel>
          <FormInput
            placeholder="e.g. Amazon Web Services"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#F3F4F6] px-6 py-6 sm:grid-cols-2">
        <div>
          <FormLabel required>Issue date</FormLabel>
          <div className="flex gap-2">
            <FormSelect value={issueMonth} onChange={(e) => setIssueMonth(e.target.value)}>
              <option value="" disabled>
                Month
              </option>
              {MONTHS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
            <FormSelect value={issueYear} onChange={(e) => setIssueYear(e.target.value)}>
              <option value="" disabled>
                Year
              </option>
              {YEARS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>
        <div>
          <FormLabel>Expiration date</FormLabel>
          <div className="flex gap-2">
            <FormSelect
              value={expirationMonth}
              disabled={doesNotExpire}
              onChange={(e) => setExpirationMonth(e.target.value)}
            >
              <option value="" disabled>
                Month
              </option>
              {MONTHS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
            <FormSelect
              value={expirationYear}
              disabled={doesNotExpire}
              onChange={(e) => setExpirationYear(e.target.value)}
            >
              <option value="" disabled>
                Year
              </option>
              {YEARS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
          </div>
          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2.5 text-[13.5px] text-foreground">
            <input
              type="checkbox"
              checked={doesNotExpire}
              onChange={(e) => setDoesNotExpire(e.target.checked)}
              className="size-4 rounded border-[#D1D5DB] accent-primary"
            />
            This credential does not expire
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#F3F4F6] px-6 py-6 sm:grid-cols-2">
        <div>
          <FormLabel>Credential ID</FormLabel>
          <FormInput placeholder="Optional" value={credentialId} onChange={(e) => setCredentialId(e.target.value)} />
        </div>
        <div>
          <FormLabel>Credential URL</FormLabel>
          <FormInput
            placeholder="https://"
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-[#F3F4F6] px-6 py-4">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/5"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
