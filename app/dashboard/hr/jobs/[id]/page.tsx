"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  MapPin, Briefcase, Clock, DollarSign, Users, CalendarDays,
  CheckCircle2, Building2, Pencil, XCircle, Eye, Loader2,
} from "lucide-react"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { jobsService, type ApiJobDetail, type ApiJobStatus } from "@/services/jobs.service"

// ── Display maps ──────────────────────────────────────────────
const TYPE_LABEL     = { FULL_TIME: "Full-time", PART_TIME: "Part-time", CONTRACT: "Contract", INTERNSHIP: "Internship" } as const
const LEVEL_LABEL    = { JUNIOR: "Junior", MID_LEVEL: "Mid-level", SENIOR: "Senior", LEAD: "Lead", EXECUTIVE: "Executive" } as const
const LOCATION_LABEL = { REMOTE: "Remote", ON_SITE: "On-site", HYBRID: "Hybrid" } as const
const STATUS_LABEL   = { OPEN: "Open", CLOSED: "Closed", DRAFT: "Draft" } as const

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return "Not specified"
  const fmt = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`)
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max!)}`
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ── Nav ───────────────────────────────────────────────────────
const sidebarNav = [
  { label: "Job Listings",         href: "/dashboard/hr/jobs"       },
  { label: "Applicants",           href: "/dashboard/hr/applicants" },
  { label: "Candidate Evaluation", href: "/dashboard/hr/evaluation" },
  { label: "Interview Scheduling", href: "/dashboard/hr/interviews" },
]

const statusStyles: Record<ApiJobStatus, string> = {
  OPEN:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  CLOSED: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
  DRAFT:  "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
}

const deptColors: Record<string, string> = {
  Design:      "bg-violet-100 text-violet-700",
  Engineering: "bg-blue-100 text-blue-700",
  Product:     "bg-amber-100 text-amber-700",
  Analytics:   "bg-emerald-100 text-emerald-700",
  Marketing:   "bg-pink-100 text-pink-700",
  HR:          "bg-primary/10 text-primary",
  Finance:     "bg-orange-100 text-orange-700",
}

// ── Sub-components ─────────────────────────────────────────────
function SkillChip({ label }: { label: string }) {
  return (
    <span className="rounded-lg border border-border bg-muted px-3 py-1.5 text-[13px] font-medium text-foreground">
      {label}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-[15px] font-bold text-foreground">{children}</h3>
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-[13px] font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function JobDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const { accessToken } = useAuth()

  const [job,     setJob]     = useState<ApiJobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (!accessToken || !id) return
    setLoading(true)
    jobsService
      .getById(id, accessToken)
      .then((res) => setJob(res.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load job"))
      .finally(() => setLoading(false))
  }, [id, accessToken])

  const handleClose = async () => {
    if (!accessToken || !job) return
    setClosing(true)
    try {
      const res = await jobsService.updateStatus(job.id, "CLOSED", accessToken)
      setJob(res.data)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to close listing")
    } finally {
      setClosing(false)
    }
  }

  if (loading) {
    return (
      <>
        <HrNavigationPannel navItems={sidebarNav} />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </main>
      </>
    )
  }

  if (error || !job) {
    return (
      <>
        <HrNavigationPannel navItems={sidebarNav} />
        <main className="flex flex-1 items-center justify-center text-sm text-rose-600">
          {error ?? "Job not found"}
        </main>
      </>
    )
  }

  const deptName     = job.department?.name ?? "—"
  const applicants   = job._count?.applications ?? 0
  const applicantPct = job.openings > 0
    ? Math.min(100, Math.round((applicants / (job.openings * 15)) * 100))
    : 0
  const sorted       = <T extends { position: number }>(arr: T[]) => [...arr].sort((a, b) => a.position - b.position)

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">

            {/* ── Left ─────────────────────────────────────── */}
            <div className="flex flex-col gap-5">

              {/* Banner */}
              <div
                className="relative h-40 overflow-hidden rounded-2xl"
                style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
              >
                <span className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10" />
                <span className="absolute -bottom-12 right-32 size-32 rounded-full bg-white/10" />
                <span className="absolute -left-6 bottom-0 size-24 rounded-full bg-white/8" />
                <span className="absolute right-16 top-6 size-16 rounded-full bg-white/15" />
                <div className="absolute bottom-5 right-8 flex gap-1.5 opacity-30">
                  {[20, 36, 24, 40, 28].map((h, i) => (
                    <div key={i} className="w-2 rounded-sm bg-white" style={{ height: h }} />
                  ))}
                </div>
                <div className="absolute left-5 top-5">
                  <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusStyles[job.status])}>
                    {STATUS_LABEL[job.status]}
                  </span>
                </div>
              </div>

              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border bg-white shadow-sm">
                  <Building2 className="size-7 text-primary" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold text-foreground">{job.title}</h1>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", deptColors[deptName] ?? "bg-muted text-muted-foreground")}>
                      {deptName}
                    </span>
                    <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {TYPE_LABEL[job.type]}
                    </span>
                    <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {LEVEL_LABEL[job.level]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" />
                    <span>{LOCATION_LABEL[job.workLocation]}</span>
                  </div>
                </div>
              </div>

              {/* Description + responsibilities */}
              {(job.description || job.responsibilities.length > 0) && (
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  {job.description && (
                    <>
                      <SectionTitle>Job Description</SectionTitle>
                      <p className="text-[14px] leading-relaxed text-muted-foreground">{job.description}</p>
                    </>
                  )}
                  {job.responsibilities.length > 0 && (
                    <div className={job.description ? "pt-6" : ""}>
                      <SectionTitle>Key Responsibilities</SectionTitle>
                      <ul className="flex flex-col gap-2.5">
                        {sorted(job.responsibilities).map((r, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                            <span className="text-[14px] leading-relaxed text-muted-foreground">{r.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Requirements + skills */}
              {(job.requirements.length > 0 || job.skills.length > 0) && (
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  {job.requirements.length > 0 && (
                    <>
                      <SectionTitle>Requirements</SectionTitle>
                      <ul className="flex flex-col gap-2.5">
                        {sorted(job.requirements).map((r, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span className="text-[14px] leading-relaxed text-muted-foreground">{r.text}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {job.skills.length > 0 && (
                    <div className={job.requirements.length > 0 ? "pt-6" : ""}>
                      <SectionTitle>Required Skills</SectionTitle>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((s) => <SkillChip key={s.name} label={s.name} />)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Right ────────────────────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* Actions */}
              <div className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-4 shadow-sm">
                <Link
                  href={`/dashboard/hr/applicants?jobId=${job.id}`}
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
                >
                  <Eye className="size-4" />
                  View Applications
                  <span className="ml-1 rounded-full bg-white/20 px-2 py-0 text-xs font-bold">
                    {applicants}
                  </span>
                </Link>
                <Link
                  href={`/dashboard/hr/jobs?edit=${job.id}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                  Edit Listing
                </Link>
                {job.status === "OPEN" && (
                  <button
                    onClick={handleClose}
                    disabled={closing}
                    className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                  >
                    <XCircle className="size-3.5" />
                    {closing ? "Closing…" : "Close Listing"}
                  </button>
                )}
              </div>

              {/* Overview */}
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <p className="mb-4 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                  Job Overview
                </p>
                <div className="flex flex-col gap-4">
                  <InfoRow icon={DollarSign}  label="Salary Range" value={formatSalary(job.salaryMin, job.salaryMax)} />
                  <InfoRow icon={Briefcase}   label="Job Type"     value={TYPE_LABEL[job.type]} />
                  <InfoRow icon={MapPin}      label="Location"     value={LOCATION_LABEL[job.workLocation]} />
                  <InfoRow icon={Clock}       label="Experience"   value={job.experience ?? "—"} />
                  <InfoRow icon={CalendarDays} label="Posted"      value={formatDate(job.postedAt)} />
                  <InfoRow icon={CalendarDays} label="Deadline"    value={formatDate(job.deadline)} />
                  <InfoRow icon={Users}       label="Openings"     value={`${job.openings} position${job.openings > 1 ? "s" : ""}`} />
                </div>

                <div className="mt-5 rounded-xl border border-border bg-background p-3">
                  <div className="mb-1.5 flex items-center justify-between text-[12px]">
                    <span className="font-medium text-foreground">{applicants} applicants</span>
                    <span className="text-muted-foreground">{applicantPct}% filled</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${applicantPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
