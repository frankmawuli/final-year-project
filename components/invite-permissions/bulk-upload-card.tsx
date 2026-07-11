import { useRef, useState } from "react"
import { Users, Upload, FileText, X, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, Divider } from "@/components/company-settings/settings-primitives"
import type { BulkInviteResult } from "@/services/onboarding.service"

export function BulkUploadCard({
  onUpload,
  uploading,
  result,
}: {
  onUpload: (file: File) => void
  uploading: boolean
  result: BulkInviteResult | null
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)

  function pick(f: File | null) {
    if (f && !f.name.endsWith(".csv")) return
    setFile(f)
  }

  return (
    <Card title="Bulk Upload Employees" subtitle="Invite many employees at once via a CSV file" icon={Users}>
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault(); setDragging(false)
          pick(e.dataTransfer.files[0] ?? null)
        }}
        className={cn(
          "flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition-colors",
          dragging ? "border-primary bg-primary/10" : "border-border bg-muted/50 hover:border-primary hover:bg-primary/5",
          uploading && "pointer-events-none opacity-70"
        )}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={e => { pick(e.target.files?.[0] ?? null); e.target.value = "" }}
        />
        {file ? (
          <>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="size-4 text-primary" />
            </div>
            <p className="text-xs font-medium text-foreground">{file.name}</p>
            <button
              onClick={e => { e.stopPropagation(); setFile(null) }}
              className="flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-rose-500"
            >
              <X className="size-3" /> Remove
            </button>
          </>
        ) : (
          <>
            <div className="flex size-9 items-center justify-center rounded-lg bg-card shadow-sm">
              <Upload className="size-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-primary">Click to upload</span> or drag & drop a CSV
            </p>
            <p className="text-[11px] text-muted-foreground">Columns: name, email, role (+ optional employee fields)</p>
          </>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={() => file && onUpload(file)}
          disabled={!file || uploading}
          className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload & invite"}
        </button>
      </div>

      {result && (
        <>
          <Divider />
          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-xl bg-muted/50 py-2">
                <p className="text-sm font-bold text-foreground">{result.total}</p>
                <p className="text-[11px] text-muted-foreground">Total rows</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 py-2">
                <p className="text-sm font-bold text-emerald-600">{result.invitedCount}</p>
                <p className="text-[11px] text-muted-foreground">Invited</p>
              </div>
              <div className="rounded-xl bg-rose-500/10 py-2">
                <p className="text-sm font-bold text-rose-500">{result.failedCount}</p>
                <p className="text-[11px] text-muted-foreground">Failed</p>
              </div>
            </div>

            {result.invited.length > 0 && (
              <div className="flex flex-col gap-1">
                {result.invited.map((row, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-foreground">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    <span className="font-medium">{row.name}</span>
                    <span className="text-muted-foreground">{row.email}</span>
                  </div>
                ))}
              </div>
            )}

            {result.failed.length > 0 && (
              <div className="flex flex-col gap-1">
                {result.failed.map((row, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs">
                    <XCircle className="mt-0.5 size-3.5 shrink-0 text-rose-500" />
                    <span className="text-muted-foreground">{row.email} — {row.reason}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
