"use client"

import { useState, useRef } from "react"
import {
  AlertCircle, CheckCircle2, Clock, ShieldAlert, Eye, EyeOff,
  MessageSquare, ChevronRight, Plus, X, Paperclip, Send, Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { uploadService } from "@/services/upload.service"

// ── Types ────────────────────────────────────────────────────────
type ComplaintCategory = "Workplace Harassment" | "Discrimination" | "Safety Concern" | "Manager Conduct" | "Policy Violation" | "Other"
type ComplaintStatus   = "Submitted" | "Under Investigation" | "Resolved" | "Closed"
type ComplaintPriority = "Low" | "Medium" | "High" | "Critical"

interface Complaint {
  id:             number
  ref:            string
  title:          string
  category:       ComplaintCategory
  priority:       ComplaintPriority
  submittedOn:    string
  status:         ComplaintStatus
  anonymous:      boolean
  description:    string
  attachmentUrl?: string
  updates:        { date: string; text: string }[]
}

// ── Style maps ───────────────────────────────────────────────────
const categoryColor: Record<ComplaintCategory, string> = {
  "Workplace Harassment": "#dc2626",
  "Discrimination":       "#ea580c",
  "Safety Concern":       "#d97706",
  "Manager Conduct":      "#7c3aed",
  "Policy Violation":     "#0369a1",
  "Other":                "#6b7280",
}

const categoryBg: Record<ComplaintCategory, string> = {
  "Workplace Harassment": "bg-[#fef2f2]",
  "Discrimination":       "bg-[#fff7ed]",
  "Safety Concern":       "bg-[#fffbeb]",
  "Manager Conduct":      "bg-[#f5f3ff]",
  "Policy Violation":     "bg-[#f0f9ff]",
  "Other":                "bg-muted",
}

const priorityBadge: Record<ComplaintPriority, string> = {
  Low:      "bg-muted text-muted-foreground",
  Medium:   "bg-[#fffbeb] text-[#d97706]",
  High:     "bg-[#fff7ed] text-[#ea580c]",
  Critical: "bg-[#fef2f2] text-[#dc2626]",
}

const statusBadge: Record<ComplaintStatus, string> = {
  "Submitted":           "bg-[#fffbeb] text-[#d97706] border border-[#d97706]",
  "Under Investigation": "bg-[#eef2ff] text-[#5e81f4] border border-[#5e81f4]",
  "Resolved":            "bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]",
  "Closed":              "bg-muted text-muted-foreground border border-border",
}

const statusIcon: Record<ComplaintStatus, React.ReactNode> = {
  "Submitted":           <Clock className="size-3" />,
  "Under Investigation": <AlertCircle className="size-3" />,
  "Resolved":            <CheckCircle2 className="size-3" />,
  "Closed":              <CheckCircle2 className="size-3" />,
}

const CATEGORIES: ComplaintCategory[] = [
  "Workplace Harassment", "Discrimination", "Safety Concern", "Manager Conduct", "Policy Violation", "Other",
]

const PRIORITIES: ComplaintPriority[] = ["Low", "Medium", "High", "Critical"]

// ── Seed data ─────────────────────────────────────────────────────
let _nextId  = 3
let _nextRef = 1003

const seed: Complaint[] = [
  {
    id:          1,
    ref:         "CMP-1001",
    title:       "Repeated interruptions during presentations",
    category:    "Manager Conduct",
    priority:    "Medium",
    submittedOn: "Mar 20, 2026",
    status:      "Under Investigation",
    anonymous:   false,
    description: "During the last three sprint reviews my manager has repeatedly interrupted my presentations before I finish, dismissing my points in front of the team. This has affected my confidence and team dynamics.",
    updates: [
      { date: "Mar 22, 2026", text: "Complaint received and assigned to HR. Initial review in progress." },
      { date: "Mar 25, 2026", text: "HR scheduled a private meeting with the employee for April 3." },
    ],
  },
  {
    id:          2,
    ref:         "CMP-1002",
    title:       "Unsafe electrical wiring in server room",
    category:    "Safety Concern",
    priority:    "High",
    submittedOn: "Feb 08, 2026",
    status:      "Resolved",
    anonymous:   true,
    description: "Exposed wiring near the server rack on floor 2 poses a fire and electrocution risk. The issue was first noticed in January but has not been addressed by facilities.",
    updates: [
      { date: "Feb 09, 2026", text: "Facilities team notified. Temporary safety barrier installed." },
      { date: "Feb 14, 2026", text: "Licensed electrician inspected and repaired wiring. Issue resolved." },
    ],
  },
]

// ── Complaint detail panel ────────────────────────────────────────
function ComplaintDetail({ c, onClose }: { c: Complaint; onClose: () => void }) {
  const clr = categoryColor[c.category]
  const bg  = categoryBg[c.category]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">{c.ref}</span>
              {c.anonymous && (
                <span className="flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <EyeOff className="size-3" />Anonymous
                </span>
              )}
            </div>
            <p className="mt-1 font-semibold text-foreground">{c.title}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span
                className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", bg)}
                style={{ color: clr }}
              >
                {c.category}
              </span>
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", priorityBadge[c.priority])}>
                {c.priority} Priority
              </span>
              <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", statusBadge[c.status])}>
                {statusIcon[c.status]}{c.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</p>
          <p className="text-xs leading-relaxed text-foreground">{c.description}</p>

          <p className="mb-2.5 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Activity Timeline
          </p>
          <div className="relative flex flex-col gap-0">
            {c.updates.map((u, i) => (
              <div key={i} className="flex gap-2.5">
                <div className="flex flex-col items-center">
                  <div className="mt-1 size-2.5 shrink-0 rounded-full bg-primary ring-2 ring-primary/20" />
                  {i < c.updates.length - 1 && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="pb-3">
                  <p className="text-xs text-muted-foreground">{u.date}</p>
                  <p className="mt-0.5 text-xs text-foreground">{u.text}</p>
                </div>
              </div>
            ))}
            {c.status !== "Resolved" && c.status !== "Closed" && (
              <div className="flex gap-2.5">
                <div className="flex flex-col items-center">
                  <div className="mt-1 size-2.5 shrink-0 rounded-full border-2 border-muted-foreground/30 bg-white" />
                </div>
                <p className="text-xs text-muted-foreground/50">Awaiting next update…</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border px-5 py-3">
          <button onClick={onClose} className="w-full rounded-lg border border-border py-2 text-xs font-medium text-foreground hover:bg-muted">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ── New complaint form ────────────────────────────────────────────
function NewComplaintForm({ onSubmit, onCancel }: {
  onSubmit: (c: Complaint) => void
  onCancel: () => void
}) {
  const { accessToken } = useAuth()
  const [title,             setTitle]             = useState("")
  const [category,          setCategory]          = useState<ComplaintCategory>("Other")
  const [priority,          setPriority]          = useState<ComplaintPriority>("Medium")
  const [description,       setDescription]       = useState("")
  const [anonymous,         setAnonymous]         = useState(false)
  const [error,             setError]             = useState("")
  const [fileName,          setFileName]          = useState("")
  const [attachmentUrl,     setAttachmentUrl]     = useState<string | null>(null)
  const [attachmentLoading, setAttachmentLoading] = useState(false)
  const [attachmentError,   setAttachmentError]   = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fieldCls = "w-full rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"

  async function handleAttachmentChange(file: File) {
    const allowed = ["application/pdf", "image/jpeg", "image/png"]
    if (!allowed.includes(file.type)) {
      setAttachmentError("Only PDF, JPG, or PNG files are accepted.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setAttachmentError("File exceeds the 5 MB limit.")
      return
    }
    setFileName(file.name)
    setAttachmentError(null)
    setAttachmentLoading(true)
    try {
      const result = await uploadService.document(file, accessToken ?? "")
      setAttachmentUrl(result.url)
    } catch {
      setAttachmentError("Attachment upload failed. Please try again.")
      setFileName("")
    } finally {
      setAttachmentLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim())       { setError("Please provide a complaint title."); return }
    if (!description.trim()) { setError("Please describe the issue."); return }
    if (attachmentLoading)   { setError("Please wait for the attachment to finish uploading."); return }

    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    onSubmit({
      id:             _nextId++,
      ref:            `CMP-${_nextRef++}`,
      title:          title.trim(),
      category,
      priority,
      submittedOn:    now,
      status:         "Submitted",
      anonymous,
      description:    description.trim(),
      ...(attachmentUrl ? { attachmentUrl } : {}),
      updates:        [{ date: now, text: "Complaint received and queued for review by HR." }],
    })
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-white shadow-sm">
      <div className="border-b border-border px-4 py-3 md:px-5">
        <h2 className="text-sm font-semibold text-foreground">New Complaint</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          All complaints are handled confidentially by HR
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-5">
        <div className="flex flex-col gap-3">

          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of the issue"
              className={fieldCls}
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ComplaintCategory)} className={fieldCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as ComplaintPriority)} className={fieldCls}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, when, where, and who was involved. Be as specific as possible."
              rows={5}
              className={cn(fieldCls, "resize-none leading-relaxed")}
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">{description.length} characters</p>
          </div>

          {/* Attachment */}
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              Attachment <span className="text-muted-foreground">(optional)</span>
            </label>
            <button
              type="button"
              onClick={() => !attachmentLoading && fileRef.current?.click()}
              disabled={attachmentLoading}
              className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/50 disabled:opacity-60"
            >
              {attachmentLoading
                ? <Loader2 className="size-4 shrink-0 animate-spin" />
                : <Paperclip className="size-4 shrink-0" />
              }
              {attachmentLoading
                ? `Uploading ${fileName}…`
                : fileName || "Attach a file (PDF, PNG, JPG — max 5 MB)"
              }
            </button>
            {attachmentError && (
              <p className="mt-1 text-xs text-rose-500">{attachmentError}</p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleAttachmentChange(f)
              }}
            />
          </div>

          {/* Anonymous toggle */}
          <div
            className={cn(
              "flex items-start gap-2.5 rounded-xl border p-3 transition-colors cursor-pointer",
              anonymous ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"
            )}
            onClick={() => setAnonymous((a) => !a)}
          >
            <div className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
              anonymous ? "border-primary bg-primary" : "border-muted-foreground/30 bg-white"
            )}>
              {anonymous && <CheckCircle2 className="size-3.5 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <EyeOff className="size-4 text-muted-foreground" />
                <p className="text-xs font-medium text-foreground">Submit anonymously</p>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your name will not be disclosed to anyone outside the HR team. Note: anonymous complaints may limit our ability to investigate fully.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 rounded-lg border border-[#dc2626]/30 bg-[#fef2f2] px-2.5 py-2 text-xs text-[#dc2626]">
              <AlertCircle className="size-4 shrink-0" />{error}
            </div>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              <Send className="size-4" />
              Submit Complaint
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

// ── Complaint card ────────────────────────────────────────────────
function ComplaintCard({ c, onView }: { c: Complaint; onView: () => void }) {
  const clr = categoryColor[c.category]
  const bg  = categoryBg[c.category]

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start gap-3 p-4">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", bg)}>
          <ShieldAlert className="size-5" style={{ color: clr }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-1.5">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-foreground">{c.title}</p>
                {c.anonymous && (
                  <span className="flex items-center gap-0.5 rounded-full bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
                    <EyeOff className="size-2.5" />Anon
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span
                  className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold", bg)}
                  style={{ color: clr }}
                >
                  {c.category}
                </span>
                <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold", priorityBadge[c.priority])}>
                  {c.priority}
                </span>
              </div>
            </div>
            <span className={cn("flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold", statusBadge[c.status])}>
              {statusIcon[c.status]}{c.status}
            </span>
          </div>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{c.description}</p>

          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <span>{c.ref}</span>
              <span>·</span>
              <span>Submitted {c.submittedOn}</span>
              {c.updates.length > 0 && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="size-3" />{c.updates.length} update{c.updates.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={onView}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────
export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(seed)
  const [showForm,   setShowForm]   = useState(false)
  const [viewing,    setViewing]    = useState<Complaint | null>(null)
  const [submitted,  setSubmitted]  = useState<Complaint | null>(null)

  function handleSubmit(c: Complaint) {
    setComplaints((prev) => [c, ...prev])
    setShowForm(false)
    setSubmitted(c)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-white px-3 py-2.5 lg:hidden">
        <h1 className="text-sm font-semibold text-foreground">Complaints</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Report › Complaints</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-5 lg:p-6">

       

        {/* ── Success banner ── */}
        {submitted && (
          <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-[#16a34a]/30 bg-[#f0fdf4] p-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#16a34a]" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground">Complaint submitted — {submitted.ref}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                HR will review your complaint within 1–2 business days. You can track the status below.
              </p>
            </div>
            <button onClick={() => setSubmitted(null)} className="text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* ── Header row ── */}
        <div className="mb-3 flex items-center justify-between">
         
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              <Plus className="size-4" />
              New Complaint
            </button>
          )}
        </div>

        {/* ── Form ── */}
        {showForm && (
          <div className="mb-4">
            <NewComplaintForm
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* ── Policy notice ── */}
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-3">
          <Eye className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Confidentiality notice: </span>
            All complaints are handled with strict confidentiality. Only authorised HR personnel have access to complaint details. Retaliation against employees who file complaints in good faith is strictly prohibited under company policy.
          </p>
        </div>

        {/* ── List ── */}
        {complaints.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {complaints.map((c) => (
              <ComplaintCard key={c.id} c={c} onView={() => setViewing(c)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-16">
            <ShieldAlert className="mb-2.5 size-10 text-muted-foreground/40" />
            <p className="text-xs font-medium text-muted-foreground">No complaints filed</p>
          </div>
        )}

      </div>

      {viewing && <ComplaintDetail c={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}
