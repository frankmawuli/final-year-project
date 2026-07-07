"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  ChevronDown, X, Download, MapPin, Mail, Phone,
  Briefcase, GraduationCap, FileText, Star, Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { useAuth } from "@/context/auth-context"
import {
  applicationsService,
  type ApiApplicantDetail,
} from "@/services/applications.service"
import type { ApiApplicant, ApiApplicantStatus } from "@/services/jobs.service"

// ── Types ─────────────────────────────────────────────────────
type EvalStatus = "Pending Review" | "Shortlisted" | "Interview" | "Accepted" | "Approved" | "Rejected"

interface Candidate {
  id:         string
  name:       string
  email:      string
  phone:      string
  photo:      string
  position:   string
  department: string
  appliedAt:  string
  location:   string
  aiScore:    number
  status:     EvalStatus
  about:      string
  skills:     string[]
  experience: { role: string; company: string; duration: string }[]
  education:  { degree: string; school: string; year: string }[]
  documents:  { name: string; type: string; url: string }[]
}

// ── Status config ─────────────────────────────────────────────
const statusConfig: Record<EvalStatus, { bg: string; text: string }> = {
  "Pending Review": { bg: "#f0f0ff", text: "#8a8cd9" },
  Shortlisted:      { bg: "#eef2ff", text: "#6366f1" },
  Interview:        { bg: "#eff6ff", text: "#3b82f6" },
  Accepted:         { bg: "#def8ee", text: "#4aa785" },
  Approved:         { bg: "#fffbd4", text: "#ffc555" },
  Rejected:         { bg: "#fef2f2", text: "#ef4444" },
}

const STATUS_OPTIONS: EvalStatus[] = ["Pending Review", "Shortlisted", "Interview", "Accepted", "Approved", "Rejected"]

// ── API ↔ UI status maps ──────────────────────────────────────
const STATUS_TO_EVAL: Record<ApiApplicantStatus, EvalStatus> = {
  PENDING_REVIEW: "Pending Review",
  SHORTLISTED:    "Shortlisted",
  INTERVIEW:      "Interview",
  ACCEPTED:       "Accepted",
  APPROVED:       "Approved",
  REJECTED:       "Rejected",
}

const EVAL_TO_STATUS: Record<EvalStatus, ApiApplicantStatus> = {
  "Pending Review": "PENDING_REVIEW",
  Shortlisted:      "SHORTLISTED",
  Interview:        "INTERVIEW",
  Accepted:         "ACCEPTED",
  Approved:         "APPROVED",
  Rejected:         "REJECTED",
}

// ── Formatters ────────────────────────────────────────────────
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  })
}

function formatDuration(start?: string, end?: string | null): string {
  const s = start ? new Date(start).getFullYear() : "?"
  const e = end   ? new Date(end).getFullYear()   : "Present"
  return `${s} – ${e}`
}

// MISMATCH: ApiApplicant.job has no department name — job.type used as fallback.
// Ask the backend to include department.name in the applicant job payload.
const JOB_TYPE_LABEL: Record<string, string> = {
  FULL_TIME:   "Full Time",
  PART_TIME:   "Part Time",
  CONTRACT:    "Contract",
  INTERNSHIP:  "Internship",
}

// ── API → local mappers ────────────────────────────────────────
function fromApplicant(a: ApiApplicant): Candidate {
  return {
    id:         a.id,
    name:       a.candidate.name,
    email:      a.candidate.email,
    phone:      a.candidate.phone    ?? "",
    photo:      a.candidate.avatarUrl ?? "",
    position:   a.job.title,
    department: JOB_TYPE_LABEL[a.job.type] ?? a.job.type,
    appliedAt:  formatDate(a.appliedAt),
    location:   a.candidate.location ?? "",
    aiScore:    a.aiScore             ?? 0,
    status:     STATUS_TO_EVAL[a.status],
    about:      a.candidate.about    ?? "",
    skills:     [],
    experience: [],
    education:  [],
    documents:  a.documents.map(d => ({ name: d.name, type: d.type, url: d.url })),
  }
}

function mergeDetail(base: Candidate, d: ApiApplicantDetail): Candidate {
  return {
    ...base,
    about:  d.candidate.about ?? base.about,
    skills: d.candidate.skills.map(s => s.name),
    experience: [...d.candidate.experience]
      .sort((a, b) => a.position - b.position)
      .map(e => ({
        role:     e.title    ?? "",   // MISMATCH: API field is "title", UI expects "role"
        company:  e.company  ?? "",
        duration: formatDuration(e.startDate, e.endDate),
      })),
    education: [...d.candidate.education]
      .sort((a, b) => a.position - b.position)
      .map(e => ({
        degree: e.degree ?? "",
        school: e.school ?? "",
        year:   e.endDate ? String(new Date(e.endDate).getFullYear()) : "",
      })),
  }
}

// ── Sub-components ─────────────────────────────────────────────

function AiScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? "#4aa785" : score >= 70 ? "#ffc555" : "#ef4444"
  const bg    = score >= 85 ? "#def8ee" : score >= 70 ? "#fffbd4" : "#fef2f2"
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-bold"
      style={{ background: bg, color }}
    >
      {score >= 85 && (
        <svg viewBox="0 0 12 12" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
        </svg>
      )}
      {score}%
    </span>
  )
}

function StatusBadge({ status }: { status: EvalStatus }) {
  const { bg, text } = statusConfig[status]
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ background: bg, color: text }}
    >
      {status}
    </span>
  )
}

function StatusDropdown({
  value,
  onChange,
}: {
  value: EvalStatus
  onChange: (v: EvalStatus) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-[28px] min-w-[130px] items-center justify-between gap-1 rounded border border-border bg-white px-2 text-xs font-medium text-[#374151] hover:bg-muted"
      >
        <span>{value}</span>
        <ChevronDown className="size-3 shrink-0 text-[#8181a5]" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
          {STATUS_OPTIONS.map((opt) => {
            const { text } = statusConfig[opt]
            return (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={cn(
                  "flex w-full items-center gap-1.5 px-2.5 py-1.5 text-xs transition-colors hover:bg-muted",
                  opt === value ? "font-semibold" : "font-medium"
                )}
                style={{ color: text }}
              >
                <span className="size-2 shrink-0 rounded-full" style={{ background: text }} />
                {opt}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProfilePanel({
  candidate,
  loading,
  onClose,
}: {
  candidate: Candidate
  loading:   boolean
  onClose:   () => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      <aside className="fixed right-0 top-0 z-40 flex h-full w-[420px] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-[#1f2937]">Applicant Profile</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-[#8181a5] hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Identity */}
          <div className="flex items-start gap-3">
            {candidate.photo ? (
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="size-16 shrink-0 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#f0f0ff] ring-2 ring-border text-base font-bold text-[#8a8cd9]">
                {candidate.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-[#1f2937]">{candidate.name}</p>
              <p className="text-xs font-medium text-[#3d70fa]">{candidate.position}</p>
              <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-[#667388]">
                <span className="flex items-center gap-1">
                  <Mail className="size-3" />{candidate.email}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2.5 text-xs text-[#667388]">
                <span className="flex items-center gap-1">
                  <Phone className="size-3" />{candidate.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />{candidate.location}
                </span>
              </div>
            </div>
          </div>

          {/* AI Score + Status */}
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-[#f8fafc] px-3 py-2.5">
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] uppercase tracking-wide text-[#8181a5]">AI Score</p>
              <AiScoreBadge score={candidate.aiScore} />
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] uppercase tracking-wide text-[#8181a5]">Status</p>
              <StatusBadge status={candidate.status} />
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] uppercase tracking-wide text-[#8181a5]">Applied</p>
              <p className="text-xs font-medium text-[#374151]">{candidate.appliedAt}</p>
            </div>
          </div>

          {/* About */}
          {candidate.about && (
            <div>
              <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-[#1f2937]">
                <Star className="size-3.5 text-[#ffc555]" />About
              </p>
              <p className="text-xs leading-relaxed text-[#667388]">{candidate.about}</p>
            </div>
          )}

          {/* Skills */}
          <div>
            <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-[#1f2937]">
              <Briefcase className="size-3.5 text-[#5e81f4]" />Skills
            </p>
            {loading ? (
              <div className="flex items-center gap-1.5 text-xs text-[#8181a5]">
                <Loader2 className="size-3.5 animate-spin" />Loading…
              </div>
            ) : candidate.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((s) => (
                  <span key={s} className="rounded-full bg-[#f0f0ff] px-2 py-0.5 text-xs font-medium text-[#8a8cd9]">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8181a5]">No skills listed.</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <p className="mb-2.5 flex items-center gap-1 text-xs font-semibold text-[#1f2937]">
              <Briefcase className="size-3.5 text-[#3b82f6]" />Experience
            </p>
            {loading ? (
              <div className="flex items-center gap-1.5 text-xs text-[#8181a5]">
                <Loader2 className="size-3.5 animate-spin" />Loading…
              </div>
            ) : candidate.experience.length > 0 ? (
              <div className="space-y-2.5">
                {candidate.experience.map((exp, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-1 size-2 shrink-0 rounded-full bg-[#5e81f4]" />
                    <div>
                      <p className="text-xs font-semibold text-[#1f2937]">{exp.role}</p>
                      <p className="text-xs text-[#667388]">{exp.company} · {exp.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8181a5]">No experience listed.</p>
            )}
          </div>

          {/* Education */}
          <div>
            <p className="mb-2.5 flex items-center gap-1 text-xs font-semibold text-[#1f2937]">
              <GraduationCap className="size-3.5 text-[#4aa785]" />Education
            </p>
            {loading ? (
              <div className="flex items-center gap-1.5 text-xs text-[#8181a5]">
                <Loader2 className="size-3.5 animate-spin" />Loading…
              </div>
            ) : candidate.education.length > 0 ? (
              <div className="space-y-2.5">
                {candidate.education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-1 size-2 shrink-0 rounded-full bg-[#4aa785]" />
                    <div>
                      <p className="text-xs font-semibold text-[#1f2937]">{edu.degree}</p>
                      <p className="text-xs text-[#667388]">{edu.school} · {edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8181a5]">No education listed.</p>
            )}
          </div>

          {/* Documents */}
          {candidate.documents.length > 0 && (
            <div>
              <p className="mb-2.5 flex items-center gap-1 text-xs font-semibold text-[#1f2937]">
                <FileText className="size-3.5 text-[#ffc555]" />Submitted Documents
              </p>
              <div className="space-y-1.5">
                {candidate.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border bg-[#f8fafc] px-2.5 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff]">
                        <FileText className="size-4 text-[#3b82f6]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#1f2937]">{doc.name}</p>
                        <p className="text-[10px] text-[#8181a5]">{doc.type}</p>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1 text-[#5e81f4] hover:bg-[#f0f0ff]"
                      title="Download"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Job Listings",         href: "/dashboard/hr/jobs",       active: false },
  { label: "Applicants",           href: "/dashboard/hr/applicants", active: false },
  { label: "Candidate Evaluation", href: "/dashboard/hr/evaluation", active: true  },
  { label: "Interview Scheduling", href: "#",                         active: false },
  { label: "History",              href: "#",                         active: false },
]

// ── Main Page ─────────────────────────────────────────────────
export default function EvaluationPage() {
  const { accessToken } = useAuth()

  const [rows, setRows]               = useState<Candidate[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError]     = useState<string | null>(null)
  const [search, setSearch]           = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage]               = useState(1)
  const [totalPages, setTotalPages]   = useState(1)
  const [viewing, setViewing]         = useState<Candidate | null>(null)
  const [panelLoading, setPanelLoading] = useState(false)

  // Debounce search → reset to page 1 when it settles
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchList = useCallback(async (p: number, q: string) => {
    if (!accessToken) return
    setListLoading(true)
    setListError(null)
    try {
      const res = await applicationsService.list(
        { search: q || undefined, page: p, limit: 8 },
        accessToken,
      )
      setRows(res.data.map(fromApplicant))
      setTotalPages(res.meta.totalPages)
    } catch {
      setListError("Failed to load candidates. Please try again.")
    } finally {
      setListLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    fetchList(page, debouncedSearch)
  }, [fetchList, page, debouncedSearch])

  const handleView = async (c: Candidate) => {
    setViewing(c)
    setPanelLoading(true)
    try {
      const res = await applicationsService.getById(c.id, accessToken!)
      setViewing(prev => prev?.id === c.id ? mergeDetail(prev, res.data) : prev)
    } catch {
      // keep showing basic data from the list
    } finally {
      setPanelLoading(false)
    }
  }

  const updateStatus = async (id: string, status: EvalStatus) => {
    // optimistic update
    setRows(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    setViewing(prev => prev?.id === id ? { ...prev, status } : prev)
    try {
      await applicationsService.updateStatus(id, EVAL_TO_STATUS[status], accessToken!)
    } catch {
      fetchList(page, debouncedSearch) // revert on failure
    }
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 flex-col overflow-hidden p-5">
        {/* Search */}
        <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-white px-3 py-2.5 shadow-sm">
          <Search className="size-5 shrink-0 text-[#8181a5]" />
          <input
            type="text"
            placeholder="Search ⌘K"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs text-[#1f2937] outline-none placeholder:text-[rgba(34,48,62,0.4)]"
          />
          <button className="rounded-lg p-1 text-[#8181a5] hover:bg-muted">
            <SlidersHorizontal className="size-5" />
          </button>
        </div>

        {listError && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
            {listError}
          </div>
        )}

        {/* Table card */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="grid grid-cols-[2fr_2fr_1.2fr_0.8fr_1.2fr_1.8fr] items-center border-b border-border px-5 py-3">
            {["Candidate Name", "Job Position", "Applied", "AI Score", "Status", "Actions"].map((h, i) => (
              <span
                key={h}
                className={cn("text-xs font-medium text-[#1f2937]", i === 5 && "text-right")}
              >
                {h}
              </span>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {listLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="size-5 animate-spin text-[#8181a5]" />
              </div>
            ) : rows.length > 0 ? rows.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[2fr_2fr_1.2fr_0.8fr_1.2fr_1.8fr] items-center gap-x-2.5 px-5 py-2.5 transition-colors hover:bg-[#f8fafc]"
              >
                {/* Name */}
                <div className="flex min-w-0 items-center gap-2.5">
                  {c.photo ? (
                    <img src={c.photo} alt={c.name} className="size-9 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f0f0ff] text-xs font-bold text-[#8a8cd9]">
                      {c.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[#1f2937]">{c.name}</p>
                    <p className="truncate text-xs text-[#667388]">{c.email}</p>
                  </div>
                </div>

                {/* Position */}
                <div className="min-w-0">
                  <p className="truncate text-xs text-[#1f2937]">{c.position}</p>
                  <p className="truncate text-xs text-[#8181a5]">{c.department}</p>
                </div>

                {/* Applied */}
                <span className="text-xs text-[#667388]">{c.appliedAt}</span>

                {/* AI Score */}
                <div>
                  <AiScoreBadge score={c.aiScore} />
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={c.status} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5">
                  <StatusDropdown
                    value={c.status}
                    onChange={(v) => updateStatus(c.id, v)}
                  />
                  <button
                    onClick={() => handleView(c)}
                    className="h-[28px] rounded border border-[#6e39cb] px-2.5 text-xs font-medium text-[#6e39cb] transition-colors hover:bg-[#6e39cb]/5"
                  >
                    View
                  </button>
                </div>
              </div>
            )) : (
              <div className="flex h-32 items-center justify-center text-xs text-[#8181a5]">
                No candidates match your search.
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-3 flex items-center justify-end gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex size-8 items-center justify-center rounded-full text-[#4b5563] transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                p === page ? "bg-[#3b6feb] text-white" : "text-[#4b5563] hover:bg-muted"
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex size-8 items-center justify-center rounded-full text-[#4b5563] transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </main>

      {viewing && (
        <ProfilePanel
          candidate={viewing}
          loading={panelLoading}
          onClose={() => setViewing(null)}
        />
      )}
    </>
  )
}
