"use client"

import { useState, useEffect } from "react"
import { MapPin, Calendar, ChevronRight } from "lucide-react"
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
    setNow(new Date())
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
  const [endTime, setEndTime] = useState<string | null>(null)
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
      setEndTime(now)
      setClockedIn(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
     

      {/* ── Mobile page title ── */}
      <div className="border-b border-border bg-white px-4 py-3 lg:hidden">
        <h1 className="text-base font-semibold text-foreground">Clock In / Clock Out</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Time › Attendance</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {/* ── Top content grid ─────────────────────────────── */}
        <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr] lg:gap-5">

          {/* Left column */}
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            {/* Greeting card */}
            <div
              className="relative overflow-hidden rounded-2xl p-5 text-white sm:flex-1 lg:flex-none"
              style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
            >
              <span className="absolute -right-6 -top-6 size-28 rounded-full bg-white/10" />
              <span className="absolute -bottom-8 right-10 size-20 rounded-full bg-white/10" />

              <p className="mb-0.5 text-base font-semibold">Hi Muhammad !</p>
              <p className="mb-4 text-xs text-white/70">Please check your attendance.</p>

              <div className="flex items-center gap-3">
                <img
                  src={employeePhoto}
                  alt="Muhammad Rifky Andrianto"
                  className="size-12 shrink-0 rounded-full object-cover ring-2 ring-white/40"
                />
                <div>
                  <p className="text-sm font-semibold">Muhammad Rifky Andrianto</p>
                  <p className="text-xs text-white/70">UI/UX Designer</p>
                </div>
              </div>

              <button className="mt-4 w-full rounded-lg bg-white py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-90">
                View Profile
              </button>
            </div>

            {/* Live clock card */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:flex-1 lg:flex-none">
              <p className="mb-1 text-sm font-medium text-muted-foreground">Time</p>
              <p className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
                {time}
                <span className="ml-2 text-sm font-normal text-muted-foreground md:text-base">
                  GMT+7
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{date}</p>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Select Project */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-4 text-base font-semibold text-foreground">Select Project</h2>
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="size-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">PT Linov Roket Prestasi</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Jl. Menteng Pulo, Menteng Dalam, Kec. Tebet, Kota Jakarta Selatan, Daerah
                    Khusus Ibukota Jakarta 12870
                  </p>
                  <button className="mt-1 text-sm font-medium text-primary hover:underline">
                    See Location
                  </button>
                </div>
              </div>
            </div>

            {/* Attendance clock in/out */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-4 text-base font-semibold text-foreground">Attendance</h2>
              <div className="mb-5 grid grid-cols-2 gap-3 md:gap-4">
                <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
                  <p className="mb-1 text-xs text-muted-foreground">Start Time</p>
                  <p
                    className={cn(
                      "text-lg font-semibold",
                      startTime ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {startTime ?? "--,--"}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
                  <p className="mb-1 text-xs text-muted-foreground">End Time</p>
                  <p
                    className={cn(
                      "text-lg font-semibold",
                      endTime ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {endTime ?? "--,--"}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleClock}
                className="w-full"
                style={
                  clockedIn
                    ? { background: "#ef4444" }
                    : { background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }
                }
              >
                {clockedIn ? "Clock Out" : "Clock In"}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Recent Attendance ─────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          {/* Filters */}
          <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <h2 className="text-base font-semibold text-foreground">Recent Attendance</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">From</span>
              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-[130px] bg-transparent text-sm text-foreground outline-none"
                />
                <Calendar className="size-4 shrink-0 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">To</span>
              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-[130px] bg-transparent text-sm text-foreground outline-none"
                />
                <Calendar className="size-4 shrink-0 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Scrollable table on small screens */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-5 py-3 text-left text-sm font-semibold text-foreground md:px-6">
                    Date
                  </th>
                  <th className="px-5 py-3 text-center text-sm font-semibold text-foreground md:px-6">
                    Clock In
                  </th>
                  <th className="px-5 py-3 text-center text-sm font-semibold text-foreground md:px-6">
                    Clock Out
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map((row, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "border-t border-border transition-colors hover:bg-muted/30",
                      i === 0 && "text-muted-foreground"
                    )}
                  >
                    <td className="px-5 py-4 text-sm md:px-6">{row.date}</td>
                    <td className="px-5 py-4 text-center text-sm md:px-6">{row.clockIn}</td>
                    <td className="px-5 py-4 text-center text-sm md:px-6">{row.clockOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
