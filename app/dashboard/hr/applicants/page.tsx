"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { useAuth } from "@/context/auth-context"
import { jobsService, type ApiApplicant, type ApiApplicantStatus } from "@/services/jobs.service"

// ── Status config ─────────────────────────────────────────────
const STATUS_OPTIONS: { value: ApiApplicantStatus | ""; label: string }[] = [
  { value: "",               label: "All"           },
  { value: "PENDING_REVIEW", label: "Pending Review"},
  { value: "INTERVIEW",      label: "Interview"     },
  { value: "ACCEPTED",       label: "Accepted"      },
  { value: "APPROVED",       label: "Approved"      },
  { value: "REJECTED",       label: "Rejected"      },
]

const STATUS_STYLE: Record<ApiApplicantStatus, string> = {
  PENDING_REVIEW: "bg-amber-100 text-amber-700",
  INTERVIEW:      "bg-cyan-100 text-cyan-700",
  ACCEPTED:       "bg-emerald-100 text-emerald-700",
  APPROVED:       "bg-green-100 text-green-700",
  REJECTED:       "bg-rose-100 text-rose-600",
}

const STATUS_LABEL: Record<ApiApplicantStatus, string> = {
  PENDING_REVIEW: "Pending Review",
  INTERVIEW:      "Interview",
  ACCEPTED:       "Accepted",
  APPROVED:       "Approved",
  REJECTED:       "Rejected",
}

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Job Listings",         active: false, href: "/dashboard/hr/jobs"       },
  { label: "Applicants",           active: true,  href: "/dashboard/hr/applicants" },
  { label: "Candidate Evaluation", active: false, href: "/dashboard/hr/evaluation" },
  { label: "Interview Scheduling", active: false, href: "/dashboard/hr/interviews" },
  { label: "History",              active: false, href: "#"                        },
]

// ── Social icon SVGs ──────────────────────────────────────────
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="size-3">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="size-3">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="size-3">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// ── Sub-components ────────────────────────────────────────────
function CandidateAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className="size-9 shrink-0 rounded-full object-cover" />
  }
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
      {initials}
    </div>
  )
}

function SocialLinks({ linkedin, twitter, facebook }: {
  linkedin: string | null
  twitter:  string | null
  facebook: string | null
}) {
  const hasAny = linkedin || twitter || facebook
  if (!hasAny) return <span className="text-xs text-muted-foreground/40">—</span>
  return (
    <div className="flex items-center gap-1">
      {facebook && (
        <a href={facebook} target="_blank" rel="noopener noreferrer" title="Facebook"
          className="flex size-6 items-center justify-center rounded-full bg-[#1877f2] transition-opacity hover:opacity-85">
          <FacebookIcon />
        </a>
      )}
      {linkedin && (
        <a href={linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"
          className="flex size-6 items-center justify-center rounded-full bg-[#0a66c2] transition-opacity hover:opacity-85">
          <LinkedInIcon />
        </a>
      )}
      {twitter && (
        <a href={twitter} target="_blank" rel="noopener noreferrer" title="X (Twitter)"
          className="flex size-6 items-center justify-center rounded-full bg-black transition-opacity hover:opacity-75">
          <XIcon />
        </a>
      )}
    </div>
  )
}

function fmtSalary(amount: number | null): string {
  if (amount === null) return "—"
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount}`
}

// ── Layout ────────────────────────────────────────────────────
const TABLE_COLUMNS = "grid-cols-[minmax(0,2fr)_minmax(0,2fr)_96px_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.4fr)]"
const PAGE_SIZE = 20

// ── Main page ─────────────────────────────────────────────────
export default function ApplicantsPage() {
  const { accessToken } = useAuth()

  const [applicants, setApplicants] = useState<ApiApplicant[]>([])
  const [search,     setSearch]     = useState("")
  const [status,     setStatus]     = useState<ApiApplicantStatus | "">("")
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total,      setTotal]      = useState(0)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [showFilter, setShowFilter] = useState(false)

  const fetchApplicants = useCallback(
    async (searchVal = search, statusVal = status, pageVal = page) => {
      if (!accessToken) return
      setLoading(true)
      setError(null)
      try {
        const res = await jobsService.getAllApplicants(
          {
            search: searchVal || undefined,
            status: statusVal || undefined,
            page:   pageVal,
            limit:  PAGE_SIZE,
          },
          accessToken,
        )
        setApplicants(res.data)
        setTotal(res.meta.total)
        setTotalPages(res.meta.totalPages)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load applicants")
      } finally {
        setLoading(false)
      }
    },
    [accessToken], // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(() => { fetchApplicants() }, [fetchApplicants])

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
    fetchApplicants(val, status, 1)
  }

  const handleStatus = (val: ApiApplicantStatus | "") => {
    setStatus(val)
    setPage(1)
    fetchApplicants(search, val, 1)
  }

  const handlePage = (p: number) => {
    setPage(p)
    fetchApplicants(search, status, p)
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 flex-col overflow-hidden p-6">
        {/* Search bar */}
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-card px-4 py-3 shadow-sm">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => setShowFilter((f) => !f)}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              showFilter ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <SlidersHorizontal className="size-5" />
          </button>
        </div>

        {/* Status filter pills */}
        {showFilter && (
          <div className="mb-4 flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatus(opt.value as ApiApplicantStatus | "")}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  status === opt.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Table card */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {/* Header */}
          <div className={cn("grid items-center gap-x-4 border-b border-border px-6 py-3", TABLE_COLUMNS)}>
            {["Candidate", "Email", "Social", "Location", "Salary", "Status"].map((col) => (
              <span key={col} className="text-sm font-medium text-foreground">{col}</span>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex h-32 items-center justify-center text-sm text-rose-600">{error}</div>
            ) : applicants.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground/40">
                No applicants found.
              </div>
            ) : (
              applicants.map((app) => (
                <div
                  key={app.id}
                  className={cn(
                    "grid items-center gap-x-4 px-6 py-3.5 transition-colors hover:bg-muted/50",
                    TABLE_COLUMNS,
                  )}
                >
                  {/* Candidate */}
                  <div className="flex min-w-0 items-center gap-3">
                    <CandidateAvatar name={app.candidate.name} avatarUrl={app.candidate.avatarUrl} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{app.candidate.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{app.job.title}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <span className="truncate text-sm text-muted-foreground">{app.candidate.email}</span>

                  {/* Social */}
                  <SocialLinks
                    linkedin={app.candidate.linkedin}
                    twitter={app.candidate.twitter}
                    facebook={app.candidate.facebook}
                  />

                  {/* Location */}
                  <span className="truncate text-sm text-muted-foreground">
                    {app.candidate.location ?? "—"}
                  </span>

                  {/* Salary */}
                  <span className="text-sm text-muted-foreground">
                    {fmtSalary(app.expectedSalary)}
                  </span>

                  {/* Status */}
                  <span className={cn(
                    "w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    STATUS_STYLE[app.status] ?? "bg-muted text-muted-foreground",
                  )}>
                    {STATUS_LABEL[app.status] ?? app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {total} applicant{total !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePage(p)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    p === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => handlePage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
