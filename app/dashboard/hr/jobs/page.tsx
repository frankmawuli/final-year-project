"use client"

"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, Building2, Plus, X, ChevronLeft, ChevronRight } from "lucide-react"
import { HRIconSidebar } from "@/components/hr-icon-sidebar"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"

// ── Asset URLs ───────────────────────────────────────────────
const profilePhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

// ── Types ─────────────────────────────────────────────────────
type JobStatus = "Open" | "Closed" | "Draft"

interface Job {
  id: number
  title: string
  department: string
  location: string
  type: string
  applicants: number
  salaryMin: string
  salaryMax: string
  experience: string
  status: JobStatus
}

// ── Sample Data ───────────────────────────────────────────────
const initialJobs: Job[] = [
  { id: 1, title: "UX/UI Designer",        department: "Design",      location: "Remote",   type: "Contract",  applicants: 12, salaryMin: "$70k", salaryMax: "$90k",  experience: "3+ years", status: "Open"   },
  { id: 2, title: "Frontend Engineer",     department: "Engineering", location: "Remote",   type: "Full-time", applicants: 32, salaryMin: "$90k", salaryMax: "$120k", experience: "4+ years", status: "Open"   },
  { id: 3, title: "Product Manager",       department: "Product",     location: "On-site",  type: "Full-time", applicants: 8,  salaryMin: "$100k", salaryMax: "$130k", experience: "5+ years", status: "Open"   },
  { id: 4, title: "Data Analyst",          department: "Analytics",   location: "Hybrid",   type: "Full-time", applicants: 21, salaryMin: "$75k", salaryMax: "$95k",  experience: "2+ years", status: "Open"   },
  { id: 5, title: "Backend Engineer",      department: "Engineering", location: "Remote",   type: "Full-time", applicants: 45, salaryMin: "$95k", salaryMax: "$125k", experience: "4+ years", status: "Closed" },
  { id: 6, title: "Marketing Specialist",  department: "Marketing",   location: "On-site",  type: "Part-time", applicants: 14, salaryMin: "$55k", salaryMax: "$70k",  experience: "2+ years", status: "Draft"  },
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
        <button className="rounded-lg border border-[#e0e6ed] px-3 py-1.5 text-xs font-medium text-[#1f2937] transition-colors hover:bg-muted">
          View Details
        </button>
        <button className="rounded-lg border border-[#e0e6ed] px-3 py-1.5 text-xs font-medium text-[#1f2937] transition-colors hover:bg-muted">
          Applications ({job.applicants})
        </button>
      </div>
    </div>
  )
}

// ── Add Listing Modal ─────────────────────────────────────────
const DEPARTMENTS = ["Design", "Engineering", "Product", "Analytics", "Marketing", "HR", "Finance"]
const JOB_TYPES   = ["Full-time", "Part-time", "Contract", "Internship"]
const LOCATIONS   = ["Remote", "On-site", "Hybrid"]

function AddListingModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (job: Job) => void
}) {
  const [form, setForm] = useState({
    title: "", department: DEPARTMENTS[0], location: LOCATIONS[0],
    type: JOB_TYPES[0], salaryMin: "", salaryMax: "", experience: "", description: "",
  })

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onAdd({
      id: Date.now(),
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      applicants: 0,
      salaryMin: form.salaryMin || "TBD",
      salaryMax: form.salaryMax || "TBD",
      experience: form.experience || "Not specified",
      status: "Open",
    })
    onClose()
  }

  const fieldClass = "h-10 w-full rounded-lg border border-[#e0e6ed] bg-white px-3 text-sm text-[#1f2937] outline-none focus:border-[#5e81f4] focus:ring-2 focus:ring-[#5e81f4]/20"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1f2937]">Add New Listing</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Job Title */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Job Title *</label>
            <input className={fieldClass} placeholder="e.g. Senior Product Designer" value={form.title} onChange={set("title")} required />
          </div>

          {/* Department + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#374151]">Department</label>
              <select className={fieldClass} value={form.department} onChange={set("department")}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#374151]">Job Type</label>
              <select className={fieldClass} value={form.type} onChange={set("type")}>
                {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Location</label>
            <select className={fieldClass} value={form.location} onChange={set("location")}>
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* Salary range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#374151]">Salary Min</label>
              <input className={fieldClass} placeholder="e.g. $70k" value={form.salaryMin} onChange={set("salaryMin")} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#374151]">Salary Max</label>
              <input className={fieldClass} placeholder="e.g. $90k" value={form.salaryMax} onChange={set("salaryMax")} />
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Experience Required</label>
            <input className={fieldClass} placeholder="e.g. 3+ years" value={form.experience} onChange={set("experience")} />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Description</label>
            <textarea
              className="h-24 w-full resize-none rounded-lg border border-[#e0e6ed] bg-white px-3 py-2 text-sm text-[#1f2937] outline-none focus:border-[#5e81f4] focus:ring-2 focus:ring-[#5e81f4]/20"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={form.description}
              onChange={set("description")}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#e0e6ed] px-4 py-2 text-sm font-medium text-[#1f2937] hover:bg-muted">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-[#5e81f4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a6ee0]">
              Post Listing
            </button>
          </div>
        </form>
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
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-[#1c1c1c]">
      <HRIconSidebar />

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
    </div>
  )
}
