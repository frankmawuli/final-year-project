"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, FileText, FileImage, File, X, CheckCircle2, AlertCircle, CloudUpload } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────
type UploadCategory = "Medical Certificate" | "Expense Receipt" | "Personal ID" | "Training Certificate" | "Other"
type UploadStatus   = "queued" | "uploading" | "done" | "error"

interface FileItem {
  id:       string
  file:     File
  category: UploadCategory
  note:     string
  status:   UploadStatus
  progress: number
}

// ── Helpers ──────────────────────────────────────────────────────
const CATEGORIES: UploadCategory[] = [
  "Medical Certificate", "Expense Receipt", "Personal ID", "Training Certificate", "Other",
]

const ACCEPTED = ["application/pdf", "image/png", "image/jpeg", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
const MAX_MB   = 10

function fileIcon(file: File) {
  if (file.type === "application/pdf")   return { Icon: FileText,  cls: "text-rose-500"  }
  if (file.type.startsWith("image/"))    return { Icon: FileImage, cls: "text-sky-500"   }
  return { Icon: File, cls: "text-blue-600" }
}

function fmtSize(bytes: number) {
  if (bytes < 1024)         return `${bytes} B`
  if (bytes < 1024 * 1024)  return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function uid() { return Math.random().toString(36).slice(2) }

// ── File row ──────────────────────────────────────────────────────
function FileRow({
  item,
  onChange,
  onRemove,
}: {
  item:     FileItem
  onChange: (id: string, patch: Partial<FileItem>) => void
  onRemove: (id: string) => void
}) {
  const { Icon, cls } = fileIcon(item.file)
  const fieldCls = "w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"

  return (
    <div className={cn(
      "rounded-xl border bg-white p-4 shadow-sm transition-all",
      item.status === "done"  ? "border-[#16a34a]/40 bg-[#f0fdf4]" :
      item.status === "error" ? "border-[#dc2626]/40 bg-[#fef2f2]" :
      "border-border"
    )}>
      <div className="flex items-start gap-3">
        {/* File icon */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white shadow-sm">
          <Icon className={cn("size-5", cls)} />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{item.file.name}</p>
          <p className="text-xs text-muted-foreground">{fmtSize(item.file.size)}</p>

          {item.status === "uploading" && (
            <div className="mt-2">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Uploading…</span>
                <span>{item.progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          )}

          {item.status === "done" && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#16a34a]">
              <CheckCircle2 className="size-3.5" /> Uploaded successfully
            </div>
          )}

          {item.status === "error" && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#dc2626]">
              <AlertCircle className="size-3.5" /> Upload failed — please try again
            </div>
          )}

          {item.status === "queued" && (
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">Category</label>
                <select
                  value={item.category}
                  onChange={(e) => onChange(item.id, { category: e.target.value as UploadCategory })}
                  className={fieldCls}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">
                  Note <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type="text"
                  value={item.note}
                  onChange={(e) => onChange(item.id, { note: e.target.value })}
                  placeholder="e.g. Sick leave Mar 2026"
                  className={fieldCls}
                />
              </div>
            </div>
          )}
        </div>

        {/* Remove */}
        {item.status !== "uploading" && (
          <button
            onClick={() => onRemove(item.id)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────
export default function UploadPage() {
  const [items,    setItems]    = useState<FileItem[]>([])
  const [dragging, setDragging] = useState(false)
  const [errors,   setErrors]   = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  function addFiles(files: FileList | null) {
    if (!files) return
    const newErrors: string[] = []
    const newItems: FileItem[] = []

    Array.from(files).forEach((f) => {
      if (!ACCEPTED.includes(f.type)) {
        newErrors.push(`"${f.name}" — unsupported file type. Use PDF, PNG, JPG, or DOCX.`)
        return
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        newErrors.push(`"${f.name}" exceeds the ${MAX_MB} MB limit.`)
        return
      }
      newItems.push({ id: uid(), file: f, category: "Other", note: "", status: "queued", progress: 0 })
    })

    setErrors(newErrors)
    setItems((prev) => [...prev, ...newItems])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [])

  function updateItem(id: string, patch: Partial<FileItem>) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...patch } : i))
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function simulateUpload() {
    const queued = items.filter((i) => i.status === "queued")
    if (!queued.length) return

    queued.forEach((item) => {
      updateItem(item.id, { status: "uploading", progress: 0 })
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 18) + 8
        if (progress >= 100) {
          clearInterval(interval)
          // ~10% chance of simulated error
          const fail = Math.random() < 0.1
          updateItem(item.id, { status: fail ? "error" : "done", progress: 100 })
        } else {
          updateItem(item.id, { progress })
        }
      }, 200)
    })
  }

  const hasQueued   = items.some((i) => i.status === "queued")
  const allDone     = items.length > 0 && items.every((i) => i.status === "done" || i.status === "error")
  const doneCount   = items.filter((i) => i.status === "done").length
  const errorCount  = items.filter((i) => i.status === "error").length

  return (
    <div className="flex h-full flex-col">
      {/* Mobile title */}
      <div className="border-b border-border bg-white px-4 py-3 lg:hidden">
        <h1 className="text-base font-semibold text-foreground">Upload Files</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Documents › Upload</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">

          {/* Page heading */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Upload Documents</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Upload supporting documents — medical certs, receipts, IDs, or training certs. Max {MAX_MB} MB per file.
            </p>
          </div>

          {/* ── Drop zone ── */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true)  }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "relative mb-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 transition-all",
              dragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border bg-white hover:border-primary/50 hover:bg-muted/30"
            )}
          >
            <div className={cn(
              "flex size-14 items-center justify-center rounded-2xl transition-colors",
              dragging ? "bg-primary/10" : "bg-muted"
            )}>
              <CloudUpload className={cn("size-7", dragging ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {dragging ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                or <span className="font-medium text-primary">click to browse</span>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {["PDF", "PNG", "JPG", "DOCX"].map((t) => (
                <span key={t} className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.docx"
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {/* ── Errors ── */}
          {errors.length > 0 && (
            <div className="mb-4 rounded-xl border border-[#dc2626]/30 bg-[#fef2f2] p-4">
              {errors.map((e, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#dc2626]">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  {e}
                </div>
              ))}
            </div>
          )}

          {/* ── File list ── */}
          {items.length > 0 && (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <FileRow
                  key={item.id}
                  item={item}
                  onChange={updateItem}
                  onRemove={removeItem}
                />
              ))}

              {/* Summary after done */}
              {allDone && (
                <div className={cn(
                  "flex items-center gap-3 rounded-xl border p-4",
                  errorCount > 0
                    ? "border-[#d97706]/30 bg-[#fffbeb]"
                    : "border-[#16a34a]/30 bg-[#f0fdf4]"
                )}>
                  <CheckCircle2 className={cn("size-5 shrink-0", errorCount > 0 ? "text-[#d97706]" : "text-[#16a34a]")} />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">
                      {doneCount} file{doneCount !== 1 ? "s" : ""} uploaded successfully
                      {errorCount > 0 && ` · ${errorCount} failed`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Documents are pending HR verification and will appear in My Documents once approved.
                    </p>
                  </div>
                </div>
              )}

              {/* Upload / Clear buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setItems([]); setErrors([]) }}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Clear all
                </button>
                {hasQueued && (
                  <button
                    onClick={simulateUpload}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  >
                    <Upload className="size-4" />
                    Upload {items.filter((i) => i.status === "queued").length} file
                    {items.filter((i) => i.status === "queued").length !== 1 ? "s" : ""}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Guidelines ── */}
          <div className="mt-8 rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-foreground">Upload guidelines</p>
            <ul className="flex flex-col gap-2">
              {[
                "Accepted formats: PDF, PNG, JPG, DOCX",
                `Maximum file size: ${MAX_MB} MB per file`,
                "Medical certificates must be signed by a licensed physician",
                "Documents are reviewed by HR within 1–2 business days",
                "Uploaded files are stored securely and only accessible to you and HR",
              ].map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {g}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}
