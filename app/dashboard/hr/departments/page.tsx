"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search, SlidersHorizontal, Plus, X, MoreHorizontal,
  Code2, Palette, Megaphone, TrendingUp,
  BarChart2, HeartHandshake, Coins, Package,
  ChevronLeft, ChevronRight, UserPlus, Trash2,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { useAuth } from "@/context/auth-context"
import { ApiError } from "@/lib/api-client"
import { departmentService, type ApiDeptEmployee } from "@/services/departments.service"
import { employeeService, type ApiEmployee } from "@/services/employee.service"

// ── Constants ─────────────────────────────────────────────────
const DEFAULT_PHOTO = "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png"
const CARDS_PER_PAGE = 6

// ── Types ─────────────────────────────────────────────────────
interface Member {
  id:     string         // CUID from dept endpoint, or stringified number from employee endpoint
  name:   string
  role:   string
  email:  string
  photo:  string
  deptId: number | null  // used to filter available vs already-assigned pool employees
}

interface Department {
  id:          number
  name:        string
  description: string
  colorKey:    string
  head:        string
  memberCount: number
}

// ── Color palette ─────────────────────────────────────────────
const colorMap: Record<string, {
  lightCls: string
  iconCls:  string
  icon:     React.ElementType
}> = {
  purple: { lightCls: "bg-purple-50 dark:bg-purple-900/30",   iconCls: "text-purple-500",   icon: Palette        },
  blue:   { lightCls: "bg-blue-50 dark:bg-blue-900/30",       iconCls: "text-blue-500",     icon: Code2          },
  orange: { lightCls: "bg-orange-50 dark:bg-orange-900/30",   iconCls: "text-orange-500",   icon: Megaphone      },
  green:  { lightCls: "bg-emerald-50 dark:bg-emerald-900/30", iconCls: "text-emerald-500",  icon: TrendingUp     },
  indigo: { lightCls: "bg-indigo-50 dark:bg-indigo-900/30",   iconCls: "text-indigo-500",   icon: BarChart2      },
  pink:   { lightCls: "bg-pink-50 dark:bg-pink-900/30",       iconCls: "text-pink-500",     icon: HeartHandshake },
  amber:  { lightCls: "bg-amber-50 dark:bg-amber-900/30",     iconCls: "text-amber-500",    icon: Coins          },
  teal:   { lightCls: "bg-teal-50 dark:bg-teal-900/30",       iconCls: "text-teal-500",     icon: Package        },
}

const COLOR_KEYS = Object.keys(colorMap)

// ── Helpers ────────────────────────────────────────────────────
function getColorKey(id: number): string {
  return COLOR_KEYS[id % COLOR_KEYS.length]
}

function mapDept(a: {
  id: number
  name: string
  description: string | null
  _count?: { employees: number }
}): Department {
  return {
    id:          a.id,
    name:        a.name,
    description: a.description ?? "",
    colorKey:    getColorKey(a.id),
    head:        "—",
    memberCount: a._count?.employees ?? 0,
  }
}

// Maps a dept-endpoint employee (string CUID id, no jobTitle) to Member
function mapDeptEmployee(e: ApiDeptEmployee, deptId: number): Member {
  return {
    id:     e.id,
    name:   e.user.name,
    role:   "",
    email:  e.user.email,
    photo:  e.user.avatarUrl ?? DEFAULT_PHOTO,
    deptId: deptId,
  }
}

// Maps an employee-endpoint record (numeric id, has jobTitle) to Member
function mapPoolEmployee(e: ApiEmployee): Member {
  return {
    id:     String(e.id),
    name:   e.user.name,
    role:   e.jobTitle ?? "",
    email:  e.user.email,
    photo:  e.user.avatarUrl ?? DEFAULT_PHOTO,
    deptId: e.department?.id ?? null,
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
      <button onClick={() => setOpen((o) => !o)} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <button onClick={() => { onEdit(); setOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted">Edit</button>
          <button onClick={() => { onDelete(); setOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20">Delete</button>
        </div>
      )}
    </div>
  )
}

// ── Department card ───────────────────────────────────────────
function DepartmentCard({
  dept, onView, onEdit, onDelete,
}: {
  dept: Department; onView: () => void; onEdit: () => void; onDelete: () => void
}) {
  const { lightCls, iconCls, icon: Icon } = colorMap[dept.colorKey]

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className={cn("flex size-12 items-center justify-center rounded-xl", lightCls)}>
          <Icon className={cn("size-6", iconCls)} />
        </div>
        <DotMenu onEdit={onEdit} onDelete={onDelete} />
      </div>

      <p className="mb-1 text-base font-bold text-foreground">{dept.name}</p>
      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{dept.description}</p>

      <div className="mb-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Head</span>
          <span className="font-semibold text-foreground">{dept.head}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Members</span>
          <span className="font-semibold text-foreground">{dept.memberCount}</span>
        </div>
      </div>

      <button
        onClick={onView}
        className={cn("mt-auto w-full rounded-lg py-2 text-sm font-semibold transition-colors", lightCls, iconCls)}
      >
        View Members
      </button>
    </div>
  )
}

// ── Add Member dropdown ───────────────────────────────────────
function AddMemberDropdown({
  available, onAdd, colorKey, disabled,
}: {
  available: Member[]; onAdd: (m: Member) => void; colorKey: string; disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { lightCls, iconCls } = colorMap[colorKey]

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  if (available.length === 0) return (
    <span className="text-xs text-muted-foreground">All employees assigned</span>
  )

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-50", lightCls, iconCls)}
      >
        <UserPlus className="size-4" /> Add Member
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <p className="border-b border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Select employee
          </p>
          <div className="max-h-56 overflow-y-auto">
            {available.map((m) => (
              <button
                key={m.id}
                onClick={() => { onAdd(m); setOpen(false) }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50"
              >
                <img src={m.photo} alt={m.name} className="size-8 shrink-0 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Members side panel ────────────────────────────────────────
function MembersPanel({ dept, onClose, onMemberCountChange }: {
  dept:                 Department
  onClose:              () => void
  onMemberCountChange:  (deptId: number, newCount: number) => void
}) {
  const { accessToken } = useAuth()
  const { lightCls, iconCls, icon: Icon } = colorMap[dept.colorKey]

  const [members,      setMembers]      = useState<Member[]>([])
  const [pool,         setPool]         = useState<Member[]>([])
  const [loading,      setLoading]      = useState(true)
  const [panelError,   setPanelError]   = useState<string | null>(null)
  const [savingId,     setSavingId]     = useState<string | null>(null)
  const [memberSearch, setMemberSearch] = useState("")

  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    Promise.all([
      departmentService.members(dept.id, { status: "active", limit: 100 }, accessToken),
      employeeService.list({ limit: 100 }, accessToken),
    ])
      .then(([membersRes, empRes]) => {
        setMembers(membersRes.data.map((e) => mapDeptEmployee(e, dept.id)))
        setPool(empRes.data.map(mapPoolEmployee))
      })
      .catch((e: unknown) => setPanelError(e instanceof Error ? e.message : "Failed to load members"))
      .finally(() => setLoading(false))
  }, [accessToken, dept.id])

  // Filter pool by deptId — avoids broken cross-list ID comparison (pool has numeric string ids,
  // dept members have CUID string ids)
  const available = pool.filter((p) => p.deptId !== dept.id)

  const displayed = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearch.toLowerCase()),
  )

  async function handleAdd(m: Member) {
    if (!accessToken) return
    setSavingId(m.id)
    setPanelError(null)
    try {
      await employeeService.update(m.id, { departmentId: dept.id }, accessToken)
      setMembers((prev) => [...prev, { ...m, deptId: dept.id }])
      setPool((prev) => prev.map((p) => p.id === m.id ? { ...p, deptId: dept.id } : p))
      onMemberCountChange(dept.id, members.length + 1)
    } catch (e: unknown) {
      setPanelError(e instanceof Error ? e.message : "Failed to add member")
    } finally {
      setSavingId(null)
    }
  }

  async function handleRemove(empId: string) {
    if (!accessToken) return
    setSavingId(empId)
    setPanelError(null)
    try {
      await employeeService.update(empId, { departmentId: null }, accessToken)
      const removed = members.find((m) => m.id === empId)
      setMembers((prev) => prev.filter((m) => m.id !== empId))
      // Sync pool by email — the only common key between dept-member CUIDs and pool numeric ids
      if (removed) {
        setPool((prev) => prev.map((p) => p.email === removed.email ? { ...p, deptId: null } : p))
      }
      onMemberCountChange(dept.id, members.length - 1)
    } catch (e: unknown) {
      setPanelError(e instanceof Error ? e.message : "Failed to remove member")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-40 flex h-full w-[420px] flex-col bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={cn("flex size-9 items-center justify-center rounded-lg", lightCls)}>
              <Icon className={cn("size-5", iconCls)} />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">{dept.name}</p>
              <p className="text-xs text-muted-foreground">
                {loading ? "Loading…" : `${members.length} member${members.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="mr-3 flex flex-1 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search members…"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <AddMemberDropdown
            available={available}
            onAdd={handleAdd}
            colorKey={dept.colorKey}
            disabled={loading || !!savingId}
          />
        </div>

        {/* Error */}
        {panelError && (
          <div className="mx-4 mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
            {panelError}
          </div>
        )}

        {/* Member list */}
        <div className="flex-1 divide-y divide-border overflow-y-auto">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">Loading…</div>
          ) : displayed.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              {members.length === 0 ? "No members yet. Add someone!" : "No matches found."}
            </div>
          ) : (
            displayed.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-muted/50">
                <img src={m.photo} alt={m.name} className="size-10 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.role || m.email}</p>
                </div>
                <button
                  onClick={() => handleRemove(m.id)}
                  disabled={savingId === m.id}
                  title="Remove from department"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-500 disabled:opacity-40 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                >
                  {savingId === m.id ? (
                    <span className="text-xs">…</span>
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  )
}

// ── Add / Edit Department Modal ───────────────────────────────
function DeptFormModal({
  initial, onClose, onSave,
}: {
  initial?: Department | null
  onClose: () => void
  onSave:  (payload: { name: string; description: string }) => Promise<void>
}) {
  const isEdit = Boolean(initial)
  const [name,        setName]        = useState(initial?.name        ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [saving,      setSaving]      = useState(false)
  const [saveErr,     setSaveErr]     = useState<string | null>(null)

  const inputCls = "w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-transparent"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaveErr(null)
    try {
      await onSave({ name, description })
      onClose()
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 409) {
        setSaveErr("A department with this name already exists.")
      } else {
        setSaveErr(err instanceof Error ? err.message : "Failed to save")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">{isEdit ? "Edit Department" : "New Department"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Department Name *</label>
            <input
              className={inputCls}
              placeholder="e.g. Product"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Description</label>
            <textarea
              className={cn(inputCls, "h-20 resize-none")}
              placeholder="What does this department do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
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
export default function DepartmentsPage() {
  const { accessToken } = useAuth()

  const [departments,  setDepartments]  = useState<Department[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [deleteError,  setDeleteError]  = useState<string | null>(null)
  const [search,       setSearch]       = useState("")
  const [page,         setPage]         = useState(1)
  const [viewing,      setViewing]      = useState<Department | null>(null)
  const [editing,      setEditing]      = useState<Department | null | undefined>(undefined)

  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    departmentService
      .list(accessToken)
      .then((res) => setDepartments(res.data.map(mapDept)))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load departments"))
      .finally(() => setLoading(false))
  }, [accessToken])

  const filtered   = departments.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE))
  const paginated  = filtered.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE)

  async function saveDept(payload: { name: string; description: string }, existing: Department | null) {
    if (!accessToken) throw new Error("Not authenticated")
    if (existing) {
      const res = await departmentService.update(existing.id, payload, accessToken)
      const updated = mapDept({ ...res.data, _count: { employees: existing.memberCount } })
      setDepartments((prev) => prev.map((d) => (d.id === existing.id ? updated : d)))
    } else {
      const res = await departmentService.create(
        { name: payload.name, description: payload.description || undefined },
        accessToken,
      )
      setDepartments((prev) => [...prev, mapDept(res.data)])
    }
  }

  async function deleteDept(id: number) {
    if (!accessToken) return
    setDeleteError(null)
    try {
      await departmentService.remove(id, accessToken)
      setDepartments((prev) => prev.filter((d) => d.id !== id))
      if (viewing?.id === id) setViewing(null)
    } catch (e: unknown) {
      if (e instanceof ApiError && e.status === 400) {
        setDeleteError(e.message)
      } else {
        setDeleteError(e instanceof Error ? e.message : "Failed to delete department")
      }
    }
  }

  function handleMemberCountChange(deptId: number, newCount: number) {
    setDepartments((prev) => prev.map((d) => (d.id === deptId ? { ...d, memberCount: newCount } : d)))
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 flex-col overflow-hidden p-6">
        {/* Search */}
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ⌘K"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
          />
          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <SlidersHorizontal className="size-5" />
          </button>
        </div>

        {/* Delete error banner */}
        {deleteError && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
            <span>{deleteError}</span>
            <button onClick={() => setDeleteError(null)} className="ml-4 shrink-0 rounded p-0.5 hover:bg-rose-100 dark:hover:bg-rose-900/30">
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div />
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Department
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Loading departments…
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center text-sm text-rose-500">
            {error}
          </div>
        ) : paginated.length > 0 ? (
          <div className="grid flex-1 auto-rows-min grid-cols-3 gap-4">
            {paginated.map((dept) => (
              <DepartmentCard
                key={dept.id}
                dept={dept}
                onView={() => setViewing(dept)}
                onEdit={() => setEditing(dept)}
                onDelete={() => deleteDept(dept.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="size-7 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">No departments found</p>
              <p className="text-xs text-muted-foreground">Try a different search or create a new department.</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-5 flex items-center justify-end gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex size-8 items-center justify-center rounded-full text-foreground hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  p === page ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex size-8 items-center justify-center rounded-full text-foreground hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </main>

      {viewing && (
        <MembersPanel
          dept={viewing}
          onClose={() => setViewing(null)}
          onMemberCountChange={handleMemberCountChange}
        />
      )}

      {editing !== undefined && (
        <DeptFormModal
          initial={editing}
          onClose={() => setEditing(undefined)}
          onSave={(payload) => saveDept(payload, editing ?? null)}
        />
      )}
    </>
  )
}
