
"use client"

import type { ElementType } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  MessageSquareText,
  MoreHorizontal,
  Server,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import AdminSidebar from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Stat = {
  label: string
  value: string
  detail: string
  trend: string
  icon: ElementType
  tone: string
}

const stats: Stat[] = [
  {
    label: "Total companies",
    value: "248",
    detail: "214 active accounts",
    trend: "+12.4%",
    icon: Building2,
    tone: "bg-blue-500/10 text-blue-600",
  },
  {
    label: "Total users",
    value: "18,642",
    detail: "16,908 active this month",
    trend: "+8.7%",
    icon: Users,
    tone: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Employees",
    value: "15,284",
    detail: "1,126 added this quarter",
    trend: "+6.2%",
    icon: ShieldCheck,
    tone: "bg-violet-500/10 text-violet-600",
  },
  {
    label: "Active job listings",
    value: "1,426",
    detail: "382 posted this month",
    trend: "+14.1%",
    icon: BriefcaseBusiness,
    tone: "bg-amber-500/10 text-amber-600",
  },
  {
    label: "Applications",
    value: "32,891",
    detail: "4,208 received this month",
    trend: "+18.6%",
    icon: FileText,
    tone: "bg-rose-500/10 text-rose-600",
  },
  {
    label: "Interviews",
    value: "5,814",
    detail: "1,032 scheduled this month",
    trend: "+9.3%",
    icon: MessageSquareText,
    tone: "bg-cyan-500/10 text-cyan-600",
  },
]

const activity = [
  { title: "Northstar Labs upgraded to Enterprise", detail: "Subscription change", time: "12 min ago", icon: ArrowUpRight, tone: "text-emerald-600 bg-emerald-500/10" },
  { title: "New company account created", detail: "Brightpath Technologies", time: "38 min ago", icon: Building2, tone: "text-blue-600 bg-blue-500/10" },
  { title: "Bulk user import completed", detail: "Acme Corporation · 184 users", time: "1 hr ago", icon: Users, tone: "text-violet-600 bg-violet-500/10" },
  { title: "System settings updated", detail: "Password policy", time: "2 hrs ago", icon: ShieldCheck, tone: "text-amber-600 bg-amber-500/10" },
]

const subscriptionPlans = [
  { name: "Enterprise", companies: 42, percentage: 17, color: "bg-primary", chartColor: "#4f6ef7" },
  { name: "Professional", companies: 96, percentage: 39, color: "bg-cyan-500", chartColor: "#22d3ee" },
  { name: "Starter", companies: 110, percentage: 44, color: "bg-amber-400", chartColor: "#fbbf24" },
]

const healthChecks = [
  { label: "API availability", value: "99.98%", status: "Operational", icon: Server, tone: "text-emerald-600" },
  { label: "Background jobs", value: "142 processed", status: "Operational", icon: Activity, tone: "text-emerald-600" },
  { label: "Failed jobs", value: "3 require review", status: "Needs attention", icon: AlertTriangle, tone: "text-amber-600" },
]

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon

  return (
    <Card className="gap-3 py-4 shadow-sm">
      <CardContent className="px-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
          </div>
          <div className={`flex size-9 items-center justify-center rounded-lg ${stat.tone}`}>
            <Icon className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
          <span className="truncate text-muted-foreground">{stat.detail}</span>
          <span className="shrink-0 font-semibold text-emerald-600">{stat.trend}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-7">
        <div className="mx-auto max-w-350 space-y-6">
        
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Platform metrics">
            {stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <Card className="gap-0 shadow-sm">
              <CardHeader className="flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Applications and interviews</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">Monthly activity across all companies</p>
                </div>
                <button type="button" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="More activity options">
                </button>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-3xl font-bold tracking-tight">32,891</p>
                    <p className="mt-1 text-xs text-muted-foreground"><span className="font-semibold text-emerald-600">+18.6%</span> compared with last month</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Applications</span>
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-cyan-400" />Interviews</span>
                  </div>
                </div>
                <div className="mt-4 grid h-56 grid-cols-12 items-end gap-2 sm:gap-4">
                  {[58, 72, 64, 82, 70, 88, 76, 94, 80, 100, 91, 108].map((height, index) => (
                    <div key={index} className="flex h-full flex-col items-center justify-end gap-2">
                      <div className="flex h-full w-full items-end gap-1">
                        <div className="w-1/2 rounded-t-sm bg-primary/80" style={{ height: `${height * 0.82}%` }} />
                        <div className="w-1/2 rounded-t-sm bg-cyan-400/80" style={{ height: `${height * 0.46}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"][index]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className=" pb-4">
                <CardTitle>Subscription mix</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">248 total company accounts</p>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionPlans}
                        dataKey="companies"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="58%"
                        outerRadius="82%"
                        paddingAngle={3}
                        stroke="none"
                      >
                        {subscriptionPlans.map((plan) => <Cell key={plan.name} fill={plan.chartColor} />)}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} companies`, name]}
                        contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card)", fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 space-y-4">
                  {subscriptionPlans.map((plan) => (
                    <div key={plan.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`size-2 rounded-full ${plan.color}`} />
                        <span className="text-xs font-medium">{plan.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{plan.companies} companies <span className="ml-1 font-semibold text-foreground">{plan.percentage}%</span></span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <Card className="shadow-sm">
              <CardHeader className="flex-row items-center justify-between border-b border-border/70 pb-4">
                <div>
                  <CardTitle>Recent platform activity</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">Latest events from across the platform</p>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-border/70 pt-0">
                {activity.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex items-center gap-3 py-4">
                      <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${item.tone}`}><Icon className="size-4" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold">{item.title}</p>
                        <p className="mt-1 truncate text-[11px] text-muted-foreground">{item.detail}</p>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{item.time}</span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="border-b border-border/70 pb-4">
                <CardTitle>System health</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Service status and background processing</p>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {healthChecks.map((check) => {
                  const Icon = check.icon
                  const needsAttention = check.status === "Needs attention"
                  return (
                    <div key={check.label} className="flex items-center gap-3 rounded-lg border border-border/70 p-3">
                      <Icon className={`size-4 ${check.tone}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold">{check.label}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{check.value}</p>
                      </div>
                      <span className={`flex items-center gap-1.5 text-[11px] font-semibold ${check.tone}`}>
                        {needsAttention ? <AlertTriangle className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
                        {check.status}
                      </span>
                    </div>
                  )
                })}
                <div className="flex items-center gap-3 rounded-lg bg-emerald-500/5 p-3">
                  <HeartPulse className="size-4 text-emerald-600" />
                  <p className="flex-1 text-xs font-medium">All critical services are operational.</p>
                  <Clock3 className="size-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">30 day uptime</span>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-700 dark:text-amber-300">
            <XCircle className="size-4 shrink-0" />
            <span><strong>3 failed background jobs</strong> need review. Open system health to inspect the affected tasks.</span>
          </div>
        </div>
      </main>
    </div>
  )
}
