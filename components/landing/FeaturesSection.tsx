import { BarChart3, Check, Clock3, Search, Users } from "lucide-react";

const teamMembers = ["Jems R", "Jedan D", "Emily J", "Jordan M"];

function OnboardingPreview() {
  return (
    <div className="relative h-40 overflow-hidden rounded-xl bg-[#f5f7fa] p-4 sm:h-48">
      <div className="mb-5 flex items-center justify-between text-[9px] text-gray-400">
        <span>April</span>
        <span className="font-semibold text-gray-700">May 2025</span>
        <span>June</span>
      </div>
      <div className="space-y-4 text-[9px] text-gray-400">
        {["8:00", "10:00", "11:00", "1:00"].map((time) => (
          <div key={time} className="flex items-center gap-3">
            <span className="w-5">{time}</span>
            <div className="h-px flex-1 border-t border-dashed border-gray-200" />
          </div>
        ))}
      </div>
      <div className="absolute left-[31%] top-[41%] rounded bg-white px-2 py-1 text-[8px] font-semibold text-gray-700 shadow-sm">
        Weekly Team Sync
      </div>
      <div className="absolute right-[12%] top-[63%] rounded bg-gray-900 px-2 py-1 text-[8px] text-white shadow-sm">
        Onboarding Session
      </div>
      <div className="absolute left-[37%] top-[82%] rounded bg-[#5f8ff5] px-2 py-1 text-[8px] text-white shadow-sm">
        Daily Meeting
      </div>
    </div>
  );
}

function TeamPreview() {
  return (
    <div className="h-40 overflow-hidden rounded-xl bg-[#f5f7fa] p-4 sm:h-48">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-800">
          <Users className="h-3 w-3 text-[#4f82ee]" /> Trendex
        </span>
        <span className="flex items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-1 text-[8px] text-gray-400">
          <Search className="h-2.5 w-2.5" /> Search
        </span>
      </div>
      <div className="grid grid-cols-[12px_1.3fr_1fr_1fr_1fr] gap-2 border-b border-gray-200 pb-2 text-[7px] text-gray-400">
        <span>□</span><span>Name</span><span>Job Position</span><span>Department</span><span>Status</span>
      </div>
      <div className="space-y-1.5 pt-2 text-[8px] text-gray-500">
        {teamMembers.map((member, index) => (
          <div key={member} className={`grid grid-cols-[12px_1.3fr_1fr_1fr_1fr] items-center gap-2 rounded px-1 py-1 ${index === 1 ? "bg-blue-50" : ""}`}>
            <span>{index === 1 ? "☑" : "□"}</span>
            <span className="flex items-center gap-1 truncate font-medium text-gray-700"><span className="h-3 w-3 shrink-0 rounded-full bg-[#d9b596]" />{member}</span>
            <span className="truncate">{index % 2 ? "Lead Webisto" : "Head of Design"}</span>
            <span className="truncate">Product</span>
            <span className="rounded bg-green-50 px-1 py-0.5 text-center text-[7px] text-green-600">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformancePreview() {
  return (
    <div className="flex h-40 items-center justify-between rounded-xl bg-[#f5f7fa] px-4 sm:h-48 sm:px-7">
      <div className="w-[42%]">
        <div className="mb-3 flex -space-x-2">
          {teamMembers.slice(0, 4).map((member) => <span key={member} className="h-7 w-7 rounded-full border-2 border-white bg-[#d9b596]" />)}
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-sm text-white">+</span>
        </div>
        <p className="text-[8px] leading-relaxed text-gray-500">Monitor employee development, goal completion, and team performance in one view.</p>
        <p className="mt-3 text-[9px] font-semibold text-gray-700">Today</p>
        <p className="text-[8px] text-gray-400">20% uncompleted</p>
      </div>
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[conic-gradient(#4384f5_0deg_288deg,#dfe4e9_288deg_360deg)] sm:h-32 sm:w-32">
        <div className="flex h-[84%] w-[84%] flex-col items-center justify-center rounded-full bg-[#f5f7fa]">
          <span className="text-2xl font-medium text-gray-800">80%</span>
          <span className="text-[9px] text-gray-400">Work Complete</span>
        </div>
      </div>
    </div>
  );
}

function AttendancePreview() {
  const cells = Array.from({ length: 42 }, (_, index) => index);
  return (
    <div className="h-40 rounded-xl bg-[#f5f7fa] p-4 sm:h-48">
      <div className="flex items-start justify-between">
        <div><p className="text-[9px] text-gray-500">May 2025</p><p className="text-xl text-gray-800">94% <span className="text-[8px] text-green-500">+3.11%</span></p></div>
        <span className="rounded border border-gray-200 bg-white px-2 py-1 text-[8px] text-gray-500">This Week⌄</span>
      </div>
      <div className="mt-3 flex gap-2"><div className="flex flex-col justify-between py-0.5 text-[7px] text-gray-400"><span>8:00</span><span>9:00</span><span>10:00</span><span>11:00</span><span>1:00</span></div><div className="grid flex-1 grid-cols-7 gap-1">{cells.map((cell) => <span key={cell} className={`h-3 rounded-[2px] ${cell % 7 === 2 || cell % 7 === 4 ? "bg-[#6f9cf0]" : cell % 5 === 0 ? "bg-[#b8cef9]" : "bg-[#e1e9fb]"}`} />)}</div></div>
      <div className="mt-2 flex justify-between pl-8 text-[7px] text-gray-400"><span>Sunday</span><span>Monday</span><span>Tuesday</span><span>Wednesday</span><span>Thursday</span><span>Friday</span><span>Saturday</span></div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="bg-[#f8f8f8] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-10 grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-end lg:mb-12">
          <h2 className="max-w-xl text-3xl font-semibold leading-[1.12] tracking-tight text-gray-900 sm:text-4xl">
            Powerful Features to <span className="text-gray-500">Simplify</span><br className="hidden sm:block" /> HR Management
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-gray-500">
            Manage onboarding, attendance, performance, and more from one smart dashboard. Treandex helps your HR team work faster, smarter, and with total clarity.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
            <OnboardingPreview />
            <div className="px-1 pb-1 pt-4"><h3 className="text-xl font-semibold text-gray-900">Smart Onboarding</h3><p className="mt-1 text-xs leading-relaxed text-gray-500">Seamlessly welcome new hires with automated checklists and document flows. Ensure a smooth, consistent experience for every team member.</p></div>
          </article>
          <article className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
            <TeamPreview />
            <div className="px-1 pb-1 pt-4"><h3 className="text-xl font-semibold text-gray-900">Time &amp; Attendance Tracking</h3><p className="mt-1 text-xs leading-relaxed text-gray-500">Track employee hours, absences, and time-off requests in real time. Gain complete visibility and reduce manual errors.</p></div>
          </article>
          <article className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
            <PerformancePreview />
            <div className="px-1 pb-1 pt-4"><h3 className="text-xl font-semibold text-gray-900">Performance Management</h3><p className="mt-1 text-xs leading-relaxed text-gray-500">Set goals, track progress, and build high-performing teams with transparent feedback and clear growth paths.</p></div>
          </article>
          <article className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
            <AttendancePreview />
            <div className="px-1 pb-1 pt-4"><h3 className="text-xl font-semibold text-gray-900">Leave &amp; Attendance</h3><p className="mt-1 text-xs leading-relaxed text-gray-500">Easily manage time-off requests, holidays, and sick leave in one place. Automated tracking reduces admin work and keeps teams in sync.</p></div>
          </article>
        </div>
      </div>
    </section>
  );
}
