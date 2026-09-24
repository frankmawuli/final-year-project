"use client"

import { useState, useEffect } from "react"
import {
  BadgeDollarSign,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Gift,
  MapPin,
  Megaphone,
  Play,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const employeePhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

const recentAttendance = [
  { date: "Fri, 10 March 2023", clockIn: "--,--", clockOut: "--,--" },
  { date: "Thu, 09 March 2023", clockIn: "09:00", clockOut: "19:30" },
  { date: "Wed, 08 March 2023", clockIn: "09:12", clockOut: "18:30" },
  { date: "Tue, 07 March 2023", clockIn: "09:10", clockOut: "18:30" },
]



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
  const { time, date } = useLiveClock()
  const [clockedIn, setClockedIn] = useState(false)
  const [startTime, setStartTime] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const handleClock = () => {
    const now = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
    if (!clockedIn) {
      setStartTime(now)
      setClockedIn(true)
    } else {
      setClockedIn(false)
    }
  }

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
                className={cn(
                  "w-full",
                  clockedIn
                    ? "bg-destructive hover:bg-destructive/90"
                    : "gradient-primary border-0 hover:opacity-90"
                )}
              >
                {clockedIn ? "Clock Out" : "Clock In"}
              </Button>
              <Button variant="outline" className="mt-2 w-full text-xs">
                <MapPin className="size-3.5" />
                Clock In + Transfer
              </Button>
              <Button variant="outline" className="mt-2 w-full text-xs">
                Manual
              </Button>
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
                    <p className="text-lg font-semibold">Hi, Muhammad!</p>
                    <p className="mt-1 text-xs text-white/75">
                      Here is your workday at a glance.
                    </p>
                  </div>
                  <UserRound className="size-5 text-white/75" />
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={employeePhoto}
                    alt="Muhammad Rifky Andrianto"
                    className="size-12 rounded-full object-cover ring-2 ring-white/40"
                  />
                  <div>
                    <p className="text-xs font-semibold">
                      Muhammad Rifky Andrianto
                    </p>
                    <p className="text-xs text-white/75">UI/UX Designer</p>
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
              {[
                ["Sick", "40.00 hours", "8.00 hours"],
                ["Vacation", "80.00 hours", "16.00 hours"],
                ["Volunteer", "16.00 hours", "0.00 hours"],
              ].map(([type, available, future]) => (
                <div
                  key={type}
                  className="grid grid-cols-3 gap-2 border-b border-border py-2 text-xs"
                >
                  <span className="font-medium text-primary">{type}</span>
                  <span>{available}</span>
                  <span>{future}</span>
                </div>
              ))}
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
                  <p className="mt-0.5 text-xs font-semibold text-foreground">Active · Full-time</p>
                </div>
                <span className="flex size-7 items-center justify-center rounded-full bg-card text-emerald-600">
                  <Check className="size-4" />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[10px]">
                <div>
                  <p className="text-muted-foreground">Job title</p>
                  <p className="mt-0.5 font-semibold text-foreground">UI/UX Designer</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="mt-0.5 font-semibold text-foreground">Design</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="mt-0.5 font-semibold text-foreground">Acme Corp</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Start date</p>
                  <p className="mt-0.5 font-semibold text-foreground">12 Jan 2023</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-[10px] text-muted-foreground">Jakarta office · GMT+7</span>
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
              <p className="text-xs text-muted-foreground">
                You&apos;re all caught up!
              </p>
              <div className="mt-3 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
                <Play className="size-10 rounded-full bg-card p-3 text-primary shadow-sm" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold">Visit Community</span>
                <ChevronRight className="size-5 rounded-full border border-border p-1 text-muted-foreground" />
              </div>
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
                Your next check is Friday, July 29 for pay period dates 11 - Jul
                24.
              </p>
              <div className="mt-3 flex gap-2">
                <Button className="gradient-primary border-0 text-xs">
                  On Demand Pay
                </Button>
                <Button variant="outline" className="text-xs">
                  Upcoming Check
                </Button>
              </div>
              {["07/15/2022", "07/08/2022", "07/01/2022", "06/15/2022"].map(
                (payDate) => (
                  <div
                    key={payDate}
                    className="flex items-center justify-between border-b border-border py-2 text-[10px]"
                  >
                    <span className="font-semibold text-primary">
                      {payDate}
                    </span>
                    <span>102034</span>
                    <span className="text-muted-foreground">hidden</span>
                    <span className="flex size-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="size-3" />
                    </span>
                  </div>
                )
              )}
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
