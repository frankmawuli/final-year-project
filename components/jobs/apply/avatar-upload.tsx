"use client"

import { useRef, useState } from "react"
import { User, Camera, Loader2 } from "lucide-react"
import { applicantAuthService } from "@/services/applicant-auth.service"

export function AvatarUpload({
  preview,
  onChange,
}: {
  preview: string | null
  onChange: (url: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFile(file: File) {
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setUploadError("Only JPG or PNG images are accepted.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image exceeds the 5 MB limit.")
      return
    }
    onChange(URL.createObjectURL(file))
    setUploadError(null)
    setUploading(true)
    try {
      const token = localStorage.getItem("access_token") ?? ""
      const result = await applicantAuthService.uploadPhoto(token, file)
      onChange(result.data.url)
    } catch {
      setUploadError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="flex size-[80px] items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted">
          {preview ? (
            <img src={preview} alt="Profile" className="size-full object-cover" />
          ) : (
            <User className="size-8 text-muted-foreground" strokeWidth={1.5} />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
        >
          <Camera className="size-3.5" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
      </div>
      <div>
        <p className="text-[13px] font-medium text-foreground">Profile Photo</p>
        <p className="mt-0.5 text-[12px] text-muted-foreground">JPG or PNG · max 5 MB</p>
        {uploadError && <p className="mt-0.5 text-[11px] text-rose-500">{uploadError}</p>}
        <div className="mt-1.5 flex gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-border bg-card px-2.5 py-1 text-[12px] font-medium text-foreground hover:bg-muted disabled:opacity-60"
          >
            Upload photo
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-lg border border-border px-2.5 py-1 text-[12px] font-medium text-muted-foreground hover:bg-muted"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
