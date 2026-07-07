"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { useAuth } from "@/context/auth-context"
import { ApiError } from "@/lib/api-client"
import { leaveService, type ApiLeaveRequest, type ApiLeaveType, type ApiLeaveStatus } from "@/services/leave.service"

// ── Constants ─────────────────────────────────────────────────
const DEFAULT_PHOTO = "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png"
const PER_PAGE = 9

// ── Types ─────────────────────────────────────────────────────
interface LeaveRequest {
  id:         number
  name:       string
  email:      string
  photo:      string
  department: string
  type:       ApiLeaveType
  startDate:  string   // ISO
  endDate:    string   // ISO
  status:     ApiLeaveStatus
  reason:     string
}

// ── Style maps ────────────────────────────────────────────────
const TYPE_LABELS: Record<ApiLeaveType, string> = {
  ANNUAL:    "Annual",
  SICK:      "Sick",
  MATERNITY: "Maternity",
  PATERNITY: "Paternity",
  UNPAID:    "Unpaid",
  OTHER:     "Other",
}

const leaveTypeBadge: Record<ApiLeaveType, string> = {
  SICK:      "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  ANNUAL:    "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  MATERNITY: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  PATERNITY: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  UNPAID:    "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  OTHER:     "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-600",
}

const statusBadge: Record<ApiLeaveStatus, string> = {
  APPROVED: "border-emerald-600 text-emerald-600",
  PENDING:  "border-amber-500 text-amber-500",
  REJECTED: "border-red-600 text-red-600",
}

// ── Helpers ────────────────────────────────────────────────────
function formatDate(iso: string): string {
  if (!iso) return ""
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  } catch {
    return iso
  }
}

function mapLeave(a: ApiLeaveRequest): LeaveRequest {
  return {
    id:         a.id,
    name:       a.employee.user.name,
    email:      a.employee.user.email,
    photo:      a.employee.user.avatarUrl ?? DEFAULT_PHOTO,
    department: a.employee.department?.name ?? "",
    type:       a.type,
    startDate:  a.startDate,
    endDate:    a.endDate,
    status:     a.status,
    reason:     a.reason ?? "",
  }
}

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Employees",   href: "/dashboard/hr/employees"   },
  { label: "Departments", href: "/dashboard/hr/departments" },
  { label: "Leave",       href: "/dashboard/hr/leave"       },
  { label: "Payroll",     href: "/dashboard/hr/payroll"     },
  { label: "History",     href: "#"                         },
]

// ── Main Page ─────────────────────────────────────────────────
export default function LeavePage() {
  const { accessToken } = useAuth()

  const [requests,      setRequests]      = useState<LeaveRequest[]>([])
  const [totalPages,    setTotalPages]    = useState(1)
  const [total,         setTotal]         = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [search,        setSearch]        = useState("")
  const [page,          setPage]          = useState(1)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [actionError,   setActionError]   = useState<string | null>(null)

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("")
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch leave requests
  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    setLoading(true)
    setError(null)
    leaveService
      .list({ search: debouncedSearch || undefined, page, limit: PER_PAGE }, accessToken)
      .then((res) => {
        if (cancelled) return
        setRequests(res.data.map(mapLeave))
        setTotalPages(res.meta.totalPages)
        setTotal(res.meta.total)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load leave requests")
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [accessToken, debouncedSearch, page])

  async function handleUpdateStatus(id: number, status: "APPROVED" | "REJECTED") {
    if (!accessToken) return
    setActionLoading(id)
    setActionError(null)
    try {
      const res = await leaveService.updateStatus(id, status, accessToken)
      setRequests((prev) => prev.map((r) => (r.id === id ? mapLeave(res.data) : r)))
    } catch (e: unknown) {
      if (e instanceof ApiError && e.status === 400) {
        setActionError("This request has already been processed.")
      } else {
        setActionError(e instanceof Error ? e.message : "Failed to update status")
      }
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2.5 border-b border-border bg-card px-5 py-2.5">
          <div className="flex flex-1 items-center gap-1.5 rounded-lg bg-muted px-3 py-2">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by employee name…"
              className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted">
            <SlidersHorizontal className="size-4" />
          </button>
        </div>

        {/* Action error banner */}
        {actionError && (
          <div className="mx-5 mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
            {actionError}
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto p-5">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {["Employee", "Department", "Leave Type", "Start Date", "End Date", "Status", "Actions"].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-xs text-muted-foreground">
                      Loading…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-xs text-rose-500">
                      {error}
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-xs text-muted-foreground">
                      No leave requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/50">
                      {/* Employee */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={r.photo}
                            alt={r.name}
                            className="size-9 shrink-0 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-foreground">{r.name}</p>
                            <p className="text-xs text-muted-foreground">{r.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-3 py-3 text-muted-foreground">{r.department}</td>

                      {/* Leave type */}
                      <td className="px-3 py-3">
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", leaveTypeBadge[r.type])}>
                          {TYPE_LABELS[r.type]}
                        </span>
                      </td>

                      {/* Start date */}
                      <td className="px-3 py-3 text-foreground">{formatDate(r.startDate)}</td>

                      {/* End date */}
                      <td className="px-3 py-3 text-foreground">{formatDate(r.endDate)}</td>

                      {/* Status */}
                      <td className="px-3 py-3">
                        <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", statusBadge[r.status])}>
                          {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                        </span>
                      </td>

                      {/* Actions — only PENDING rows can be acted on */}
                      <td className="px-3 py-3">
                        {r.status === "PENDING" ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateStatus(r.id, "APPROVED")}
                              disabled={actionLoading === r.id}
                              className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                            >
                              {actionLoading === r.id ? "…" : "Approve"}
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(r.id, "REJECTED")}
                              disabled={actionLoading === r.id}
                              className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-50 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30"
                            >
                              {actionLoading === r.id ? "…" : "Reject"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
                <p className="text-xs text-muted-foreground">
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg text-xs font-medium",
                        page === i + 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
