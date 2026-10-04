"use client"

import { useState, useEffect } from "react"
import {
  BadgeDollarSign,
  Check,
  ChevronDown,
  Clock3,
  Gift,
  Megaphone,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ApiError } from "@/lib/api-client"
import { useAuth } from "@/context/auth-context"
import { attendanceService } from "@/services/attendance.service"
import { announcementService, type ApiAnnouncement } from "@/services/anouncement.service"
import { employeeService } from "@/services/employee.service"
import { leaveService, type ApiLeaveRequest } from "@/services/leave.service"
import { payrollService, type ApiMyPayslip } from "@/services/payroll.service"

const employeePhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"


function useLiveClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) return { time: "--:--:--", date: "" }

  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  const date = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return { time, date }
}

export default function AttendancePage() {
  const { accessToken } = useAuth()
  const { time, date } = useLiveClock()
  const [clockedIn, setClockedIn] = useState(false)
  const [startTime, setStartTime] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [announcements, setAnnouncements] = useState<ApiAnnouncement[]>([])
  const [payslips, setPayslips] = useState<ApiMyPayslip[]>([])
  const [leaveRequests, setLeaveRequests] = useState<ApiLeaveRequest[]>([])
  const [employee, setEmployee] = useState<Awaited<ReturnType<typeof employeeService.getMe>>["data"] | null>(null)

  useEffect(() => {
    if (!accessToken) return
    attendanceService.today(accessToken)
      .then(({ data }) => {
        setClockedIn(Boolean(data?.clockIn && !data.clockOut))
        setStartTime(data?.clockIn ? new Date(data.clockIn).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : null)
      })
      .catch(() => setActionError("Unable to load today's attendance."))
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return
    employeeService.getMe(accessToken)
      .then(({ data }) => setEmployee(data))
      .catch(() => setEmployee(null))
    announcementService.list(accessToken)
      .then(({ data }) => setAnnouncements(data.filter((item) => item.status === "SENT")))
      .catch(() => setAnnouncements([]))
    payrollService.getMyPayslips(accessToken)
      .then(({ data }) => setPayslips(data))
      .catch(() => setPayslips([]))
    leaveService.list({ limit: 100 }, accessToken)
      .then(({ data }) => setLeaveRequests(data))
      .catch(() => setLeaveRequests([]))
  }, [accessToken])

  const handleClock = async () => {
    if (!accessToken || saving) return
    setSaving(true)
    setActionError(null)
    try {
      const response = clockedIn
        ? await attendanceService.clockOut(new Date().toISOString(), accessToken)
        : await attendanceService.clockIn(new Date().toISOString(), accessToken)
      setClockedIn(Boolean(response.data.clockIn && !response.data.clockOut))
      setStartTime(response.data.clockIn ? new Date(response.data.clockIn).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : null)
    } catch (error) {
      setActionError(error instanceof ApiError ? error.message : "Attendance action failed.")
    } finally {
      setSaving(false)
    }
  }

  const latestAnnouncement = announcements[0]
  const recentPayslips = payslips.slice(0, 4)
  const leaveSummary = Array.from(new Set(leaveRequests.map((request) => request.type))).map((type) => {
    const requests = leaveRequests.filter((request) => request.type === type)
    const days = (request: ApiLeaveRequest) => {
      const start = new Date(request.startDate).getTime()
      const end = new Date(request.endDate).getTime()
      return Math.max(1, Math.round((end - start) / 86400000) + 1)
    }
    return {
      type,
      approved: requests.filter((request) => request.status === "APPROVED").reduce((sum, request) => sum + days(request), 0),
      pending: requests.filter((request) => request.status === "PENDING").reduce((sum, request) => sum + days(request), 0),
    }
  })

  const formatMoney = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount)
  const employeeName = employee?.user?.name ?? "there"
  const employmentType = employee?.employmentType?.replace("_", "-").toLowerCase() ?? "—"
  const joinDate = employee?.joinDate
    ? new Date(employee.joinDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
    : "—"

  return (
    <main className="min-h-full bg-background px-3 py-3 text-foreground sm:px-5 sm:py-5 lg:px-6">
      <div className="mx-auto max-w-[1420px]">
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <div>
            <h1 className="text-base font-semibold">Clock In / Clock Out</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Time / Attendance
            </p>
          </div>
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock3 className="size-4" />
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.05fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <Clock3 className="size-4 text-primary" />
                  Time Entry
                </h2>
                <ChevronDown className="size-4 text-muted-foreground" />
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {clockedIn
                  ? `Clocked in since ${startTime}`
                  : "Ready to start your workday"}
              </p>
              <div className="mx-auto my-4 flex size-40 flex-col items-center justify-center rounded-full border-[7px] border-primary/15 border-r-primary text-center">
                <span className="text-[10px] font-semibold text-primary">
                  {clockedIn ? "WORKING" : "TODAY"}
                </span>
                <span className="mt-1 text-3xl font-light tracking-tight">
                  {time.slice(0, 5)}
                </span>
                <span className="mt-1 text-xs font-medium text-muted-foreground">
                  GMT+7
                </span>
              </div>
              <p className="-mt-2 mb-3 text-center text-[10px] text-muted-foreground">
                {date}
              </p>
              <label
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
                htmlFor="attendance-notes"
              >
                Notes
              </label>
              <input
                id="attendance-notes"
                placeholder="Add a note for this entry"
                className="mb-3 h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring/30"
              />
              <Button
                onClick={handleClock}
                disabled={saving}
                className={cn(
                  "w-full",
                  clockedIn
                    ? "bg-destructive hover:bg-destructive/90"
                    : "gradient-primary border-0 hover:opacity-90"
                )}
              >
                {saving ? "Saving..." : clockedIn ? "Clock Out" : "Clock In"}
              </Button>
              {actionError && <p className="mt-2 text-center text-xs text-destructive">{actionError}</p>}
            
            </section>

            <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <Gift className="size-4 text-primary" />
                  Benefits
                </h2>
                <ChevronDown className="size-4 text-muted-foreground" />
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-bold text-primary">
                  BlueCross BlueShield
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-[10px] text-muted-foreground">
                  <span>
                    Member Name
                    <br />
                    <b className="text-foreground">Muhammad Rifky</b>
                  </span>
                  <span>
                    Network Name
                    <br />
                    <b className="text-foreground">Standard</b>
                  </span>
                  <span>
                    ID
                    <br />
                    <b className="text-foreground">XX123456789</b>
                  </span>
                  <span>
                    Coverage
                    <br />
                    <b className="text-foreground">Medical & Rx</b>
                  </span>
                </div>
              </div>
              <Button className="gradient-primary mt-3 w-full border-0 text-xs">
                View Compensation
              </Button>
            </section>
          </div>

          <div className="flex flex-col gap-3">
            <section className="gradient-primary relative overflow-hidden rounded-2xl p-5 text-white shadow-sm">
              <div className="absolute -top-8 -right-8 size-32 rounded-full bg-white/10" />
              <div className="relative">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold">Hi, {employeeName}!</p>
                    <p className="mt-1 text-xs text-white/75">
                      Here is your workday at a glance.
                    </p>
                  </div>
                  <UserRound className="size-5 text-white/75" />
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={employee?.user?.avatarUrl ?? employeePhoto}
                    alt={employeeName}
                    className="size-12 rounded-full object-cover ring-2 ring-white/40"
                  />
                  <div>
                    <p className="text-xs font-semibold">
                      {employeeName}
                    </p>
                    <p className="text-xs text-white/75">{employee?.jobTitle ?? "Employee"}</p>
                  </div>
                </div>
                <button className="mt-4 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/30">
                  View Employee Record
                </button>
              </div>
            </section>
            <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <Clock3 className="size-4 text-primary" />
                  Time Off
                </h2>
                <ChevronDown className="size-4 text-muted-foreground" />
              </div>
              <Button className="gradient-primary border-0 text-xs">
                Request Time Off
              </Button>
              <div className="mt-4 grid grid-cols-3 gap-2 border-b border-border pb-2 text-[10px] font-semibold text-muted-foreground">
                <span>Type</span>
                <span>Available</span>
                <span>Future Approved</span>
              </div>
              {leaveSummary.map(({ type, approved, pending }) => (
                <div
                  key={type}
                  className="grid grid-cols-3 gap-2 border-b border-border py-2 text-xs"
                >
                  <span className="font-medium text-primary">{type}</span>
                  <span>{approved} day{approved === 1 ? "" : "s"} used</span>
                  <span>{pending} day{pending === 1 ? "" : "s"} pending</span>
                </div>
              ))}
              {leaveSummary.length === 0 && <p className="py-3 text-xs text-muted-foreground">No leave requests yet.</p>}
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm">
                  Time Off History
                </Button>
                <Button variant="outline" size="sm">
                  More <ChevronDown className="size-3" />
                </Button>
              </div>
            </section>
                       <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <UserRound className="size-4 text-primary" />
                  Employment
                </h2>
                <ChevronDown className="size-4 text-muted-foreground" />
              </div>
              <div className="mb-3 flex items-center justify-between rounded-xl bg-primary/10 px-3 py-2.5">
                <div>
                  <p className="text-[10px] text-muted-foreground">Employment status</p>
                    <p className="mt-0.5 text-xs font-semibold text-foreground">
                      {employee?.isActive ? "Active" : "Inactive"} · {employmentType}
                    </p>
                </div>
                <span className="flex size-7 items-center justify-center rounded-full bg-card text-emerald-600">
                  <Check className="size-4" />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[10px]">
                <div>
                  <p className="text-muted-foreground">Job title</p>
                  <p className="mt-0.5 font-semibold text-foreground">{employee?.jobTitle ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="mt-0.5 font-semibold text-foreground">{employee?.department?.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="mt-0.5 font-semibold text-foreground">{employee?.company.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Start date</p>
                  <p className="mt-0.5 font-semibold text-foreground">{joinDate}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-[10px] text-muted-foreground">
                  {employee?.officeLocation?.city ?? employee?.officeLocation?.name ?? "—"} · {employee?.company.timezone ?? "Local time"}
                </span>
                <button className="text-xs font-medium text-primary hover:underline">View record</button>
              </div>
            </section>
 
    
          </div>

          <div className="flex flex-col gap-3">
            <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <Megaphone className="size-4 text-primary" />
                  Announcements
                </h2>
                <ChevronDown className="size-4 text-muted-foreground" />
              </div>
              {!latestAnnouncement ? <p className="text-xs text-muted-foreground">No announcements yet.</p> : (
                <div className="mt-3 rounded-xl bg-primary/10 p-3">
                  <p className="text-xs font-semibold text-foreground">{latestAnnouncement.subject}</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    {latestAnnouncement.bodyText}
                  </p>
                  <p className="mt-2 text-[10px] font-medium text-primary">
                    Posted {new Date(latestAnnouncement.sentAt ?? latestAnnouncement.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              )}
           
            </section>
            <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <BadgeDollarSign className="size-4 text-primary" />
                  Pay
                </h2>
                <ChevronDown className="size-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                {recentPayslips[0]
                  ? `Latest pay for ${recentPayslips[0].period}: ${formatMoney(recentPayslips[0].netPay, recentPayslips[0].currency)}`
                  : "No payslips are available yet."}
              </p>
              <div className="mt-3 flex gap-2">
                <Button className="gradient-primary border-0 text-xs">
                  On Demand Pay
                </Button>
                <Button variant="outline" className="text-xs">
                  Upcoming Check
                </Button>
              </div>
              {recentPayslips.map((payslip) => (
                  <div
                    key={payslip.id}
                    className="flex items-center justify-between border-b border-border py-2 text-[10px]"
                  >
                    <span className="font-semibold text-primary">
                      {new Date(payslip.payDate).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}
                    </span>
                    <span>{formatMoney(payslip.netPay, payslip.currency)}</span>
                    <span className="text-muted-foreground">{payslip.period}</span>
                    <span className="flex size-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="size-3" />
                    </span>
                  </div>
              ))}
              {recentPayslips.length === 0 && <p className="py-3 text-xs text-muted-foreground">No payslips available.</p>}
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm">
                  View Expenses
                </Button>
                <Button variant="outline" size="sm">
                  Go Paperless
                </Button>
              </div>
            </section>
         
          </div>
        </div>
      </div>
    </main>
  )
}
