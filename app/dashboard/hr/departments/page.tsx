"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Search, SlidersHorizontal, Plus, X, MoreHorizontal,
  Users, Code2, Palette, Megaphone, TrendingUp,
  BarChart2, HeartHandshake, Coins, Package,
  ChevronLeft, ChevronRight, UserPlus, Trash2,
  Building2,
} from "lucide-react"
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
interface Member {
  id:    number
  name:  string
  role:  string
  email: string
  photo: string
}

interface Department {
  id:          number
  name:        string
  description: string
  colorKey:    string
  head:        string
  members:     Member[]
}

// ── Color palette ─────────────────────────────────────────────
const colorMap: Record<string, { bg: string; text: string; light: string; icon: React.ElementType }> = {
  purple:  { bg: "#8b5cf6", text: "#8b5cf6", light: "#f5f3ff", icon: Palette        },
  blue:    { bg: "#3b82f6", text: "#3b82f6", light: "#eff6ff", icon: Code2          },
  orange:  { bg: "#f97316", text: "#f97316", light: "#fff7ed", icon: Megaphone      },
  green:   { bg: "#10b981", text: "#10b981", light: "#ecfdf5", icon: TrendingUp     },
  indigo:  { bg: "#6366f1", text: "#6366f1", light: "#eef2ff", icon: BarChart2      },
  pink:    { bg: "#ec4899", text: "#ec4899", light: "#fdf2f8", icon: HeartHandshake },
  amber:   { bg: "#f59e0b", text: "#f59e0b", light: "#fffbeb", icon: Coins          },
  teal:    { bg: "#14b8a6", text: "#14b8a6", light: "#f0fdfa", icon: Package        },
}

const COLOR_KEYS = Object.keys(colorMap)

// ── All employees pool (for adding to departments) ────────────
const allEmployees: Member[] = [
  { id: 1, name: "Michael Chen",     role: "Senior Product Designer",  email: "michael.chen@corecruiter.com",     photo: photos["Michael Chen"]     },
  { id: 2, name: "Sarah Williams",   role: "Marketing Manager",         email: "sarah.williams@corecruiter.com",   photo: photos["Sarah Williams"]   },
  { id: 3, name: "David Rodriguez",  role: "Full Stack Developer",      email: "david.rodriguez@corecruiter.com",  photo: photos["David Rodriguez"]  },
  { id: 4, name: "James Anderson",   role: "Sales Director",            email: "james.anderson@corecruiter.com",   photo: photos["James Anderson"]   },
  { id: 5, name: "Jessica Martinez", role: "UX Researcher",             email: "jessica.martinez@corecruiter.com", photo: photos["Jessica Martinez"] },
  { id: 6, name: "Robert Taylor",    role: "DevOps Engineer",           email: "robert.taylor@corecruiter.com",    photo: photos["Robert Taylor"]    },
  { id: 7, name: "Priya Patel",      role: "Data Analyst",              email: "priya.patel@corecruiter.com",      photo: photos["Priya Patel"]      },
  { id: 8, name: "Lena Schmidt",     role: "HR Specialist",             email: "lena.schmidt@corecruiter.com",     photo: photos["Lena Schmidt"]     },
  { id: 9, name: "Omar Hassan",      role: "Backend Engineer",          email: "omar.hassan@corecruiter.com",      photo: photos["Omar Hassan"]      },
]

// ── Seed departments ──────────────────────────────────────────
const seed: Department[] = [
  {
    id: 1, name: "Design",      colorKey: "purple", description: "Product design, UX research, and brand identity.",
    head: "Michael Chen",
    members: [
      allEmployees.find((e) => e.name === "Michael Chen")!,
      allEmployees.find((e) => e.name === "Jessica Martinez")!,
    ],
  },
  {
    id: 2, name: "Engineering", colorKey: "blue",   description: "Full-stack, backend, and DevOps engineering.",
    head: "David Rodriguez",
    members: [
      allEmployees.find((e) => e.name === "David Rodriguez")!,
      allEmployees.find((e) => e.name === "Robert Taylor")!,
      allEmployees.find((e) => e.name === "Omar Hassan")!,
    ],
  },
  {
    id: 3, name: "Marketing",   colorKey: "orange", description: "Growth, content, campaigns, and brand awareness.",
    head: "Sarah Williams",
    members: [allEmployees.find((e) => e.name === "Sarah Williams")!],
  },
  {
    id: 4, name: "Sales",       colorKey: "green",  description: "Enterprise sales, partnerships, and revenue growth.",
    head: "James Anderson",
    members: [allEmployees.find((e) => e.name === "James Anderson")!],
  },
  {
    id: 5, name: "Analytics",   colorKey: "indigo", description: "Business intelligence, data pipelines, and reporting.",
    head: "Priya Patel",
    members: [allEmployees.find((e) => e.name === "Priya Patel")!],
  },
  {
    id: 6, name: "HR",          colorKey: "pink",   description: "Talent acquisition, culture, and employee experience.",
    head: "Lena Schmidt",
    members: [allEmployees.find((e) => e.name === "Lena Schmidt")!],
  },
]

const CARDS_PER_PAGE = 6

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
      <button onClick={() => setOpen((o) => !o)} className="rounded-md p-1 text-[#8181a5] hover:bg-muted">
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
          <button onClick={() => { onEdit(); setOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-muted">Edit</button>
          <button onClick={() => { onDelete(); setOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-rose-50">Delete</button>
        </div>
      )}
    </div>
  )
}

// ── Department card ───────────────────────────────────────────
function DepartmentCard({
  dept,
  onView,
  onEdit,
  onDelete,
}: {
  dept:     Department
  onView:   () => void
  onEdit:   () => void
  onDelete: () => void
}) {
  const { bg, light, icon: Icon } = colorMap[dept.colorKey]

  return (
    <div className="flex flex-col rounded-xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Top row */}
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex size-12 items-center justify-center rounded-xl"
          style={{ background: light }}
        >
          <Icon className="size-6" style={{ color: bg }} />
        </div>
        <DotMenu onEdit={onEdit} onDelete={onDelete} />
      </div>

      {/* Name + description */}
      <p className="mb-1 text-base font-bold text-[#1f2937]">{dept.name}</p>
      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#667388]">{dept.description}</p>

      {/* Meta */}
      <div className="mb-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#8181a5]">Head</span>
          <span className="font-semibold text-[#1f2937]">{dept.head}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#8181a5]">Members</span>
          <span className="font-semibold text-[#1f2937]">{dept.members.length}</span>
        </div>
      </div>

      {/* Stacked avatars */}
      <div className="mb-4 flex items-center">
        <div className="flex -space-x-2">
          {dept.members.slice(0, 4).map((m) => (
            <img
              key={m.id}
              src={m.photo}
              alt={m.name}
              title={m.name}
              className="size-7 rounded-full object-cover ring-2 ring-white"
            />
          ))}
          {dept.members.length > 4 && (
            <div className="flex size-7 items-center justify-center rounded-full bg-[#f0f0ff] text-[10px] font-semibold text-[#8a8cd9] ring-2 ring-white">
              +{dept.members.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* View Members button */}
      <button
        onClick={onView}
        className="mt-auto w-full rounded-lg py-2 text-sm font-semibold transition-colors"
        style={{ background: light, color: bg }}
      >
        View Members
      </button>
    </div>
  )
}

// ── Add Member dropdown ───────────────────────────────────────
function AddMemberDropdown({
  available,
  onAdd,
  colorKey,
}: {
  available: Member[]
  onAdd:     (m: Member) => void
  colorKey:  string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { bg, light } = colorMap[colorKey]

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  if (available.length === 0) return (
    <span className="text-xs text-[#8181a5]">All employees are in this department</span>
  )

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors"
        style={{ background: light, color: bg }}
      >
        <UserPlus className="size-4" /> Add Member
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-xl border border-border bg-white shadow-xl">
          <p className="border-b border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#8181a5]">
            Select employee
          </p>
          <div className="max-h-56 overflow-y-auto">
            {available.map((m) => (
              <button
                key={m.id}
                onClick={() => { onAdd(m); setOpen(false) }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[#f8fafc]"
              >
                <img src={m.photo} alt={m.name} className="size-8 shrink-0 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#1f2937]">{m.name}</p>
                  <p className="truncate text-xs text-[#8181a5]">{m.role}</p>
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
function MembersPanel({
  dept,
  onClose,
  onAddMember,
  onRemoveMember,
}: {
  dept:           Department
  onClose:        () => void
  onAddMember:    (deptId: number, m: Member) => void
  onRemoveMember: (deptId: number, memberId: number) => void
}) {
  const { bg, light, icon: Icon } = colorMap[dept.colorKey]
  const [memberSearch, setMemberSearch] = useState("")

  const memberIds  = new Set(dept.members.map((m) => m.id))
  const available  = allEmployees.filter((e) => !memberIds.has(e.id))
  const displayed  = dept.members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearch.toLowerCase())
  )

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-40 flex h-full w-[420px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg" style={{ background: light }}>
              <Icon className="size-5" style={{ color: bg }} />
            </div>
            <div>
              <p className="text-base font-bold text-[#1f2937]">{dept.name}</p>
              <p className="text-xs text-[#8181a5]">{dept.members.length} member{dept.members.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-[#f8fafc] px-3 py-1.5 mr-3">
            <Search className="size-3.5 text-[#8181a5]" />
            <input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search members…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#8181a5]"
            />
          </div>
          <AddMemberDropdown
            available={available}
            onAdd={(m) => onAddMember(dept.id, m)}
            colorKey={dept.colorKey}
          />
        </div>

        {/* Member list */}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {displayed.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-[#8181a5]">
              {dept.members.length === 0 ? "No members yet. Add someone!" : "No matches found."}
            </div>
          ) : (
            displayed.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-[#f8fafc]">
                <img src={m.photo} alt={m.name} className="size-10 shrink-0 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1f2937]">{m.name}</p>
                  <p className="truncate text-xs text-[#667388]">{m.role}</p>
                  {m.name === dept.head && (
                    <span
                      className="mt-0.5 inline-block rounded-full px-2 py-px text-[10px] font-bold"
                      style={{ background: light, color: bg }}
                    >
                      Head
                    </span>
                  )}
                </div>
                {m.name !== dept.head && (
                  <button
                    onClick={() => onRemoveMember(dept.id, m.id)}
                    title="Remove from department"
                    className="rounded-lg p-1.5 text-[#8181a5] transition-colors hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
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
  initial,
  onClose,
  onSave,
}: {
  initial?: Department | null
  onClose:  () => void
  onSave:   (d: Department) => void
}) {
  const isEdit = Boolean(initial)
  const [name,        setName]        = useState(initial?.name        ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [head,        setHead]        = useState(initial?.head        ?? allEmployees[0].name)
  const [colorKey,    setColorKey]    = useState(initial?.colorKey    ?? "blue")

  const inputCls = "w-full rounded-lg border border-[#e0e6ed] bg-white px-3 py-2.5 text-sm text-[#1f2937] outline-none focus:border-[#5e81f4] focus:ring-2 focus:ring-[#5e81f4]/20"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id:      initial?.id      ?? Date.now(),
      members: initial?.members ?? [],
      name, description, head, colorKey,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1f2937]">{isEdit ? "Edit Department" : "New Department"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted"><X className="size-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Department Name *</label>
            <input className={inputCls} placeholder="e.g. Product" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Description</label>
            <textarea
              className={`${inputCls} h-20 resize-none`}
              placeholder="What does this department do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Department Head */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Department Head</label>
            <select className={inputCls} value={head} onChange={(e) => setHead(e.target.value)}>
              {allEmployees.map((e) => (
                <option key={e.id} value={e.name}>{e.name} — {e.role}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="mb-2 block text-xs font-medium text-[#374151]">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_KEYS.map((key) => {
                const { bg, icon: Icon } = colorMap[key]
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setColorKey(key)}
                    title={key}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg transition-all",
                      colorKey === key ? "ring-2 ring-offset-1 ring-[#5e81f4]" : "opacity-60 hover:opacity-100"
                    )}
                    style={{ background: colorMap[key].light }}
                  >
                    <Icon className="size-5" style={{ color: bg }} />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#e0e6ed] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-muted">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-[#5e81f4] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4a6ee0]">
              {isEdit ? "Save Changes" : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Employees",   href: "/dashboard/hr/employees",   active: false },
  { label: "Departments", href: "/dashboard/hr/departments", active: true  },
  { label: "Leave",       href: "/dashboard/hr/leave",         active: false },
  { label: "Payroll",     href: "/dashboard/hr/payroll",      active: false },
  { label: "History",     href: "#",                          active: false },
]

// ── Main Page ─────────────────────────────────────────────────
export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(seed)
  const [search,      setSearch]      = useState("")
  const [page,        setPage]        = useState(1)
  const [viewing,     setViewing]     = useState<Department | null>(null)
  const [editing,     setEditing]     = useState<Department | null | undefined>(undefined)

  const filtered    = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.head.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages  = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE))
  const paginated   = filtered.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE)

  const saveDept = (d: Department) => {
    setDepartments((prev) => {
      const exists = prev.find((x) => x.id === d.id)
      return exists ? prev.map((x) => (x.id === d.id ? d : x)) : [d, ...prev]
    })
    // keep viewing panel in sync
    setViewing((v) => (v?.id === d.id ? d : v))
    setPage(1)
  }

  const deleteDept = (id: number) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id))
    if (viewing?.id === id) setViewing(null)
  }

  const addMember = (deptId: number, member: Member) => {
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === deptId ? { ...d, members: [...d.members, member] } : d
      )
    )
    setViewing((v) =>
      v?.id === deptId ? { ...v, members: [...v.members, member] } : v
    )
  }

  const removeMember = (deptId: number, memberId: number) => {
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === deptId ? { ...d, members: d.members.filter((m) => m.id !== memberId) } : d
      )
    )
    setViewing((v) =>
      v?.id === deptId ? { ...v, members: v.members.filter((m) => m.id !== memberId) } : v
    )
  }

  // Stats row
  const totalMembers = departments.reduce((acc, d) => acc + d.members.length, 0)

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-[#1c1c1c]">
      <HRIconSidebar />

      {/* ── Text sidebar ── */}
      <aside className="flex w-[280px] shrink-0 flex-col justify-between bg-white py-5 pl-5 pr-3 shadow-sm">
        <nav className="flex flex-col gap-1">
          {sidebarNav.map(({ label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "block w-full rounded px-3 py-2.5 text-left text-base font-medium transition-colors hover:bg-muted",
                active ? "font-semibold text-primary" : "text-[#324054]"
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
      <main className="flex flex-1 flex-col overflow-hidden p-6">
        {/* Search */}
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

        {/* Header + stats */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-lg font-semibold text-[#1f2937]">Departments</h1>
              <p className="text-sm text-[#667388]">
                {departments.length} departments · {totalMembers} total employees
              </p>
            </div>
            {/* Quick stat pills */}
            <div className="hidden items-center gap-2 lg:flex">
              {departments.slice(0, 3).map((d) => {
                const { bg, light } = colorMap[d.colorKey]
                return (
                  <span key={d.id} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ background: light, color: bg }}>
                    <Users className="size-3" /> {d.name} ({d.members.length})
                  </span>
                )
              })}
            </div>
          </div>
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-2 rounded-xl bg-[#5e81f4] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#4a6ee0]"
          >
            <Plus className="size-4" /> Add Department
          </button>
        </div>

        {/* Department cards */}
        {paginated.length > 0 ? (
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
              <div className="flex size-14 items-center justify-center rounded-full bg-[#f0f0ff]">
                <Building2 className="size-7 text-[#8a8cd9]" />
              </div>
              <p className="text-sm font-medium text-[#1f2937]">No departments found</p>
              <p className="text-xs text-[#8181a5]">Try a different search or create a new department.</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-end gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex size-8 items-center justify-center rounded-full text-[#4b5563] hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  p === page ? "bg-[#3b6feb] text-white" : "text-[#4b5563] hover:bg-muted"
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex size-8 items-center justify-center rounded-full text-[#4b5563] hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </main>

      {/* Members panel */}
      {viewing && (
        <MembersPanel
          dept={viewing}
          onClose={() => setViewing(null)}
          onAddMember={addMember}
          onRemoveMember={removeMember}
        />
      )}

      {/* Add / Edit modal */}
      {editing !== undefined && (
        <DeptFormModal
          initial={editing}
          onClose={() => setEditing(undefined)}
          onSave={saveDept}
        />
      )}
    </div>
  )
}
