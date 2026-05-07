"use client"

import { useState, useEffect } from "react"
import { Search, Plus, X, CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { ApiError } from "@/lib/api-client"
import { leaveService, type ApiLeaveRequest, type ApiLeaveType, type ApiLeaveStatus } from "@/services/leave.service"

// ── Constants ─────────────────────────────────────────────────
const DEFAULT_PHOTO = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"
const PER_PAGE = 5

// ── Types ─────────────────────────────────────────────────────
interface LeaveRequest {
  id:        number
  type:      ApiLeaveType
  startDate: string   // ISO
  endDate:   string   // ISO
  status:    ApiLeaveStatus
  reason:    string
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
  SICK:      "bg-[#fee2e2] text-[#b91c1c]",
  ANNUAL:    "bg-[#dbeafe] text-[#1d4ed8]",
  MATERNITY: "bg-[#f3e8ff] text-[#7c3aed]",
  PATERNITY: "bg-[#ede9fe] text-[#6d28d9]",
  UNPAID:    "bg-[#ffedd5] text-[#ea580c]",
  OTHER:     "bg-[#fef9c3] text-[#854d0e]",
}

const statusBadge: Record<ApiLeaveStatus, string> = {
  APPROVED: "border-[#16a34a] text-[#16a34a] bg-[#f0fdf4]",
  PENDING:  "border-[#d97706] text-[#d97706] bg-[#fffbeb]",
  REJECTED: "border-[#dc2626] text-[#dc2626] bg-[#fef2f2]",
}

const statusIcon: Record<ApiLeaveStatus, React.ReactNode> = {
  APPROVED: <CheckCircle2 className="size-3.5" />,
  PENDING:  <Clock className="size-3.5" />,
  REJECTED: <XCircle className="size-3.5" />,
}

const LEAVE_TYPES = Object.keys(TYPE_LABELS) as ApiLeaveType[]

// ── Helpers ────────────────────────────────────────────────────
function formatDate(iso: string): string {
  if (!iso) return ""
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  } catch {
    return iso
  }
}

function calcDays(start: string, end: string): number {
  if (!start || !end) return 0
  const s = new Date(start.slice(0, 10))
  const e = new Date(end.slice(0, 10))
  return Math.max(1, Math.round((e.getTime() - s.getTime()) / 86400000) + 1)
}

function mapLeave(a: ApiLeaveRequest): LeaveRequest {
  return {
    id:        a.id,
    type:      a.type,
    startDate: a.startDate,
    endDate:   a.endDate,
    status:    a.status,
    reason:    a.reason ?? "",
  }
}

// ── Leave balance totals (hardcoded — no balance API endpoint) ─
const LEAVE_TOTALS: Partial<Record<ApiLeaveType, { total: number; color: string }>> = {
  ANNUAL: { total: 14, color: "#5e81f4" },
  SICK:   { total: 10, color: "#f472b6" },
}

// ── Add Leave Modal ────────────────────────────────────────────
function AddLeaveModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave:  (payload: { type: ApiLeaveType; startDate: string; endDate: string; reason?: string }) => Promise<void>
}) {
  const [type,      setType]      = useState<ApiLeaveType>("ANNUAL")
  const [startDate, setStartDate] = useState("")
  const [endDate,   setEndDate]   = useState("")
  const [reason,    setReason]    = useState("")
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!startDate || !endDate)   { setError("Start and end dates are required."); return }
    if (endDate < startDate)      { setError("End date cannot be before start date."); return }
    setSaving(true)
    setError("")
    try {
      await onSave({ type, startDate, endDate, reason: reason.trim() || undefined })
      onClose()
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 409) setError("You already have a leave request overlapping these dates.")
        else if (err.status === 400) setError("No employee profile is linked to your account. Contact HR.")
        else setError(err.message)
      } else {
        setError("Failed to submit request.")
      }
    } finally {
      setSaving(false)
    }
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
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Leave Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as ApiLeaveType)} className={fieldCls}>
              {LEAVE_TYPES.map((t) => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={fieldCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">End Date</label>
              <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} className={fieldCls} />
            </div>
          </div>

          {startDate && endDate && endDate >= startDate && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2">
              <CalendarDays className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {calcDays(startDate, endDate)} day{calcDays(startDate, endDate) !== 1 ? "s" : ""} requested
              </span>
            </div>
          )}

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
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Submitting…" : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
export default function EssLeavePage() {
  const { accessToken, user } = useAuth()

  const [requests,  setRequests]  = useState<LeaveRequest[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [search,    setSearch]    = useState("")
  const [page,      setPage]      = useState(1)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    setLoading(true)
    setError(null)
    leaveService
      .list({ limit: 100 }, accessToken)
      .then((res) => {
        if (cancelled) return
        setRequests(res.data.map(mapLeave))
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load leave requests")
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [accessToken])

  async function handleCreate(payload: { type: ApiLeaveType; startDate: string; endDate: string; reason?: string }) {
    if (!accessToken) throw new Error("Not authenticated")
    const res = await leaveService.create(payload, accessToken)
    setRequests((prev) => [mapLeave(res.data), ...prev])
    setPage(1)
  }

  // Derived stats
  const totalUsed = requests
    .filter((r) => r.status === "APPROVED")
    .reduce((s, r) => s + calcDays(r.startDate, r.endDate), 0)

  const leaveBalance = (Object.entries(LEAVE_TOTALS) as [ApiLeaveType, { total: number; color: string }][]).map(
    ([type, { total, color }]) => ({
      type,
      total,
      color,
      used: requests
        .filter((r) => r.status === "APPROVED" && r.type === type)
        .reduce((s, r) => s + calcDays(r.startDate, r.endDate), 0),
    }),
  )

  // Client-side search
  const filtered = requests.filter(
    (r) =>
      TYPE_LABELS[r.type].toLowerCase().includes(search.toLowerCase()) ||
      r.status.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase()),
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-white px-4 py-3 lg:hidden">
        <h1 className="text-base font-semibold text-foreground">My Leave</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Leave › Requests</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

        {/* Employee header */}
        <div
          className="relative mb-6 overflow-hidden rounded-2xl p-5 text-white"
          style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
        >
          <span className="absolute -right-6 -top-6 size-32 rounded-full bg-white/10" />
          <span className="absolute -bottom-8 right-16 size-24 rounded-full bg-white/10" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={DEFAULT_PHOTO}
                alt={user?.name ?? "Employee"}
                className="size-14 shrink-0 rounded-full object-cover ring-2 ring-white/40"
              />
              <div>
                <p className="text-base font-semibold">{user?.name ?? "—"}</p>
                <p className="text-sm text-white/70">{user?.role ?? ""}</p>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-2xl font-bold">{totalUsed}</p>
              <p className="text-xs text-white/70">days used this year</p>
            </div>
          </div>
        </div>

        {/* Leave balance cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {leaveBalance.map((b) => {
            const remaining = b.total - b.used
            const pct = Math.min(100, Math.round((b.used / b.total) * 100))
            return (
              <div key={b.type} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{TYPE_LABELS[b.type]}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: b.color }}
                  >
                    {remaining} left
                  </span>
                </div>
                <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: b.color }} />
                </div>
                <p className="text-xs text-muted-foreground">{b.used} of {b.total} days used</p>
              </div>
            )
          })}
        </div>

        {/* Leave requests table */}
        <div className="rounded-2xl border border-border bg-white shadow-sm">
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

          <div className="overflow-x-auto">
            <table className="w-full min-w-135">
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-sm text-muted-foreground">Loading…</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-sm text-rose-500">{error}</td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-sm text-muted-foreground">No leave requests found.</td>
                  </tr>
                ) : (
                  paginated.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-muted/20">
                      <td className="px-5 py-4 md:px-6">
                        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", leaveTypeBadge[r.type])}>
                          {TYPE_LABELS[r.type]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">{formatDate(r.startDate)}</td>
                      <td className="px-4 py-4 text-sm text-foreground">{formatDate(r.endDate)}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                          {calcDays(r.startDate, r.endDate)}d
                        </span>
                      </td>
                      <td className="max-w-45 truncate px-4 py-4 text-sm text-muted-foreground">
                        {r.reason || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold", statusBadge[r.status])}>
                          {statusIcon[r.status]}
                          {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && !error && totalPages > 1 && (
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
                      page === i + 1 ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted",
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
        <AddLeaveModal onClose={() => setShowModal(false)} onSave={handleCreate} />
      )}
    </div>
  )
}
