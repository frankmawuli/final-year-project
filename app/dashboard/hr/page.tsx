"use client"

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
import { HRIconSidebar } from "@/components/hr-icon-sidebar"
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
import { act } from "react"

// ── Asset URLs ───────────────────────────────────────────────
const profilePhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

const activityPhotos = [
  "/assets/2aa4ccfe7aa8b40d03bc579f255782e2d4894460.png",
  "/assets/ebd4a3a11f0187a98b13e4c169aed2f3d43383cf.png",
  "/assets/436771083b9e6fbf3b904cb9059f230ff9ac3c54.png",
  "/assets/9162b46046ea191cf2521da217a47666fbc1dd85.png",
]

const employeePhotos = [
  "/assets/9e3b4e81174edab916396a375259694534e63067.png",
  "/assets/aaaa09271295e3a0e2de430793dd620b97f19e60.png",
  "/assets/bc29c53acc3a7842572d5ad4194df98ca02711de.png",
  "/assets/06f94aa9dc854a370f71bf1ebb26ed778dcf8302.png",
]

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

const departmentData = [
  { name: "Engineering", value: 35 },
  { name: "HR",          value: 6  },
  { name: "Marketing",   value: 12 },
  { name: "Finance",     value: 8  },
  { name: "Support",     value: 20 },
]

const roleData = [
  { name: "Engineers",   value: 35, color: "#3d70fa" },
  { name: "Managers",    value: 18, color: "#f59e0b" },
  { name: "HR Staff",    value: 10, color: "#10b981" },
  { name: "Marketing",   value: 12, color: "#f472b6" },
  { name: "Interns",     value: 25, color: "#a78bfa" },
]

// ── Sidebar Data ─────────────────────────────────────────────
const hrActivities = [
  { icon: CalendarClock, text: "John Doe submitted a leave request",  time: "Just now"        },
  { icon: UserPlus,      text: "New employee registered",             time: "1 hour ago"      },
  { icon: DollarSign,    text: "Payroll processed for March",         time: "3 hours ago"     },
  { icon: FileText,      text: "Job application received",            time: "Today, 10:24 AM" },
  { icon: FileCheck,     text: "Contract signed — Aisha Mensah",      time: "Yesterday"       },
]

const recruitmentActivity = [
  { photo: activityPhotos[0], text: "Candidate applied for Frontend Developer", time: "Just now"       },
  { photo: activityPhotos[1], text: "Interview scheduled with Sarah Adams",      time: "2 hours ago"   },
  { photo: activityPhotos[2], text: "Offer sent to Michael Lee",                 time: "12 hours ago"  },
  { photo: activityPhotos[3], text: "Candidate accepted offer",                  time: "Feb 28, 2026"  },
]

const newEmployees = [
  { photo: employeePhotos[0], name: "Sarah Johnson", role: "UI Designer"       },
  { photo: employeePhotos[1], name: "David Mensah",  role: "Backend Engineer"  },
  { photo: employeePhotos[2], name: "Anita Clarke",  role: "HR Coordinator"    },
  { photo: employeePhotos[3], name: "Kevin Osei",    role: "Marketing Analyst" },
]

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
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
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
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <HRIconSidebar />

      {/* ── Text sidebar ── */}
      <HrNavigationPannel navItems={navItems}/>
    

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1280px] p-6">
        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <StatCard
            label="Total Employees"
            value="124"
            change="+4 this month"
            positive
            icon={Users}
          />
          <StatCard
            label="Open Job Positions"
            value="8"
            change="+2 this week"
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
        <div className="mb-6 rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-foreground">HR Workforce Analytics</p>
              <p className="text-xs text-muted-foreground">Monthly attendance rate (%)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={attendanceData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[80, 100]}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                cursor={{ stroke: "#e5e7eb" }}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
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
        <div className="grid grid-cols-2 gap-4">
          {/* Employees by Department */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <p className="mb-4 text-base font-semibold text-foreground">Employees by Department</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={departmentData} barSize={28} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[0, 10, 20, 30, 40]}
                />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                  formatter={(v) => [v, "Employees"]}
                />
                <Bar dataKey="value" fill="#3d70fa" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Employees by Role */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <p className="mb-4 text-base font-semibold text-foreground">Employees by Role</p>
            <div className="flex items-center gap-4">
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
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                    formatter={(v) => [v, "Employees"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {roleData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>{/* end max-w wrapper */}
      </main>

      {/* ── Right sidebar ── */}
      <aside className="flex w-[260px] shrink-0 flex-col gap-6 overflow-y-auto border-l border-border bg-white p-4">
        {/* HR Activities */}
        <section>
          <p className="mb-2 px-1 py-2 text-sm font-semibold text-foreground">HR Activities</p>
          <div className="flex flex-col gap-1">
            {hrActivities.map(({ icon: Icon, text, time }, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted/50">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] leading-snug text-foreground">{text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recruitment Activity */}
        <section>
          <p className="mb-2 px-1 py-2 text-sm font-semibold text-foreground">Recruitment Activity</p>
          <div className="relative flex flex-col gap-1">
            <div className="absolute bottom-[10%] left-[19px] top-[10%] w-px bg-border" />
            {recruitmentActivity.map(({ photo, text, time }, i) => (
              <div key={i} className="relative flex items-start gap-2 rounded-lg p-2">
                <img
                  src={photo}
                  alt=""
                  className="relative z-10 size-6 shrink-0 rounded-full object-cover ring-2 ring-white"
                />
                <div className="min-w-0">
                  <p className="text-[13px] leading-snug text-foreground">{text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Employees */}
        <section>
          <p className="mb-2 px-1 py-2 text-sm font-semibold text-foreground">New Employees</p>
          <div className="flex flex-col gap-1">
            {newEmployees.map(({ photo, name, role }, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted/50">
                <img
                  src={photo}
                  alt={name}
                  className="size-7 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  )
}
