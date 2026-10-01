"use client"

import { startTransition, useEffect, useMemo, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  LogIn,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { attendanceService, type ApiAttendanceRecord } from "@/services/attendance.service"

type AttendanceStatus = "present" | "absent" | "leave" | "holiday" | "weekend"

interface AttendanceDay {
  date: number
  status: AttendanceStatus
  checkIn?: string
  checkOut?: string
  hours?: string
  note?: string
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const STATUS_STYLES: Record<AttendanceStatus, { label: string; band: string; text: string }> = {
  present: { label: "Present", band: "bg-emerald-100", text: "text-emerald-700" },
  absent: { label: "Absent", band: "bg-rose-100", text: "text-rose-700" },
  leave: { label: "Leave", band: "bg-amber-100", text: "text-amber-700" },
  holiday: { label: "Holiday", band: "bg-sky-100", text: "text-sky-700" },
  weekend: { label: "Weekend", band: "bg-slate-100", text: "text-slate-500" },
}

function formatTime(value: string | null) {
  return value
    ? new Date(value).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : undefined
}

function getMonthDays(month: Date, records: ApiAttendanceRecord[]) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const previousMonthDays = new Date(month.getFullYear(), month.getMonth(), 0).getDate()
  const cells: Array<{ date: number; currentMonth: boolean; day?: AttendanceDay }> = []

  for (let index = firstDay - 1; index >= 0; index -= 1) {
    cells.push({ date: previousMonthDays - index, currentMonth: false })
  }
  const recordByDate = new Map(records.map((record) => [record.date.slice(0, 10), record]))
  for (let date = 1; date <= dayCount; date += 1) {
    const calendarDate = new Date(month.getFullYear(), month.getMonth(), date)
    const weekday = calendarDate.getDay()
    const isoDate = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`
    const record = recordByDate.get(isoDate)
    const day: AttendanceDay = record
      ? {
          date,
          status: "present" as const,
          checkIn: formatTime(record.clockIn),
          checkOut: formatTime(record.clockOut),
          hours: record.hoursWorked === null ? undefined : `${record.hoursWorked.toFixed(2)} Hrs`,
        }
      : {
          date,
          status: weekday === 0 || weekday === 6 ? "weekend" : "absent",
          hours: "0.00 Hrs",
        }
    cells.push({ date, currentMonth: true, day })
  }
  const trailingDays = (7 - (cells.length % 7)) % 7
  for (let date = 1; date <= trailingDays; date += 1) {
    cells.push({ date, currentMonth: false })
  }
  return cells
}

export default function WorksheetPage() {
  const { accessToken } = useAuth()
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [records, setRecords] = useState<ApiAttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const today = new Date()
  const fromDate = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-01`
  const toDate = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()).padStart(2, "0")}`
  const cells = useMemo(() => getMonthDays(month, records), [month, records])
  const monthLabel = month.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    startTransition(() => {
      setLoading(true)
      setError(null)
    })
    attendanceService.list(accessToken, { from: fromDate, to: toDate })
      .then((response) => {
        if (!cancelled) setRecords(response.data)
      })
      .catch(() => {
        if (!cancelled) {
          setRecords([])
          setError("Unable to load attendance for this month.")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [accessToken, fromDate, toDate])

  function shiftMonth(amount: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  }

  function goToCurrentMonth() {
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  return (
    <main className="min-h-full bg-[#f7f8fa] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
      

    

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {error && <p className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">{error}</p>}
          {loading && <p className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">Loading attendance...</p>}
          <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button onClick={goToCurrentMonth} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">Today</button>
              <button aria-label="Previous month" onClick={() => shiftMonth(-1)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"><ChevronLeft className="size-4" /></button>
              <button aria-label="Next month" onClick={() => shiftMonth(1)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"><ChevronRight className="size-4" /></button>
              <h2 className="ml-1 text-base font-semibold text-slate-900">{monthLabel}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
              {(Object.keys(STATUS_STYLES) as AttendanceStatus[]).filter((status) => status !== "weekend").map((status) => (
                <span key={status} className="inline-flex items-center gap-1.5"><span className={cn("size-2 rounded-full", STATUS_STYLES[status].band.replace("100", "500"))} />{STATUS_STYLES[status].label}</span>
              ))}
            </div>
          </div>

          <div className="min-w-[760px]">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {DAY_NAMES.map((day) => <div key={day} className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
              {cells.map((cell, index) => {
                const status = cell.day ? STATUS_STYLES[cell.day.status] : undefined
                const isToday = cell.currentMonth && month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth() && cell.date === today.getDate()
                return (
                  <div key={`${cell.date}-${index}`} className={cn("relative flex min-h-[142px] flex-col border-b border-r border-slate-200 p-2.5 last:border-r-0 sm:min-h-[154px]", !cell.currentMonth && "bg-slate-50/70", isToday && "bg-blue-50/40") }>
                    <div className="flex items-center justify-between">
                      <span className={cn("flex size-7 items-center justify-center rounded-full text-sm font-semibold", isToday ? "bg-blue-600 text-white" : cell.currentMonth ? "text-slate-800" : "text-slate-300")}>{cell.date}</span>
                      {isToday && <span className="text-[10px] font-semibold text-blue-600">Today</span>}
                    </div>
                    {cell.currentMonth && cell.day && cell.day.status !== "weekend" && (
                      <>
                        <div className="mt-3 space-y-2 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5"><LogIn className="size-3 text-blue-500" /><span>{cell.day.checkIn ?? "--:--"}</span></div>
                          <div className="flex items-center gap-1.5"><LogOut className="size-3 text-orange-500" /><span>{cell.day.checkOut ?? "--:--"}</span></div>
                          <div className="flex items-center gap-1.5"><Clock3 className="size-3 text-slate-400" /><span>{cell.day.hours ?? "0.00 Hrs"}</span></div>
                        </div>
                        {cell.day.note && <p className="mt-2 truncate text-[10px] text-slate-500">{cell.day.note}</p>}
                      </>
                    )}
                    {cell.currentMonth && cell.day && <div className={cn("absolute inset-x-0 bottom-0 px-2.5 py-1 text-center text-[10px] font-medium", status?.band, status?.text)}>{cell.day.note ?? status?.label}</div>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
