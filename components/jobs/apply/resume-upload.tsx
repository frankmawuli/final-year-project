"use client"

import { useRef, useState } from "react"
import { Upload, X as XIcon, FileText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { applicantAuthService } from "@/services/applicant-auth.service"

export function ResumeUpload({
  fileName,
  onChange,
  error,
}: {
  fileName: string | null
  onChange: (name: string | null, url: string | null) => void
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [displayName, setDisplayName] = useState<string | null>(fileName)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFile(file: File) {
    const allowed = ["application/pdf", "image/jpeg", "image/png"]
    if (!allowed.includes(file.type)) {
      setUploadError("Only PDF, JPG, and PNG files are accepted.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File exceeds the 5 MB limit.")
      return
    }
    setDisplayName(file.name)
    setUploadError(null)
    setUploading(true)
    try {
      const token = localStorage.getItem("access_token") ?? ""
      const result = await applicantAuthService.uploadCv(token, file)
      onChange(result.data.cvName, result.data.cvUrl)
    } catch {
      setUploadError("Upload failed. Please try again.")
      setDisplayName(null)
      onChange(null, null)
    } finally {
      setUploading(false)
    }
  }

  const activeError = uploadError ?? error

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed py-5 transition-colors",
          dragging
            ? "border-primary bg-primary/10"
            : activeError
            ? "border-rose-400 bg-muted"
            : "border-border bg-muted hover:border-primary hover:bg-primary/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-1.5">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-[13px] text-muted-foreground">Uploading {displayName}…</p>
          </div>
        ) : displayName ? (
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">{displayName}</p>
              <p className="text-[11px] text-muted-foreground">Click to replace</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setDisplayName(null)
                onChange(null, null)
              }}
              className="ml-1.5 rounded-full p-1 hover:bg-muted"
            >
              <XIcon className="size-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex size-10 items-center justify-center rounded-lg bg-card shadow-sm">
              <Upload className="size-5 text-primary" />
            </div>
            <p className="text-center text-[13px] text-muted-foreground">
              <span className="font-medium text-primary">Click to upload</span> or drag & drop
            </p>
            <p className="text-[11px] text-muted-foreground">PDF, JPG or PNG (max 5 MB)</p>
          </>
        )}
      </div>
      {activeError && <p className="mt-1 text-[11px] text-rose-500">{activeError}</p>}
    </div>
  )
}
