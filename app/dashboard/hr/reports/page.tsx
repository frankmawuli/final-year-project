"use client"

import { useState, useMemo } from "react"
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from "recharts"
import {
  TrendingUp, FileBarChart2, AlertCircle, Target, MessageSquare,
  CheckCircle2, Clock, XCircle, FileText, CalendarDays, Building2,
  X, ChevronRight,
} from "lucide-react"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { cn } from "@/lib/utils"

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "All Reports",  href: "/dashboard/hr/reports"            },
  { label: "Performance",  href: "#"                                 },
  { label: "Incidents",    href: "#"                                 },
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
  "Performance":  "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  "Work Summary": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Incident":     "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  "Goal Update":  "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  "Complaint":    "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
}

const typeIcon: Record<ReportType, React.ElementType> = {
  "Performance":  TrendingUp,
  "Work Summary": FileBarChart2,
  "Incident":     AlertCircle,
  "Goal Update":  Target,
  "Complaint":    MessageSquare,
}

const statusStyle: Record<ReportStatus, { badge: string; dot: string; icon: React.ElementType }> = {
  "Submitted":    { badge: "border-amber-500 text-amber-500",     dot: "bg-amber-500",     icon: Clock        },
  "Under Review": { badge: "border-primary text-primary",         dot: "bg-primary",       icon: Clock        },
  "Resolved":     { badge: "border-emerald-600 text-emerald-600", dot: "bg-emerald-600",   icon: CheckCircle2 },
  "Closed":       { badge: "border-muted-foreground text-muted-foreground", dot: "bg-muted-foreground", icon: XCircle },
}

const STATUS_OPTIONS: ReportStatus[] = ["Submitted", "Under Review", "Resolved", "Closed"]
const TYPE_OPTIONS:   ReportType[]   = ["Performance", "Work Summary", "Incident", "Goal Update", "Complaint"]

// ── Chart colour palettes ──────────────────────────────────────
const TYPE_COLORS   = ["#2563eb", "#059669", "#dc2626", "#d97706", "#9333ea"]
const STATUS_COLORS = ["#f59e0b", "#3b6feb", "#10b981", "#94a3b8"]

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

// ── Shared tooltip ────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: {
  active?:  boolean
  payload?: { name: string; value: number }[]
  label?:   string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-2.5 py-1.5 shadow-lg">
      {label && <p className="mb-1 text-xs font-semibold text-foreground">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">{p.value}</span>{" "}{p.name}
        </p>
      ))}
    </div>
  )
}

// ── KPI card ──────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, suffix }: {
  label:   string
  value:   number | string
  sub:     string
  color:   string
  suffix?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex items-end gap-1">
        <span className="text-2xl font-bold leading-none" style={{ color }}>{value}</span>
        {suffix && <span className="mb-0.5 text-xs text-muted-foreground">{suffix}</span>}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

// ── Drill-down list panel ─────────────────────────────────────
function DrillPanel({ label, items, onClose, onSelect }: {
  label:    string
  items:    EmployeeReport[]
  onClose:  () => void
  onSelect: (r: EmployeeReport) => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-40 flex h-full w-[380px] flex-col bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Filtered Reports</p>
            <h2 className="mt-0.5 font-bold text-foreground">{label} · {items.length}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 divide-y divide-border overflow-y-auto">
          {items.map(r => {
            const TypeIcon = typeIcon[r.reportType]
            return (
              <button
                key={r.id}
                onClick={() => onSelect(r)}
                className="flex w-full items-start gap-2.5 px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <img src={r.photo} alt={r.name} className="mt-0.5 size-9 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1.5">
                    <p className="truncate font-semibold text-foreground">{r.name}</p>
                    <span className={cn("shrink-0 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold", typeBadge[r.reportType])}>
                      <TypeIcon className="size-2.5" />{r.reportType}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.department} · {r.submittedOn}</p>
                </div>
                <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
              </button>
            )
          })}
        </div>
      </aside>
    </>
  )
}

// ── Detail slide-over ─────────────────────────────────────────
function DetailPanel({ report, onClose, onStatusChange }: {
  report:         EmployeeReport
  onClose:        () => void
  onStatusChange: (s: ReportStatus) => void
}) {
  const Icon = typeIcon[report.reportType]

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-40 flex h-full w-[420px] flex-col bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">Report Detail</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Employee hero */}
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
            <img src={report.photo} alt={report.name} className="size-14 shrink-0 rounded-full object-cover ring-2 ring-background shadow" />
            <div className="min-w-0">
              <p className="font-bold text-foreground">{report.name}</p>
              <p className="text-xs text-muted-foreground">{report.email}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary">
                  <Building2 className="size-3" />{report.department}
                </span>
              </div>
            </div>
          </div>

          {/* Type + title */}
          <div className="mb-4 flex flex-col gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", typeBadge[report.reportType].split(" ")[0])}>
                <Icon className={cn("size-4", typeBadge[report.reportType].split(" ")[1])} />
              </div>
              <div>
                <p className="font-semibold text-foreground">{report.title}</p>
                <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold", typeBadge[report.reportType])}>
                  {report.reportType}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 rounded-xl border border-border bg-muted/50 p-3 text-xs">
              {[
                { icon: CalendarDays, label: "Period",    value: report.period      },
                { icon: FileText,     label: "Submitted", value: report.submittedOn },
              ].map(({ icon: Ic, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background shadow-sm">
                    <Ic className="size-3.5 text-muted-foreground" />
                  </div>
                  <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
              {report.score !== undefined && (
                <div className="flex items-center gap-2.5">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background shadow-sm">
                    <TrendingUp className="size-3.5 text-muted-foreground" />
                  </div>
                  <span className="w-24 shrink-0 text-muted-foreground">Score</span>
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-bold text-primary">
                    {report.score} / 100
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-4">
            <p className="mb-1.5 text-xs font-semibold text-foreground">Summary</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{report.summary}</p>
          </div>

          {/* Status update */}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-foreground">Update Status</p>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((s) => {
                const { dot } = statusStyle[s]
                const active  = s === report.status
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(s)}
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all",
                      active
                        ? cn("border-current", statusStyle[s].badge)
                        : "border-border text-muted-foreground hover:border-current hover:text-foreground"
                    )}
                  >
                    <span className={cn("size-2 rounded-full", dot)} />{s}
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
  const [reports, setReports] = useState<EmployeeReport[]>(seed)
  const [drill,   setDrill]   = useState<{ label: string; items: EmployeeReport[] } | null>(null)
  const [detail,  setDetail]  = useState<EmployeeReport | null>(null)

  // ── Derived chart data ──────────────────────────────────────
  const typeCounts = useMemo(() =>
    TYPE_OPTIONS.map(t => ({ name: t, value: reports.filter(r => r.reportType === t).length })),
  [reports])

  const statusCounts = useMemo(() =>
    STATUS_OPTIONS.map(s => ({ name: s, value: reports.filter(r => r.status === s).length })),
  [reports])

  const deptCounts = useMemo(() => {
    const depts = [...new Set(reports.map(r => r.department))]
    return depts
      .map(d => ({ department: d, count: reports.filter(r => r.department === d).length }))
      .sort((a, b) => b.count - a.count)
  }, [reports])

  const timeData = useMemo(() => {
    const ordered = ["Jan", "Feb", "Mar", "Apr"]
    const map = new Map(ordered.map(m => [m, 0]))
    reports.forEach(r => {
      const m = new Date(r.submittedOn).toLocaleDateString("en-US", { month: "short" })
      map.set(m, (map.get(m) ?? 0) + 1)
    })
    return ordered.map(month => ({ month, count: map.get(month) ?? 0 }))
  }, [reports])

  const kpi = useMemo(() => {
    const active   = reports.filter(r => r.status === "Submitted" || r.status === "Under Review").length
    const resolved = reports.filter(r => r.status === "Resolved"  || r.status === "Closed").length
    const scores   = reports.filter(r => r.score !== undefined).map(r => r.score!)
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    return { total: reports.length, active, resolved, avgScore }
  }, [reports])

  // ── Handlers ────────────────────────────────────────────────
  function updateStatus(id: number, status: ReportStatus) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    if (detail?.id === id) setDetail(prev => prev ? { ...prev, status } : prev)
  }

  function openDrill(label: string, items: EmployeeReport[]) {
    setDetail(null)
    setDrill({ label, items })
  }

  function selectFromDrill(r: EmployeeReport) {
    setDrill(null)
    setDetail(r)
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex-1 overflow-auto p-5">
        <div className="space-y-5">

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-4 gap-3">
            <KpiCard label="Total Reports"      value={kpi.total}    sub="All submissions"         color="#3b6feb"  />
            <KpiCard label="Active"             value={kpi.active}   sub="Submitted or in review"  color="#f59e0b"  />
            <KpiCard label="Resolved"           value={kpi.resolved} sub="Resolved and closed"     color="#10b981"  />
            <KpiCard label="Avg Perf Score"     value={kpi.avgScore} sub="Across scored reports"   color="#9333ea" suffix="/100" />
          </div>

          {/* ── Charts grid ── */}
          <div className="grid grid-cols-[3fr_2fr] gap-5">

            {/* Left column */}
            <div className="space-y-5">

              {/* Submissions over time */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="mb-1 font-semibold text-foreground">Submissions Over Time</p>
                <p className="mb-3 text-xs text-muted-foreground">Report volume per month</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={timeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b6feb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3b6feb" stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <ReTooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      name="Reports"
                      stroke="#3b6feb"
                      strokeWidth={2}
                      fill="url(#areaGrad)"
                      dot={{ fill: "#3b6feb", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Department bar chart */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="mb-1 font-semibold text-foreground">Reports by Department</p>
                <p className="mb-3 text-xs text-muted-foreground">Click a bar to see individual reports</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={deptCounts} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="department" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={80} />
                    <ReTooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
                    <Bar
                      dataKey="count"
                      name="Reports"
                      fill="#3b6feb"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={22}
                      cursor="pointer"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onClick={(data: any) => data?.department && openDrill(data.department as string, reports.filter(r => r.department === data.department))}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">

              {/* Report type donut */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="mb-1 font-semibold text-foreground">Report Types</p>
                <p className="mb-1.5 text-xs text-muted-foreground">Click a slice to see reports</p>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={typeCounts}
                      cx="50%"
                      cy="42%"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                      dataKey="value"
                      cursor="pointer"
                      onClick={(d: { name?: string }) => d.name && openDrill(d.name, reports.filter(r => r.reportType === (d.name as ReportType)))}
                    >
                      {typeCounts.map((_, i) => <Cell key={i} fill={TYPE_COLORS[i]} stroke="none" />)}
                    </Pie>
                    <ReTooltip content={<ChartTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={7}
                      formatter={(v) => <span className="text-xs text-foreground">{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Status donut */}
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="mb-1 font-semibold text-foreground">By Status</p>
                <p className="mb-1.5 text-xs text-muted-foreground">Click a slice to see reports</p>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={statusCounts}
                      cx="50%"
                      cy="42%"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                      dataKey="value"
                      cursor="pointer"
                      onClick={(d: { name?: string }) => d.name && openDrill(d.name, reports.filter(r => r.status === (d.name as ReportStatus)))}
                    >
                      {statusCounts.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} stroke="none" />)}
                    </Pie>
                    <ReTooltip content={<ChartTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={7}
                      formatter={(v) => <span className="text-xs text-foreground">{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      {drill && (
        <DrillPanel
          label={drill.label}
          items={drill.items}
          onClose={() => setDrill(null)}
          onSelect={selectFromDrill}
        />
      )}

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
