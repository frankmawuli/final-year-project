"use client"

import { useMemo, useState } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  LogIn,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

const MOCK_ATTENDANCE: Record<number, AttendanceDay> = {
  1: { date: 1, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  2: { date: 2, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  3: { date: 3, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  4: { date: 4, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  5: { date: 5, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  8: { date: 8, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  9: { date: 9, status: "absent", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "0.00 Hrs" },
  10: { date: 10, status: "present", checkIn: "09:30 AM", checkOut: "07:30 PM", hours: "9.25 Hrs" },
  11: { date: 11, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  12: { date: 12, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  15: { date: 15, status: "present", checkIn: "09:00 AM", checkOut: "07:30 PM", hours: "9.25 Hrs" },
  16: { date: 16, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  17: { date: 17, status: "holiday", note: "National Holiday" },
  18: { date: 18, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  19: { date: 19, status: "leave", note: "Leave (SL)" },
  22: { date: 22, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  23: { date: 23, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  24: { date: 24, status: "absent", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "0.00 Hrs" },
  25: { date: 25, status: "leave", note: "Leave (SL)" },
  26: { date: 26, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
  29: { date: 29, status: "leave", note: "Leave (SL)" },
  30: { date: 30, status: "present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "8.00 Hrs" },
}

function getMonthDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const previousMonthDays = new Date(month.getFullYear(), month.getMonth(), 0).getDate()
  const cells: Array<{ date: number; currentMonth: boolean; day?: AttendanceDay }> = []

  for (let index = firstDay - 1; index >= 0; index -= 1) {
    cells.push({ date: previousMonthDays - index, currentMonth: false })
  }
  for (let date = 1; date <= dayCount; date += 1) {
    const weekday = new Date(month.getFullYear(), month.getMonth(), date).getDay()
    const day = MOCK_ATTENDANCE[date] ?? {
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
  const [month, setMonth] = useState(() => new Date(2026, 8, 1))
  const today = new Date()
  const cells = useMemo(() => getMonthDays(month), [month])
  const monthLabel = month.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const presentDays = cells.filter((cell) => cell.day?.status === "present").length
  const totalHours = cells.reduce((sum, cell) => sum + (cell.day?.hours ? Number.parseFloat(cell.day.hours) : 0), 0)

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
