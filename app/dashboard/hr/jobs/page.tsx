"use client"

import { useState, useRef, KeyboardEvent } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, Building2, Plus, X, ChevronLeft, ChevronRight, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { jobsStore } from "@/lib/jobs-store"

// ── Types ─────────────────────────────────────────────────────
type JobStatus = "Open" | "Closed" | "Draft"

interface Job {
  id: number
  title: string
  department: string
  location: string
  type: string
  level: string
  applicants: number
  salaryMin: string
  salaryMax: string
  experience: string
  openings: number
  deadline: string
  status: JobStatus
  description: string
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
  skills: string[]
}

// ── Sample Data ───────────────────────────────────────────────
const initialJobs: Job[] = [
  { id: 1, title: "UX/UI Designer",       department: "Design",      location: "Remote",  type: "Contract",  level: "Mid-level", applicants: 12, salaryMin: "$70k",  salaryMax: "$90k",  experience: "3+ years", openings: 2, deadline: "Apr 20, 2026", status: "Open",   description: "", responsibilities: [], requirements: [], niceToHave: [], skills: ["Figma","Adobe XD","Wireframing","Prototyping"] },
  { id: 2, title: "Frontend Engineer",    department: "Engineering", location: "Remote",  type: "Full-time", level: "Senior",    applicants: 32, salaryMin: "$90k",  salaryMax: "$120k", experience: "4+ years", openings: 3, deadline: "Apr 18, 2026", status: "Open",   description: "", responsibilities: [], requirements: [], niceToHave: [], skills: ["React","Next.js","TypeScript","Tailwind CSS"] },
  { id: 3, title: "Product Manager",      department: "Product",     location: "On-site", type: "Full-time", level: "Senior",    applicants: 8,  salaryMin: "$100k", salaryMax: "$130k", experience: "5+ years", openings: 1, deadline: "Apr 15, 2026", status: "Open",   description: "", responsibilities: [], requirements: [], niceToHave: [], skills: ["Roadmapping","Agile","Data Analysis"] },
  { id: 4, title: "Data Analyst",         department: "Analytics",   location: "Hybrid",  type: "Full-time", level: "Mid-level", applicants: 21, salaryMin: "$75k",  salaryMax: "$95k",  experience: "2+ years", openings: 2, deadline: "Apr 22, 2026", status: "Open",   description: "", responsibilities: [], requirements: [], niceToHave: [], skills: ["SQL","Tableau","Python"] },
  { id: 5, title: "Backend Engineer",     department: "Engineering", location: "Remote",  type: "Full-time", level: "Senior",    applicants: 45, salaryMin: "$95k",  salaryMax: "$125k", experience: "4+ years", openings: 2, deadline: "Mar 10, 2026", status: "Closed", description: "", responsibilities: [], requirements: [], niceToHave: [], skills: ["Node.js","PostgreSQL","Docker"] },
  { id: 6, title: "Marketing Specialist", department: "Marketing",   location: "On-site", type: "Part-time", level: "Mid-level", applicants: 14, salaryMin: "$55k",  salaryMax: "$70k",  experience: "2+ years", openings: 1, deadline: "Apr 28, 2026", status: "Draft",  description: "", responsibilities: [], requirements: [], niceToHave: [], skills: ["HubSpot","SEO","Copywriting"] },
]

const JOBS_PER_PAGE = 4

// ── Status badge ──────────────────────────────────────────────
const statusStyles: Record<JobStatus, string> = {
  Open:   "bg-[#def8ee] text-[#4aa785]",
  Closed: "bg-rose-100 text-rose-600",
  Draft:  "bg-gray-100 text-gray-500",
}

function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", statusStyles[status])}>
      {status}
    </span>
  )
}

// ── Job Card ──────────────────────────────────────────────────
function JobCard({ job }: { job: Job }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#e0e6ed] bg-white p-4">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <StatusBadge status={job.status} />
        <Building2 className="size-6 text-[#8181a5]" strokeWidth={1.5} />
      </div>

      {/* Title + department */}
      <div>
        <p className="text-sm font-semibold text-[#1f2937]">{job.title}</p>
        <p className="text-xs font-medium text-[#3d70fa]">{job.department}</p>
      </div>

      {/* Meta */}
      <p className="text-[10px] text-[#667388]">
        {job.location} · {job.type} · {job.applicants} applicants
      </p>

      {/* Salary */}
      <div>
        <p className="text-sm font-semibold text-[#1f2937]">{job.salaryMin}–{job.salaryMax}</p>
        <p className="text-[10px] text-[#667388]">{job.experience} experience</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/dashboard/hr/jobs/${job.id}`}
          className="rounded-lg border border-[#e0e6ed] px-3 py-1.5 text-xs font-medium text-[#1f2937] transition-colors hover:bg-muted"
        >
          View Details
        </Link>
        <Link
          href="/dashboard/hr/applicants"
          className="rounded-lg border border-[#e0e6ed] px-3 py-1.5 text-xs font-medium text-[#1f2937] transition-colors hover:bg-muted"
        >
          Applications ({job.applicants})
        </Link>
      </div>
    </div>
  )
}

// ── Add Listing Modal (3-step wizard) ────────────────────────
const DEPARTMENTS = ["Design", "Engineering", "Product", "Analytics", "Marketing", "HR", "Finance"]
const JOB_TYPES   = ["Full-time", "Part-time", "Contract", "Internship"]
const LOCATIONS   = ["Remote", "On-site", "Hybrid"]
const LEVELS      = ["Junior", "Mid-level", "Senior", "Lead", "Executive"]

const STEP_LABELS = ["Basic Info", "Job Content", "Skills"]

// ── Helpers ───────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#6b7280]">{children}</label>
}

const fieldCls = "h-10 w-full rounded-xl border border-[#e0e6ed] bg-[#f9fafb] px-3 text-sm text-[#1f2937] outline-none transition-all focus:border-[#5e81f4] focus:ring-2 focus:ring-[#5e81f4]/20"
const areaCls  = "w-full resize-none rounded-xl border border-[#e0e6ed] bg-[#f9fafb] px-3 py-2.5 text-sm text-[#1f2937] outline-none transition-all focus:border-[#5e81f4] focus:ring-2 focus:ring-[#5e81f4]/20"

// Dynamic list editor (responsibilities / requirements / niceToHave)
function ListEditor({
  label,
  placeholder,
  items,
  onChange,
}: {
  label: string
  placeholder: string
  items: string[]
  onChange: (items: string[]) => void
}) {
  const update = (i: number, val: string) => {
    const next = [...items]
    next[i] = val
    onChange(next)
  }
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
              className="shrink-0 text-[#9ca3af] hover:text-rose-500"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-[#d1d5db] px-3 py-1.5 text-xs font-medium text-[#6b7280] transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="size-3" /> Add item
        </button>
      </div>
    </div>
  )
}

// Skills tag input
function SkillsInput({
  skills,
  onChange,
}: {
  skills: string[]
  onChange: (skills: string[]) => void
}) {
  const [draft, setDraft] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const commit = () => {
    const val = draft.trim()
    if (val && !skills.includes(val)) onChange([...skills, val])
    setDraft("")
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit() }
    if (e.key === "Backspace" && draft === "" && skills.length > 0) {
      onChange(skills.slice(0, -1))
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-[44px] cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-[#e0e6ed] bg-[#f9fafb] px-3 py-2 transition-all focus-within:border-[#5e81f4] focus-within:ring-2 focus-within:ring-[#5e81f4]/20"
    >
      {skills.map((s) => (
        <span
          key={s}
          className="flex items-center gap-1 rounded-lg border border-[#e0e6ed] bg-white px-2.5 py-0.5 text-[12px] font-medium text-[#1f2937]"
        >
          {s}
          <button type="button" onClick={() => onChange(skills.filter((x) => x !== s))}>
            <X className="size-3 text-[#9ca3af] hover:text-rose-500" />
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
        className="min-w-[140px] flex-1 bg-transparent text-sm text-[#1f2937] outline-none placeholder:text-[#9ca3af]"
      />
    </div>
  )
}

// Step indicator
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const done   = step < current
        const active = step === current
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  done   ? "bg-primary text-white"
                  : active ? "bg-primary text-white ring-4 ring-primary/20"
                  : "bg-[#f3f4f6] text-[#9ca3af]"
                )}
              >
                {done ? <Check className="size-3.5" /> : step}
              </div>
              <span className={cn("text-[10px] font-semibold", active ? "text-primary" : "text-[#9ca3af]")}>
                {STEP_LABELS[i]}
              </span>
            </div>
            {i < total - 1 && (
              <div className={cn("mb-4 h-px w-16 transition-colors", i < current - 1 ? "bg-primary" : "bg-[#e5e7eb]")} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────
function AddListingModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (job: Job) => void
}) {
  const [step, setStep] = useState(1)

  // Step 1
  const [title,      setTitle]      = useState("")
  const [department, setDepartment] = useState(DEPARTMENTS[0])
  const [jobType,    setJobType]    = useState(JOB_TYPES[0])
  const [level,      setLevel]      = useState(LEVELS[1])
  const [location,   setLocation]   = useState(LOCATIONS[0])
  const [salaryMin,  setSalaryMin]  = useState("")
  const [salaryMax,  setSalaryMax]  = useState("")
  const [experience, setExperience] = useState("")
  const [openings,   setOpenings]   = useState("1")
  const [deadline,   setDeadline]   = useState("")

  // Step 2
  const [description,      setDescription]      = useState("")
  const [responsibilities, setResponsibilities] = useState<string[]>([""])
  const [requirements,     setRequirements]     = useState<string[]>([""])
  const [niceToHave,       setNiceToHave]       = useState<string[]>([])

  // Step 3
  const [skills, setSkills] = useState<string[]>([])

  const canNext1 = title.trim().length > 0

  const handleSubmit = () => {
    const id  = Date.now()
    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

    const job: Job = {
      id,
      title,
      department,
      location,
      type:    jobType,
      level,
      applicants: 0,
      salaryMin:  salaryMin  || "TBD",
      salaryMax:  salaryMax  || "TBD",
      experience: experience || "Not specified",
      openings:   parseInt(openings, 10) || 1,
      deadline:   deadline
        ? new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Open",
      status: "Open",
      description,
      responsibilities: responsibilities.filter((r) => r.trim()),
      requirements:     requirements.filter((r) => r.trim()),
      niceToHave:       niceToHave.filter((n) => n.trim()),
      skills,
    }

    // Save to shared store so the detail page can render this job
    jobsStore.set({
      id,
      title,
      department,
      company:         "Core Recruiter Inc.",
      companyIndustry: "Technology / HR Software",
      companySize:     "250–500 employees",
      companyFounded:  "2019",
      companyWebsite:  "corerecruiter.io",
      location,
      type:       jobType,
      level,
      experience: experience || "Not specified",
      salaryMin:  salaryMin  || "TBD",
      salaryMax:  salaryMax  || "TBD",
      status:     "Open",
      postedDate: now,
      deadline:   deadline
        ? new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Open",
      openings:    parseInt(openings, 10) || 1,
      applicants:  0,
      description,
      responsibilities: responsibilities.filter((r) => r.trim()),
      requirements:     requirements.filter((r) => r.trim()),
      niceToHave:       niceToHave.filter((n) => n.trim()),
      skills,
      recentApplicants: [],
    })

    onAdd(job)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-[#1f2937]">Add New Listing</h2>
            <p className="text-xs text-[#6b7280]">Fill in all details to publish the job</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="border-b border-[#f0f0f0] px-6 py-4">
          <StepIndicator current={step} total={3} />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── Step 1: Basic Info ── */}
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
                  <select className={fieldCls} value={department} onChange={(e) => setDepartment(e.target.value)}>
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
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
                  <input className={fieldCls} placeholder="e.g. $70k" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>Salary Max</FieldLabel>
                  <input className={fieldCls} placeholder="e.g. $90k" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Experience Required</FieldLabel>
                  <input className={fieldCls} placeholder="e.g. 3+ years" value={experience} onChange={(e) => setExperience(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>No. of Openings</FieldLabel>
                  <input className={fieldCls} type="number" min="1" placeholder="1" value={openings} onChange={(e) => setOpenings(e.target.value)} />
                </div>
              </div>

              <div>
                <FieldLabel>Application Deadline</FieldLabel>
                <input className={fieldCls} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Step 2: Job Content ── */}
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

          {/* ── Step 3: Skills ── */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>Required Skills</FieldLabel>
                <p className="mb-2 text-xs text-[#6b7280]">Type a skill and press <kbd className="rounded bg-muted px-1 font-mono text-[11px]">Enter</kbd> or <kbd className="rounded bg-muted px-1 font-mono text-[11px]">,</kbd> to add it.</p>
                <SkillsInput skills={skills} onChange={setSkills} />
              </div>

              {skills.length > 0 && (
                <div className="rounded-xl border border-[#e0e6ed] bg-[#f9fafb] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Preview</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s} className="rounded-lg border border-[#e0e6ed] bg-white px-3 py-1.5 text-[13px] font-medium text-[#1f2937]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#f0f0f0] px-6 py-4">
          <button
            type="button"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="rounded-xl border border-[#e0e6ed] px-5 py-2 text-sm font-medium text-[#374151] hover:bg-muted"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          <div className="flex items-center gap-2">
            {/* Dot progress */}
            {[1,2,3].map((s) => (
              <div key={s} className={cn("size-1.5 rounded-full transition-colors", s === step ? "bg-primary" : "bg-[#e5e7eb]")} />
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
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Post Listing
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Job Listings",          active: true,  href: "/dashboard/hr/jobs"       },
  { label: "Applicants",            active: false, href: "/dashboard/hr/applicants" },
  { label: "Candidate Evaluation",  active: false, href: "/dashboard/hr/evaluation" },
  { label: "Interview Scheduling",  active: false, href: "#"                        },
  { label: "History",               active: false, href: "#"                        },
]

// ── Main Page ─────────────────────────────────────────────────
export default function JobsPage() {
  const [jobs, setJobs]           = useState<Job[]>(initialJobs)
  const [search, setSearch]       = useState("")
  const [page, setPage]           = useState(1)
  const [showModal, setShowModal] = useState(false)

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PER_PAGE))
  const paginated  = filtered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE)

  const addJob = (job: Job) => {
    setJobs((prev) => [job, ...prev])
    setPage(1)
  }

  return (
    <>

      {/* ── Text sidebar ── */}
     <HrNavigationPannel navItems={sidebarNav}/>

      {/* ── Main content ── */}
      <main className="flex flex-1 flex-col overflow-y-auto p-6">
        {/* Search + filter bar */}
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
          <Search className="size-5 shrink-0 text-[#8181a5]" />
          <input
            type="text"
            placeholder="Search ⌘K"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="flex-1 bg-transparent text-sm text-[#1f2937] outline-none placeholder:text-[rgba(34,48,62,0.4)]"
          />
          <button className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <SlidersHorizontal className="size-5" />
          </button>
        </div>

        {/* Header row */}
        <div className="mb-5 flex items-center justify-between">
          <div>
           
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#5e81f4] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#4a6ee0]"
          >
            <Plus className="size-4" />
            Add Listing
          </button>
        </div>

        {/* Job cards grid */}
        {paginated.length > 0 ? (
          <div className="grid flex-1 grid-cols-2 gap-4 content-start">
            {paginated.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-[#8181a5]">
            No listings match your search.
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex size-8 items-center justify-center rounded-full text-[#4b5563] disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                p === page
                  ? "bg-[#3b6feb] text-white"
                  : "text-[#4b5563] hover:bg-muted"
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex size-8 items-center justify-center rounded-full text-[#4b5563] disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </main>

      {/* Add Listing modal */}
      {showModal && (
        <AddListingModal onClose={() => setShowModal(false)} onAdd={addJob} />
      )}
    </>
  )
}
