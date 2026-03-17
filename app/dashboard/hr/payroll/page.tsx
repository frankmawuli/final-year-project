"use client"

import { useState } from "react"
import Link from "next/link"
import { DollarSign, BarChart2, Minus, CalendarDays, Clock, ChevronRight, Search } from "lucide-react"
import { HRIconSidebar } from "@/components/hr-icon-sidebar"
import { cn } from "@/lib/utils"

// ── Assets ────────────────────────────────────────────────────
const adminPhoto = "http://localhost:3845/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

const photos = {
  a: "http://localhost:3845/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png",
  b: "http://localhost:3845/assets/c8f5ae43e33ebde623eb7d3b22aeb6930878a4ce.png",
  c: "http://localhost:3845/assets/cf9965b714128bf9b66e7daf6ad58bf5300b9eea.png",
  d: "http://localhost:3845/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png",
  e: "http://localhost:3845/assets/ba50d841bff1eb820c0b59f56f778fbbf8b8a8c3.png",
  f: "http://localhost:3845/assets/3b57a33d98b5a1b80a335988932aa248a0875725.png",
  g: "http://localhost:3845/assets/635a3bf857069957b4442100197a1e910ea3121d.png",
  h: "http://localhost:3845/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png",
  i: "http://localhost:3845/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png",
}

// ── Employee payroll data ──────────────────────────────────────
interface PayrollEmployee {
  id:         number
  name:       string
  email:      string
  photo:      string
  department: string
  baseSalary: number
  bonus:      number
  deductions: number
  status:     "Paid" | "Pending" | "Processing"
}

const payrollEmployees: PayrollEmployee[] = [
  { id: 1, name: "Michael Chen",     email: "michael.chen@corecruiter.com",     photo: photos.a, department: "Design",       baseSalary: 9500,  bonus: 1200, deductions: 2150, status: "Paid"       },
  { id: 2, name: "Sarah Williams",   email: "sarah.williams@corecruiter.com",   photo: photos.b, department: "Marketing",    baseSalary: 8750,  bonus: 1500, deductions: 2050, status: "Paid"       },
  { id: 3, name: "David Rodriguez",  email: "david.rodriguez@corecruiter.com",  photo: photos.c, department: "Engineering",  baseSalary: 11200, bonus: 2100, deductions: 2800, status: "Paid"       },
  { id: 4, name: "James Anderson",   email: "james.anderson@corecruiter.com",   photo: photos.d, department: "Sales",        baseSalary: 13500, bonus: 3000, deductions: 3200, status: "Paid"       },
  { id: 5, name: "Jessica Martinez", email: "jessica.martinez@corecruiter.com", photo: photos.e, department: "Design",       baseSalary: 8200,  bonus: 900,  deductions: 1950, status: "Paid"       },
  { id: 6, name: "Robert Taylor",    email: "robert.taylor@corecruiter.com",    photo: photos.f, department: "Engineering",  baseSalary: 12083, bonus: 2800, deductions: 3383, status: "Paid"       },
  { id: 7, name: "Priya Patel",      email: "priya.patel@corecruiter.com",      photo: photos.g, department: "Analytics",    baseSalary: 9800,  bonus: 1100, deductions: 2300, status: "Paid"       },
  { id: 8, name: "Lena Schmidt",     email: "lena.schmidt@corecruiter.com",     photo: photos.h, department: "HR",           baseSalary: 7600,  bonus: 800,  deductions: 1750, status: "Paid"       },
  { id: 9, name: "Omar Hassan",      email: "omar.hassan@corecruiter.com",      photo: photos.i, department: "Engineering",  baseSalary: 11500, bonus: 2500, deductions: 2950, status: "Processing" },
]

const statusStyle: Record<PayrollEmployee["status"], string> = {
  Paid:       "bg-emerald-50 text-emerald-600",
  Pending:    "bg-amber-50 text-amber-600",
  Processing: "bg-blue-50 text-[#2d68fe]",
}

// ── Data ──────────────────────────────────────────────────────
const stats = [
  {
    label:       "Total Payroll",
    value:       "$117,449",
    change:      "+3.2%",
    changeLabel: "this month",
    positive:    true,
    Icon:        DollarSign,
    iconBg:      "bg-[#2d68fe]",
  },
  {
    label:       "Total Gross",
    value:       "$157,723",
    change:      "+2.8%",
    changeLabel: "before deductions",
    positive:    true,
    Icon:        BarChart2,
    iconBg:      "bg-[#2d68fe]",
  },
  {
    label:       "Total Deductions",
    value:       "$40,274",
    change:      "+1.5%",
    changeLabel: "taxes & benefits",
    positive:    false,
    Icon:        Minus,
    iconBg:      "bg-[#eef0f6]",
  },
]

const payrollRuns = [
  { period: "March 2026",    employees: 14, meta: "Due Mar 31",  amount: "$117,449", status: "Scheduled" },
  { period: "February 2026", employees: 14, meta: "Paid Feb 28", amount: "$113,827", status: "Completed" },
  { period: "January 2026",  employees: 14, meta: "Paid Jan 31", amount: "$115,203", status: "Completed" },
  { period: "December 2025", employees: 13, meta: "Paid Dec 31", amount: "$108,945", status: "Completed" },
]

const payDistribution = [
  { dept: "Engineering", amount: 52380 },
  { dept: "Product",     amount: 28740 },
  { dept: "Design",      amount: 17690 },
  { dept: "Marketing",   amount: 11790 },
  { dept: "Sales",       amount:  6849 },
]

const maxPay = Math.max(...payDistribution.map((d) => d.amount))

const sidebarNav = [
  { label: "Employees",   href: "/dashboard/hr/employees"   },
  { label: "Departments", href: "/dashboard/hr/departments" },
  { label: "Leave",       href: "/dashboard/hr/leave"       },
  { label: "Payroll",     href: "/dashboard/hr/payroll"     },
  { label: "History",     href: "#"                         },
]

const TABS = ["Overview", "Employees", "Payroll Runs"] as const
type Tab = (typeof TABS)[number]

// ── Employees tab content ──────────────────────────────────────
function EmployeesPayrollTab() {
  const [search, setSearch] = useState("")

  const filtered = payrollEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (n: number) => `$${n.toLocaleString()}`

  return (
    <div className="rounded-2xl bg-white shadow-sm">
      {/* Table toolbar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold text-[#1c1c1c]">Employee Payroll — March 2026</h2>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-[#f8fafc] px-3 py-2">
          <Search className="size-4 shrink-0 text-[#8181a5]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees…"
            className="w-44 bg-transparent text-sm text-[#1c1c1c] outline-none placeholder:text-[#8181a5]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8181a5]">Employee</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8181a5]">Base Salary</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8181a5]">Department</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8181a5]">Bonus</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8181a5]">Deductions</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8181a5]">Net Pay</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8181a5]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((emp) => {
              const netPay = emp.baseSalary + emp.bonus - emp.deductions
              return (
                <tr key={emp.id} className="hover:bg-[#f8fafc]">
                  {/* Employee */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.photo}
                        alt={emp.name}
                        className="size-9 shrink-0 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-[#1c1c1c]">{emp.name}</p>
                        <p className="text-xs text-[#8181a5]">{emp.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Base Salary */}
                  <td className="px-4 py-4 text-[#1c1c1c]">{fmt(emp.baseSalary)}</td>

                  {/* Department */}
                  <td className="px-4 py-4 text-[#8181a5]">{emp.department}</td>

                  {/* Bonus */}
                  <td className="px-4 py-4 font-medium text-emerald-500">+{fmt(emp.bonus)}</td>

                  {/* Deductions */}
                  <td className="px-4 py-4 font-medium text-rose-500">-{fmt(emp.deductions)}</td>

                  {/* Net Pay */}
                  <td className="px-4 py-4 font-semibold text-[#1c1c1c]">{fmt(netPay)}</td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusStyle[emp.status])}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              )
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-[#8181a5]">
                  No employees match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer totals */}
      <div className="flex items-center justify-between border-t border-border px-6 py-4">
        <p className="text-xs text-[#8181a5]">{filtered.length} of {payrollEmployees.length} employees</p>
        <div className="flex items-center gap-8 text-sm">
          <span className="text-[#8181a5]">
            Total base: <span className="font-semibold text-[#1c1c1c]">{fmt(filtered.reduce((s, e) => s + e.baseSalary, 0))}</span>
          </span>
          <span className="text-[#8181a5]">
            Total net: <span className="font-semibold text-[#1c1c1c]">{fmt(filtered.reduce((s, e) => s + e.baseSalary + e.bonus - e.deductions, 0))}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview")

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-[#1c1c1c]">
      <HRIconSidebar />

      {/* ── Text sidebar ── */}
      <aside className="flex w-[280px] shrink-0 flex-col justify-between bg-white py-5 pl-5 pr-3 shadow-sm">
        <nav className="flex flex-col gap-1">
          {sidebarNav.map(({ label, href }) => {
            const isActive = href === "/dashboard/hr/payroll"
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "block w-full rounded px-3 py-2.5 text-left text-base font-medium transition-colors hover:bg-muted",
                  isActive ? "font-semibold text-primary" : "text-[#324054]"
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex flex-col gap-3">
          <button className="w-full rounded px-3 py-2.5 text-left text-base font-medium text-[#324054] hover:bg-muted">
            Settings
          </button>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2">
            <img src={adminPhoto} alt="Michael Smith" className="size-10 shrink-0 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#324054]">Michael Smith</p>
              <p className="truncate text-xs text-[#71839b]">michaelsmith12@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex flex-1 flex-col overflow-auto p-8">

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-3 gap-6">
          {stats.map(({ label, value, change, changeLabel, positive, Icon, iconBg }) => (
            <div key={label} className="flex items-start justify-between rounded-2xl bg-white p-6 shadow-sm">
              <div>
                <p className="mb-1 text-sm text-[#8181a5]">{label}</p>
                <p className="mb-2 text-3xl font-bold tracking-tight text-[#1c1c1c]">{value}</p>
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-sm font-semibold", positive ? "text-emerald-500" : "text-rose-500")}>
                    ↑ {change}
                  </span>
                  <span className="text-sm text-[#8181a5]">{changeLabel}</span>
                </div>
              </div>
              <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full", iconBg)}>
                <Icon className={cn("size-5", positive ? "text-white" : "text-[#8181a5]")} />
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex w-fit items-center gap-1 rounded-xl border border-border bg-white p-1 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-lg px-5 py-2 text-sm font-medium transition-colors",
                activeTab === tab
                  ? "bg-white text-[#1c1c1c] shadow-sm ring-1 ring-border"
                  : "text-[#8181a5] hover:text-[#1c1c1c]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-[1fr_360px] gap-6">

            {/* Recent Payroll Runs */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1c1c1c]">Recent Payroll Runs</h2>
                <button className="text-sm font-medium text-[#5e81f4] hover:underline">View all</button>
              </div>

              <div className="flex flex-col divide-y divide-border">
                {payrollRuns.map((run) => (
                  <div key={run.period} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <CalendarDays className="size-5 text-[#2d68fe]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1c1c1c]">{run.period}</p>
                        <p className="text-xs text-[#8181a5]">
                          {run.employees} employees • {run.meta}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <p className="text-sm font-bold text-[#1c1c1c]">{run.amount}</p>
                      <span
                        className={cn(
                          "min-w-[90px] rounded-md px-3 py-1 text-center text-xs font-semibold",
                          run.status === "Scheduled"
                            ? "bg-blue-50 text-[#2d68fe]"
                            : "bg-emerald-50 text-emerald-600"
                        )}
                      >
                        {run.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">

              {/* Pay Distribution */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-[#1c1c1c]">Pay Distribution</h2>
                <div className="flex flex-col gap-4">
                  {payDistribution.map(({ dept, amount }) => (
                    <div key={dept}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm text-[#1c1c1c]">{dept}</span>
                        <span className="text-sm font-semibold text-[#1c1c1c]">
                          ${amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#eef0f6]">
                        <div
                          className="h-2 rounded-full bg-[#2d68fe] transition-all"
                          style={{ width: `${(amount / maxPay) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-[#1c1c1c]">Upcoming</h2>
                <div className="flex items-center gap-3 rounded-xl bg-[#eef4ff] px-4 py-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2d68fe]">
                    <Clock className="size-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1c1c1c]">March payroll due</p>
                    <p className="text-xs text-[#8181a5]">Processing begins March 29, 2026</p>
                  </div>
                  <ChevronRight className="size-4 text-[#8181a5]" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── Employees tab ── */}
        {activeTab === "Employees" && (
          <EmployeesPayrollTab />
        )}

        {/* ── Payroll Runs tab ── */}
        {activeTab === "Payroll Runs" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-white p-12 text-center shadow-sm">
            <CalendarDays className="size-12 text-[#eef0f6]" />
            <p className="text-base font-medium text-[#8181a5]">Full payroll runs history coming soon</p>
          </div>
        )}

      </main>
    </div>
  )
}
