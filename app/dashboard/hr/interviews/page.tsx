"use client"

import { useState, useRef, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  HelpCircle,
  Settings,
  X,
  Calendar as CalendarIcon,
  Clock,
  UserPlus,
  Link2,
  AlignJustify,
} from "lucide-react"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { cn } from "@/lib/utils"

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Job Listings",         href: "/dashboard/hr/jobs"       },
  { label: "Applicants",           href: "/dashboard/hr/applicants" },
  { label: "Candidate Evaluation", href: "/dashboard/hr/evaluation" },
  { label: "Interview Scheduling", href: "/dashboard/hr/interviews" },
  { label: "History",              href: "#"                        },
]

// ── Types ─────────────────────────────────────────────────────
interface CandidateOption {
  id:       number
  name:     string
  photo:    string
  email:    string
  position: string
}

interface Interview {
  id:       number
  title:    string
  date:     string   // "YYYY-MM-DD"
  startMin: number   // minutes from midnight
  endMin:   number   // minutes from midnight
  colorIdx: number
  guests?:  string[]
  meetLink?: string
  desc?:    string
}

// ── Color palette ─────────────────────────────────────────────
const COLORS = [
  { bg: "#fce7f3", text: "#9d174d", dot: "#f472b6" },
  { bg: "#ccfbf1", text: "#0f766e", dot: "#2dd4bf" },
  { bg: "#dbeafe", text: "#1d4ed8", dot: "#60a5fa" },
  { bg: "#fef3c7", text: "#92400e", dot: "#fbbf24" },
  { bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" },
]

// ── Candidate pool ────────────────────────────────────────────
const CANDIDATES: CandidateOption[] = [
  { id:1,  name:"Tiger Nixon",        photo:"/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png", email:"tiger.nixon@gmail.com",       position:"Web Developer"          },
  { id:2,  name:"Garrett Winters",    photo:"/assets/2dba1db7966039308370470fce52b3b220f9a3fb.png", email:"garrett.winters@gmail.com",   position:"Accountant"             },
  { id:3,  name:"Ashton Cox",         photo:"/assets/5f121b335ad17b18af3c3c797e7a5f1afc3ec39f.png", email:"ashton.cox@gmail.com",        position:"Technical Author"       },
  { id:4,  name:"Cedric Kelly",       photo:"/assets/635a3bf857069957b4442100197a1e910ea3121d.png", email:"cedric.kelly@gmail.com",      position:"Integration Specialist"  },
  { id:5,  name:"Airi Satou",         photo:"/assets/e4478e9b5a6f2c79870bedf6446dd7b9c9c09ee0.png", email:"airi.satou@gmail.com",        position:"Sales Assistant"        },
  { id:6,  name:"Brielle Williamson", photo:"/assets/3b57a33d98b5a1b80a335988932aa248a0875725.png", email:"brielle.w@gmail.com",         position:"Integration Specialist"  },
  { id:7,  name:"Herrod Chandler",    photo:"/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png", email:"herrod.chandler@gmail.com",   position:"Javascript Developer"   },
  { id:8,  name:"Rhona Davidson",     photo:"/assets/277048e308d3c618330fc9b64ac87f9bdc187ddd.png", email:"rhona.davidson@gmail.com",    position:"Software Engineer"      },
  { id:9,  name:"Colleen Hurst",      photo:"/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png", email:"colleen.hurst@gmail.com",     position:"Javascript Developer"   },
  { id:10, name:"Sonya Kim",          photo:"/assets/c8f5ae43e33ebde623eb7d3b22aeb6930878a4ce.png", email:"sonya.kim@gmail.com",         position:"Software Engineer"      },
  { id:11, name:"Jenna Elliott",      photo:"/assets/ba50d841bff1eb820c0b59f56f778fbbf8b8a8c3.png", email:"jenna.elliott@gmail.com",     position:"Product Designer"       },
]

// ── Grid constants ────────────────────────────────────────────
const HOUR_PX    = 64
const GRID_START = 7   // 7 AM
const GRID_END   = 20  // 8 PM

// ── Static data ───────────────────────────────────────────────
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const DAY_ABBR = ["SUN","MON","TUE","WED","THU","FRI","SAT"]

// ── Helpers ───────────────────────────────────────────────────
function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
}

function getWeekStart(d: Date): Date {
  const s = new Date(d)
  s.setDate(s.getDate() - s.getDay())
  s.setHours(0, 0, 0, 0)
  return s
}

function fmtTime(min: number): string {
  const h  = Math.floor(min / 60)
  const m  = min % 60
  const ap = h >= 12 ? "pm" : "am"
  const hh = h % 12 || 12
  return m === 0 ? `${hh}${ap}` : `${hh}.${String(m).padStart(2,"0")}${ap}`
}

function toTimeStr(min: number) {
  return `${String(Math.floor(min/60)).padStart(2,"0")}:${String(min%60).padStart(2,"0")}`
}

function parseTimeStr(s: string) {
  const [h, m] = s.split(":").map(Number)
  return h * 60 + m
}

// ── Seed interviews (relative to today's week) ────────────────
let _nextId = 10

function makeSeed(): Interview[] {
  const ws = getWeekStart(new Date())
  const d = (offset: number) => {
    const dt = new Date(ws)
    dt.setDate(dt.getDate() + offset)
    return toIso(dt)
  }
  return [
    { id:1, title:"Sarah Adams – Frontend Dev",   date:d(1), startMin:9*60,     endMin:10*60,    colorIdx:2, guests:["sarah.adams@email.com"], meetLink:"https://meet.google.com/abc-defg" },
    { id:2, title:"John Lee – Backend Engineer",  date:d(2), startMin:10*60,    endMin:11*60,    colorIdx:1 },
    { id:3, title:"Maria Silva – UX Designer",    date:d(3), startMin:9*60,     endMin:9*60+30,  colorIdx:0 },
    { id:4, title:"Team Sync",                    date:d(1), startMin:11*60,    endMin:11*60+30, colorIdx:3 },
    { id:5, title:"David Chen – Product Mgr",     date:d(4), startMin:14*60,    endMin:15*60,    colorIdx:4 },
    { id:6, title:"Amara Osei – Data Analyst",    date:d(0), startMin:9*60,     endMin:9*60+30,  colorIdx:2 },
    { id:7, title:"Panel Review",                 date:d(3), startMin:13*60,    endMin:14*60,    colorIdx:1 },
    { id:8, title:"Kevin Mensah – DevOps",        date:d(5), startMin:10*60,    endMin:11*60,    colorIdx:0 },
    { id:9, title:"Offer Discussion",             date:d(2), startMin:14*60+30, endMin:15*60,    colorIdx:3 },
  ]
}

// ── Add Schedule Modal ────────────────────────────────────────
interface ModalProps {
  onClose:       () => void
  onSave:        (iv: Interview) => void
  defaultDate?:  string
  defaultStart?: number
  defaultEnd?:   number
}

function AddScheduleModal({ onClose, onSave, defaultDate, defaultStart = 9*60, defaultEnd = 10*60 ,}: ModalProps) {
  const [title,       setTitle]       = useState("")
  const [date,        setDate]        = useState(defaultDate ?? toIso(new Date()))
  const [startMin,    setStartMin]    = useState(defaultStart)
  const [endMin,      setEndMin]      = useState(defaultEnd)
  const [guests,      setGuests]      = useState<CandidateOption[]>([])
  const [guestSearch, setGuestSearch] = useState("")
  const [showDrop,    setShowDrop]    = useState(false)
  const [meetLink,    setMeetLink]    = useState("https://meet.google.com/new")
  const [desc,        setDesc]        = useState("")
  const [colorIdx,    setColorIdx]    = useState(2)
  const [error,       setError]       = useState("")
  const guestRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setShowDrop(false)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  const filteredCandidates = CANDIDATES.filter(
    c => !guests.some(g => g.id === c.id) &&
    (guestSearch === "" ||
      c.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      c.position.toLowerCase().includes(guestSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(guestSearch.toLowerCase()))
  )

  function handleSave() {
    if (!title.trim())    { setError("Please enter an event title."); return }
    if (endMin <= startMin) { setError("End time must be after start time."); return }
    onSave({
      id: _nextId++,
      title: title.trim(),
      date,
      startMin,
      endMin,
      colorIdx,
      guests:   guests.length > 0 ? guests.map(g => g.email) : undefined,
      meetLink: meetLink || undefined,
      desc:     desc     || undefined,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-120 rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Add Schedule</h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 px-5 py-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New event title"
            autoFocus
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />

          {/* Date */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5 focus-within:border-blue-300">
            <CalendarIcon className="size-4 shrink-0 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 text-sm text-gray-700 outline-none"
            />
          </div>

          {/* Time range */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-100 px-3 py-2.5 focus-within:border-blue-300">
              <Clock className="size-3.5 shrink-0 text-gray-400" />
              <input
                type="time"
                value={toTimeStr(startMin)}
                onChange={(e) => setStartMin(parseTimeStr(e.target.value))}
                className="w-full text-sm text-gray-700 outline-none"
              />
            </div>
            <span className="text-sm text-gray-400">→</span>
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-100 px-3 py-2.5 focus-within:border-blue-300">
              <Clock className="size-3.5 shrink-0 text-gray-400" />
              <input
                type="time"
                value={toTimeStr(endMin)}
                onChange={(e) => setEndMin(parseTimeStr(e.target.value))}
                className="w-full text-sm text-gray-700 outline-none"
              />
            </div>
          </div>

          {/* Guest multi-select */}
          <div ref={guestRef} className="relative">
            <div
              className="flex min-h-10.5 flex-wrap items-center gap-1.5 rounded-lg border border-gray-100 px-3 py-2 focus-within:border-blue-300 cursor-text"
              onClick={() => setShowDrop(true)}
            >
              <UserPlus className="size-4 shrink-0 text-gray-400" />
              {guests.map(g => (
                <span
                  key={g.id}
                  className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                >
                  <img src={g.photo} className="size-4 rounded-full object-cover" />
                  {g.name}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setGuests(prev => prev.filter(x => x.id !== g.id)) }}
                    className="ml-0.5 text-blue-400 hover:text-blue-700"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={guestSearch}
                onChange={(e) => { setGuestSearch(e.target.value); setShowDrop(true) }}
                onFocus={() => setShowDrop(true)}
                placeholder={guests.length === 0 ? "Add guest" : ""}
                className="min-w-20 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>

            {showDrop && (
              <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-lg">
                {filteredCandidates.length > 0 ? filteredCandidates.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setGuests(prev => [...prev, c]); setGuestSearch(""); }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50"
                  >
                    <img src={c.photo} className="size-8 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800">{c.name}</p>
                      <p className="truncate text-xs text-gray-400">{c.position}</p>
                    </div>
                  </button>
                )) : (
                  <p className="px-3 py-3 text-xs text-gray-400">No matching candidates</p>
                )}
              </div>
            )}
          </div>

          {/* Meet link */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5 focus-within:border-blue-300">
            <Link2 className="size-4 shrink-0 text-gray-400" />
            <input
              type="url"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              placeholder="https://meet.google.com/..."
              className="flex-1 truncate text-sm text-blue-500 outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5 focus-within:border-blue-300">
            <AlignJustify className="size-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Add description"
              className="flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Color pickers */}
          <div className="flex items-center gap-2 pt-1">
            {COLORS.map((c, i) => (
              <button
                key={i}
                onClick={() => setColorIdx(i)}
                className={cn(
                  "size-6 rounded-full border-2 transition-transform hover:scale-110",
                  colorIdx === i ? "scale-110 border-gray-700" : "border-transparent"
                )}
                style={{ backgroundColor: c.dot }}
              />
            ))}
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function InterviewsPage() {
  const today = new Date()

  const [weekStart,   setWeekStart]   = useState(() => getWeekStart(today))
  const [view,        setView]        = useState<"Day"|"Week"|"Month">("Week")
  const [interviews,  setInterviews]  = useState<Interview[]>(() => makeSeed())
  const [showModal,   setShowModal]   = useState(false)
  const [modalDate,   setModalDate]   = useState<string>()
  const [modalStart,  setModalStart]  = useState<number>()
  const [modalEnd,    setModalEnd]    = useState<number>()

  // Build week days array
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const endDay  = weekDays[6]
  const wsMonth = weekStart.getMonth()
  const wsYear  = weekStart.getFullYear()
  const headerLabel =
    wsMonth === endDay.getMonth()
      ? `${MONTH_NAMES[wsMonth]} ${wsYear}`
      : `${MONTH_NAMES[wsMonth].slice(0,3)} – ${MONTH_NAMES[endDay.getMonth()].slice(0,3)} ${endDay.getFullYear()}`

  function prevWeek() {
    setWeekStart(p => { const d = new Date(p); d.setDate(d.getDate()-7); return d })
  }
  function nextWeek() {
    setWeekStart(p => { const d = new Date(p); d.setDate(d.getDate()+7); return d })
  }
  function goToday() { setWeekStart(getWeekStart(today)) }

  function isToday(d: Date) {
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth()    === today.getMonth()    &&
           d.getDate()     === today.getDate()
  }

  // Current-time line position (minutes from grid start)
  const nowMin  = today.getHours() * 60 + today.getMinutes()
  const nowTop  = ((nowMin - GRID_START * 60) / 60) * HOUR_PX

  // Hours array
  const hours = Array.from({ length: GRID_END - GRID_START }, (_, i) => GRID_START + i)

  function getDayInterviews(iso: string) {
    return interviews.filter(iv => iv.date === iso)
  }

  function openModal(dayIso: string, clickY: number) {
    const rawMin    = GRID_START * 60 + (clickY / HOUR_PX) * 60
    const rounded   = Math.round(rawMin / 30) * 30
    const clamped   = Math.max(GRID_START * 60, Math.min(GRID_END * 60 - 30, rounded))
    setModalDate(dayIso)
    setModalStart(clamped)
    setModalEnd(clamped + 60)
    setShowModal(true)
  }

  function addInterview(iv: Interview) {
    setInterviews(prev => [...prev, iv])
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 flex-col overflow-hidden bg-white">
        {/* ── Top bar ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-3">
          {/* Left: month label + navigation */}
          <div className="flex items-center gap-3">
            <h1 className="text-[15px] font-semibold text-gray-900">{headerLabel}</h1>
            <button
              onClick={goToday}
              className="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Today
            </button>
            <button onClick={prevWeek} className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={nextWeek} className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Right: icons + view toggle */}
          <div className="flex items-center gap-2">
            <button className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100">
              <Search className="size-4" />
            </button>
            <button className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100">
              <HelpCircle className="size-4" />
            </button>
            <button className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100">
              <Settings className="size-4" />
            </button>
            <div className="ml-1 flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
              {(["Day","Week","Month"] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    view === v
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Calendar body ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Scrollable container */}
          <div className="flex flex-1 overflow-auto">
            {/* Inner width wrapper */}
            <div className="flex min-w-0 flex-1 flex-col">

              {/* Sticky day-header row */}
              <div className="sticky top-0 z-20 flex border-b border-gray-100 bg-white">
                {/* Spacer for time column */}
                <div className="w-16 shrink-0 border-r border-gray-100">
                  <div className="flex h-14 items-end justify-center pb-2">
                    <span className="text-[10px] font-medium text-gray-400">GMT+0</span>
                  </div>
                </div>

                {/* Day headers */}
                {weekDays.map((d, i) => {
                  const tod = isToday(d)
                  return (
                    <div
                      key={i}
                      className="flex flex-1 flex-col items-center justify-center gap-1 border-r border-gray-100 py-2 last:border-r-0"
                    >
                      <span className={cn("text-[11px] font-semibold uppercase tracking-wide", tod ? "text-blue-600" : "text-gray-400")}>
                        {DAY_ABBR[d.getDay()]}
                      </span>
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full text-sm font-bold",
                          tod ? "bg-blue-600 text-white" : "text-gray-800"
                        )}
                      >
                        {d.getDate()}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Time grid */}
              <div className="flex flex-1">
                {/* Time labels column */}
                <div className="relative w-16 shrink-0 border-r border-gray-100">
                  <div style={{ height: `${(GRID_END - GRID_START) * HOUR_PX}px` }} className="relative">
                    {hours.map(h => (
                      <div
                        key={h}
                        className="absolute right-0 flex w-full justify-end pr-2"
                        style={{ top: `${(h - GRID_START) * HOUR_PX - 8}px` }}
                      >
                        <span className="text-[10px] text-gray-400">
                          {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day columns */}
                <div
                  className="relative flex flex-1"
                  style={{ height: `${(GRID_END - GRID_START) * HOUR_PX}px` }}
                >
                  {/* Horizontal hour lines */}
                  {hours.map(h => (
                    <div
                      key={h}
                      className="pointer-events-none absolute left-0 right-0 border-t border-gray-100"
                      style={{ top: `${(h - GRID_START) * HOUR_PX}px` }}
                    />
                  ))}

                  {/* Vertical day columns */}
                  {weekDays.map((day, colIdx) => {
                    const iso     = toIso(day)
                    const todDay  = isToday(day)
                    const dayIvs  = getDayInterviews(iso)
                    const showNow = todDay && nowMin >= GRID_START * 60 && nowMin <= GRID_END * 60

                    return (
                      <div
                        key={colIdx}
                        className={cn(
                          "relative flex-1 cursor-pointer border-r border-gray-100 last:border-r-0",
                          todDay && "bg-blue-50/30"
                        )}
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          openModal(iso, e.clientY - rect.top)
                        }}
                      >
                        {/* Current-time red line */}
                        {showNow && (
                          <div
                            className="pointer-events-none absolute left-0 right-0 z-20 flex items-center"
                            style={{ top: `${nowTop}px` }}
                          >
                            <div className="size-2.5 shrink-0 rounded-full bg-red-500" />
                            <div className="h-px flex-1 bg-red-400" />
                          </div>
                        )}

                        {/* Interview event blocks */}
                        {dayIvs.map(iv => {
                          const c      = COLORS[iv.colorIdx]
                          const top    = ((iv.startMin - GRID_START * 60) / 60) * HOUR_PX
                          const height = Math.max(22, ((iv.endMin - iv.startMin) / 60) * HOUR_PX - 2)
                          return (
                            <div
                              key={iv.id}
                              className="absolute left-1 right-1 overflow-hidden rounded-md px-2 py-1 text-xs shadow-sm"
                              style={{
                                top:             `${top}px`,
                                height:          `${height}px`,
                                backgroundColor: c.bg,
                                color:           c.text,
                                zIndex:          10,
                              }}
                              onClick={e => e.stopPropagation()}
                            >
                              <p className="truncate font-semibold leading-tight">{iv.title}</p>
                              <p className="mt-0.5 text-[10px] opacity-75">
                                {fmtTime(iv.startMin)} – {fmtTime(iv.endMin)}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Add Schedule Modal ── */}
      {showModal && (
        <AddScheduleModal
          onClose={() => setShowModal(false)}
          onSave={addInterview}
          defaultDate={modalDate}
          defaultStart={modalStart}
          defaultEnd={modalEnd}
        />
      )}
    </>
  )
}
