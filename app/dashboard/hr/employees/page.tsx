"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search, SlidersHorizontal, Plus, X, MoreHorizontal,
  Phone, MessageSquare, User, Mail, MapPin, Building2,
  Calendar, IdCard, ChevronLeft, ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { useAuth } from "@/context/auth-context"
import { employeeService, type ApiEmployee, type EmploymentType } from "@/services/employee.service"

// ── Constants ─────────────────────────────────────────────────
const DEFAULT_PHOTO = "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png"
const CARDS_PER_PAGE = 6

// ── Types ─────────────────────────────────────────────────────
interface Employee {
  id:             number
  empId:          string
  name:           string
  photo:          string
  role:           string           // jobTitle
  department:     string
  email:          string
  phone:          string
  location:       string
  joinDate:       string           // display-formatted
  joinDateIso:    string           // YYYY-MM-DD for form input
  bio:            string
  skills:         string[]
  isActive:       boolean
  employmentType: EmploymentType | null
}

interface FormPayload {
  name:           string
  email:          string
  empId:          string
  role:           string
  employmentType: EmploymentType | ""
  phone:          string
  joinDate:       string           // YYYY-MM-DD
  bio:            string
}

// ── Helpers ────────────────────────────────────────────────────
function generateEmpId(): string {
  return `EMP-${Math.floor(2500 + Math.random() * 500)}`
}

function formatJoinDate(iso: string | null | undefined): string {
  if (!iso) return ""
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  } catch {
    return iso
  }
}

function mapEmployee(a: ApiEmployee): Employee {
  return {
    id:             a.id,
    empId:          a.employeeId,
    name:           a.user.name,
    photo:          a.user.avatarUrl ?? DEFAULT_PHOTO,
    role:           a.jobTitle ?? "",
    department:     a.department?.name ?? "",
    email:          a.user.email,
    phone:          a.phone ?? "",
    location:       a.officeLocation?.city ?? a.officeLocation?.name ?? "",
    joinDate:       formatJoinDate(a.joinDate),
    joinDateIso:    a.joinDate ? a.joinDate.slice(0, 10) : "",
    bio:            a.bio ?? "",
    skills:         (a.skills ?? []).map((s) => (typeof s === "string" ? s : s.name)),
    isActive:       a.isActive,
    employmentType: a.employmentType ?? null,
  }
}

// ── Dot menu ──────────────────────────────────────────────────
function DotMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
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
        className="rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <button onClick={() => { onEdit(); setOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted">
            Edit
          </button>
          <button onClick={() => { onDelete(); setOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30">
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

// ── Employee card ─────────────────────────────────────────────
function EmployeeCard({
  emp,
  onMessage,
  onViewProfile,
  onEdit,
  onDelete,
}: {
  emp:           Employee
  onMessage:     (e: Employee) => void
  onViewProfile: (e: Employee) => void
  onEdit:        (e: Employee) => void
  onDelete:      (id: number) => void
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="w-5" />
        <img
          src={emp.photo}
          alt={emp.name}
          className="size-[72px] rounded-full object-cover ring-2 ring-border"
        />
        <DotMenu onEdit={() => onEdit(emp)} onDelete={() => onDelete(emp.id)} />
      </div>

      <div className="mb-4 text-center">
        <p className="text-base font-bold text-foreground">{emp.name}</p>
        <p className="text-sm text-muted-foreground">{emp.role}</p>
      </div>

      <div className="mb-4 space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Employee ID</span>
          <span className="font-semibold text-foreground">{emp.empId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Join Date</span>
          <span className="font-semibold text-foreground">{emp.joinDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <a
          href={`tel:${emp.phone}`}
          title={`Call ${emp.name}`}
          className="flex items-center justify-center rounded-lg bg-emerald-50 py-2 text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
        >
          <Phone className="size-4" />
        </a>
        <button
          onClick={() => onMessage(emp)}
          title="Send message via email"
          className="flex items-center justify-center rounded-lg bg-violet-50 py-2 text-violet-600 transition-colors hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/30"
        >
          <MessageSquare className="size-4" />
        </button>
        <button
          onClick={() => onViewProfile(emp)}
          title="View profile"
          className="flex items-center justify-center rounded-lg bg-blue-50 py-2 text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
        >
          <User className="size-4" />
        </button>
      </div>
    </div>
  )
}

// ── Email Compose Modal ───────────────────────────────────────
function EmailModal({ emp, onClose }: { emp: Employee; onClose: () => void }) {
  const [subject, setSubject] = useState("")
  const [body,    setBody]    = useState("")
  const [sent,    setSent]    = useState(false)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    window.open(`mailto:${emp.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    setSent(true)
    setTimeout(onClose, 1800)
  }

  const fieldCls = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
              <Mail className="size-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Send Message</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20">
              <Mail className="size-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-foreground">Message sent to {emp.name}!</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">To</label>
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
                <img src={emp.photo} alt={emp.name} className="size-6 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-foreground">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.email}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Subject</label>
              <input
                className={fieldCls}
                placeholder="e.g. Team Update — Q2 Goals"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Message</label>
              <textarea
                className={`${fieldCls} h-32 resize-none`}
                placeholder="Write your message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                Cancel
              </button>
              <button type="submit" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Mail className="size-4" /> Send Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Add / Edit Employee Modal ─────────────────────────────────
function EmployeeFormModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Employee | null
  onClose:  () => void
  onSave:   (payload: FormPayload) => Promise<void>
}) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState<FormPayload>({
    name:           initial?.name           ?? "",
    email:          initial?.email          ?? "",
    empId:          initial?.empId          ?? generateEmpId(),
    role:           initial?.role           ?? "",
    employmentType: initial?.employmentType ?? "",
    phone:          initial?.phone          ?? "",
    joinDate:       initial?.joinDateIso    ?? "",
    bio:            initial?.bio            ?? "",
  })
  const [saving,  setSaving]  = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)

  const set = (k: keyof FormPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveErr(null)
    try {
      await onSave(form)
      onClose()
    } catch (err: unknown) {
      setSaveErr(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const inputCls    = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
  const readonlyCls = "w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
  const labelCls    = "mb-1 block text-xs font-medium text-foreground"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">{isEdit ? "Edit Employee" : "Add New Employee"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Full Name — read-only on edit (name is on user record, not patchable) */}
            <div className="col-span-2">
              <label className={labelCls}>Full Name {!isEdit && "*"}</label>
              {isEdit ? (
                <input className={readonlyCls} value={form.name} readOnly />
              ) : (
                <input className={inputCls} placeholder="e.g. Jane Doe" value={form.name} onChange={set("name")} required />
              )}
            </div>

            {/* Email — read-only on edit (email is on user record, not patchable) */}
            <div>
              <label className={labelCls}>Email {!isEdit && "*"}</label>
              {isEdit ? (
                <input className={readonlyCls} value={form.email} readOnly />
              ) : (
                <input className={inputCls} type="email" placeholder="jane@company.com" value={form.email} onChange={set("email")} required />
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className={labelCls}>Employee ID *</label>
              <input className={inputCls} placeholder="EMP-1234" value={form.empId} onChange={set("empId")} required />
            </div>

            {/* Job Title */}
            <div>
              <label className={labelCls}>Job Title</label>
              <input className={inputCls} placeholder="e.g. Product Designer" value={form.role} onChange={set("role")} />
            </div>

            {/* Employment Type */}
            <div>
              <label className={labelCls}>Employment Type</label>
              <select className={inputCls} value={form.employmentType} onChange={set("employmentType")}>
                <option value="">— Select —</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERN">Intern</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} />
            </div>

            {/* Join Date */}
            <div>
              <label className={labelCls}>Join Date</label>
              <input className={inputCls} type="date" value={form.joinDate} onChange={set("joinDate")} />
            </div>

            {/* Bio */}
            <div className="col-span-2">
              <label className={labelCls}>Bio</label>
              <textarea className={`${inputCls} h-20 resize-none`} placeholder="Brief description..." value={form.bio} onChange={set("bio")} />
            </div>
          </div>

          {saveErr && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
              {saveErr}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Profile Side Panel ────────────────────────────────────────
function ProfilePanel({ emp, onClose, onMessage }: { emp: Employee; onClose: () => void; onMessage: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-40 flex h-full w-[400px] flex-col bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Employee Profile</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/50 py-6">
            <img src={emp.photo} alt={emp.name} className="size-20 rounded-full object-cover ring-2 ring-background shadow" />
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{emp.name}</p>
              <p className="text-sm font-medium text-primary">{emp.role}</p>
              {emp.department && (
                <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                  {emp.department}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            {[
              { icon: IdCard,    label: "Employee ID", value: emp.empId      },
              { icon: Calendar,  label: "Joined",      value: emp.joinDate   },
              { icon: Mail,      label: "Email",       value: emp.email      },
              { icon: Phone,     label: "Phone",       value: emp.phone      },
              { icon: MapPin,    label: "Location",    value: emp.location   },
              { icon: Building2, label: "Department",  value: emp.department },
            ]
              .filter(({ value }) => value)
              .map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-3.5 text-primary" />
                  </div>
                  <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
                  <span className="truncate font-medium text-foreground">{value}</span>
                </div>
              ))}
          </div>

          {emp.bio && (
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">About</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{emp.bio}</p>
            </div>
          )}

          {emp.skills.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Skills</p>
              <div className="flex flex-wrap gap-2">
                {emp.skills.map((s) => (
                  <span key={s} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onMessage}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Mail className="size-4" /> Send Message
            </button>
            <a
              href={`tel:${emp.phone}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
            >
              <Phone className="size-4" /> Call
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Employees",   href: "/dashboard/hr/employees",   active: true  },
  { label: "Departments", href: "/dashboard/hr/departments", active: false },
  { label: "Leave",       href: "/dashboard/hr/leave",       active: false },
  { label: "Payroll",     href: "/dashboard/hr/payroll",     active: false },
  { label: "History",     href: "#",                         active: false },
]

// ── Main Page ─────────────────────────────────────────────────
export default function EmployeesPage() {
  const { accessToken } = useAuth()

  const [employees,  setEmployees]  = useState<Employee[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [search,     setSearch]     = useState("")
  const [page,       setPage]       = useState(1)
  const [messaging,  setMessaging]  = useState<Employee | null>(null)
  const [viewing,    setViewing]    = useState<Employee | null>(null)
  // undefined = closed, null = add new, Employee = edit
  const [editing,    setEditing]    = useState<Employee | null | undefined>(undefined)

  // Debounce search and reset page when it changes
  const [debouncedSearch, setDebouncedSearch] = useState("")
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch from API
  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    setLoading(true)
    setError(null)
    employeeService
      .list({ search: debouncedSearch || undefined, page, limit: CARDS_PER_PAGE }, accessToken)
      .then((res) => {
        if (cancelled) return
        setEmployees(res.data.map(mapEmployee))
        setTotalPages(res.meta.totalPages)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load employees")
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [accessToken, debouncedSearch, page])

  const saveEmployee = async (payload: FormPayload, existing: Employee | null) => {
    if (!accessToken) throw new Error("Not authenticated")

    if (existing) {
      const res = await employeeService.update(
        existing.id,
        {
          ...(payload.empId !== existing.empId && { employeeId: payload.empId }),
          ...(payload.role       && { jobTitle:       payload.role }),
          ...(payload.employmentType && { employmentType: payload.employmentType as EmploymentType }),
          ...(payload.phone      && { phone:          payload.phone }),
          ...(payload.bio        && { bio:            payload.bio }),
          ...(payload.joinDate   && { joinDate:       payload.joinDate }),
        },
        accessToken,
      )
      setEmployees((prev) => prev.map((e) => (e.id === existing.id ? mapEmployee(res.data) : e)))
      if (viewing?.id === existing.id) setViewing(mapEmployee(res.data))
    } else {
      const res = await employeeService.create(
        {
          name:           payload.name,
          email:          payload.email,
          employeeId:     payload.empId,
          ...(payload.role           && { jobTitle:       payload.role }),
          ...(payload.employmentType && { employmentType: payload.employmentType as EmploymentType }),
          ...(payload.phone          && { phone:          payload.phone }),
          ...(payload.bio            && { bio:            payload.bio }),
          ...(payload.joinDate       && { joinDate:       payload.joinDate }),
        },
        accessToken,
      )
      setEmployees((prev) => [mapEmployee(res.data), ...prev])
    }
  }

  // Optimistic remove — API is soft-delete so employee won't reappear on next fetch
  const deleteEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
    if (viewing?.id === id) setViewing(null)
    if (accessToken) {
      employeeService.remove(id, accessToken).catch(console.error)
    }
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 flex-col overflow-hidden p-6">
        {/* Search */}
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-card px-4 py-3 shadow-sm">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ⌘K"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <SlidersHorizontal className="size-5" />
          </button>
        </div>

        {/* Header row */}
        <div className="mb-5 flex items-center justify-between">
          <div />
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Employee
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Loading employees…
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center text-sm text-rose-500">
            {error}
          </div>
        ) : employees.length > 0 ? (
          <div className="grid flex-1 auto-rows-min grid-cols-3 gap-4">
            {employees.map((emp) => (
              <EmployeeCard
                key={emp.id}
                emp={emp}
                onMessage={(e) => { setViewing(null); setMessaging(e) }}
                onViewProfile={(e) => setViewing(e)}
                onEdit={(e) => setEditing(e)}
                onDelete={deleteEmployee}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            No employees found.
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-5 flex items-center justify-end gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  p === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </main>

      {messaging && (
        <EmailModal emp={messaging} onClose={() => setMessaging(null)} />
      )}
      {viewing && (
        <ProfilePanel
          emp={viewing}
          onClose={() => setViewing(null)}
          onMessage={() => { setViewing(null); setMessaging(viewing) }}
        />
      )}
      {editing !== undefined && (
        <EmployeeFormModal
          initial={editing}
          onClose={() => setEditing(undefined)}
          onSave={(payload) => saveEmployee(payload, editing ?? null)}
        />
      )}
    </>
  )
}
