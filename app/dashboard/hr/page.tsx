"use client"

import {
  Target,
  User,
  PackageSearch,
  Radio,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
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
  Legend,
  Tooltip,
} from "recharts"

// ── Asset URLs ──────────────────────────────────────────────
const profilePhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

const activityPhotos = [
  "/assets/2aa4ccfe7aa8b40d03bc579f255782e2d4894460.png",
  "/assets/ebd4a3a11f0187a98b13e4c169aed2f3d43383cf.png",
  "/assets/436771083b9e6fbf3b904cb9059f230ff9ac3c54.png",
  "/assets/9162b46046ea191cf2521da217a47666fbc1dd85.png",
  "/assets/06f94aa9dc854a370f71bf1ebb26ed778dcf8302.png",
]

const customerPhotos = [
  "/assets/9e3b4e81174edab916396a375259694534e63067.png",
  "/assets/aaaa09271295e3a0e2de430793dd620b97f19e60.png",
  "/assets/bc29c53acc3a7842572d5ad4194df98ca02711de.png",
]

// ── Chart Data ───────────────────────────────────────────────
const visitorsData = Array.from({ length: 30 }, (_, i) => ({
  day: String(i + 1),
  visits: Math.floor(100 + Math.random() * 280 + (i === 14 ? 80 : 0)),
}))

const deviceData = [
  { name: "Linux",   value: 18000 },
  { name: "Mac",     value: 26000 },
  { name: "iOS",     value: 30000 },
  { name: "Windows", value: 28000 },
  { name: "Android", value: 10000 },
  { name: "Other",   value: 6000  },
]

const locationData = [
  { name: "United States", value: 38.6, color: "#93c5fd" },
  { name: "Canada",        value: 22.5, color: "#fcd34d" },
  { name: "Mexico",        value: 30.8, color: "#f9a8d4" },
  { name: "Other",         value: 8.1,  color: "#d1d5db" },
]


const notifications = [
  { icon: Target,        text: "You launched a campaign.",    time: "Just now"        },
  { icon: User,          text: "New user signed up.",         time: "32 minutes ago"  },
  { icon: PackageSearch, text: "You restocked XYZ product.",  time: "8 hours ago"     },
  { icon: Radio,         text: "Running low on XYZ product.", time: "Today, 10:24 AM" },
]

const teamActivity = [
  { photo: activityPhotos[0], text: "Ordered XYZ product.",       time: "Just now"        },
  { photo: activityPhotos[1], text: "Inquired about ABC product.", time: "59 minutes ago"  },
  { photo: activityPhotos[2], text: "Submitted a review.",         time: "12 hours ago"    },
  { photo: activityPhotos[3], text: "Completed transaction.",      time: "Today, 11:59 AM" },
  { photo: activityPhotos[4], text: "Signed up for newsletter.",   time: "Feb 2, 2024"     },
]

const newCustomers = [
  { photo: customerPhotos[0], name: "Cheyenne Saris"  },
  { photo: customerPhotos[1], name: "Aspen Stanton"   },
  { photo: customerPhotos[2], name: "Talan Septimus"  },
]

// ── Sub-components ────────────────────────────────────────────
function StatCard({
  label,
  value,
  change,
  positive,
}: {
  label: string
  value: string
  change: string
  positive: boolean
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-white p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
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

// ── Main Page ─────────────────────────────────────────────────
export default function HRDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-[#1c1c1c]">
      <HRIconSidebar />

      {/* ── Text sidebar ── */}
      <aside className="flex w-[280px] shrink-0 flex-col justify-between bg-white py-5 pl-5 pr-3 shadow-sm">
        <nav className="flex flex-col gap-1">
          {["Overview", "Calendar", "Announcement"].map((item, i) => (
            <button
              key={item}
              className={`w-full rounded px-3 py-2.5 text-left text-base font-medium transition-colors ${
                i === 0
                  ? "text-[#324054]"
                  : "text-[#324054] hover:bg-muted"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Profile */}
        <div className="flex items-center gap-2 rounded-lg px-3 py-2">
          <img
            src={profilePhoto}
            alt="Michael Smith"
            className="size-10 shrink-0 rounded-full object-cover"
          />
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-sm font-medium text-[#324054]">Michael Smith</p>
            <p className="truncate text-xs text-[#71839b]">michaelsmith12@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <StatCard label="Revenue"    value="$16,249" change="+11.02%" positive />
          <StatCard label="Expenses"   value="$3,671"  change="-0.03%"  positive={false} />
          <StatCard label="New Orders" value="24,094"  change="+15.03%" positive />
        </div>

        {/* Visitors Analytics */}
        <div className="mb-6 rounded-xl border border-border bg-white p-6 shadow-sm">
          <p className="mb-4 text-base font-semibold text-foreground">Visitors Analytics</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={visitorsData} barSize={14} margin={{ left: -20 }}>
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                ticks={[0, 100, 200, 300, 400]}
              />
              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Bar dataKey="visits" fill="#3d70fa" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom charts row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Traffic by Device */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <p className="mb-4 text-base font-semibold text-foreground">Traffic by Device</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={deviceData} barSize={28} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000}K`}
                  ticks={[0, 10000, 20000, 30000]}
                />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                  formatter={(v: number) => [`${(v / 1000).toFixed(0)}K`, "Visits"]}
                />
                <Bar dataKey="value" fill="#d1d5db" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic by Location */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <p className="mb-4 text-base font-semibold text-foreground">Traffic by Location</p>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={66}
                    dataKey="value"
                    strokeWidth={2}
                  >
                    {locationData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {locationData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Right sidebar ── */}
      <aside className="flex w-[280px] shrink-0 flex-col gap-6 overflow-y-auto border-l border-border bg-white p-4">
        {/* Notifications */}
        <section>
          <p className="mb-2 px-1 py-2 text-sm text-[#1c1c1c]">Notifications</p>
          <div className="flex flex-col gap-1">
            {notifications.map(({ icon: Icon, text, time }, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg p-2">
                <div className="mt-0.5 shrink-0 p-1">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-[#1c1c1c]">{text}</p>
                  <p className="text-xs text-[rgba(28,28,28,0.4)]">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Activity */}
        <section>
          <p className="mb-2 px-1 py-2 text-sm text-[#1c1c1c]">Team Activity</p>
          <div className="relative flex flex-col gap-1">
            {/* Timeline line */}
            <div className="absolute bottom-[10%] left-[19px] top-[10%] w-px bg-[rgba(28,28,28,0.1)]" />
            {teamActivity.map(({ photo, text, time }, i) => (
              <div key={i} className="relative flex items-start gap-2 rounded-lg p-2">
                <img
                  src={photo}
                  alt=""
                  className="relative z-10 size-6 shrink-0 rounded-full object-cover ring-2 ring-white"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm text-[#1c1c1c]">{text}</p>
                  <p className="text-xs text-[rgba(28,28,28,0.4)]">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Customers */}
        <section>
          <p className="mb-2 px-1 py-2 text-sm text-[#1c1c1c]">New Customers</p>
          <div className="flex flex-col gap-1">
            {newCustomers.map(({ photo, name }, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg p-2">
                <img
                  src={photo}
                  alt={name}
                  className="size-6 shrink-0 rounded-full object-cover"
                />
                <p className="text-sm text-[#1c1c1c]">{name}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  )
}
