"use client"

import { useState } from "react"
import { Search, Plus, X, CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Assets ─────────────────────────────────────────────────────
const employeePhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

// ── Types ───────────────────────────────────────────────────────
type LeaveType   = "Sick" | "Annual" | "Maternity" | "Paternity" | "Emergency" | "Casual"
type LeaveStatus = "Approved" | "Pending" | "Rejected"

interface LeaveRequest {
  id:        number
  leaveType: LeaveType
  startDate: string
  endDate:   string
  days:      number
  status:    LeaveStatus
  reason:    string
}

// ── Style maps ──────────────────────────────────────────────────
const leaveTypeBadge: Record<LeaveType, string> = {
  Sick:       "bg-[#fee2e2] text-[#b91c1c]",
  Annual:     "bg-[#dbeafe] text-[#1d4ed8]",
  Maternity:  "bg-[#f3e8ff] text-[#7c3aed]",
  Paternity:  "bg-[#ede9fe] text-[#6d28d9]",
  Emergency:  "bg-[#ffedd5] text-[#ea580c]",
  Casual:     "bg-[#fef9c3] text-[#854d0e]",
}

const statusBadge: Record<LeaveStatus, string> = {
  Approved: "border-[#16a34a] text-[#16a34a] bg-[#f0fdf4]",
  Pending:  "border-[#d97706] text-[#d97706] bg-[#fffbeb]",
  Rejected: "border-[#dc2626] text-[#dc2626] bg-[#fef2f2]",
}

const statusIcon: Record<LeaveStatus, React.ReactNode> = {
  Approved: <CheckCircle2 className="size-3.5" />,
  Pending:  <Clock className="size-3.5" />,
  Rejected: <XCircle className="size-3.5" />,
}

const LEAVE_TYPES: LeaveType[] = ["Sick", "Annual", "Maternity", "Paternity", "Emergency", "Casual"]

// ── Leave balance data ──────────────────────────────────────────
const leaveBalance = [
  { type: "Annual",    total: 14, used: 5,  color: "#5e81f4" },
  { type: "Sick",      total: 10, used: 3,  color: "#f472b6" },
]

// ── Seed data ───────────────────────────────────────────────────
let _nextId = 6
const seed: LeaveRequest[] = [
  { id: 1, leaveType: "Annual",    startDate: "Mar 18, 2026", endDate: "Mar 20, 2026", days: 3, status: "Approved", reason: "Family vacation"     },
  { id: 2, leaveType: "Sick",      startDate: "Feb 10, 2026", endDate: "Feb 12, 2026", days: 3, status: "Approved", reason: "Flu recovery"         },
  { id: 3, leaveType: "Casual",    startDate: "Mar 28, 2026", endDate: "Mar 28, 2026", days: 1, status: "Pending",  reason: "Personal errand"      },
  { id: 4, leaveType: "Emergency", startDate: "Jan 15, 2026", endDate: "Jan 15, 2026", days: 1, status: "Approved", reason: "Family emergency"     },
  { id: 5, leaveType: "Annual",    startDate: "Apr 20, 2026", endDate: "Apr 22, 2026", days: 3, status: "Rejected", reason: "Conflicting deadline" },
]

// ── Add Leave Modal ─────────────────────────────────────────────
interface AddLeaveModalProps {
  onClose: () => void
  onAdd:   (r: LeaveRequest) => void
}

function AddLeaveModal({ onClose, onAdd }: AddLeaveModalProps) {
  const [leaveType, setLeaveType] = useState<LeaveType>("Annual")
  const [startDate, setStartDate] = useState("")
  const [endDate,   setEndDate]   = useState("")
  const [reason,    setReason]    = useState("")
  const [error,     setError]     = useState("")

  function fmt(iso: string): string {
    if (!iso) return ""
    const d = new Date(iso)
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  }

  function calcDays(start: string, end: string): number {
    if (!start || !end) return 0
    const diff = new Date(end).getTime() - new Date(start).getTime()
    return Math.max(1, Math.round(diff / 86400000) + 1)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!startDate || !endDate) { setError("Start and end dates are required."); return }
    if (endDate < startDate)    { setError("End date cannot be before start date."); return }
    onAdd({
      id:        _nextId++,
      leaveType,
      startDate: fmt(startDate),
      endDate:   fmt(endDate),
      days:      calcDays(startDate, endDate),
      status:    "Pending",
      reason:    reason.trim() || "—",
    })
    onClose()
  }

  const fieldCls = "w-full rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Request Leave</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Submit a new leave request for approval</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Leave type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className={fieldCls}
            >
              {LEAVE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={fieldCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={fieldCls}
              />
            </div>
          </div>

          {/* Days preview */}
          {startDate && endDate && endDate >= startDate && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
              <CalendarDays className="size-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                {calcDays(startDate, endDate)} day{calcDays(startDate, endDate) !== 1 ? "s" : ""} requested
              </span>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Reason <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe the reason for leave…"
              rows={3}
              className={cn(fieldCls, "resize-none")}
            />
          </div>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────
const PER_PAGE = 5

export default function EssLeavePage() {
  const [requests,  setRequests]  = useState<LeaveRequest[]>(seed)
  const [search,    setSearch]    = useState("")
  const [page,      setPage]      = useState(1)
  const [showModal, setShowModal] = useState(false)

  const filtered = requests.filter((r) =>
    r.leaveType.toLowerCase().includes(search.toLowerCase()) ||
    r.status.toLowerCase().includes(search.toLowerCase())   ||
    r.reason.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function addRequest(r: LeaveRequest) {
    setRequests((prev) => [r, ...prev])
    setPage(1)
  }

  const totalUsed  = requests.filter((r) => r.status === "Approved").reduce((s, r) => s + r.days, 0)
  const totalPending = requests.filter((r) => r.status === "Pending").length

  return (
    <div className="flex h-full flex-col">
      {/* ── Mobile page title ── */}
      <div className="border-b border-border bg-white px-4 py-3 lg:hidden">
        <h1 className="text-base font-semibold text-foreground">My Leave</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Leave › Requests</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

        {/* ── Employee header ── */}
        <div
          className="relative mb-6 overflow-hidden rounded-2xl p-5 text-white"
          style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
        >
          <span className="absolute -right-6 -top-6 size-32 rounded-full bg-white/10" />
          <span className="absolute -bottom-8 right-16 size-24 rounded-full bg-white/10" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={employeePhoto}
                alt="Muhammad Rifky Andrianto"
                className="size-14 shrink-0 rounded-full object-cover ring-2 ring-white/40"
              />
              <div>
                <p className="text-base font-semibold">Muhammad Rifky Andrianto</p>
                <p className="text-sm text-white/70">UI/UX Designer · Engineering</p>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-2xl font-bold">{totalUsed}</p>
              <p className="text-xs text-white/70">days used this year</p>
            </div>
          </div>

          
        </div>

        {/* ── Leave balance cards ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {leaveBalance.map((b) => {
            const remaining = b.total - b.used
            const pct = Math.round((b.used / b.total) * 100)
            return (
              <div key={b.type} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{b.type}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: b.color }}
                  >
                    {remaining} left
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: b.color }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{b.used} of {b.total} days used</p>
              </div>
            )
          })}
        </div>

        {/* ── Leave requests table ── */}
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          {/* Table header / search */}
          <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div>
              <h2 className="text-base font-semibold text-foreground">My Leave Requests</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{requests.length} total requests</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search requests…"
                  className="w-36 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:w-44"
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                <Plus className="size-4" />
                <span className="hidden sm:inline">New Request</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:px-6">Leave Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">End Date</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    {/* Leave type */}
                    <td className="px-5 py-4 md:px-6">
                      <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", leaveTypeBadge[r.leaveType])}>
                        {r.leaveType}
                      </span>
                    </td>

                    {/* Start date */}
                    <td className="px-4 py-4 text-sm text-foreground">{r.startDate}</td>

                    {/* End date */}
                    <td className="px-4 py-4 text-sm text-foreground">{r.endDate}</td>

                    {/* Days */}
                    <td className="px-4 py-4 text-center">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                        {r.days}d
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="px-4 py-4 text-sm text-muted-foreground max-w-[180px] truncate">
                      {r.reason}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={cn(
                        "flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                        statusBadge[r.status]
                      )}>
                        {statusIcon[r.status]}
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                      No leave requests match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-5 py-3 md:px-6">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg text-sm font-medium",
                      page === i + 1 ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
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

      {showModal && (
        <AddLeaveModal
          onClose={() => setShowModal(false)}
          onAdd={addRequest}
        />
      )}
    </div>
  )
}
