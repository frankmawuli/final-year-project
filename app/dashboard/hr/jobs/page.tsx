"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { useAuth } from "@/context/auth-context"
import { jobsService, type ApiJobListItem, type ApiJobDetail, type ApiJobStatus } from "@/services/jobs.service"
import { departmentService, type ApiDepartment } from "@/services/departments.service"
import { JobCard } from "@/components/jobs/job-card-hr"
import { AddListingModal } from "@/components/jobs/add-listing-modal"
import { FilterDropdown } from "@/components/filter-dropdown"

const sidebarNav = [
  { label: "Job Listings",         active: true,  href: "/dashboard/hr/jobs"       },
  { label: "Applicants",           active: false, href: "/dashboard/hr/applicants" },
  { label: "Candidate Evaluation", active: false, href: "/dashboard/hr/evaluation" },
  { label: "Interview Scheduling", active: false, href: "#"                        },
  { label: "History",              active: false, href: "#"                        },
]

const JOB_STATUS_LABELS: Record<ApiJobStatus, string> = {
  DRAFT:  "Draft",
  OPEN:   "Open",
  CLOSED: "Closed",
}
const JOB_STATUS_OPTIONS = Object.values(JOB_STATUS_LABELS)

export default function JobsPage() {
  const { accessToken } = useAuth()
  const searchParams = useSearchParams()

  const [jobs,        setJobs]        = useState<ApiJobListItem[]>([])
  const [departments, setDepartments] = useState<ApiDepartment[]>([])
  const [search,       setSearch]       = useState("")
  const [statusFilter, setStatusFilter] = useState<string | "All">("All")
  const [deptFilter,   setDeptFilter]   = useState<string | "All">("All")
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [showModal,   setShowModal]   = useState(false)
  const [editJob,     setEditJob]     = useState<ApiJobDetail | null>(null)

  const hasFilters = search !== "" || statusFilter !== "All" || deptFilter !== "All"

  const fetchJobs = useCallback(
    async (searchVal = search, pageVal = page, statusVal = statusFilter, deptVal = deptFilter) => {
      if (!accessToken) return
      setLoading(true)
      setError(null)
      try {
        const status = statusVal !== "All"
          ? (Object.keys(JOB_STATUS_LABELS) as ApiJobStatus[]).find((k) => JOB_STATUS_LABELS[k] === statusVal)
          : undefined
        const departmentId = deptVal !== "All" ? departments.find((d) => d.name === deptVal)?.id : undefined
        const res = await jobsService.list(
          { search: searchVal || undefined, status, departmentId, page: pageVal, limit: 4 },
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
    [accessToken, departments], // eslint-disable-line react-hooks/exhaustive-deps
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

  const handleStatusFilter = (val: string | "All") => {
    setStatusFilter(val)
    setPage(1)
    fetchJobs(search, 1, val, deptFilter)
  }

  const handleDeptFilter = (val: string | "All") => {
    setDeptFilter(val)
    setPage(1)
    fetchJobs(search, 1, statusFilter, val)
  }

  const clearFilters = () => {
    setSearch(""); setStatusFilter("All"); setDeptFilter("All"); setPage(1)
    fetchJobs("", 1, "All", "All")
  }

  const handlePage = (p: number) => {
    setPage(p)
    fetchJobs(search, p, statusFilter, deptFilter)
  }

  const handleDelete = async (id: string) => {
    if (!accessToken) return
    try {
      await jobsService.delete(id, accessToken)
      fetchJobs(search, page, statusFilter, deptFilter)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete job")
    }
  }

  const handlePublish = async (id: string) => {
    if (!accessToken) return
    try {
      await jobsService.updateStatus(id, "OPEN", accessToken)
      fetchJobs(search, page, statusFilter, deptFilter)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to publish job")
    }
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center gap-2.5 border-b border-border bg-card px-5 py-2.5">
          <div className="flex flex-1 items-center gap-1.5">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ⌘K"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <FilterDropdown
            label="Status"
            value={statusFilter}
            options={JOB_STATUS_OPTIONS}
            onChange={handleStatusFilter}
          />
          <FilterDropdown
            label="Department"
            value={deptFilter}
            options={departments.map((d) => d.name)}
            onChange={handleDeptFilter}
          />
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="whitespace-nowrap rounded-lg border border-border px-2.5 py-2 text-xs text-muted-foreground hover:bg-muted"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-5">
          <div className="mb-4 flex items-center justify-between">
            <div />
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
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
            <div className="flex flex-1 items-center justify-center text-xs text-rose-600">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
              No listings found.
            </div>
          ) : (
            <div className="grid flex-1 grid-cols-2 content-start gap-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onDelete={handleDelete} onPublish={handlePublish} />
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-end gap-1.5">
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
                  "flex size-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
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
