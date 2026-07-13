import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lock,
  RotateCw,
  Share2,
  Plus,
  Copy,
  LayoutDashboard,
  Briefcase,
  Users,
  Monitor,
  ClipboardList,
  Moon,
  Settings,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const logoSvg = "/assets/db803ca622d556de5dc88a89ce27f842fcbf3c8b.svg";
const chatbotSvg = "/assets/chatbot.svg";

const iconNav = [
  { icon: LayoutDashboard, active: true },
  { icon: Briefcase },
  { icon: Users },
  { icon: Monitor },
  { icon: ClipboardList },
  { img: chatbotSvg },
];

const subNav = ["Overview", "Calendar", "Announcement"];

const stats = [
  { label: "Total Employees", value: "4", change: "+0 this month", icon: Users },
  { label: "Open Job Positions", value: "4", change: "+0 this week", icon: Briefcase },
  { label: "Attendance Today", value: "96%", change: "+1.2% vs yesterday", icon: Calendar },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const attendance = [91, 88, 94, 90, 96, 92, 87, 95, 91, 97, 94, 96];
const attendancePoints = attendance
  .map((v, i) => {
    const x = (i * 300) / (attendance.length - 1);
    const y = 90 - ((v - 80) / 20) * 84;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(" ");

const departments = [
  { name: "Engineering", value: 13 },
  { name: "Hr", value: 10 },
  { name: "Labour", value: 5 },
  { name: "Marketting", value: 6 },
  { name: "Sales", value: 10 },
];

const roles = [
  { label: "Fullstack Developer", value: 5, color: "#3d70fa" },
  { label: "HR Officer", value: 6, color: "#f59e0b" },
  { label: "Software Engineer", value: 7, color: "#10b981" },
  { label: "UI/UX Designer", value: 3, color: "#f472b6" },
];

const hrActivities = [
  { text: "Ama Boateng's leave request was approved", time: "4 hours ago" },
  { text: "Ama Boateng's leave request was rejected", time: "4 hours ago" },
  { text: "Ama Boateng submitted a leave request", time: "2 days ago" },
  { text: "Ama Boateng submitted a leave request", time: "2 days ago" },
];

const newEmployees = [
  { name: "Frank Mawuli Gbadago", role: "Fullstack Developer", initial: "F" },
  { name: "Abena Nyarko", role: "HR Officer", initial: "A" },
  { name: "Kofi Asare", role: "UI/UX Designer", initial: "K" },
  { name: "Ama Boateng", role: "Software Engineer", initial: "A" },
];

export function DashboardMockup() {
  return (
    <div className="w-full">
      {/* Laptop screen */}
      <div className="relative rounded-[14px] bg-neutral-900 p-[6px] shadow-2xl">
        <div className="absolute left-1/2 top-[3px] z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-neutral-600" />

        <div className="overflow-hidden rounded-[8px] bg-white">
          {/* Browser toolbar */}
          <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-2.5 py-1.5">
            <ChevronLeft className="h-3 w-3 text-gray-400" />
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <BookOpen className="h-3 w-3 text-gray-400" />
            <div className="mx-1 flex flex-1 items-center justify-center gap-1.5 rounded-md bg-white px-2 py-1 text-[8px] text-gray-500 ring-1 ring-gray-200">
              <Lock className="h-2.5 w-2.5 text-gray-400" />
              <span>corerecruiter.app</span>
              <RotateCw className="h-2.5 w-2.5 text-gray-400" />
            </div>
            <Share2 className="h-3 w-3 text-gray-400" />
            <Plus className="h-3 w-3 text-gray-400" />
            <Copy className="h-3 w-3 text-gray-400" />
          </div>

          {/* Dashboard body */}
          <div className="flex h-100 md:h-110">
            {/* Icon-only sidebar */}
            <div className="flex w-9 shrink-0 flex-col items-center border-r border-gray-100 bg-white py-2">
              <img src={logoSvg} alt="" className="mb-2 h-4 w-4 object-contain" />
              <div className="flex flex-1 flex-col items-center gap-1">
                {iconNav.map(({ icon: Icon, img, active }, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md",
                      active && "bg-primary/10"
                    )}
                  >
                    {img ? (
                      <img src={img} alt="" className="h-3 w-3 object-contain" />
                    ) : Icon ? (
                      <Icon className={cn("h-3 w-3", active ? "text-primary" : "text-gray-400")} />
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center gap-1.5 pb-1">
                <Moon className="h-3 w-3 text-gray-300" />
                <Settings className="h-3 w-3 text-gray-300" />
              </div>
            </div>

            {/* Labeled sub-nav sidebar */}
            <div className="flex w-[76px] shrink-0 flex-col border-r border-gray-100 bg-white py-2">
              <div className="flex flex-col gap-0.5 px-1.5">
                {subNav.map((item, i) => (
                  <div
                    key={item}
                    className={cn(
                      "rounded-md px-1.5 py-1 text-[7px]",
                      i === 0 ? "bg-primary/10 font-semibold text-primary" : "text-gray-500"
                    )}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-1 px-1.5 pt-2">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[6px] font-bold text-white">
                  F
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[6.5px] font-semibold leading-none text-gray-700">
                    Frank Gbadago
                  </div>
                  <div className="truncate text-[5.5px] leading-none text-gray-400">
                    HR Administrator
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden bg-gray-50/60 p-1.5">
              {/* Stat cards */}
              <div className="mb-1.5 grid grid-cols-3 gap-1">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-gray-100 bg-white p-1.5">
                    <div className="mb-1 flex items-start justify-between">
                      <span className="text-[6.5px] leading-tight text-gray-400">{stat.label}</span>
                      <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded bg-primary/10">
                        <stat.icon className="h-2 w-2 text-primary" />
                      </div>
                    </div>
                    <div className="text-[12px] font-bold leading-none text-gray-800">{stat.value}</div>
                    <div className="mt-1 flex items-center gap-0.5 text-[5.5px] font-medium text-green-500">
                      <TrendingUp className="h-1.5 w-1.5" />
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* HR Workforce Analytics */}
              <div className="mb-1.5 rounded-lg border border-gray-100 bg-white p-1.5">
                <div className="text-[8px] font-bold text-gray-800">HR Workforce Analytics</div>
                <div className="mb-1 text-[6px] text-gray-400">Monthly attendance rate (%)</div>
                <div className="flex gap-1">
                  <div className="flex h-20 flex-col justify-between py-0.5 text-[5px] leading-none text-gray-300">
                    <span>100%</span>
                    <span>95%</span>
                    <span>90%</span>
                    <span>85%</span>
                    <span>80%</span>
                  </div>
                  <svg viewBox="0 0 300 90" className="h-20 flex-1" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3d70fa" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3d70fa" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[6, 27, 48, 69, 90].map((y) => (
                      <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#f1f2f4" strokeWidth="1" />
                    ))}
                    <polygon points={`0,90 ${attendancePoints} 300,90`} fill="url(#attendanceGrad)" />
                    <polyline
                      fill="none"
                      stroke="#3d70fa"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      points={attendancePoints}
                    />
                  </svg>
                </div>
                <div className="ml-3.5 flex justify-between text-[5px] text-gray-300">
                  {months.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Department + Role charts */}
              <div className="grid flex-1 grid-cols-2 gap-1">
                {/* Employees by Department */}
                <div className="flex flex-col rounded-lg border border-gray-100 bg-white p-1.5">
                  <div className="mb-1 text-[7px] font-bold text-gray-800">Employees by Department</div>
                  <div className="flex flex-1 gap-1">
                    <div className="flex flex-col justify-between text-[5px] leading-none text-gray-300">
                      <span>40</span>
                      <span>30</span>
                      <span>20</span>
                      <span>10</span>
                      <span>0</span>
                    </div>
                    <div className="flex flex-1 items-end justify-between gap-0.5 border-l border-gray-100 pl-1">
                      {departments.map((d) => (
                        <div
                          key={d.name}
                          className="w-full rounded-t-[1px] bg-primary"
                          style={{ height: d.value > 0 ? `${(d.value / 40) * 100}%` : "1px" }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="ml-3.5 mt-1 flex justify-between gap-px text-[4.5px] leading-none text-gray-300">
                    {departments.map((d) => (
                      <span key={d.name} className="truncate">
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Employees by Role */}
                <div className="flex flex-col rounded-lg border border-gray-100 bg-white p-1.5">
                  <div className="mb-1 text-[7px] font-bold text-gray-800">Employees by Role</div>
                  <div className="flex flex-1 items-center gap-1.5">
                    <div
                      className="relative aspect-square h-full max-h-14 shrink-0 rounded-full"
                      style={{
                        background: `conic-gradient(${roles
                          .map((r, i) => `${r.color} ${(i / roles.length) * 100}% ${((i + 1) / roles.length) * 100}%`)
                          .join(", ")})`,
                      }}
                    >
                      <div className="absolute inset-[22%] rounded-full bg-white" />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      {roles.map((r) => (
                        <div key={r.label} className="flex items-center gap-0.5 text-[5px] leading-none">
                          <span
                            className="h-1 w-1 shrink-0 rounded-full"
                            style={{ backgroundColor: r.color }}
                          />
                          <span className="flex-1 truncate text-gray-500">{r.label}</span>
                          <span className="font-semibold text-gray-700">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right activity panel */}
            <div className="w-[108px] shrink-0 overflow-hidden border-l border-gray-100 bg-white p-1.5">
              <div className="mb-1 text-[7px] font-bold text-gray-800">HR Activities</div>
              <div className="mb-1.5 flex flex-col">
                {hrActivities.map((a, i) => (
                  <div key={i} className="flex gap-1 border-b border-gray-50 py-1 last:border-0">
                    <div className="mt-px flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-1.5 w-1.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[5.5px] leading-tight text-gray-600">{a.text}</div>
                      <div className="text-[5px] text-gray-300">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-1 text-[7px] font-bold text-gray-800">Recruitment Activity</div>
              <div className="mb-1.5 text-[5.5px] text-gray-300">No recent activity</div>

              <div className="mb-1 text-[7px] font-bold text-gray-800">New Employees</div>
              <div className="flex flex-col gap-1">
                {newEmployees.map((e) => (
                  <div key={e.name} className="flex items-center gap-1">
                    <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[5.5px] font-semibold text-primary">
                      {e.initial}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[5.5px] font-semibold leading-tight text-gray-700">
                        {e.name}
                      </div>
                      <div className="truncate text-[5px] leading-tight text-gray-400">{e.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Laptop base */}
      <div className="relative mx-[3%]">
        <div className="h-2 rounded-b-xl bg-gradient-to-b from-neutral-300 to-neutral-400" />
        <div className="absolute left-1/2 top-0 h-[3px] w-16 -translate-x-1/2 rounded-b bg-neutral-500/40" />
      </div>
      <div className="mt-1 text-center text-[8px] font-medium text-neutral-400">MacBook Air</div>
    </div>
  );
}
