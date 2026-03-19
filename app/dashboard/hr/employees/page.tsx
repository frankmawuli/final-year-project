"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Search, SlidersHorizontal, Plus, X, MoreHorizontal,
  Phone, MessageSquare, User, Mail, MapPin, Building2,
  Calendar, IdCard, Download, FileText, ChevronLeft, ChevronRight,
} from "lucide-react"
import { HRIconSidebar } from "@/components/hr-icon-sidebar"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"

// ── Assets ────────────────────────────────────────────────────
const adminPhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

const photos = {
  a: "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png",
  b: "/assets/c8f5ae43e33ebde623eb7d3b22aeb6930878a4ce.png",
  c: "/assets/cf9965b714128bf9b66e7daf6ad58bf5300b9eea.png",
  d: "/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png",
  e: "/assets/ba50d841bff1eb820c0b59f56f778fbbf8b8a8c3.png",
  f: "/assets/3b57a33d98b5a1b80a335988932aa248a0875725.png",
  g: "/assets/635a3bf857069957b4442100197a1e910ea3121d.png",
  h: "/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png",
  i: "/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png",
}

// ── Types ─────────────────────────────────────────────────────
interface Employee {
  id:         number
  empId:      string
  name:       string
  photo:      string
  role:       string
  department: string
  email:      string
  phone:      string
  location:   string
  joinDate:   string
  bio:        string
  skills:     string[]
}

// ── Seed data ─────────────────────────────────────────────────
const seed: Employee[] = [
  { id: 1,  empId: "EMP-2341", name: "Michael Chen",     photo: photos.a, role: "Senior Product Designer",  department: "Design",       email: "michael.chen@corecruiter.com",     phone: "+1 (555) 234-5678", location: "Tokyo, Japan",         joinDate: "Jan 15, 2022", bio: "Award-winning product designer with a passion for user-centred experiences and design systems.", skills: ["Figma", "Prototyping", "UX Research", "Illustrator"] },
  { id: 2,  empId: "EMP-2156", name: "Sarah Williams",   photo: photos.b, role: "Marketing Manager",         department: "Marketing",    email: "sarah.williams@corecruiter.com",   phone: "+1 (555) 876-2341", location: "New York, USA",        joinDate: "Mar 22, 2021", bio: "Data-driven marketing leader specialising in growth campaigns and brand positioning.",          skills: ["SEO", "Content Strategy", "Google Ads", "HubSpot"]    },
  { id: 3,  empId: "EMP-2487", name: "David Rodriguez",  photo: photos.c, role: "Full Stack Developer",      department: "Engineering",  email: "david.rodriguez@corecruiter.com",  phone: "+34 612 345 678",   location: "Madrid, Spain",        joinDate: "Jun 08, 2023", bio: "Versatile developer comfortable across the entire stack, from React frontends to Node.js APIs.", skills: ["React", "Node.js", "PostgreSQL", "TypeScript"]         },
  { id: 4,  empId: "EMP-1745", name: "James Anderson",   photo: photos.d, role: "Sales Director",            department: "Sales",        email: "james.anderson@corecruiter.com",   phone: "+1 (555) 654-9870", location: "Chicago, USA",         joinDate: "Feb 28, 2019", bio: "Results-oriented sales leader who has consistently exceeded quota and built high-performing teams.", skills: ["Salesforce", "Negotiation", "Pipeline Management"]    },
  { id: 5,  empId: "EMP-2298", name: "Jessica Martinez", photo: photos.e, role: "UX Researcher",             department: "Design",       email: "jessica.martinez@corecruiter.com", phone: "+52 55 1234 5678",  location: "Mexico City, Mexico",  joinDate: "Nov 05, 2022", bio: "Mixed-methods researcher who turns ambiguous problems into clear, actionable insights.",           skills: ["User Interviews", "Usability Testing", "Miro", "Dovetail"] },
  { id: 6,  empId: "EMP-2512", name: "Robert Taylor",    photo: photos.f, role: "DevOps Engineer",           department: "Engineering",  email: "robert.taylor@corecruiter.com",    phone: "+44 7911 223344",   location: "London, UK",           joinDate: "Apr 17, 2023", bio: "Cloud infrastructure specialist focused on reliability, automation, and reducing toil for dev teams.", skills: ["Kubernetes", "Terraform", "AWS", "CI/CD"]             },
  { id: 7,  empId: "EMP-1932", name: "Priya Patel",      photo: photos.g, role: "Data Analyst",              department: "Analytics",    email: "priya.patel@corecruiter.com",      phone: "+91 98765 43210",   location: "Bangalore, India",     joinDate: "Sep 12, 2020", bio: "Analytical thinker who excels at turning raw data into meaningful business intelligence reports.",   skills: ["Python", "SQL", "Tableau", "Power BI"]                },
  { id: 8,  empId: "EMP-2067", name: "Lena Schmidt",     photo: photos.h, role: "HR Specialist",             department: "HR",           email: "lena.schmidt@corecruiter.com",     phone: "+49 30 98765432",   location: "Berlin, Germany",      joinDate: "Jul 19, 2021", bio: "Empathetic HR professional focused on building inclusive cultures and improving employee satisfaction.", skills: ["Talent Acquisition", "HRIS", "Performance Reviews"]   },
  { id: 9,  empId: "EMP-2390", name: "Omar Hassan",      photo: photos.i, role: "Backend Engineer",          department: "Engineering",  email: "omar.hassan@corecruiter.com",      phone: "+971 50 123 4567",  location: "Dubai, UAE",           joinDate: "Jan 03, 2023", bio: "Backend engineer with experience in high-throughput event-driven systems and real-time applications.", skills: ["Node.js", "Kafka", "Redis", "PostgreSQL"]             },
]

const DEPARTMENTS = ["Design", "Engineering", "Marketing", "Sales", "Analytics", "HR", "Finance", "Product"]
const CARDS_PER_PAGE = 6

// ── Helpers ────────────────────────────────────────────────────
function generateEmpId() {
  return `EMP-${Math.floor(2500 + Math.random() * 500)}`
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
        className="rounded-md p-1 text-[#8181a5] hover:bg-muted"
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
          <button onClick={() => { onEdit(); setOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-[#374151] hover:bg-muted">
            Edit
          </button>
          <button onClick={() => { onDelete(); setOpen(false) }} className="block w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-rose-50">
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
    <div className="flex flex-col rounded-xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Top row */}
      <div className="mb-3 flex items-start justify-between">
        <div className="w-5" />
        <img
          src={emp.photo}
          alt={emp.name}
          className="size-[72px] rounded-full object-cover ring-2 ring-border"
        />
        <DotMenu onEdit={() => onEdit(emp)} onDelete={() => onDelete(emp.id)} />
      </div>

      {/* Name + role */}
      <div className="mb-4 text-center">
        <p className="text-base font-bold text-[#1f2937]">{emp.name}</p>
        <p className="text-sm text-[#667388]">{emp.role}</p>
      </div>

      {/* Meta rows */}
      <div className="mb-4 space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#8181a5]">Employee ID</span>
          <span className="font-semibold text-[#1f2937]">{emp.empId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#8181a5]">Join Date</span>
          <span className="font-semibold text-[#1f2937]">{emp.joinDate}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2">
        <a
          href={`tel:${emp.phone}`}
          title={`Call ${emp.name}`}
          className="flex items-center justify-center rounded-lg bg-emerald-50 py-2 text-emerald-500 transition-colors hover:bg-emerald-100"
        >
          <Phone className="size-4" />
        </a>
        <button
          onClick={() => onMessage(emp)}
          title="Send message via email"
          className="flex items-center justify-center rounded-lg bg-violet-50 py-2 text-violet-500 transition-colors hover:bg-violet-100"
        >
          <MessageSquare className="size-4" />
        </button>
        <button
          onClick={() => onViewProfile(emp)}
          title="View profile"
          className="flex items-center justify-center rounded-lg bg-blue-50 py-2 text-blue-500 transition-colors hover:bg-blue-100"
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
    // Open native email client as fallback; show confirmation
    window.open(`mailto:${emp.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    setSent(true)
    setTimeout(onClose, 1800)
  }

  const fieldCls = "w-full rounded-lg border border-[#e0e6ed] bg-white px-3 py-2.5 text-sm text-[#1f2937] outline-none focus:border-[#5e81f4] focus:ring-2 focus:ring-[#5e81f4]/20"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-50">
              <Mail className="size-4 text-violet-500" />
            </div>
            <h2 className="text-base font-semibold text-[#1f2937]">Send Message</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50">
              <Mail className="size-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-[#1f2937]">Message sent to {emp.name}!</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            {/* To (readonly) */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[#374151]">To</label>
              <div className="flex items-center gap-2.5 rounded-lg border border-[#e0e6ed] bg-[#f8fafc] px-3 py-2.5">
                <img src={emp.photo} alt={emp.name} className="size-6 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-[#1f2937]">{emp.name}</p>
                  <p className="text-xs text-[#8181a5]">{emp.email}</p>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[#374151]">Subject</label>
              <input
                className={fieldCls}
                placeholder="e.g. Team Update — Q2 Goals"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            {/* Body */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[#374151]">Message</label>
              <textarea
                className={`${fieldCls} h-32 resize-none`}
                placeholder="Write your message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={onClose} className="rounded-lg border border-[#e0e6ed] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-muted">
                Cancel
              </button>
              <button type="submit" className="flex items-center gap-2 rounded-lg bg-[#5e81f4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a6ee0]">
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
  onClose: () => void
  onSave:  (emp: Employee) => void
}) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState({
    name:       initial?.name       ?? "",
    role:       initial?.role       ?? "",
    department: initial?.department ?? DEPARTMENTS[0],
    email:      initial?.email      ?? "",
    phone:      initial?.phone      ?? "",
    location:   initial?.location   ?? "",
    joinDate:   initial?.joinDate   ?? new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    bio:        initial?.bio        ?? "",
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id:         initial?.id       ?? Date.now(),
      empId:      initial?.empId    ?? generateEmpId(),
      photo:      initial?.photo    ?? photos.a,
      skills:     initial?.skills   ?? [],
      ...form,
    })
    onClose()
  }

  const inputCls = "w-full rounded-lg border border-[#e0e6ed] bg-white px-3 py-2.5 text-sm text-[#1f2937] outline-none focus:border-[#5e81f4] focus:ring-2 focus:ring-[#5e81f4]/20"
  const labelCls = "mb-1 block text-xs font-medium text-[#374151]"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1f2937]">{isEdit ? "Edit Employee" : "Add New Employee"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} placeholder="e.g. Jane Doe" value={form.name} onChange={set("name")} required />
            </div>
            <div>
              <label className={labelCls}>Job Title *</label>
              <input className={inputCls} placeholder="e.g. Product Designer" value={form.role} onChange={set("role")} required />
            </div>
            <div>
              <label className={labelCls}>Department</label>
              <select className={inputCls} value={form.department} onChange={set("department")}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input className={inputCls} type="email" placeholder="jane@company.com" value={form.email} onChange={set("email")} required />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input className={inputCls} placeholder="City, Country" value={form.location} onChange={set("location")} />
            </div>
            <div>
              <label className={labelCls}>Join Date</label>
              <input className={inputCls} placeholder="Jan 01, 2024" value={form.joinDate} onChange={set("joinDate")} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Bio</label>
              <textarea className={`${inputCls} h-20 resize-none`} placeholder="Brief description..." value={form.bio} onChange={set("bio")} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#e0e6ed] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-muted">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-[#5e81f4] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4a6ee0]">
              {isEdit ? "Save Changes" : "Add Employee"}
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
      <aside className="fixed right-0 top-0 z-40 flex h-full w-[400px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-[#1f2937]">Employee Profile</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Hero */}
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-[#f8fafc] py-6">
            <img src={emp.photo} alt={emp.name} className="size-20 rounded-full object-cover ring-2 ring-white shadow" />
            <div className="text-center">
              <p className="text-lg font-bold text-[#1f2937]">{emp.name}</p>
              <p className="text-sm font-medium text-[#5e81f4]">{emp.role}</p>
              <span className="mt-1 inline-block rounded-full bg-[#f0f0ff] px-2.5 py-0.5 text-xs text-[#8a8cd9]">
                {emp.department}
              </span>
            </div>
          </div>

          {/* Contact & meta */}
          <div className="space-y-2.5 text-sm">
            {[
              { icon: IdCard,    label: "Employee ID", value: emp.empId    },
              { icon: Calendar,  label: "Joined",      value: emp.joinDate },
              { icon: Mail,      label: "Email",       value: emp.email    },
              { icon: Phone,     label: "Phone",       value: emp.phone    },
              { icon: MapPin,    label: "Location",    value: emp.location },
              { icon: Building2, label: "Department",  value: emp.department },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#f0f0ff]">
                  <Icon className="size-3.5 text-[#8a8cd9]" />
                </div>
                <span className="w-24 shrink-0 text-[#8181a5]">{label}</span>
                <span className="truncate font-medium text-[#1f2937]">{value}</span>
              </div>
            ))}
          </div>

          {/* Bio */}
          {emp.bio && (
            <div>
              <p className="mb-2 text-sm font-semibold text-[#1f2937]">About</p>
              <p className="text-sm leading-relaxed text-[#667388]">{emp.bio}</p>
            </div>
          )}

          {/* Skills */}
          {emp.skills.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-[#1f2937]">Skills</p>
              <div className="flex flex-wrap gap-2">
                {emp.skills.map((s) => (
                  <span key={s} className="rounded-full bg-[#f0f0ff] px-2.5 py-0.5 text-xs font-medium text-[#8a8cd9]">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onMessage}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#5e81f4] py-2.5 text-sm font-semibold text-white hover:bg-[#4a6ee0]"
            >
              <Mail className="size-4" /> Send Message
            </button>
            <a
              href={`tel:${emp.phone}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-100"
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
  { label: "Leave",       href: "/dashboard/hr/leave",        active: false },
  { label: "Payroll",     href: "/dashboard/hr/payroll",     active: false },
  { label: "History",     href: "#",                         active: false },
]

// ── Main Page ─────────────────────────────────────────────────
export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(seed)
  const [search,    setSearch]    = useState("")
  const [page,      setPage]      = useState(1)
  const [messaging, setMessaging] = useState<Employee | null>(null)
  const [viewing,   setViewing]   = useState<Employee | null>(null)
  const [editing,   setEditing]   = useState<Employee | null | undefined>(undefined) // undefined = closed, null = add new

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.empId.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE))
  const paginated  = filtered.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE)

  const saveEmployee = (emp: Employee) => {
    setEmployees((prev) => {
      const exists = prev.find((e) => e.id === emp.id)
      return exists ? prev.map((e) => (e.id === emp.id ? emp : e)) : [emp, ...prev]
    })
    setPage(1)
  }

  const deleteEmployee = (id: number) =>
    setEmployees((prev) => prev.filter((e) => e.id !== id))

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-[#1c1c1c]">
      <HRIconSidebar />

      {/* ── Text sidebar ── */}
     <HrNavigationPannel navItems={sidebarNav}/>

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

        {/* Header row */}
        <div className="mb-5 flex items-center justify-between">
          <div>

          </div>
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-2 rounded-xl bg-[#5e81f4] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#4a6ee0]"
          >
            <Plus className="size-4" /> Add Employee
          </button>
        </div>

        {/* Card grid */}
        {paginated.length > 0 ? (
          <div className="grid flex-1 auto-rows-min grid-cols-3 gap-4">
            {paginated.map((emp) => (
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
          <div className="flex flex-1 items-center justify-center text-sm text-[#8181a5]">
            No employees match your search.
          </div>
        )}

        {/* Pagination */}
        <div className="mt-5 flex items-center justify-end gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex size-8 items-center justify-center rounded-full text-[#4b5563] transition-colors hover:bg-muted disabled:opacity-40"
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
            className="flex size-8 items-center justify-center rounded-full text-[#4b5563] transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </main>

      {/* Modals & panels */}
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
          onSave={saveEmployee}
        />
      )}
    </div>
  )
}
