"use client"

import { useState } from "react"
import Link from "next/link"
import {
  FileBarChart2, Clock, CheckCircle2, AlertCircle, TrendingUp,
  CalendarDays, Award, Target, ChevronRight, Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────
type ReportStatus = "Submitted" | "Under Review" | "Resolved" | "Closed"
type ReportType   = "Performance" | "Work Summary" | "Incident" | "Goal Update"

interface Report {
  id:         number
  title:      string
  type:       ReportType
  period:     string
  submittedOn: string
  status:     ReportStatus
  summary:    string
  score?:     number // out of 100, for performance reports
}

// ── Style maps ───────────────────────────────────────────────────
const typeBadge: Record<ReportType, string> = {
  "Performance":  "bg-[#eef2ff] text-[#5e81f4]",
  "Work Summary": "bg-[#f0fdf4] text-[#16a34a]",
  "Incident":     "bg-[#fef2f2] text-[#dc2626]",
  "Goal Update":  "bg-[#fffbeb] text-[#d97706]",
}

const typeIcon: Record<ReportType, React.ElementType> = {
  "Performance":  TrendingUp,
  "Work Summary": FileBarChart2,
  "Incident":     AlertCircle,
  "Goal Update":  Target,
}

const statusBadge: Record<ReportStatus, string> = {
  "Submitted":    "bg-[#fffbeb] text-[#d97706] border border-[#d97706]",
  "Under Review": "bg-[#eef2ff] text-[#5e81f4] border border-[#5e81f4]",
  "Resolved":     "bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]",
  "Closed":       "bg-muted text-muted-foreground border border-border",
}

const statusIcon: Record<ReportStatus, React.ReactNode> = {
  "Submitted":    <Clock className="size-3" />,
  "Under Review": <Clock className="size-3" />,
  "Resolved":     <CheckCircle2 className="size-3" />,
  "Closed":       <CheckCircle2 className="size-3" />,
}

// ── Data ─────────────────────────────────────────────────────────
const reports: Report[] = [
  {
    id: 1,
    title:       "Q1 2026 Performance Review",
    type:        "Performance",
    period:      "Jan – Mar 2026",
    submittedOn: "Apr 05, 2026",
    status:      "Under Review",
    summary:     "Delivered all sprint tasks ahead of schedule. Led the redesign of the onboarding flow, improving completion rate by 18%. Collaborated closely with engineering to ship the new dashboard.",
    score:       91,
  },
  {
    id: 2,
    title:       "March 2026 Work Summary",
    type:        "Work Summary",
    period:      "Mar 2026",
    submittedOn: "Apr 01, 2026",
    status:      "Resolved",
    summary:     "Completed 14 design tasks across 3 projects. Participated in 2 design reviews and delivered the redesigned leave management screens.",
  },
  {
    id: 3,
    title:       "Goal Update – H1 2026",
    type:        "Goal Update",
    period:      "H1 2026",
    submittedOn: "Mar 15, 2026",
    status:      "Resolved",
    summary:     "On track for all 4 H1 goals. Design system contribution at 80%. Mentoring junior designer started in February.",
  },
  {
    id: 4,
    title:       "Q4 2025 Performance Review",
    type:        "Performance",
    period:      "Oct – Dec 2025",
    submittedOn: "Jan 10, 2026",
    status:      "Closed",
    summary:     "Strong quarter. Shipped mobile redesign on time. Score reflects high-quality delivery and stakeholder feedback.",
    score:       88,
  },
  {
    id: 5,
    title:       "Workplace Incident – Nov 2025",
    type:        "Incident",
    period:      "Nov 2025",
    submittedOn: "Nov 18, 2025",
    status:      "Closed",
    summary:     "Reported miscommunication during cross-team sprint that led to duplicate design work. Issue was resolved after a process alignment meeting.",
  },
]

// ── KPI data ──────────────────────────────────────────────────────
const goals = [
  { label: "Design System Contribution", target: 100, current: 80,  unit: "tasks"  },
  { label: "Sprint Task Completion",     target: 40,  current: 40,  unit: "tasks"  },
  { label: "Design Reviews Attended",    target: 12,  current: 9,   unit: "sessions" },
  { label: "Mentoring Sessions",         target: 8,   current: 5,   unit: "sessions" },
]

// ── Report card ───────────────────────────────────────────────────
function ReportCard({ r }: { r: Report }) {
  const [open, setOpen] = useState(false)
  const Icon = typeIcon[r.type]

  return (
    <div className={cn(
      "rounded-2xl border bg-white shadow-sm transition-all",
      open ? "border-primary/30" : "border-border"
    )}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-4 px-5 py-4 text-left"
      >
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", typeBadge[r.type].split(" ")[0])}>
          <Icon className={cn("size-5", typeBadge[r.type].split(" ")[1])} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{r.title}</p>
            {r.score !== undefined && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                {r.score}/100
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", typeBadge[r.type])}>
              {r.type}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3" />{r.period}
            </span>
            <span>Submitted {r.submittedOn}</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold", statusBadge[r.status])}>
            {statusIcon[r.status]}{r.status}
          </span>
          <ChevronRight className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-90")} />
        </div>
      </button>

      {open && (
        <div className="border-t border-border px-5 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-muted-foreground">{r.summary}</p>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────
export default function ReportsPage() {
  const avgScore = Math.round(
    reports.filter((r) => r.score !== undefined).reduce((s, r) => s + (r.score ?? 0), 0) /
    reports.filter((r) => r.score !== undefined).length
  )

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-white px-4 py-3 lg:hidden">
        <h1 className="text-base font-semibold text-foreground">My Reports</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Report › Overview</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

        {/* ── Stats ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Reports",  value: reports.length,                                        icon: FileBarChart2, bg: "bg-[#eef2ff]", color: "#5e81f4" },
            { label: "Under Review",   value: reports.filter((r) => r.status === "Under Review").length, icon: Clock,         bg: "bg-[#fffbeb]", color: "#d97706" },
            { label: "Resolved",       value: reports.filter((r) => r.status === "Resolved").length,  icon: CheckCircle2,  bg: "bg-[#f0fdf4]", color: "#16a34a" },
            { label: "Avg Score",      value: `${avgScore}`,                                          icon: Award,         bg: "bg-[#f5f3ff]", color: "#8b5cf6" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className={cn("mb-2 flex size-8 items-center justify-center rounded-lg", s.bg)}>
                <s.icon className="size-4" style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── H1 goals progress ── */}
        <div className="mb-6 rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">H1 2026 Goal Progress</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Tracking against your performance objectives</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">On Track</span>
          </div>
          <div className="flex flex-col gap-4">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100))
              return (
                <div key={g.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{g.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {g.current} / {g.target} {g.unit}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-[11px] text-muted-foreground">{pct}%</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Reports list ── */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Submitted Reports</h2>
          <Link
            href="/dashboard/ess/report/complaints"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            <Plus className="size-3.5" />
            File a Complaint
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {reports.map((r) => <ReportCard key={r.id} r={r} />)}
        </div>

      </div>
    </div>
  )
}
