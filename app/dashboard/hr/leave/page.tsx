"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, ChevronDown, X, Plus, CalendarDays } from "lucide-react"
import { HRIconSidebar } from "@/components/hr-icon-sidebar"
import { cn } from "@/lib/utils"

// ── Assets ────────────────────────────────────────────────────
const adminPhoto = "http://localhost:3845/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

const photos: Record<string, string> = {
  "Michael Chen":     "http://localhost:3845/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png",
  "Sarah Williams":   "http://localhost:3845/assets/c8f5ae43e33ebde623eb7d3b22aeb6930878a4ce.png",
  "David Rodriguez":  "http://localhost:3845/assets/cf9965b714128bf9b66e7daf6ad58bf5300b9eea.png",
  "James Anderson":   "http://localhost:3845/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png",
  "Jessica Martinez": "http://localhost:3845/assets/ba50d841bff1eb820c0b59f56f778fbbf8b8a8c3.png",
  "Robert Taylor":    "http://localhost:3845/assets/3b57a33d98b5a1b80a335988932aa248a0875725.png",
  "Priya Patel":      "http://localhost:3845/assets/635a3bf857069957b4442100197a1e910ea3121d.png",
  "Lena Schmidt":     "http://localhost:3845/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png",
  "Omar Hassan":      "http://localhost:3845/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png",
}

// ── Types ─────────────────────────────────────────────────────
type LeaveType   = "Sick" | "Annual" | "Maternity" | "Paternity" | "Emergency" | "Casual"
type LeaveStatus = "Approved" | "Pending" | "Rejected"

interface LeaveRequest {
  id:         number
  name:       string
  email:      string
  department: string
  leaveType:  LeaveType
  startDate:  string
  endDate:    string
  status:     LeaveStatus
  reason:     string
}

// ── Style maps ────────────────────────────────────────────────
const leaveTypeBadge: Record<LeaveType, string> = {
  Sick:       "bg-[#fee2e2] text-[#b91c1c]",
  Annual:     "bg-[#dbeafe] text-[#1d4ed8]",
  Maternity:  "bg-[#f3e8ff] text-[#7c3aed]",
  Paternity:  "bg-[#ede9fe] text-[#6d28d9]",
  Emergency:  "bg-[#ffedd5] text-[#ea580c]",
  Casual:     "bg-[#fef9c3] text-[#854d0e]",
}

const statusBadge: Record<LeaveStatus, string> = {
  Approved: "border-[#16a34a] text-[#16a34a]",
  Pending:  "border-[#d97706] text-[#d97706]",
  Rejected: "border-[#dc2626] text-[#dc2626]",
}

const STATUS_OPTIONS: LeaveStatus[] = ["Approved", "Pending", "Rejected"]

const LEAVE_TYPES: LeaveType[] = ["Sick", "Annual", "Maternity", "Paternity", "Emergency", "Casual"]

const DEPARTMENTS = ["Design", "Engineering", "Marketing", "Sales", "Analytics", "HR", "Finance", "Product"]

// ── Seed data ─────────────────────────────────────────────────
let _nextId = 10
const seed: LeaveRequest[] = [
  { id: 1,  name: "Michael Chen",     email: "michael.chen@corecruiter.com",     department: "Design",      leaveType: "Annual",    startDate: "Mar 18, 2026", endDate: "Mar 20, 2026", status: "Approved", reason: "Family vacation"          },
  { id: 2,  name: "Sarah Williams",   email: "sarah.williams@corecruiter.com",   department: "Marketing",   leaveType: "Sick",      startDate: "Mar 10, 2026", endDate: "Mar 14, 2026", status: "Approved", reason: "Flu recovery"             },
  { id: 3,  name: "David Rodriguez",  email: "david.rodriguez@corecruiter.com",  department: "Engineering", leaveType: "Sick",      startDate: "Mar 17, 2026", endDate: "Mar 19, 2026", status: "Pending",  reason: "Medical appointment"      },
  { id: 4,  name: "James Anderson",   email: "james.anderson@corecruiter.com",   department: "Sales",       leaveType: "Annual",    startDate: "Mar 22, 2026", endDate: "Mar 26, 2026", status: "Approved", reason: "Annual leave"             },
  { id: 5,  name: "Jessica Martinez", email: "jessica.martinez@corecruiter.com", department: "Design",      leaveType: "Emergency", startDate: "Mar 15, 2026", endDate: "Mar 15, 2026", status: "Approved", reason: "Family emergency"         },
  { id: 6,  name: "Robert Taylor",    email: "robert.taylor@corecruiter.com",    department: "Engineering", leaveType: "Casual",    startDate: "Mar 20, 2026", endDate: "Mar 20, 2026", status: "Pending",  reason: "Personal errand"          },
  { id: 7,  name: "Priya Patel",      email: "priya.patel@corecruiter.com",      department: "Analytics",   leaveType: "Annual",    startDate: "Mar 24, 2026", endDate: "Mar 28, 2026", status: "Rejected", reason: "Conflicting sprint dates" },
  { id: 8,  name: "Lena Schmidt",     email: "lena.schmidt@corecruiter.com",     department: "HR",          leaveType: "Maternity", startDate: "Mar 01, 2026", endDate: "Mar 31, 2026", status: "Approved", reason: "Maternity leave"          },
  { id: 9,  name: "Omar Hassan",      email: "omar.hassan@corecruiter.com",      department: "Engineering", leaveType: "Sick",      startDate: "Mar 10, 2026", endDate: "Mar 14, 2026", status: "Approved", reason: "Sick leave"               },
]

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Employees",            href: "/dashboard/hr/employees"   },
  { label: "Departments",          href: "/dashboard/hr/departments" },
  { label: "Leave",                href: "/dashboard/hr/leave"       },
  { label: "Payroll",              href: "/dashboard/hr/payroll"     },
  { label: "History",              href: "#"                         },
]

// ── Status dropdown ───────────────────────────────────────────
function StatusDropdown({
  value,
  onChange,
}: {
  value:    LeaveStatus
  onChange: (s: LeaveStatus) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
          statusBadge[value],
          "hover:opacity-80"
        )}
      >
        {value}
        <ChevronDown className="size-3" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-32 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false) }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium hover:bg-muted",
                s === value && "bg-muted/60"
              )}
            >
              <span className={cn("size-2 rounded-full", {
                "bg-[#16a34a]": s === "Approved",
                "bg-[#d97706]": s === "Pending",
                "bg-[#dc2626]": s === "Rejected",
              })} />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Add Leave modal ───────────────────────────────────────────
interface AddLeaveModalProps {
  onClose: () => void
  onAdd:   (r: LeaveRequest) => void
}

function AddLeaveModal({ onClose, onAdd }: AddLeaveModalProps) {
  const employees = Object.keys(photos)
  const [name,       setName]       = useState(employees[0])
  const [leaveType,  setLeaveType]  = useState<LeaveType>("Annual")
  const [startDate,  setStartDate]  = useState("")
  const [endDate,    setEndDate]    = useState("")
  const [reason,     setReason]     = useState("")
  const [error,      setError]      = useState("")

  const empEmail: Record<string, string> = {
    "Michael Chen":     "michael.chen@corecruiter.com",
    "Sarah Williams":   "sarah.williams@corecruiter.com",
    "David Rodriguez":  "david.rodriguez@corecruiter.com",
    "James Anderson":   "james.anderson@corecruiter.com",
    "Jessica Martinez": "jessica.martinez@corecruiter.com",
    "Robert Taylor":    "robert.taylor@corecruiter.com",
    "Priya Patel":      "priya.patel@corecruiter.com",
    "Lena Schmidt":     "lena.schmidt@corecruiter.com",
    "Omar Hassan":      "omar.hassan@corecruiter.com",
  }
  const empDept: Record<string, string> = {
    "Michael Chen": "Design", "Sarah Williams": "Marketing", "David Rodriguez": "Engineering",
    "James Anderson": "Sales", "Jessica Martinez": "Design", "Robert Taylor": "Engineering",
    "Priya Patel": "Analytics", "Lena Schmidt": "HR", "Omar Hassan": "Engineering",
  }

  function fmt(iso: string): string {
    if (!iso) return ""
    const d = new Date(iso)
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!startDate || !endDate) { setError("Start and end dates are required."); return }
    if (endDate < startDate)    { setError("End date cannot be before start date."); return }
    onAdd({
      id:         _nextId++,
      name,
      email:      empEmail[name] ?? "",
      department: empDept[name]  ?? "",
      leaveType,
      startDate:  fmt(startDate),
      endDate:    fmt(endDate),
      status:     "Pending",
      reason:     reason.trim() || "—",
    })
    onClose()
  }

  const fieldCls = "w-full rounded-lg border border-[#dbdcde] bg-[#f4f5f9] px-3 py-2.5 text-sm text-[#1c1c1c] outline-none focus:border-[#5e81f4] focus:ring-2 focus:ring-[#5e81f4]/20"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1c1c1c]">Request Leave</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Employee */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#324054]">Employee</label>
            <select value={name} onChange={(e) => setName(e.target.value)} className={fieldCls}>
              {employees.map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>

          {/* Leave type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#324054]">Leave Type</label>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value as LeaveType)} className={fieldCls}>
              {LEAVE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#324054]">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={fieldCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#324054]">End Date</label>
              <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} className={fieldCls} />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#324054]">Reason <span className="text-[#8181a5]">(optional)</span></label>
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
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-[#324054] hover:bg-muted">
              Cancel
            </button>
            <button type="submit" className="flex-1 rounded-lg bg-[#5e81f4] py-2.5 text-sm font-semibold text-white hover:bg-[#4a6ee0]">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
const PER_PAGE = 9

export default function LeavePage() {
  const [requests,  setRequests]  = useState<LeaveRequest[]>(seed)
  const [search,    setSearch]    = useState("")
  const [page,      setPage]      = useState(1)
  const [showModal, setShowModal] = useState(false)

  const filtered = requests.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())       ||
    r.department.toLowerCase().includes(search.toLowerCase()) ||
    r.leaveType.toLowerCase().includes(search.toLowerCase())  ||
    r.status.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function updateStatus(id: number, status: LeaveStatus) {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
  }

  function addRequest(r: LeaveRequest) {
    setRequests((prev) => [r, ...prev])
    setPage(1)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-[#1c1c1c]">
      <HRIconSidebar />

      {/* ── Text sidebar ── */}
      <aside className="flex w-[280px] shrink-0 flex-col justify-between bg-white py-5 pl-5 pr-3 shadow-sm">
        <nav className="flex flex-col gap-1">
          {sidebarNav.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "block w-full rounded px-3 py-2.5 text-left text-base font-medium transition-colors hover:bg-muted",
                href === "/dashboard/hr/leave" ? "font-semibold text-primary" : "text-[#324054]"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <button className="w-full rounded px-3 py-2.5 text-left text-base font-medium text-[#324054] hover:bg-muted">
            Settings
          </button>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2">
            <img src={adminPhoto} alt="Michael Smith" className="size-10 shrink-0 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#324054]">Michael Smith</p>
              <p className="truncate text-xs text-[#71839b]">michaelsmith12@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex flex-1 flex-col overflow-hidden">

        {/* Search bar */}
        <div className="flex items-center gap-3 border-b border-border bg-white px-6 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-[#f4f5f9] px-4 py-2.5">
            <Search className="size-4 shrink-0 text-[#8181a5]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search ⌘K"
              className="flex-1 bg-transparent text-sm text-[#1c1c1c] outline-none placeholder:text-[#8181a5]"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-[#5e81f4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4a6ee0]"
          >
            <Plus className="size-4" />
            Request Leave
          </button>
          <button className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-[#8181a5] hover:bg-muted">
            <SlidersHorizontal className="size-4" />
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="rounded-xl border border-border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8181a5]">Employee Name</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8181a5]">Department</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8181a5]">Leave Type</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8181a5]">Start Date</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8181a5]">End Date</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8181a5]">Status</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8181a5]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((r) => (
                  <tr key={r.id} className="hover:bg-[#f8fafc]">
                    {/* Employee */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={photos[r.name] ?? adminPhoto}
                          alt={r.name}
                          className="size-9 shrink-0 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-[#1c1c1c]">{r.name}</p>
                          <p className="text-xs text-[#8181a5]">{r.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-4 text-[#8181a5]">{r.department}</td>

                    {/* Leave type */}
                    <td className="px-4 py-4">
                      <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", leaveTypeBadge[r.leaveType])}>
                        {r.leaveType}
                      </span>
                    </td>

                    {/* Start date */}
                    <td className="px-4 py-4 text-[#1c1c1c]">{r.startDate}</td>

                    {/* End date */}
                    <td className="px-4 py-4 text-[#1c1c1c]">{r.endDate}</td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", statusBadge[r.status])}>
                        {r.status}
                      </span>
                    </td>

                    {/* Actions dropdown */}
                    <td className="px-4 py-4">
                      <StatusDropdown
                        value={r.status}
                        onChange={(s) => updateStatus(r.id, s)}
                      />
                    </td>
                  </tr>
                ))}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-[#8181a5]">
                      No leave requests match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <p className="text-xs text-[#8181a5]">
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg text-sm font-medium",
                        page === i + 1
                          ? "bg-[#5e81f4] text-white"
                          : "text-[#8181a5] hover:bg-muted"
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

      {showModal && (
        <AddLeaveModal
          onClose={() => setShowModal(false)}
          onAdd={addRequest}
        />
      )}
    </div>
  )
}
