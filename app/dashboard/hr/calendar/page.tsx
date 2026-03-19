"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, X, Plus, MoreHorizontal } from "lucide-react"
import { HRIconSidebar } from "@/components/hr-icon-sidebar"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"

// ── Assets ────────────────────────────────────────────────────
const adminPhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

// ── Types ─────────────────────────────────────────────────────
interface CalEvent {
  id:     number
  title:  string
  start:  string   // "YYYY-MM-DD"
  end:    string   // "YYYY-MM-DD" (inclusive)
  bg:     string
  border: string
  text:   string
}

// ── Color palette ─────────────────────────────────────────────
const PALETTE = [
  { bg: "#f4fcff", border: "#2dccff", text: "#2dccff" },
  { bg: "#eeffe5", border: "#533fe4", text: "#533fe4" },
  { bg: "#ebf4ff", border: "#1877f2", text: "#1877f2" },
  { bg: "#efe5ff", border: "#6e39cb", text: "#6e39cb" },
  { bg: "#fff1d4", border: "#ffa800", text: "#ffa800" },
  { bg: "#fff5d8", border: "#fbbc05", text: "#fbbc05" },
  { bg: "#fff5f5", border: "#f93131", text: "#f93131" },
  { bg: "#dcfce7", border: "#22c55e", text: "#22c55e" },
]

// ── Seed events ───────────────────────────────────────────────
let _nextId = 8
const seedEvents: CalEvent[] = [
  { id: 1, title: "Weekend festival",     start: "2026-03-05", end: "2026-03-08", ...PALETTE[0] },
  { id: 2, title: "Weekend festival",     start: "2026-03-10", end: "2026-03-11", ...PALETTE[1] },
  { id: 3, title: "Eid festival",         start: "2026-03-14", end: "2026-03-14", ...PALETTE[2] },
  { id: 4, title: "Design conference",    start: "2026-03-19", end: "2026-03-19", ...PALETTE[3] },
  { id: 5, title: "Glastonbury festival", start: "2026-03-22", end: "2026-03-22", ...PALETTE[4] },
  { id: 6, title: "Design conference",    start: "2026-03-25", end: "2026-03-25", ...PALETTE[5] },
  { id: 7, title: "Glastonbury festival", start: "2026-03-28", end: "2026-03-29", ...PALETTE[6] },
]

// ── Date helpers ──────────────────────────────────────────────
function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function getCalendarWeeks(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1)
  const start = new Date(first)
  start.setDate(start.getDate() - first.getDay())
  const weeks: Date[][] = []
  for (let w = 0; w < 6; w++) {
    const week: Date[] = []
    for (let d = 0; d < 7; d++) {
      week.push(new Date(start))
      start.setDate(start.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

function eventsForWeek(events: CalEvent[], week: Date[]) {
  const wStart = week[0]
  const wEnd   = week[6]
  return events
    .filter((e) => {
      const es = parseDate(e.start)
      const ee = parseDate(e.end)
      return ee >= wStart && es <= wEnd
    })
    .map((e) => {
      const es = parseDate(e.start)
      const ee = parseDate(e.end)
      const msPerDay = 86400000
      const startCol = Math.max(0, Math.round((es.getTime() - wStart.getTime()) / msPerDay))
      const endCol   = Math.min(6, Math.round((ee.getTime() - wStart.getTime()) / msPerDay))
      return { event: e, startCol, endCol }
    })
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Overview",  href: "/dashboard/hr"          },
  { label: "Calendar",  href: "/dashboard/hr/calendar" },
  { label: "Analytics", href: "/dashboard/hr/reports"  },
]

// ── Add-event modal ───────────────────────────────────────────
interface AddEventModalProps {
  onClose: () => void
  onAdd:   (e: CalEvent) => void
  defaultDate?: string
}

function AddEventModal({ onClose, onAdd, defaultDate }: AddEventModalProps) {
  const [title,      setTitle]      = useState("")
  const [start,      setStart]      = useState(defaultDate ?? toIso(new Date()))
  const [end,        setEnd]        = useState(defaultDate ?? toIso(new Date()))
  const [colorIdx,   setColorIdx]   = useState(0)
  const [error,      setError]      = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError("Event title is required."); return }
    if (end < start)   { setError("End date cannot be before start date."); return }
    onAdd({
      id:    _nextId++,
      title: title.trim(),
      start,
      end,
      ...PALETTE[colorIdx],
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1c1c1c]">Add Event</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#324054]">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Team meeting"
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-[#1c1c1c] outline-none focus:border-[#5e81f4] focus:ring-2 focus:ring-[#5e81f4]/20"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#324054]">Start Date</label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-[#1c1c1c] outline-none focus:border-[#5e81f4] focus:ring-2 focus:ring-[#5e81f4]/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#324054]">End Date</label>
              <input
                type="date"
                value={end}
                min={start}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-sm text-[#1c1c1c] outline-none focus:border-[#5e81f4] focus:ring-2 focus:ring-[#5e81f4]/20"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#324054]">Color</label>
            <div className="flex gap-2">
              {PALETTE.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setColorIdx(i)}
                  className={cn(
                    "size-7 rounded-full border-2 transition-transform",
                    colorIdx === i ? "scale-110 border-[#1c1c1c]" : "border-transparent"
                  )}
                  style={{ backgroundColor: c.border }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {title && (
            <div
              className="flex h-7 items-center overflow-hidden rounded-sm"
              style={{ backgroundColor: PALETTE[colorIdx].bg }}
            >
              <div className="h-full w-[3px] shrink-0" style={{ backgroundColor: PALETTE[colorIdx].border }} />
              <span className="ml-2 truncate text-xs font-medium" style={{ color: PALETTE[colorIdx].text }}>
                {title}
              </span>
            </div>
          )}

          {error && <p className="text-sm text-rose-500">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-[#324054] hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#5e81f4] py-2.5 text-sm font-semibold text-white hover:bg-[#4a6ee0]"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Event pill (inside week row) ───────────────────────────────
function EventPill({
  event, startCol, endCol, onDelete,
}: {
  event:    CalEvent
  startCol: number
  endCol:   number
  onDelete: (id: number) => void
}) {
  const [hovered, setHovered] = useState(false)
  const span = endCol - startCol + 1

  return (
    <div
      className="absolute bottom-[6px] flex h-[22px] cursor-pointer items-center overflow-hidden rounded-sm"
      style={{
        left:            `calc(${(startCol / 7) * 100}% + 2px)`,
        width:           `calc(${(span / 7) * 100}% - 4px)`,
        backgroundColor: event.bg,
        zIndex:          10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="h-full w-[3px] shrink-0" style={{ backgroundColor: event.border }} />
      <span className="ml-1 flex-1 truncate text-[10px]" style={{ color: event.text }}>
        {event.title}
      </span>
      {hovered && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(event.id) }}
          className="mr-1 shrink-0 rounded"
          style={{ color: event.text }}
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function CalendarPage() {
  const today  = new Date()
  const [year,     setYear]     = useState(2026)
  const [month,    setMonth]    = useState(2)  // 0-indexed; 2 = March
  const [events,   setEvents]   = useState<CalEvent[]>(seedEvents)
  const [showModal, setShowModal] = useState(false)
  const [clickedDate, setClickedDate] = useState<string | undefined>()

  const weeks = getCalendarWeeks(year, month)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }
  function goToday() {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  function addEvent(e: CalEvent) {
    setEvents(prev => [...prev, e])
  }
  function deleteEvent(id: number) {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  function openModalForDate(iso: string) {
    setClickedDate(iso)
    setShowModal(true)
  }

  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth()    === today.getMonth()    &&
    d.getDate()     === today.getDate()

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-[#1c1c1c]">
      <HRIconSidebar />

      {/* ── Text sidebar ── */}
      <HrNavigationPannel navItems={sidebarNav} />

      {/* ── Main content ── */}
      <main className="flex flex-1 flex-col overflow-auto p-6">

        {/* Top bar */}
        <div className="mb-4 flex items-center justify-end">
          <button
            onClick={() => { setClickedDate(undefined); setShowModal(true) }}
            className="flex items-center gap-2 rounded-[10px] bg-[#5e81f4] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#4a6ee0]"
          >
            <Plus className="size-4" />
            Add Event
          </button>
        </div>

        {/* Calendar card */}
        <div className="flex-1 rounded-lg bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">

          {/* Calendar header */}
          <div className="flex items-center justify-between px-6 py-4">
            {/* Month nav */}
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="rounded p-1 hover:bg-muted">
                <ChevronLeft className="size-4 text-[#3a3541]" />
              </button>
              <span className="text-base font-medium text-[#3a3541]">
                {MONTH_NAMES[month]} {year}
              </span>
              <button onClick={nextMonth} className="rounded p-1 hover:bg-muted">
                <ChevronRight className="size-4 text-[#3a3541]" />
              </button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={goToday}
                className="rounded-lg bg-[#eee4ff] px-3 py-1 text-sm font-medium text-[#6e39cb] hover:bg-[#e0d0ff]"
              >
                Today
              </button>
              <div className="flex items-center gap-1 text-sm text-[#3a3541]">
                <span>Sort By:</span>
                <span className="text-[#89868d]">Month</span>
                <ChevronLeft className="size-3 rotate-[-90deg] text-[#89868d]" />
              </div>
              <button className="rounded p-1 hover:bg-muted">
                <MoreHorizontal className="size-4 text-[#89868d]" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-t border-[#dbdcde]">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="border-b border-r border-[#dbdcde] bg-[#f4f5f9] px-2 py-3 text-center text-sm font-medium text-[#3a3541] last:border-r-0"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Week rows */}
          {weeks.map((week, wIdx) => {
            const weekEvents = eventsForWeek(events, week)
            const isLastRow  = wIdx === weeks.length - 1
            return (
              <div
                key={wIdx}
                className={cn("relative", !isLastRow && "border-b border-[#dbdcde]")}
                style={{ height: "80px" }}
              >
                {/* Day cells */}
                <div className="absolute inset-0 grid grid-cols-7">
                  {week.map((day, dIdx) => {
                    const inMonth = day.getMonth() === month
                    const isTod   = isToday(day)
                    const iso     = toIso(day)
                    const isFirst = wIdx === 0
                    const isLast  = wIdx === weeks.length - 1
                    return (
                      <div
                        key={dIdx}
                        onClick={() => openModalForDate(iso)}
                        className={cn(
                          "cursor-pointer border-r border-[#dbdcde] p-2 last:border-r-0 hover:bg-[#f8fafc]",
                          !inMonth && "bg-[#fafbff]",
                          isFirst && dIdx === 0 && "rounded-bl-none",
                          isLast  && dIdx === 6 && "rounded-br-none"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex size-6 items-center justify-center rounded-full text-sm font-medium",
                            isTod
                              ? "bg-[#5e81f4] text-white"
                              : inMonth
                              ? "text-[#3a3541]"
                              : "text-[#89868d]"
                          )}
                        >
                          {day.getDate()}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Event bars */}
                {weekEvents.map(({ event, startCol, endCol }, eIdx) => (
                  <EventPill
                    key={event.id}
                    event={event}
                    startCol={startCol}
                    endCol={endCol}
                    onDelete={deleteEvent}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </main>

      {/* Add Event modal */}
      {showModal && (
        <AddEventModal
          onClose={() => setShowModal(false)}
          onAdd={addEvent}
          defaultDate={clickedDate}
        />
      )}
    </div>
  )
}
