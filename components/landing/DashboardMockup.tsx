import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const sidebarItems = [
  "Dashboard",
  "Jobs",
  "Candidates",
  "Interviews",
  "Employees",
  "Payroll",
  "Performance",
  "Reports",
  "Settings",
];

const kpis = [
  { label: "Open Positions", val: "24", change: "+12% from last month" },
  { label: "New Candidates", val: "156", change: "+38% from last month" },
  { label: "Interviews Today", val: "8", change: "+6% from yesterday" },
  { label: "Employees", val: "342", change: "+6% from last month" },
];

const recentActivity = [
  "Frontend Developer position has 12 new applications",
  "Interview scheduled with John Smith",
  "New hire Michael Brown joined the team",
  "Offer accepted by Emily Davis",
];

export function DashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-3 py-2">
        <div className="flex items-center gap-1">
          <Logo width={29} height={29} />
          <span className="text-xs font-bold text-gray-800">CoreRecruiter</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            <div className="h-4 w-4 rounded-full bg-gray-100" />
            <div className="h-4 w-4 rounded-full bg-gray-100" />
          </div>
          <div className="flex items-center gap-1 border-l border-gray-100 pl-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary">
              SJ
            </div>
            <div>
              <div className="text-[9px] font-semibold text-gray-700">Sarah Johnson</div>
              <div className="text-[8px] text-gray-400">HR Manager</div>
            </div>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex h-[300px] md:h-[340px]">
        {/* Sidebar */}
        <div className="w-[92px] flex-shrink-0 border-r border-gray-100 bg-white py-1.5">
          {sidebarItems.map((item, i) => (
            <div
              key={item}
              className={cn(
                "cursor-pointer px-2.5 py-1 text-[9px]",
                i === 0
                  ? "border-r-2 border-primary bg-primary/10 font-semibold text-primary"
                  : "text-gray-400"
              )}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden bg-gray-50/60 p-2.5">
          <div className="mb-2">
            <div className="text-[11px] font-bold text-gray-800">Welcome back, Sarah! 👋</div>
            <div className="text-[8px] text-gray-400">
              Here&apos;s what&apos;s happening with your organization today.
            </div>
          </div>

          {/* KPI cards */}
          <div className="mb-2 grid grid-cols-4 gap-1">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-gray-100 bg-white p-1.5">
                <div className="text-[7.5px] text-gray-400">{kpi.label}</div>
                <div className="text-[14px] font-bold text-gray-800">{kpi.val}</div>
                <div className="text-[7px] font-medium text-green-500">{kpi.change}</div>
              </div>
            ))}
          </div>

          {/* Chart + Activity row */}
          <div className="grid grid-cols-5 gap-1">
            {/* Line chart */}
            <div className="col-span-3 rounded-lg border border-gray-100 bg-white p-1.5">
              <div className="mb-1 flex items-center justify-between">
                <div className="text-[9px] font-semibold text-gray-700">Hiring Overview</div>
                <div className="text-[7.5px] text-gray-400">This Month ▾</div>
              </div>
              <svg viewBox="0 0 180 55" className="h-14 w-full">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F6EF7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4F6EF7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 42 L 30 32 L 60 36 L 90 16 L 120 24 L 150 8 L 180 14 L 180 55 L 0 55 Z"
                  fill="url(#chartGrad)"
                />
                <polyline
                  fill="none"
                  stroke="#4F6EF7"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points="0,42 30,32 60,36 90,16 120,24 150,8 180,14"
                />
                {([
                  [0, 42],
                  [30, 32],
                  [60, 36],
                  [90, 16],
                  [120, 24],
                  [150, 8],
                  [180, 14],
                ] as [number, number][]).map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill="white"
                    stroke="#4F6EF7"
                    strokeWidth="1"
                  />
                ))}
              </svg>
              <div className="flex justify-between text-[7px] text-gray-300">
                {["May 1", "May 8", "May 15", "May 22", "May 29"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="col-span-2 rounded-lg border border-gray-100 bg-white p-1.5">
              <div className="mb-1 flex items-center justify-between">
                <div className="text-[9px] font-semibold text-gray-700">Recent Activity</div>
                <div className="cursor-pointer text-[7.5px] font-medium text-primary">View all</div>
              </div>
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-1 border-b border-gray-50 py-1 last:border-0">
                  <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <div className="text-[7.5px] leading-tight text-gray-500">{activity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
