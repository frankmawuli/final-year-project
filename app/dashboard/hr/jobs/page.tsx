"use client"

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Search, SlidersHorizontal, Building2, Plus, X,
  ChevronLeft, ChevronRight, Check, Trash2, Loader2, Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { useAuth } from "@/context/auth-context"
import {
  jobsService,
  type ApiJobListItem,
  type ApiJobDetail,
  type ApiJobType,
  type ApiJobLevel,
  type ApiJobWorkLocation,
} from "@/services/jobs.service"
import { departmentService, type ApiDepartment } from "@/services/departments.service"

// ── Display mappings ──────────────────────────────────────────
const TYPE_LABEL: Record<ApiJobType, string> = {
  FULL_TIME: "Full-time", PART_TIME: "Part-time", CONTRACT: "Contract", INTERNSHIP: "Internship",
}
const LEVEL_LABEL: Record<ApiJobLevel, string> = {
  JUNIOR: "Junior", MID_LEVEL: "Mid-level", SENIOR: "Senior", LEAD: "Lead", EXECUTIVE: "Executive",
}
const LOCATION_LABEL: Record<ApiJobWorkLocation, string> = {
  REMOTE: "Remote", ON_SITE: "On-site", HYBRID: "Hybrid",
}
const STATUS_LABEL = { OPEN: "Open", CLOSED: "Closed", DRAFT: "Draft" } as const

// Reverse maps for form → API
const TYPE_API = Object.fromEntries(
  Object.entries(TYPE_LABEL).map(([k, v]) => [v, k as ApiJobType]),
) as Record<string, ApiJobType>

const LEVEL_API = Object.fromEntries(
  Object.entries(LEVEL_LABEL).map(([k, v]) => [v, k as ApiJobLevel]),
) as Record<string, ApiJobLevel>

const LOCATION_API = Object.fromEntries(
  Object.entries(LOCATION_LABEL).map(([k, v]) => [v, k as ApiJobWorkLocation]),
) as Record<string, ApiJobWorkLocation>

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return "Not specified"
  const fmt = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`)
  if (min && max) return `${fmt(min)}–${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max!)}`
}

// ── Status badge ──────────────────────────────────────────────
const statusStyles = {
  OPEN:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CLOSED: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  DRAFT:  "bg-muted text-muted-foreground",
} as const

function StatusBadge({ status }: { status: keyof typeof statusStyles }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", statusStyles[status])}>
      {STATUS_LABEL[status]}
    </span>
  )
}

// ── Job Card ──────────────────────────────────────────────────
function JobCard({
  job,
  onDelete,
  onPublish,
}: {
  job: ApiJobListItem
  onDelete: (id: string) => void
  onPublish: (id: string) => void
}) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const url = `${window.location.origin}/apply/${job.id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <StatusBadge status={job.status} />
        <Building2 className="size-6 text-muted-foreground" strokeWidth={1.5} />
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">{job.title}</p>
        <p className="text-xs font-medium text-primary">{job.department?.name ?? "—"}</p>
      </div>

      <p className="text-[10px] text-muted-foreground">
        {LOCATION_LABEL[job.workLocation]} · {TYPE_LABEL[job.type]} · {job._count.applications} applicants
      </p>

      <div>
        <p className="text-sm font-semibold text-foreground">
          {formatSalary(job.salaryMin, job.salaryMax)}
        </p>
        <p className="text-[10px] text-muted-foreground">{job.experience ?? "—"} experience</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/dashboard/hr/jobs/${job.id}`}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          View Details
        </Link>
        <Link
          href="/dashboard/hr/applicants"
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Applications ({job._count.applications})
        </Link>
        {job.status === "DRAFT" && (
          <button
            onClick={() => onPublish(job.id)}
            className="rounded-lg border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Publish
          </button>
        )}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={handleShare}
            title={copied ? "Copied!" : "Copy application link"}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              copied ? "text-emerald-500" : "text-muted-foreground hover:text-primary",
            )}
          >
            {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-rose-500"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Add Listing Modal ─────────────────────────────────────────
const JOB_TYPES   = ["Full-time", "Part-time", "Contract", "Internship"]
const LOCATIONS   = ["Remote", "On-site", "Hybrid"]
const LEVELS      = ["Junior", "Mid-level", "Senior", "Lead", "Executive"]
const STEP_LABELS = ["Basic Info", "Job Content", "Skills"]

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </label>
  )
}

const fieldCls = "h-10 w-full rounded-xl border border-border bg-muted/50 px-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
const areaCls  = "w-full resize-none rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"

function ListEditor({
  label, placeholder, items, onChange,
}: {
  label: string; placeholder: string; items: string[]; onChange: (items: string[]) => void
}) {
  const update = (i: number, val: string) => { const next = [...items]; next[i] = val; onChange(next) }
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const add    = () => onChange([...items, ""])
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className={cn(fieldCls, "flex-1")}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 text-muted-foreground hover:text-rose-500"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="size-3" /> Add item
        </button>
      </div>
    </div>
  )
}

function SkillsInput({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [draft, setDraft] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const commit = () => {
    const val = draft.trim()
    if (val && !skills.includes(val)) onChange([...skills, val])
    setDraft("")
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit() }
    if (e.key === "Backspace" && draft === "" && skills.length > 0) onChange(skills.slice(0, -1))
  }
  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-[44px] cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-border bg-muted/50 px-3 py-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
    >
      {skills.map((s) => (
        <span key={s} className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-0.5 text-[12px] font-medium text-foreground">
          {s}
          <button type="button" onClick={() => onChange(skills.filter((x) => x !== s))}>
            <X className="size-3 text-muted-foreground hover:text-rose-500" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={commit}
        placeholder={skills.length === 0 ? "Type a skill and press Enter…" : ""}
        className="min-w-[140px] flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}

// function StepIndicator({ current, total }: { current: number; total: number }) {
//   return (
//     <div className="flex items-center justify-center gap-0">
//       {Array.from({ length: total }, (_, i) => {
//         const step = i + 1
//         const done   = step < current
//         const active = step === current
//         return (
//           <div key={step} className="flex items-center">
//             <div className="flex flex-col items-center gap-1">
//               <div
//                 className={cn(
//                   "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
//                   done   ? "bg-primary text-primary-foreground"
//                   : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
//                   : "bg-muted text-muted-foreground",
//                 )}
//               >
//                 {done ? <Check className="size-3.5" /> : step}
//               </div>
//               <span className={cn("text-[10px] font-semibold", active ? "text-primary" : "text-muted-foreground")}>
//                 {STEP_LABELS[i]}
//               </span>
//             </div>
//             {i < total - 1 && (
//               <div className={cn("mb-4 h-px w-16 transition-colors", i < current - 1 ? "bg-primary" : "bg-border")} />
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

function AddListingModal({
  onClose,
  onCreated,
  departments,
  token,
  editJob,
}: {
  onClose:     () => void
  onCreated:   () => void
  departments: ApiDepartment[]
  token:       string
  editJob?:    ApiJobDetail
}) {
  const sorted = <T extends { position: number }>(arr: T[]) =>
    [...arr].sort((a, b) => a.position - b.position)

  const [step,       setStep]       = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const [title,      setTitle]      = useState(editJob?.title ?? "")
  const [deptId,     setDeptId]     = useState<number>(editJob?.department?.id ?? departments[0]?.id ?? 0)
  const [jobType,    setJobType]    = useState(editJob ? TYPE_LABEL[editJob.type] : JOB_TYPES[0])
  const [level,      setLevel]      = useState(editJob ? LEVEL_LABEL[editJob.level] : LEVELS[1])
  const [location,   setLocation]   = useState(editJob ? LOCATION_LABEL[editJob.workLocation] : LOCATIONS[0])
  const [salaryMin,  setSalaryMin]  = useState(editJob?.salaryMin != null ? String(editJob.salaryMin) : "")
  const [salaryMax,  setSalaryMax]  = useState(editJob?.salaryMax != null ? String(editJob.salaryMax) : "")
  const [experience, setExperience] = useState(editJob?.experience ?? "")
  const [openings,   setOpenings]   = useState(editJob ? String(editJob.openings) : "1")
  const [deadline,   setDeadline]   = useState(editJob?.deadline ? editJob.deadline.split("T")[0] : "")

  const [description,      setDescription]      = useState(editJob?.description ?? "")
  const [responsibilities, setResponsibilities] = useState<string[]>(
    editJob?.responsibilities.length ? sorted(editJob.responsibilities).map((r) => r.text) : [""],
  )
  const [requirements, setRequirements] = useState<string[]>(
    editJob?.requirements.length ? sorted(editJob.requirements).map((r) => r.text) : [""],
  )
  const [niceToHave, setNiceToHave] = useState<string[]>(
    editJob?.niceToHave.length ? sorted(editJob.niceToHave).map((r) => r.text) : [],
  )

  const [skills, setSkills] = useState<string[]>(editJob?.skills.map((s) => s.name) ?? [])

  const canNext1 = title.trim().length > 0

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    const payload = {
      title,
      type:         TYPE_API[jobType],
      level:        LEVEL_API[level],
      workLocation: LOCATION_API[location],
      departmentId: deptId,
      experience:   experience || undefined,
      salaryMin:    salaryMin ? Number(salaryMin) : undefined,
      salaryMax:    salaryMax ? Number(salaryMax) : undefined,
      openings:     parseInt(openings, 10) || 1,
      deadline:     deadline || undefined,
      description:  description || undefined,
      responsibilities: responsibilities.filter(Boolean).map((text, i) => ({ text, position: i + 1 })),
      requirements:     requirements.filter(Boolean).map((text, i) => ({ text, position: i + 1 })),
      niceToHave:       niceToHave.filter(Boolean).map((text, i) => ({ text, position: i + 1 })),
      skills:           skills.map((name) => ({ name })),
    }
    try {
      if (editJob) {
        await jobsService.update(editJob.id, payload, token)
      } else {
        await jobsService.create({ ...payload, status: "OPEN" }, token)
      }
      onCreated()
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : editJob ? "Failed to update job listing" : "Failed to create job listing")
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm ">
      <div className="relative flex max-h-[90vh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl">

        <div className="flex items-center justify-between  px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-foreground">{editJob ? "Edit Listing" : "Add New Listing"}</h2>
            <p className="text-xs text-muted-foreground">{editJob ? "Update the job details below" : "Fill in all details to publish the job"}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-primary">{step}/3</span>
            <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>Job Title *</FieldLabel>
                <input
                  className={fieldCls}
                  placeholder="e.g. Senior Product Designer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Department</FieldLabel>
                  <select
                    className={fieldCls}
                    value={deptId}
                    onChange={(e) => setDeptId(Number(e.target.value))}
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Job Type</FieldLabel>
                  <select className={fieldCls} value={jobType} onChange={(e) => setJobType(e.target.value)}>
                    {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Level</FieldLabel>
                  <select className={fieldCls} value={level} onChange={(e) => setLevel(e.target.value)}>
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel>Location</FieldLabel>
                  <select className={fieldCls} value={location} onChange={(e) => setLocation(e.target.value)}>
                    {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Salary Min</FieldLabel>
                  <input
                    className={fieldCls}
                    type="number"
                    min="0"
                    placeholder="e.g. 70000"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>Salary Max</FieldLabel>
                  <input
                    className={fieldCls}
                    type="number"
                    min="0"
                    placeholder="e.g. 90000"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Experience Required</FieldLabel>
                  <input
                    className={fieldCls}
                    placeholder="e.g. 3+ years"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>No. of Openings</FieldLabel>
                  <input
                    className={fieldCls}
                    type="number"
                    min="1"
                    placeholder="1"
                    value={openings}
                    onChange={(e) => setOpenings(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Application Deadline</FieldLabel>
                <input className={fieldCls} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <FieldLabel>Job Description</FieldLabel>
                <textarea
                  className={cn(areaCls, "h-28")}
                  placeholder="Describe the role and what makes it exciting…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <ListEditor
                label="Key Responsibilities"
                placeholder="e.g. Lead design sprints and prototyping sessions"
                items={responsibilities}
                onChange={setResponsibilities}
              />
              <ListEditor
                label="Requirements"
                placeholder="e.g. 3+ years of professional UI/UX design experience"
                items={requirements}
                onChange={setRequirements}
              />
              <ListEditor
                label="Nice to Have"
                placeholder="e.g. Experience with design systems"
                items={niceToHave}
                onChange={setNiceToHave}
              />
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>Required Skills</FieldLabel>
                <p className="mb-2 text-xs text-muted-foreground">
                  Type a skill and press{" "}
                  <kbd className="rounded bg-muted px-1 font-mono text-[11px]">Enter</kbd> or{" "}
                  <kbd className="rounded bg-muted px-1 font-mono text-[11px]">,</kbd> to add it.
                </p>
                <SkillsInput skills={skills} onChange={setSkills} />
              </div>
              {skills.length > 0 && (
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s} className="rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="rounded-xl border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={cn("size-1.5 rounded-full transition-colors", s === step ? "bg-primary" : "bg-border")} />
            ))}
          </div>

          {step < 3 ? (
            <button
              type="button"
              disabled={step === 1 && !canNext1}
              onClick={() => setStep(step + 1)}
              className={cn(
                "rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors",
                step === 1 && !canNext1
                  ? "cursor-not-allowed bg-primary/40"
                  : "bg-primary hover:bg-primary/90",
              )}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {editJob ? "Save Changes" : "Post Listing"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Job Listings",         active: true,  href: "/dashboard/hr/jobs"       },
  { label: "Applicants",           active: false, href: "/dashboard/hr/applicants" },
  { label: "Candidate Evaluation", active: false, href: "/dashboard/hr/evaluation" },
  { label: "Interview Scheduling", active: false, href: "#"                        },
  { label: "History",              active: false, href: "#"                        },
]

// ── Main Page ─────────────────────────────────────────────────
export default function JobsPage() {
  const { accessToken } = useAuth()
  const searchParams = useSearchParams()

  const [jobs,        setJobs]        = useState<ApiJobListItem[]>([])
  const [departments, setDepartments] = useState<ApiDepartment[]>([])
  const [search,      setSearch]      = useState("")
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [showModal,   setShowModal]   = useState(false)
  const [editJob,     setEditJob]     = useState<ApiJobDetail | null>(null)

  const fetchJobs = useCallback(
    async (searchVal = search, pageVal = page) => {
      if (!accessToken) return
      setLoading(true)
      setError(null)
      try {
        const res = await jobsService.list(
          { search: searchVal || undefined, page: pageVal, limit: 4 },
          accessToken,
        )
        setJobs(res.data)
        setTotalPages(res.meta.totalPages)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load jobs")
      } finally {
        setLoading(false)
      }
    },
    [accessToken], // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(() => { fetchJobs() }, [fetchJobs])

  useEffect(() => {
    if (!accessToken) return
    departmentService.list(accessToken).then((res) => setDepartments(res.data)).catch(() => null)
  }, [accessToken])

  useEffect(() => {
    const editId = searchParams.get("edit")
    if (!editId || !accessToken) return
    jobsService.getById(editId, accessToken).then((res) => {
      setEditJob(res.data)
      setShowModal(true)
    }).catch(() => null)
  }, [searchParams, accessToken])

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
    fetchJobs(val, 1)
  }

  const handlePage = (p: number) => {
    setPage(p)
    fetchJobs(search, p)
  }

  const handleDelete = async (id: string) => {
    if (!accessToken) return
    try {
      await jobsService.delete(id, accessToken)
      fetchJobs(search, page)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete job")
    }
  }

  const handlePublish = async (id: string) => {
    if (!accessToken) return
    try {
      await jobsService.updateStatus(id, "OPEN", accessToken)
      fetchJobs(search, page)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to publish job")
    }
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 flex-col overflow-y-auto p-6">
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-card px-4 py-3 shadow-sm">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ⌘K"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <SlidersHorizontal className="size-5" />
          </button>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <div />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Add Listing
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center text-sm text-rose-600">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            No listings found.
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-2 content-start gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onDelete={handleDelete} onPublish={handlePublish} />
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={() => handlePage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePage(p)}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => handlePage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </main>

      {showModal && accessToken && (
        <AddListingModal
          onClose={() => { setShowModal(false); setEditJob(null) }}
          onCreated={() => fetchJobs(search, page)}
          departments={departments}
          token={accessToken}
          editJob={editJob ?? undefined}
        />
      )}
    </>
  )
}
