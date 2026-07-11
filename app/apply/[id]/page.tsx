"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  MapPin, Briefcase, Clock, DollarSign, CalendarDays,
  CheckCircle2, Star, Building2, Globe, XCircle, Share2,
  ClipboardList, Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { jobsService, type PublicJobDetail } from "@/services/jobs.service"
import { ApplyModal } from "@/components/jobs/apply-modal"
import { useApplicantAuth } from "@/context/applicant-auth-context"
import {
  PUBLIC_TYPE_LABEL,
  PUBLIC_LEVEL_LABEL,
  PUBLIC_LOCATION_LABEL,
  PUBLIC_STATUS_LABEL,
  formatSalary,
} from "@/components/jobs/constants"

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  closed: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
  draft:  "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
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

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function SkillChip({ label }: { label: string }) {
  return (
    <span className="rounded-lg border border-border bg-muted px-2.5 py-1 text-[13px] font-medium text-foreground">
      {label}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2.5 text-[15px] font-bold text-foreground">{children}</h3>
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
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

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = String(params.id ?? "")
  const { isAuthenticated } = useApplicantAuth()

  const [job,       setJob]       = useState<PublicJobDetail | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [applyOpen, setApplyOpen] = useState(false)

  // Logged-in applicants pick between quick apply and the form; everyone else
  // goes straight to the form as before.
  function handleApply() {
    if (isAuthenticated) {
      setApplyOpen(true)
    } else {
      router.push(`/apply/apply?jobId=${id}`)
    }
  }

  useEffect(() => {
    if (!id) return
    jobsService.getPublicById(id)
      .then((res) => setJob(res.data))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load job"))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-xs text-rose-600">
        {error ?? "Job not found."}
      </div>
    )
  }

  const { employment, location, compensation, company, meta } = job

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sticky apply bar – mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card p-2.5 shadow-lg lg:hidden">
        <button
          onClick={handleApply}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
        >
          <ClipboardList className="size-4" />
          Apply Now
        </button>
      </div>

      <ApplyModal jobId={id} jobTitle={job.title} open={applyOpen} onOpenChange={setApplyOpen} />

      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
        <div className="mx-auto max-w-7xl p-3 sm:p-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">

            {/* ── Left: main content ───────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* Cover banner */}
              <div
                className="relative h-28 sm:h-40 overflow-hidden rounded-2xl"
                style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
              >
                <span className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10" />
                <span className="absolute -bottom-12 right-32 size-32 rounded-full bg-white/10" />
                <span className="absolute -left-6 bottom-0 size-24 rounded-full bg-white/8" />
                <span className="absolute right-16 top-6 size-16 rounded-full bg-white/15" />
                <div className="absolute bottom-5 right-8 flex gap-1 opacity-30">
                  {[20, 36, 24, 40, 28].map((h, i) => (
                    <div key={i} className="w-2 rounded-sm bg-white" style={{ height: h }} />
                  ))}
                </div>
                <div className="absolute left-5 top-5">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", statusStyles[meta.status])}>
                    {PUBLIC_STATUS_LABEL[meta.status]}
                  </span>
                </div>
              </div>

              {/* Job header */}
              <div className="flex items-start gap-3">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border bg-white shadow-sm">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="size-10 rounded-lg object-cover" />
                  ) : (
                    <Building2 className="size-7 text-primary" strokeWidth={1.5} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <h1 className="text-lg font-bold text-foreground">{job.title}</h1>
                    
                  
                  </div>
                  <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{company.name}</span>
                    <CheckCircle2 className="size-4 text-primary" />
                    <span>·</span>
                    <MapPin className="size-3.5" />
                    <span>{PUBLIC_LOCATION_LABEL[location.arrangement]}</span>
                    {location.city && location.country && (
                      <>
                        <span>·</span>
                        <span>{location.city}, {location.country}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description + Responsibilities */}
              <div className="rounded-2xl border border-border bg-white p-3 sm:p-5 shadow-sm">
                <SectionTitle>Job Description</SectionTitle>
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  {job.description || "No description provided."}
                </p>
                {job.responsibilities.length > 0 && (
                  <div className="pt-5">
                    <SectionTitle>Key Responsibilities</SectionTitle>
                    <ul className="flex flex-col gap-2">
                      {job.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                          <span className="text-[14px] leading-relaxed text-muted-foreground">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Requirements + Tags */}
              <div className="rounded-2xl border border-border bg-white p-3 sm:p-5 shadow-sm">
                {job.requirements.length > 0 && (
                  <>
                    <SectionTitle>Requirements</SectionTitle>
                    <ul className="flex flex-col gap-2">
                      {job.requirements.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span className="text-[14px] leading-relaxed text-muted-foreground">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {job.tags.length > 0 && (
                  <div className="pt-5">
                    <SectionTitle>Skills & Tags</SectionTitle>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map((s) => <SkillChip key={s} label={s} />)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: sidebar ───────────────────────────── */}
            <div className="flex flex-col gap-3">

              {/* Action buttons */}
              <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-white p-3 shadow-sm">
                <button
                  onClick={handleApply}
                  className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
                >
                  <ClipboardList className="size-4" />
                  Apply Now
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Share2 className="size-4" />
                  Share
                </button>
                {meta.status === "active" && (
                  <button className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50">
                    <XCircle className="size-3.5" />
                    Report
                  </button>
                )}
              </div>

              {/* Job overview */}
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <p className="mb-3 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                  Job Overview
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <InfoRow icon={DollarSign}   label="Salary Range" value={formatSalary(compensation.min, compensation.max)} />
                  <InfoRow icon={Briefcase}    label="Job Type"     value={PUBLIC_TYPE_LABEL[employment.type]} />
                  <InfoRow icon={MapPin}       label="Location"     value={PUBLIC_LOCATION_LABEL[location.arrangement]} />
                  <InfoRow icon={Clock}        label="Level"        value={PUBLIC_LEVEL_LABEL[employment.experience_level]} />
                  <InfoRow icon={CalendarDays} label="Posted"       value={formatDate(meta.posted_at)} />
                  <InfoRow icon={CalendarDays} label="Deadline"     value={formatDate(meta.deadline)} />
                </div>
              </div>

              {/* About company */}
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <p className="mb-3 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                  About Company
                </p>
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
                    <Building2 className="size-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{company.name}</p>
                    <div className="flex items-center gap-1 text-[11px] text-primary">
                      <CheckCircle2 className="size-3" />
                      <span>Verified Employer</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 text-[13px]">
                  {company.size && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Briefcase className="size-3.5 shrink-0" />
                      <span>{company.size} employees</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Globe className="size-3.5 shrink-0" />
                      <span>{company.website.replace(/^https?:\/\//, "")}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-[12px] text-muted-foreground">Payment verified</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
