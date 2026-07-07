"use client"

import { useState, useEffect, useCallback } from "react"
import { DollarSign, BarChart2, Minus, CalendarDays, Clock, ChevronRight, Search, Play, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { useAuth } from "@/context/auth-context"
import {
  payrollService,
  type ApiPayrollRun,
  type ApiPayrollSummary,
  type ApiPayslip,
} from "@/services/payroll.service"

// ── Constants ─────────────────────────────────────────────────
const DEFAULT_PHOTO = "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png"

// ── Types ─────────────────────────────────────────────────────
interface PayrollEmployee {
  id:         string
  name:       string
  email:      string
  photo:      string
  department: string
  baseSalary: number
  bonus:      number
  deductions: number
  netPay:     number
  status:     "Paid" | "Pending" | "Processing" | "Failed"
}

interface RunRow {
  id:        string
  period:    string
  employees: number
  meta:      string
  amount:    string
  status:    string
}

const statusStyle: Record<PayrollEmployee["status"], string> = {
  Paid:       "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  Pending:    "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  Processing: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  Failed:     "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
}

// ── API → view mapping ─────────────────────────────────────────
function formatPeriod(period: string): string {
  const [y, m] = period.split("-").map(Number)
  return new Date(y, m - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

function currentPeriodLabel(): string {
  const now = new Date()
  return now.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const runStatusLabel: Record<ApiPayrollRun["status"], string> = {
  DRAFT:            "Draft",
  CALCULATED:       "Processing",
  PENDING_APPROVAL: "Awaiting approval",
  APPROVED:         "Scheduled",
  PAID:             "Completed",
  // Legacy backend statuses
  SCHEDULED:        "Scheduled",
  PROCESSING:       "Processing",
  COMPLETED:        "Completed",
  CANCELLED:        "Cancelled",
}

function mapRun(run: ApiPayrollRun): RunRow {
  const paid = run.status === "PAID" || run.status === "COMPLETED"
  return {
    id:        run.id,
    period:    formatPeriod(run.period),
    employees: run.employeeCount,
    meta:      paid ? `Paid ${shortDate(run.paidAt ?? run.payDate)}` : `Due ${shortDate(run.payDate)}`,
    amount:    `$${run.totals.net.toLocaleString()}`,
    status:    runStatusLabel[run.status] ?? run.status,
  }
}

const payslipStatusLabel: Record<ApiPayslip["paymentStatus"], PayrollEmployee["status"]> = {
  PAID:       "Paid",
  PROCESSING: "Processing",
  PENDING:    "Pending",
  FAILED:     "Failed",
}

function mapPayslip(slip: ApiPayslip): PayrollEmployee {
  return {
    id:         slip.id,
    name:       slip.employee.user.name,
    email:      slip.employee.user.email,
    photo:      slip.employee.user.avatarUrl ?? DEFAULT_PHOTO,
    department: slip.employee.department ?? "—",
    baseSalary: slip.baseSalary,
    bonus:      slip.bonus,
    deductions: slip.totalDeductions,
    netPay:     slip.netPay,
    status:     payslipStatusLabel[slip.paymentStatus] ?? "Pending",
  }
}

const sidebarNav = [
  { label: "Employees",   href: "/dashboard/hr/employees"   },
  { label: "Departments", href: "/dashboard/hr/departments" },
  { label: "Leave",       href: "/dashboard/hr/leave"       },
  { label: "Payroll",     href: "/dashboard/hr/payroll"     },
  { label: "History",     href: "#"                         },
]

const TABS = ["Overview", "Employees", "Payroll Runs"] as const
type Tab = (typeof TABS)[number]

// ── Run list rows (shared by Overview and Payroll Runs tab) ────
function RunList({ runs }: { runs: RunRow[] }) {
  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1.5 py-8 text-center">
        <CalendarDays className="size-10 text-muted" />
        <p className="text-xs text-muted-foreground">
          No payroll runs yet — click “Run Payroll” to calculate your first one.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {runs.map((run) => (
        <div key={run.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
              <CalendarDays className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{run.period}</p>
              <p className="text-xs text-muted-foreground">
                {run.employees} employee{run.employees !== 1 ? "s" : ""} • {run.meta}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs font-bold text-foreground">{run.amount}</p>
            <span
              className={cn(
                "min-w-[90px] rounded-md px-2.5 py-1 text-center text-xs font-semibold",
                run.status === "Completed"
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-400"
              )}
            >
              {run.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Employees tab content ──────────────────────────────────────
function EmployeesPayrollTab({
  employees,
  periodLabel,
}: {
  employees:   PayrollEmployee[]
  periodLabel: string
}) {
  const [search, setSearch] = useState("")

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (n: number) => `$${n.toLocaleString()}`

  return (
    <div className="rounded-2xl bg-card shadow-sm">
      {/* Table toolbar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">Employee Payroll — {periodLabel}</h2>
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2.5 py-1.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees…"
            className="w-44 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Employee</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Base Salary</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Department</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Bonus</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Deductions</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Net Pay</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((emp) => (
              <tr key={emp.id} className="hover:bg-muted/50">
                {/* Employee */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={emp.photo}
                      alt={emp.name}
                      className="size-9 shrink-0 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>
                  </div>
                </td>

                {/* Base Salary */}
                <td className="px-3 py-3 text-foreground">{fmt(emp.baseSalary)}</td>

                {/* Department */}
                <td className="px-3 py-3 text-muted-foreground">{emp.department}</td>

                {/* Bonus */}
                <td className="px-3 py-3 font-medium text-emerald-500">+{fmt(emp.bonus)}</td>

                {/* Deductions */}
                <td className="px-3 py-3 font-medium text-rose-500">-{fmt(emp.deductions)}</td>

                {/* Net Pay */}
                <td className="px-3 py-3 font-semibold text-foreground">{fmt(emp.netPay)}</td>

                {/* Status */}
                <td className="px-3 py-3">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusStyle[emp.status])}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  {employees.length === 0
                    ? "No payslips yet — run payroll to generate them."
                    : "No employees match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer totals */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <p className="text-xs text-muted-foreground">{filtered.length} of {employees.length} employees</p>
        <div className="flex items-center gap-6 text-xs">
          <span className="text-muted-foreground">
            Total base: <span className="font-semibold text-foreground">{fmt(filtered.reduce((s, e) => s + e.baseSalary, 0))}</span>
          </span>
          <span className="text-muted-foreground">
            Total net: <span className="font-semibold text-foreground">{fmt(filtered.reduce((s, e) => s + e.netPay, 0))}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function PayrollPage() {
  const [activeTab, setActiveTab]     = useState<Tab>("Overview")
  const { accessToken }               = useAuth()
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [summary, setSummary]         = useState<ApiPayrollSummary | null>(null)
  const [runs, setRuns]               = useState<RunRow[]>([])
  const [employees, setEmployees]     = useState<PayrollEmployee[]>([])
  const [periodLabel, setPeriodLabel] = useState(currentPeriodLabel())
  const [running, setRunning]         = useState(false)
  const [runMsg, setRunMsg]           = useState<{ text: string; error: boolean } | null>(null)

  const loadData = useCallback(async () => {
    if (!accessToken) return
    setError(null)
    try {
      const [sumRes, runsRes] = await Promise.all([
        payrollService.summary(accessToken),
        payrollService.listRuns(accessToken, { limit: 12 }),
      ])
      setSummary(sumRes.data)
      setRuns(runsRes.data.map(mapRun))
      const latest = runsRes.data[0]
      if (latest) {
        setPeriodLabel(formatPeriod(latest.period))
        const runRes = await payrollService.getRun(latest.id, accessToken)
        setEmployees((runRes.data.payslips ?? []).map(mapPayslip))
      } else {
        setEmployees([])
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load payroll data")
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => { loadData() }, [loadData])

  async function runPayroll() {
    if (!accessToken) return
    setRunning(true)
    setRunMsg(null)
    try {
      const res = await payrollService.createRun({}, accessToken)
      const skipped = res.meta?.skippedCount ?? 0
      setRunMsg({
        text: `Payroll calculated for ${res.data.employeeCount} employee${res.data.employeeCount !== 1 ? "s" : ""}${
          skipped ? ` — ${skipped} skipped (no salary set)` : ""
        }`,
        error: false,
      })
      await loadData()
    } catch (e: unknown) {
      setRunMsg({ text: e instanceof Error ? e.message : "Failed to run payroll", error: true })
    } finally {
      setRunning(false)
    }
  }

  const fmtMoney = (n: number) => `$${Math.round(n).toLocaleString()}`
  const fmtPct   = (n: number) => `${n >= 0 ? "+" : ""}${n}%`

  const stats = [
    {
      label:       "Total Payroll",
      value:       summary ? fmtMoney(summary.totalNet) : "—",
      change:      summary ? fmtPct(summary.netChangePct) : "",
      changeLabel: "vs previous run",
      positive:    (summary?.netChangePct ?? 0) >= 0,
      Icon:        DollarSign,
      iconBg:      "bg-primary",
    },
    {
      label:       "Total Gross",
      value:       summary ? fmtMoney(summary.totalGross) : "—",
      change:      summary ? fmtPct(summary.grossChangePct) : "",
      changeLabel: "before deductions",
      positive:    (summary?.grossChangePct ?? 0) >= 0,
      Icon:        BarChart2,
      iconBg:      "bg-primary",
    },
    {
      label:       "Total Deductions",
      value:       summary ? fmtMoney(summary.totalDeductions) : "—",
      change:      summary ? fmtPct(summary.deductionsChangePct) : "",
      changeLabel: "taxes & pension",
      positive:    false,
      Icon:        Minus,
      iconBg:      "bg-muted",
    },
  ]

  const distribution = summary?.distribution ?? []
  const maxPay = Math.max(...distribution.map((d) => d.amount), 1)

  const upcoming = summary?.upcoming
    ? {
        title: `${formatPeriod(summary.upcoming.period)} payroll due`,
        sub:   `Pay date ${new Date(summary.upcoming.payDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
      }
    : null

  if (loading) {
    return (
      <>
        <HrNavigationPannel navItems={sidebarNav}/>
        <main className="flex flex-1 items-center justify-center p-6">
          <p className="text-xs text-muted-foreground">Loading payroll…</p>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <HrNavigationPannel navItems={sidebarNav}/>
        <main className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <p className="text-xs text-rose-500">{error}</p>
          <button
            onClick={() => { setLoading(true); loadData() }}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <RefreshCw className="size-4" /> Retry
          </button>
        </main>
      </>
    )
  }

  return (
    <>
      {/* ── Text sidebar ── */}
      <HrNavigationPannel navItems={sidebarNav}/>
      {/* ── Main content ── */}
      <main className="flex flex-1 flex-col overflow-auto p-6">

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-3 gap-5">
          {stats.map(({ label, value, change, changeLabel, positive, Icon, iconBg }) => (
            <div key={label} className="flex items-start justify-between rounded-2xl bg-card p-5 shadow-sm">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">{label}</p>
                <p className="mb-1.5 text-2xl font-bold tracking-tight text-foreground">{value}</p>
                <div className="flex items-center gap-1">
                  {change && (
                    <span className={cn("text-xs font-semibold", positive ? "text-emerald-500" : "text-rose-500")}>
                      {change}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                </div>
              </div>
              <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full", iconBg)}>
                <Icon className={cn("size-5", positive ? "text-primary-foreground" : "text-muted-foreground")} />
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + actions */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex w-fit items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-xs font-medium transition-colors",
                  activeTab === tab
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            {runMsg && (
              <p className={cn("text-xs font-medium", runMsg.error ? "text-rose-500" : "text-emerald-600")}>
                {runMsg.text}
              </p>
            )}
            <button
              onClick={runPayroll}
              disabled={running}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
            >
              <Play className="size-4" />
              {running ? "Calculating…" : "Run Payroll"}
            </button>
          </div>
        </div>

        {/* ── Overview tab ── */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-[1fr_360px] gap-5">

            {/* Recent Payroll Runs */}
            <div className="rounded-2xl bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">Recent Payroll Runs</h2>
                <button
                  onClick={() => setActiveTab("Payroll Runs")}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View all
                </button>
              </div>
              <RunList runs={runs.slice(0, 4)} />
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">

              {/* Pay Distribution */}
              <div className="rounded-2xl bg-card p-5 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-foreground">Pay Distribution</h2>
                {distribution.length === 0 ? (
                  <p className="py-3 text-xs text-muted-foreground">No payroll data yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {distribution.map(({ department, amount }) => (
                      <div key={department}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-foreground">{department}</span>
                          <span className="text-xs font-semibold text-foreground">
                            ${amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary transition-all"
                            style={{ width: `${(amount / maxPay) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming */}
              {upcoming && (
                <div className="rounded-2xl bg-card p-5 shadow-sm">
                  <h2 className="mb-3 text-base font-semibold text-foreground">Upcoming</h2>
                  <div className="flex items-center gap-2.5 rounded-xl bg-primary/10 px-3 py-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Clock className="size-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">{upcoming.title}</p>
                      <p className="text-xs text-muted-foreground">{upcoming.sub}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── Employees tab ── */}
        {activeTab === "Employees" && (
          <EmployeesPayrollTab employees={employees} periodLabel={periodLabel} />
        )}

        {/* ── Payroll Runs tab ── */}
        {activeTab === "Payroll Runs" && (
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-foreground">Payroll Runs</h2>
            <RunList runs={runs} />
          </div>
        )}

      </main>
    </>
  )
}
