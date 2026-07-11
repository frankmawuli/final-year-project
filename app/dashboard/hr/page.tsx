"use client"

import { useEffect, useState } from "react"
import {
  Users,
  Briefcase,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  CalendarClock,
  UserPlus,
  DollarSign,
  FileText,
  FileCheck,
} from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
} from "recharts"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { useAuth } from "@/context/auth-context"
import { hrService, type HrOverviewData, type ActivityItem } from "@/services/hr.service"
import { employeeService, type ApiEmployee } from "@/services/employee.service"

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  CalendarClock,
  UserPlus,
  DollarSign,
  FileText,
  FileCheck,
  CalendarCheck,
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// ── Chart Data ───────────────────────────────────────────────
const attendanceData = [
  { month: "Jan", attendance: 91 },
  { month: "Feb", attendance: 88 },
  { month: "Mar", attendance: 94 },
  { month: "Apr", attendance: 90 },
  { month: "May", attendance: 96 },
  { month: "Jun", attendance: 93 },
  { month: "Jul", attendance: 87 },
  { month: "Aug", attendance: 95 },
  { month: "Sep", attendance: 92 },
  { month: "Oct", attendance: 97 },
  { month: "Nov", attendance: 94 },
  { month: "Dec", attendance: 96 },
]

const ROLE_COLORS = ["#3d70fa", "#f59e0b", "#10b981", "#f472b6", "#a78bfa", "#22d3ee", "#fb923c"]

// ── Sub-components ────────────────────────────────────────────
function StatCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
}: {
  label: string
  value: string
  change: string
  positive: boolean
  icon: React.ElementType
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-1.5">
        <p className="text-xl font-bold tracking-tight text-foreground">{value}</p>
        <span
          className={`mb-0.5 flex items-center gap-1 text-xs font-medium ${
            positive ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {positive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
          {change}
        </span>
      </div>
    </div>
  )
}

const navItems = [
  { label: "Overview",     href: "/dashboard/hr"              },
  { label: "Calendar",     href: "/dashboard/hr/calendar"     },
  { label: "Announcement", href: "/dashboard/hr/announcement" },
]
// ── Main Page ─────────────────────────────────────────────────
export default function HRDashboard() {
  const { accessToken } = useAuth()
  const [overview, setOverview] = useState<HrOverviewData | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    hrService
      .overview(accessToken)
      .then((res) => setOverview(res.data))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load overview"))
      .finally(() => setLoading(false))
  }, [accessToken])

  const departmentData = (overview?.employeesByDepartment ?? []).map((d) => ({
    name:  d.department,
    value: d.count,
  }))

  const roleData = (overview?.employeesByRole ?? []).map((r, i) => ({
    name:  r.role ?? "Unspecified",
    value: r.count,
    color: ROLE_COLORS[i % ROLE_COLORS.length],
  }))

  const totalEmployeesValue = loading ? "…" : String(overview?.stats.totalEmployees ?? 0)
  const totalEmployeesChange = loading
    ? ""
    : `+${overview?.stats.newEmployeesThisMonth ?? 0} this month`

  const openJobsValue = loading ? "…" : String(overview?.stats.openJobPositions ?? 0)
  const openJobsChange = loading
    ? ""
    : `+${overview?.stats.newJobsThisWeek ?? 0} this week`

  const [activity, setActivity] = useState<ActivityItem[]>([])

  useEffect(() => {
    if (!accessToken) return

    let cancelled = false
    hrService.activity(accessToken, 30).then((res) => {
      if (!cancelled) setActivity(res.data)
    })

    const source = new EventSource(hrService.activityStreamUrl(accessToken))
    source.onmessage = (event) => {
      const entry = JSON.parse(event.data) as ActivityItem
      setActivity((prev) => [entry, ...prev].slice(0, 30))
    }

    return () => {
      cancelled = true
      source.close()
    }
  }, [accessToken])

  const hrActivities = activity.filter((a) => a.category === "HR").slice(0, 5)
  const recruitmentActivity = activity.filter((a) => a.category === "RECRUITMENT").slice(0, 5)

  const [newEmployees, setNewEmployees] = useState<ApiEmployee[]>([])

  useEffect(() => {
    if (!accessToken) return
    employeeService.list({ limit: 4 }, accessToken).then((res) => setNewEmployees(res.data))
  }, [accessToken])

  return (
    // <div className="flex h-screen overflow-hidden bg-background text-foreground">
<>
      {/* ── Text sidebar ── */}
      <HrNavigationPannel navItems={navItems}/>
    

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1280px] p-5">
        {/* Error banner */}
        {error && (
          <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <StatCard
            label="Total Employees"
            value={totalEmployeesValue}
            change={totalEmployeesChange}
            positive
            icon={Users}
          />
          <StatCard
            label="Open Job Positions"
            value={openJobsValue}
            change={openJobsChange}
            positive
            icon={Briefcase}
          />
          <StatCard
            label="Attendance Today"
            value="96%"
            change="+1.2% vs yesterday"
            positive
            icon={CalendarCheck}
          />
        </div>

        {/* HR Workforce Analytics */}
        <div className="mb-5 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">HR Workforce Analytics</p>
              <p className="text-xs text-muted-foreground">Monthly attendance rate (%)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={attendanceData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[80, 100]}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                cursor={{ stroke: "var(--color-border)" }}
                contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-card)", color: "var(--color-foreground)" }}
                formatter={(v) => [`${v}%`, "Attendance"]}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#3d70fa"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#3d70fa" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom charts row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Employees by Department */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-foreground">Employees by Department</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={departmentData} barSize={28} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[0, 10, 20, 30, 40]}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-card)", color: "var(--color-foreground)" }}
                  formatter={(v) => [v, "Employees"]}
                />
                <Bar dataKey="value" fill="#3d70fa" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Employees by Role */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-foreground">Employees by Role</p>
            <div className="flex items-center gap-3">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={66}
                    dataKey="value"
                    strokeWidth={2}
                  >
                    {roleData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12, background: "var(--color-card)", color: "var(--color-foreground)" }}
                    formatter={(v) => [v, "Employees"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5">
                {roleData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-xs font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>{/* end max-w wrapper */}
      </main>

      {/* ── Right sidebar ── */}
      <aside className="flex w-[260px] shrink-0 flex-col gap-5 overflow-y-auto border-l border-border bg-card p-3">
        {/* HR Activities */}
        <section>
          <p className="mb-1.5 px-1 py-1.5 text-xs font-semibold text-foreground">HR Activities</p>
          <div className="flex flex-col gap-1">
            {hrActivities.length === 0 && (
              <p className="px-1.5 py-1 text-xs text-muted-foreground">No recent activity</p>
            )}
            {hrActivities.map((item) => {
              const Icon = ACTIVITY_ICONS[item.icon] ?? FileText
              return (
                <div key={item.id} className="flex items-start gap-1.5 rounded-lg p-1.5 hover:bg-muted/50">
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] leading-snug text-foreground">{item.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Recruitment Activity */}
        <section>
          <p className="mb-1.5 px-1 py-1.5 text-xs font-semibold text-foreground">Recruitment Activity</p>
          <div className="relative flex flex-col gap-1">
            <div className="absolute bottom-[10%] left-[19px] top-[10%] w-px bg-border" />
            {recruitmentActivity.length === 0 && (
              <p className="px-1.5 py-1 text-xs text-muted-foreground">No recent activity</p>
            )}
            {recruitmentActivity.map((item) => {
              const Icon = ACTIVITY_ICONS[item.icon] ?? FileText
              return (
                <div key={item.id} className="relative flex items-start gap-1.5 rounded-lg p-1.5">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt=""
                      className="relative z-10 size-6 shrink-0 rounded-full object-cover ring-2 ring-background"
                    />
                  ) : (
                    <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-2 ring-background">
                      <Icon className="size-3 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[13px] leading-snug text-foreground">{item.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* New Employees */}
        <section>
          <p className="mb-1.5 px-1 py-1.5 text-xs font-semibold text-foreground">New Employees</p>
          <div className="flex flex-col gap-1">
            {newEmployees.length === 0 && (
              <p className="px-1.5 py-1 text-xs text-muted-foreground">No employees yet</p>
            )}
            {newEmployees.map((emp) => (
              <div key={emp.id} className="flex items-center gap-1.5 rounded-lg p-1.5 hover:bg-muted/50">
                {emp.user?.avatarUrl ? (
                  <img
                    src={emp.user.avatarUrl}
                    alt={emp.user.name}
                    className="size-7 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {emp.user ? emp.user.name.charAt(0).toUpperCase() : <UserPlus className="size-3.5" />}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground">{emp.user?.name ?? emp.employeeId}</p>
                  <p className="text-xs text-muted-foreground">{emp.jobTitle ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
     {/* </div> */}
     </>
  )
}
