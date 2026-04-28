"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight,
  X, FileBarChart2, TrendingUp, AlertCircle, Target, MessageSquare,
  Clock, CheckCircle2, XCircle, FileText, CalendarDays, Building2,
  Eye,
} from "lucide-react"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { cn } from "@/lib/utils"

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "All Reports",  href: "/dashboard/hr/reports"    },
  { label: "Performance",  href: "#"                        },
  { label: "Incidents",    href: "#"                        },
  { label: "Complaints",   href: "/dashboard/hr/reports/complaints" },
]

// ── Types ─────────────────────────────────────────────────────
type ReportType   = "Performance" | "Work Summary" | "Incident" | "Goal Update" | "Complaint"
type ReportStatus = "Submitted" | "Under Review" | "Resolved" | "Closed"

interface EmployeeReport {
  id:          number
  name:        string
  photo:       string
  email:       string
  department:  string
  reportType:  ReportType
  title:       string
  period:      string
  submittedOn: string
  status:      ReportStatus
  summary:     string
  score?:      number
}

// ── Style maps ────────────────────────────────────────────────
const typeBadge: Record<ReportType, string> = {
  "Performance":  "bg-[#eef2ff] text-[#5e81f4]",
  "Work Summary": "bg-[#f0fdf4] text-[#16a34a]",
  "Incident":     "bg-[#fef2f2] text-[#dc2626]",
  "Goal Update":  "bg-[#fffbeb] text-[#d97706]",
  "Complaint":    "bg-[#f5f3ff] text-[#7c3aed]",
}

const typeIcon: Record<ReportType, React.ElementType> = {
  "Performance":  TrendingUp,
  "Work Summary": FileBarChart2,
  "Incident":     AlertCircle,
  "Goal Update":  Target,
  "Complaint":    MessageSquare,
}

const statusStyle: Record<ReportStatus, { badge: string; dot: string; icon: React.ElementType }> = {
  "Submitted":    { badge: "border-[#d97706] text-[#d97706]", dot: "bg-[#d97706]", icon: Clock        },
  "Under Review": { badge: "border-[#5e81f4] text-[#5e81f4]", dot: "bg-[#5e81f4]", icon: Clock        },
  "Resolved":     { badge: "border-[#16a34a] text-[#16a34a]", dot: "bg-[#16a34a]", icon: CheckCircle2 },
  "Closed":       { badge: "border-[#8181a5] text-[#8181a5]", dot: "bg-[#8181a5]", icon: XCircle      },
}

const STATUS_OPTIONS: ReportStatus[] = ["Submitted", "Under Review", "Resolved", "Closed"]
const TYPE_OPTIONS:   ReportType[]   = ["Performance", "Work Summary", "Incident", "Goal Update", "Complaint"]

// ── Seed data ─────────────────────────────────────────────────
const photos: Record<string, string> = {
  "Michael Chen":     "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png",
  "Sarah Williams":   "/assets/c8f5ae43e33ebde623eb7d3b22aeb6930878a4ce.png",
  "David Rodriguez":  "/assets/cf9965b714128bf9b66e7daf6ad58bf5300b9eea.png",
  "James Anderson":   "/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png",
  "Jessica Martinez": "/assets/ba50d841bff1eb820c0b59f56f778fbbf8b8a8c3.png",
  "Robert Taylor":    "/assets/3b57a33d98b5a1b80a335988932aa248a0875725.png",
  "Priya Patel":      "/assets/635a3bf857069957b4442100197a1e910ea3121d.png",
  "Lena Schmidt":     "/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png",
  "Omar Hassan":      "/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png",
}

const seed: EmployeeReport[] = [
  {
    id: 1, name: "Michael Chen",     photo: photos["Michael Chen"],     email: "michael.chen@corecruiter.com",
    department: "Design",      reportType: "Performance",  title: "Q1 2026 Performance Review",
    period: "Jan – Mar 2026",  submittedOn: "Apr 05, 2026", status: "Under Review",
    summary: "Delivered all sprint tasks ahead of schedule. Led the redesign of the onboarding flow, improving completion rate by 18%. Collaborated closely with engineering to ship the new dashboard.",
    score: 91,
  },
  {
    id: 2, name: "Sarah Williams",   photo: photos["Sarah Williams"],   email: "sarah.williams@corecruiter.com",
    department: "Marketing",   reportType: "Work Summary", title: "March 2026 Work Summary",
    period: "Mar 2026",        submittedOn: "Apr 01, 2026", status: "Resolved",
    summary: "Managed three active campaigns. Grew organic traffic by 22% through SEO optimisations. Coordinated the Q2 product launch content calendar.",
  },
  {
    id: 3, name: "David Rodriguez",  photo: photos["David Rodriguez"],  email: "david.rodriguez@corecruiter.com",
    department: "Engineering", reportType: "Goal Update",  title: "H1 2026 Goal Update",
    period: "H1 2026",         submittedOn: "Mar 30, 2026", status: "Resolved",
    summary: "On track for all H1 engineering targets. Migration to TypeScript strict mode is 80% complete. API response times improved by 35% after query optimisation.",
  },
  {
    id: 4, name: "James Anderson",   photo: photos["James Anderson"],   email: "james.anderson@corecruiter.com",
    department: "Sales",       reportType: "Performance",  title: "Q1 2026 Sales Performance",
    period: "Jan – Mar 2026",  submittedOn: "Apr 03, 2026", status: "Under Review",
    summary: "Achieved 112% of quarterly quota. Closed three enterprise accounts totalling $480k ARR. Pipeline entering Q2 is the strongest on record.",
    score: 94,
  },
  {
    id: 5, name: "Jessica Martinez", photo: photos["Jessica Martinez"], email: "jessica.martinez@corecruiter.com",
    department: "Design",      reportType: "Incident",     title: "Workspace Access Incident – Mar 2026",
    period: "Mar 2026",        submittedOn: "Mar 21, 2026", status: "Resolved",
    summary: "Reported unauthorised access to the shared design drive by an ex-contractor account that had not been revoked. IT resolved the issue within 4 hours and audited all access logs.",
  },
  {
    id: 6, name: "Robert Taylor",    photo: photos["Robert Taylor"],    email: "robert.taylor@corecruiter.com",
    department: "Engineering", reportType: "Work Summary", title: "March 2026 DevOps Summary",
    period: "Mar 2026",        submittedOn: "Apr 02, 2026", status: "Submitted",
    summary: "Completed Kubernetes cluster upgrade to v1.29. Set up automated nightly backups for all production databases. Zero critical incidents in March.",
  },
  {
    id: 7, name: "Priya Patel",      photo: photos["Priya Patel"],      email: "priya.patel@corecruiter.com",
    department: "Analytics",   reportType: "Performance",  title: "Q4 2025 Performance Review",
    period: "Oct – Dec 2025",  submittedOn: "Jan 10, 2026", status: "Closed",
    summary: "Delivered the annual workforce analytics report two weeks early. Built three new Tableau dashboards adopted by the executive team. Peer feedback was excellent.",
    score: 88,
  },
  {
    id: 8, name: "Lena Schmidt",     photo: photos["Lena Schmidt"],     email: "lena.schmidt@corecruiter.com",
    department: "HR",          reportType: "Goal Update",  title: "H1 2026 HR Goal Update",
    period: "H1 2026",         submittedOn: "Mar 28, 2026", status: "Submitted",
    summary: "Employee engagement survey completed with 91% participation, up from 78% last year. Onboarding programme redesign is 60% done. Three new job descriptions published.",
  },
  {
    id: 9, name: "Omar Hassan",      photo: photos["Omar Hassan"],      email: "omar.hassan@corecruiter.com",
    department: "Engineering", reportType: "Complaint",    title: "On-Call Rotation Fairness",
    period: "Feb – Mar 2026",  submittedOn: "Mar 25, 2026", status: "Under Review",
    summary: "Raised concern that on-call duties were distributed unevenly, with junior engineers carrying significantly more weekend shifts than seniors. Requesting a structured rotation policy.",
  },
  {
    id: 10, name: "Michael Chen",   photo: photos["Michael Chen"],     email: "michael.chen@corecruiter.com",
    department: "Design",      reportType: "Work Summary", title: "February 2026 Work Summary",
    period: "Feb 2026",        submittedOn: "Mar 03, 2026", status: "Resolved",
    summary: "Completed 11 design tasks across two product tracks. Ran a design critique session for junior designers. Shipped the updated component library documentation.",
  },
  {
    id: 11, name: "Sarah Williams",  photo: photos["Sarah Williams"],  email: "sarah.williams@corecruiter.com",
    department: "Marketing",   reportType: "Goal Update",  title: "H1 2026 Marketing Objectives",
    period: "H1 2026",         submittedOn: "Mar 15, 2026", status: "Resolved",
    summary: "Brand awareness target at 65% of goal. Email open rate improved to 34% after subject-line A/B tests. Social media follower growth at 110% of target.",
  },
  {
    id: 12, name: "David Rodriguez", photo: photos["David Rodriguez"], email: "david.rodriguez@corecruiter.com",
    department: "Engineering", reportType: "Incident",     title: "Production Outage – Feb 28, 2026",
    period: "Feb 2026",        submittedOn: "Mar 01, 2026", status: "Closed",
    summary: "A misconfigured environment variable caused a 47-minute API outage affecting 12% of users. Root cause identified, fix deployed, and a pre-deploy checklist has been added to the CI pipeline.",
  },
  {
    id: 13, name: "James Anderson",  photo: photos["James Anderson"],  email: "james.anderson@corecruiter.com",
    department: "Sales",       reportType: "Complaint",    title: "CRM Tool Limitations",
    period: "Q1 2026",         submittedOn: "Mar 12, 2026", status: "Closed",
    summary: "Existing CRM lacks bulk email sequencing and territory-based reporting, which is slowing deal velocity. Requesting evaluation of a replacement tool before Q3.",
  },
  {
    id: 14, name: "Priya Patel",     photo: photos["Priya Patel"],     email: "priya.patel@corecruiter.com",
    department: "Analytics",   reportType: "Work Summary", title: "March 2026 Analytics Summary",
    period: "Mar 2026",        submittedOn: "Apr 01, 2026", status: "Submitted",
    summary: "Completed eight ad-hoc data requests from the product team. Published the monthly retention cohort analysis. Started scoping the customer LTV predictive model.",
  },
  {
    id: 15, name: "Robert Taylor",   photo: photos["Robert Taylor"],   email: "robert.taylor@corecruiter.com",
    department: "Engineering", reportType: "Performance",  title: "Q1 2026 Engineering Performance",
    period: "Jan – Mar 2026",  submittedOn: "Apr 04, 2026", status: "Submitted",
    summary: "Maintained 99.97% uptime across all production services. Reduced cloud spend by 18% through auto-scaling improvements. Excellent collaboration with the product team on the new API layer.",
    score: 90,
  },
]

const PER_PAGE = 10

// ── Status dropdown ───────────────────────────────────────────
function StatusDropdown({ value, onChange }: { value: ReportStatus; onChange: (s: ReportStatus) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { badge } = statusStyle[value]

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-80", badge)}
      >
        {value}
        <ChevronDown className="size-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-36 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false) }}
              className={cn("flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium hover:bg-muted", s === value && "bg-muted/60")}
            >
              <span className={cn("size-2 rounded-full", statusStyle[s].dot)} />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Detail slide-over ─────────────────────────────────────────
function DetailPanel({ report, onClose, onStatusChange }: {
  report:         EmployeeReport
  onClose:        () => void
  onStatusChange: (s: ReportStatus) => void
}) {
  const Icon     = typeIcon[report.reportType]
  const { badge } = statusStyle[report.status]

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-40 flex h-full w-[420px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-[#1f2937]">Report Detail</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Employee hero */}
          <div className="mb-5 flex items-center gap-4 rounded-xl border border-border bg-[#f8fafc] px-5 py-4">
            <img
              src={report.photo}
              alt={report.name}
              className="size-14 shrink-0 rounded-full object-cover ring-2 ring-white shadow"
            />
            <div className="min-w-0">
              <p className="font-bold text-[#1f2937]">{report.name}</p>
              <p className="text-xs text-[#8181a5]">{report.email}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-[#f0f0ff] px-2 py-0.5 text-[11px] text-[#8a8cd9]">
                  <Building2 className="size-3" />
                  {report.department}
                </span>
              </div>
            </div>
          </div>

          {/* Report meta */}
          <div className="mb-5 flex flex-col gap-3">
            {/* Type + title */}
            <div className="flex items-start gap-3">
              <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", typeBadge[report.reportType].split(" ")[0])}>
                <Icon className={cn("size-4", typeBadge[report.reportType].split(" ")[1])} />
              </div>
              <div>
                <p className="font-semibold text-[#1f2937]">{report.title}</p>
                <span className={cn("mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold", typeBadge[report.reportType])}>
                  {report.reportType}
                </span>
              </div>
            </div>

            {/* Meta rows */}
            <div className="space-y-2 rounded-xl border border-border bg-[#f8fafc] p-4 text-sm">
              {[
                { icon: CalendarDays, label: "Period",       value: report.period      },
                { icon: FileText,     label: "Submitted",    value: report.submittedOn },
              ].map(({ icon: Ic, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white shadow-sm">
                    <Ic className="size-3.5 text-[#8181a5]" />
                  </div>
                  <span className="w-24 shrink-0 text-[#8181a5]">{label}</span>
                  <span className="font-medium text-[#1f2937]">{value}</span>
                </div>
              ))}
              {report.score !== undefined && (
                <div className="flex items-center gap-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white shadow-sm">
                    <TrendingUp className="size-3.5 text-[#8181a5]" />
                  </div>
                  <span className="w-24 shrink-0 text-[#8181a5]">Score</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {report.score} / 100
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-5">
            <p className="mb-2 text-sm font-semibold text-[#1f2937]">Summary</p>
            <p className="text-sm leading-relaxed text-[#667388]">{report.summary}</p>
          </div>

          {/* Status update */}
          <div>
            <p className="mb-2 text-sm font-semibold text-[#1f2937]">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => {
                const { dot } = statusStyle[s]
                const active  = s === report.status
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(s)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                      active
                        ? cn("border-current", statusStyle[s].badge)
                        : "border-border text-[#8181a5] hover:border-current hover:text-[#1f2937]"
                    )}
                  >
                    <span className={cn("size-2 rounded-full", dot)} />
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function HRReportsPage() {
  const [reports,     setReports]     = useState<EmployeeReport[]>(seed)
  const [search,      setSearch]      = useState("")
  const [typeFilter,  setTypeFilter]  = useState<ReportType | "All">("All")
  const [statFilter,  setStatFilter]  = useState<ReportStatus | "All">("All")
  const [page,        setPage]        = useState(1)
  const [detail,      setDetail]      = useState<EmployeeReport | null>(null)
  const [typeOpen,    setTypeOpen]    = useState(false)
  const [statusOpen,  setStatusOpen]  = useState(false)
  const typeRef   = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (typeRef.current   && !typeRef.current.contains(e.target as Node))   setTypeOpen(false)
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  // Derived stats
  const total       = reports.length
  const underReview = reports.filter(r => r.status === "Under Review").length
  const resolved    = reports.filter(r => r.status === "Resolved").length
  const closed      = reports.filter(r => r.status === "Closed").length

  // Filtering
  const filtered = reports.filter(r => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase())       ||
      r.title.toLowerCase().includes(search.toLowerCase())      ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.reportType.toLowerCase().includes(search.toLowerCase())
    const matchType   = typeFilter  === "All" || r.reportType === typeFilter
    const matchStatus = statFilter  === "All" || r.status     === statFilter
    return matchSearch && matchType && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function updateStatus(id: number, status: ReportStatus) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    if (detail?.id === id) setDetail(prev => prev ? { ...prev, status } : prev)
  }

  function resetFilters() {
    setSearch(""); setTypeFilter("All"); setStatFilter("All"); setPage(1)
  }

  const hasFilters = search !== "" || typeFilter !== "All" || statFilter !== "All"

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      {/* ── Main content ── */}
      <main className="flex flex-1 flex-col overflow-hidden">

      
        {/* ── Toolbar ── */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border bg-white px-6 py-3">
          {/* Search */}
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-[#f4f5f9] px-4 py-2.5">
            <Search className="size-4 shrink-0 text-[#8181a5]" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name, title, department…"
              className="flex-1 bg-transparent text-sm text-[#1c1c1c] outline-none placeholder:text-[#8181a5]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-[#8181a5] hover:text-[#1c1c1c]">
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Type filter */}
          <div ref={typeRef} className="relative">
            <button
              onClick={() => setTypeOpen(o => !o)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                typeFilter !== "All"
                  ? "border-[#5e81f4] bg-[#eef2ff] text-[#5e81f4]"
                  : "border-border text-[#8181a5] hover:bg-muted"
              )}
            >
              <SlidersHorizontal className="size-4" />
              {typeFilter === "All" ? "Type" : typeFilter}
              <ChevronDown className="size-3.5" />
            </button>
            {typeOpen && (
              <div className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                <button
                  onClick={() => { setTypeFilter("All"); setTypeOpen(false); setPage(1) }}
                  className={cn("flex w-full px-4 py-2.5 text-left text-sm hover:bg-muted", typeFilter === "All" && "bg-muted/60 font-medium")}
                >
                  All Types
                </button>
                {TYPE_OPTIONS.map(t => (
                  <button
                    key={t}
                    onClick={() => { setTypeFilter(t); setTypeOpen(false); setPage(1) }}
                    className={cn("flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted", typeFilter === t && "bg-muted/60 font-medium")}
                  >
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", typeBadge[t])}>{t}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status filter */}
          <div ref={statusRef} className="relative">
            <button
              onClick={() => setStatusOpen(o => !o)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                statFilter !== "All"
                  ? "border-[#5e81f4] bg-[#eef2ff] text-[#5e81f4]"
                  : "border-border text-[#8181a5] hover:bg-muted"
              )}
            >
              Status
              {statFilter !== "All" && <span className="size-2 rounded-full" style={{ backgroundColor: statusStyle[statFilter as ReportStatus].dot }} />}
              {statFilter === "All" ? "" : ` · ${statFilter}`}
              <ChevronDown className="size-3.5" />
            </button>
            {statusOpen && (
              <div className="absolute right-0 top-full z-30 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                <button
                  onClick={() => { setStatFilter("All"); setStatusOpen(false); setPage(1) }}
                  className={cn("flex w-full px-4 py-2.5 text-left text-sm hover:bg-muted", statFilter === "All" && "bg-muted/60 font-medium")}
                >
                  All Statuses
                </button>
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => { setStatFilter(s); setStatusOpen(false); setPage(1) }}
                    className={cn("flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted", statFilter === s && "bg-muted/60 font-medium")}
                  >
                    <span className={cn("size-2 rounded-full", statusStyle[s].dot)} />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="rounded-lg border border-border px-3 py-2.5 text-sm text-[#8181a5] hover:bg-muted"
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="flex-1 overflow-auto p-6">
          <div className="rounded-xl border border-border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Employee", "Department", "Report Type", "Title", "Period", "Submitted", "Status", ""].map(col => (
                    <th
                      key={col}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8181a5]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map(r => {
                  const TypeIcon = typeIcon[r.reportType]
                  const { badge } = statusStyle[r.status]
                  return (
                    <tr
                      key={r.id}
                      className="cursor-pointer hover:bg-[#f8fafc]"
                      onClick={() => setDetail(r)}
                    >
                      {/* Employee */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={r.photo}
                            alt={r.name}
                            className="size-9 shrink-0 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#1f2937]">{r.name}</p>
                            <p className="truncate text-xs text-[#8181a5]">{r.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4 text-[#667388]">{r.department}</td>

                      {/* Report type */}
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold", typeBadge[r.reportType])}>
                          <TypeIcon className="size-3" />
                          {r.reportType}
                        </span>
                      </td>

                      {/* Title */}
                      <td className="max-w-[200px] px-5 py-4">
                        <p className="truncate font-medium text-[#1f2937]">{r.title}</p>
                        {r.score !== undefined && (
                          <span className="mt-0.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {r.score}/100
                          </span>
                        )}
                      </td>

                      {/* Period */}
                      <td className="whitespace-nowrap px-5 py-4 text-[#667388]">{r.period}</td>

                      {/* Submitted */}
                      <td className="whitespace-nowrap px-5 py-4 text-[#667388]">{r.submittedOn}</td>

                      {/* Status */}
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <StatusDropdown
                          value={r.status}
                          onChange={s => updateStatus(r.id, s)}
                        />
                      </td>

                      {/* View */}
                      <td className="px-4 py-4">
                        <button
                          onClick={e => { e.stopPropagation(); setDetail(r) }}
                          className="flex size-8 items-center justify-center rounded-lg text-[#8181a5] hover:bg-muted hover:text-[#5e81f4]"
                          title="View report"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-[#8181a5]">
                      {hasFilters ? "No reports match your filters." : "No reports submitted yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border px-5 py-3">
              <p className="text-xs text-[#8181a5]">
                {filtered.length === 0
                  ? "No results"
                  : `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length} report${filtered.length !== 1 ? "s" : ""}`}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex size-8 items-center justify-center rounded-lg text-[#4b5563] hover:bg-muted disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                      p === page ? "bg-[#5e81f4] text-white" : "text-[#8181a5] hover:bg-muted"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex size-8 items-center justify-center rounded-lg text-[#4b5563] hover:bg-muted disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Detail panel ── */}
      {detail && (
        <DetailPanel
          report={detail}
          onClose={() => setDetail(null)}
          onStatusChange={s => updateStatus(detail.id, s)}
        />
      )}
    </>
  )
}
