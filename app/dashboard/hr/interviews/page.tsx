"use client"

import { useState, useRef, useEffect } from "react"
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Video,
  Phone,
  MapPin,
  X,
  Check,
  MoreHorizontal,
  CalendarDays,
  Clock3,
  LinkIcon,
  StickyNote,
  UserCircle2,
} from "lucide-react"
import { HRIconSidebar } from "@/components/hr-icon-sidebar"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ── Nav ───────────────────────────────────────────────────────
const sidebarNav = [
  { label: "Overview",     href: "/dashboard/hr"              },
  { label: "Calendar",     href: "/dashboard/hr/calendar"     },
  { label: "Announcement", href: "/dashboard/hr/announcement" },
  { label: "Interviews",   href: "/dashboard/hr/interviews"   },
]

// ── Types ─────────────────────────────────────────────────────
type Status = "pending" | "completed" | "cancelled"
type InterviewType = "Video Call" | "In-Person" | "Phone"

interface Interview {
  id: number
  candidate: { name: string; avatar: string }
  position: string
  interviewer: string
  date: string
  time: string
  type: InterviewType
  status: Status
  meetingUrl?: string
}

// ── Seed data ─────────────────────────────────────────────────
const SEED_INTERVIEWS: Interview[] = [
  {
    id: 1,
    candidate: { name: "Ana Jadric",     avatar: "/assets/635a3bf857069957b4442100197a1e910ea3121d.png" },
    position:    "UI/UX Designer",
    interviewer: "Michael Smith",
    date:        "Mon, 31 Mar 2026",
    time:        "10:00 AM",
    type:        "Video Call",
    status:      "pending",
    meetingUrl:  "https://meet.google.com/abc-xyz",
  },
  {
    id: 2,
    candidate: { name: "James Okafor",   avatar: "/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png" },
    position:    "Backend Engineer",
    interviewer: "Sarah Williams",
    date:        "Tue, 01 Apr 2026",
    time:        "2:00 PM",
    type:        "Video Call",
    status:      "pending",
    meetingUrl:  "https://meet.google.com/def-uvw",
  },
  {
    id: 3,
    candidate: { name: "Priya Patel",    avatar: "/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png" },
    position:    "Data Scientist",
    interviewer: "Kevin Osei",
    date:        "Wed, 26 Mar 2026",
    time:        "11:00 AM",
    type:        "In-Person",
    status:      "completed",
  },
  {
    id: 4,
    candidate: { name: "Samuel Torres",  avatar: "/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png" },
    position:    "DevOps Engineer",
    interviewer: "Michael Smith",
    date:        "Thu, 27 Mar 2026",
    time:        "3:00 PM",
    type:        "Phone",
    status:      "completed",
  },
  {
    id: 5,
    candidate: { name: "Lena Schmidt",   avatar: "/assets/b576687fbeec177fd13f21dd8dbc7c15d0e204cb.png" },
    position:    "UX Researcher",
    interviewer: "Anita Clarke",
    date:        "Fri, 28 Mar 2026",
    time:        "9:00 AM",
    type:        "Video Call",
    status:      "cancelled",
  },
  {
    id: 6,
    candidate: { name: "Omar Hassan",    avatar: "/assets/ba50d841bff1eb820c0b59f56f778fbbf8b8a8c3.png" },
    position:    "Product Manager",
    interviewer: "Sarah Williams",
    date:        "Mon, 02 Apr 2026",
    time:        "1:00 PM",
    type:        "In-Person",
    status:      "pending",
  },
  {
    id: 7,
    candidate: { name: "Clara Mensah",   avatar: "/assets/3b57a33d98b5a1b80a335988932aa248a0875725.png" },
    position:    "Marketing Analyst",
    interviewer: "Kevin Osei",
    date:        "Tue, 25 Mar 2026",
    time:        "4:00 PM",
    type:        "Video Call",
    status:      "completed",
  },
  {
    id: 8,
    candidate: { name: "David Kim",      avatar: "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png" },
    position:    "Frontend Engineer",
    interviewer: "Michael Smith",
    date:        "Thu, 03 Apr 2026",
    time:        "11:00 AM",
    type:        "Video Call",
    status:      "pending",
  },
]

// ── Candidate pool for scheduling ────────────────────────────
const CANDIDATES = [
  { id: "1", name: "Ana Jadric",    role: "UI/UX Designer",    avatar: "/assets/635a3bf857069957b4442100197a1e910ea3121d.png" },
  { id: "2", name: "James Okafor",  role: "Backend Engineer",  avatar: "/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png" },
  { id: "3", name: "Priya Patel",   role: "Data Scientist",    avatar: "/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png" },
  { id: "4", name: "Samuel Torres", role: "DevOps Engineer",   avatar: "/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png" },
  { id: "5", name: "Lena Schmidt",  role: "UX Researcher",     avatar: "/assets/b576687fbeec177fd13f21dd8dbc7c15d0e204cb.png" },
  { id: "6", name: "Omar Hassan",   role: "Product Manager",   avatar: "/assets/ba50d841bff1eb820c0b59f56f778fbbf8b8a8c3.png" },
  { id: "7", name: "Clara Mensah",  role: "Marketing Analyst", avatar: "/assets/3b57a33d98b5a1b80a335988932aa248a0875725.png" },
  { id: "8", name: "David Kim",     role: "Frontend Engineer", avatar: "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png" },
]

// ── Time slots (3-col grid like the design) ───────────────────
const TIME_SLOTS = [
  "7:00 AM", "12:00 PM", "5:00 PM",
  "8:00 AM", "1:00 PM",  "6:00 PM",
  "9:00 AM", "2:00 PM",  "7:00 PM",
  "10:00 AM","3:00 PM",  "8:00 PM",
  "11:00 AM","4:00 PM",  "9:00 PM",
]

// Unavailable for demo
const UNAVAILABLE_SLOTS = new Set(["9:00 AM", "10:00 AM"])

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"]

// ── Helpers ───────────────────────────────────────────────────
function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate()
}
function firstDayOfWeek(y: number, m: number) {
  return new Date(y, m, 1).getDay()
}
function padCalendar(y: number, m: number): (number | null)[] {
  const offset = firstDayOfWeek(y, m)
  const total  = daysInMonth(y, m)
  const cells: (number | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= total; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}
function formatDateLabel(y: number, m: number, d: number) {
  const date = new Date(y, m, d)
  return date.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  })
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    pending:   "bg-amber-50 text-amber-700 ring-amber-200",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelled: "bg-rose-50 text-rose-600 ring-rose-200",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1",
        map[status]
      )}
    >
      {status === "completed" && <Check className="size-2.5" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ── Interview type icon + badge ────────────────────────────────
function TypeBadge({ type }: { type: InterviewType }) {
  const icons: Record<InterviewType, React.ReactNode> = {
    "Video Call": <Video  className="size-3" />,
    "Phone":      <Phone  className="size-3" />,
    "In-Person":  <MapPin className="size-3" />,
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {icons[type]}{type}
    </span>
  )
}

// ── Mini calendar ─────────────────────────────────────────────
function CalendarPicker({
  selectedDay, selectedMonth, selectedYear,
  onSelect, viewMonth, viewYear, onPrev, onNext,
}: {
  selectedDay: number | null
  selectedMonth: number
  selectedYear: number
  onSelect: (day: number) => void
  viewMonth: number
  viewYear: number
  onPrev: () => void
  onNext: () => void
}) {
  const cells = padCalendar(viewYear, viewMonth)
  const today = new Date()

  return (
    <div className="select-none">
      {/* Month nav */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onPrev}
          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={onNext}
          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-1 grid grid-cols-7">
        {DAYS.map((d) => (
          <div key={d} className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={i} />
          }
          const isSelected =
            day === selectedDay &&
            viewMonth === selectedMonth &&
            viewYear  === selectedYear
          const isToday =
            day === today.getDate() &&
            viewMonth === today.getMonth() &&
            viewYear  === today.getFullYear()
          const isPast =
            new Date(viewYear, viewMonth, day) <
            new Date(today.getFullYear(), today.getMonth(), today.getDate())

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onSelect(day)}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-[13px] transition-colors mx-auto my-0.5",
                isSelected
                  ? "bg-primary font-semibold text-white"
                  : isToday
                  ? "font-semibold text-primary ring-1 ring-primary"
                  : isPast
                  ? "cursor-not-allowed text-muted-foreground/40"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Schedule Modal ─────────────────────────────────────────────
function ScheduleModal({
  open,
  onClose,
  onSchedule,
}: {
  open: boolean
  onClose: () => void
  onSchedule: (interview: Omit<Interview, "id">) => void
}) {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selDay,    setSelDay]    = useState<number | null>(null)
  const [selMonth,  setSelMonth]  = useState(today.getMonth())
  const [selYear,   setSelYear]   = useState(today.getFullYear())
  const [selTime,   setSelTime]   = useState<string | null>(null)

  const [candidateSearch, setCandidateSearch] = useState("")
  const [candidate, setCandidate] = useState<typeof CANDIDATES[0] | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [meetingTitle, setMeetingTitle] = useState("Interview")
  const [meetingUrl,   setMeetingUrl]   = useState("")
  const [toEmail,      setToEmail]      = useState("")
  const [note,         setNote]         = useState("")
  const [interviewType, setInterviewType] = useState<InterviewType>("Video Call")

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Trap scroll on body when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  const filteredCandidates = CANDIDATES.filter(
    (c) =>
      c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.role.toLowerCase().includes(candidateSearch.toLowerCase())
  )

  const canSubmit = selDay !== null && selTime !== null && candidate !== null && meetingTitle.trim()

  function handleSubmit() {
    if (!canSubmit || !candidate) return
    const dateLabel = formatDateLabel(selYear, selMonth, selDay!)
    onSchedule({
      candidate: { name: candidate.name, avatar: candidate.avatar },
      position:    candidate.role,
      interviewer: "Michael Smith",
      date:        dateLabel,
      time:        selTime!,
      type:        interviewType,
      status:      "pending",
      meetingUrl:  meetingUrl || undefined,
    })
    onClose()
  }

  const selectedDateLabel =
    selDay !== null ? formatDateLabel(selYear, selMonth, selDay) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-[780px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Schedule Interview</h2>
            <p className="text-xs text-muted-foreground">Pick a date, time and fill in the details</p>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Top split: calendar + time slots */}
          <div className="grid grid-cols-1 gap-0 border-b border-border sm:grid-cols-[1fr_1fr]">
            {/* Calendar */}
            <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                Pick a date
              </p>
              <CalendarPicker
                selectedDay={selDay}
                selectedMonth={selMonth}
                selectedYear={selYear}
                viewMonth={viewMonth}
                viewYear={viewYear}
                onSelect={(d) => {
                  setSelDay(d)
                  setSelMonth(viewMonth)
                  setSelYear(viewYear)
                }}
                onPrev={() => {
                  if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
                  else setViewMonth((m) => m - 1)
                }}
                onNext={() => {
                  if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
                  else setViewMonth((m) => m + 1)
                }}
              />
            </div>

            {/* Time slots */}
            <div className="p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pick a time interval
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const unavailable = UNAVAILABLE_SLOTS.has(slot)
                  const selected    = selTime === slot
                  return (
                    <button
                      key={slot}
                      disabled={unavailable}
                      onClick={() => setSelTime(slot)}
                      className={cn(
                        "rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors",
                        selected
                          ? "border-primary bg-primary text-white"
                          : unavailable
                          ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/40"
                          : "border-border bg-white text-foreground hover:border-primary/50 hover:bg-primary/5"
                      )}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Candidate + form */}
          <div className="p-5">
            {/* Candidate row */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              {/* Candidate picker */}
              <div ref={dropdownRef} className="relative flex-1">
                {candidate ? (
                  <div className="flex items-center gap-3 rounded-xl border border-primary bg-primary/5 px-4 py-2.5">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="size-9 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.role}</p>
                    </div>
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                      <Check className="size-3 text-white" />
                    </div>
                    <button onClick={() => { setCandidate(null); setCandidateSearch("") }}>
                      <X className="size-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex h-[44px] items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                      <UserCircle2 className="size-4 shrink-0 text-muted-foreground" />
                      <input
                        value={candidateSearch}
                        onChange={(e) => { setCandidateSearch(e.target.value); setDropdownOpen(true) }}
                        onFocus={() => setDropdownOpen(true)}
                        placeholder="Search candidate…"
                        className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                    {dropdownOpen && filteredCandidates.length > 0 && (
                      <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                        {filteredCandidates.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setCandidate(c)
                              setDropdownOpen(false)
                              setCandidateSearch("")
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted"
                          >
                            <img src={c.avatar} alt={c.name} className="size-7 rounded-full object-cover" />
                            <div>
                              <p className="text-[13px] font-medium text-foreground">{c.name}</p>
                              <p className="text-[11px] text-muted-foreground">{c.role}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Selected date/time display */}
              {selectedDateLabel && selTime && (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground sm:shrink-0">
                  <CalendarDays className="size-4 text-primary" />
                  <span className="font-medium">{selectedDateLabel}</span>
                  <span className="text-muted-foreground">·</span>
                  <Clock3 className="size-4 text-primary" />
                  <span className="font-medium">{selTime}</span>
                </div>
              )}
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Meeting Title */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <StickyNote className="size-3" /> Meeting Title
                </label>
                <input
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="h-[42px] rounded-xl border border-border bg-muted/40 px-3.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Meeting URL */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <LinkIcon className="size-3" /> Meeting URL
                </label>
                <input
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://meet.google.com/…"
                  className="h-[42px] rounded-xl border border-border bg-muted/40 px-3.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Interview type */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Video className="size-3" /> Type
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                  className="h-[42px] rounded-xl border border-border bg-muted/40 px-3 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option>Video Call</option>
                  <option>In-Person</option>
                  <option>Phone</option>
                </select>
              </div>

              {/* Note */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <StickyNote className="size-3" /> Note
                </label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional notes…"
                  className="h-[42px] rounded-xl border border-border bg-muted/40 px-3.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" /> Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all",
              canSubmit
                ? "bg-primary hover:bg-primary/90"
                : "cursor-not-allowed bg-primary/40"
            )}
          >
            <Check className="size-3.5" /> Schedule
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({
  label, value, color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-bold", color)}>{value}</p>
    </div>
  )
}

// ── Interview row ─────────────────────────────────────────────
function InterviewRow({
  interview,
  onStatusChange,
}: {
  interview: Interview
  onStatusChange: (id: number, status: Status) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <tr className="group border-t border-border transition-colors hover:bg-muted/30">
      {/* Candidate */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <img
            src={interview.candidate.avatar}
            alt={interview.candidate.name}
            className="size-8 shrink-0 rounded-full object-cover"
          />
          <div>
            <p className="text-[13px] font-semibold text-foreground">{interview.candidate.name}</p>
            <p className="text-[11px] text-muted-foreground">{interview.position}</p>
          </div>
        </div>
      </td>

      {/* Interviewer */}
      <td className="px-5 py-3.5 text-[13px] text-muted-foreground">{interview.interviewer}</td>

      {/* Date & Time */}
      <td className="px-5 py-3.5">
        <p className="text-[13px] font-medium text-foreground">{interview.date}</p>
        <p className="text-[11px] text-muted-foreground">{interview.time}</p>
      </td>

      {/* Type */}
      <td className="px-5 py-3.5">
        <TypeBadge type={interview.type} />
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <StatusBadge status={interview.status} />
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5">
        <div ref={menuRef} className="relative flex justify-end">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 min-w-[160px] overflow-hidden rounded-xl border border-border bg-white shadow-lg">
              {interview.status !== "completed" && (
                <button
                  onClick={() => { onStatusChange(interview.id, "completed"); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] text-emerald-600 hover:bg-muted"
                >
                  <Check className="size-3.5" /> Mark Completed
                </button>
              )}
              {interview.status !== "cancelled" && (
                <button
                  onClick={() => { onStatusChange(interview.id, "cancelled"); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] text-rose-600 hover:bg-muted"
                >
                  <X className="size-3.5" /> Cancel Interview
                </button>
              )}
              {interview.status === "cancelled" && (
                <button
                  onClick={() => { onStatusChange(interview.id, "pending"); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] text-amber-600 hover:bg-muted"
                >
                  <Clock3 className="size-3.5" /> Restore to Pending
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>(SEED_INTERVIEWS)
  const [activeTab, setActiveTab]   = useState<"all" | Status>("all")
  const [search, setSearch]         = useState("")
  const [modalOpen, setModalOpen]   = useState(false)
  const [nextId, setNextId]         = useState(100)

  const counts = {
    all:       interviews.length,
    pending:   interviews.filter((i) => i.status === "pending").length,
    completed: interviews.filter((i) => i.status === "completed").length,
    cancelled: interviews.filter((i) => i.status === "cancelled").length,
  }

  const filtered = interviews.filter((iv) => {
    const matchTab    = activeTab === "all" || iv.status === activeTab
    const matchSearch =
      iv.candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      iv.position.toLowerCase().includes(search.toLowerCase()) ||
      iv.interviewer.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  function handleSchedule(interview: Omit<Interview, "id">) {
    setInterviews((prev) => [{ ...interview, id: nextId }, ...prev])
    setNextId((n) => n + 1)
  }

  function handleStatusChange(id: number, status: Status) {
    setInterviews((prev) =>
      prev.map((iv) => (iv.id === id ? { ...iv, status } : iv))
    )
  }

  const tabs: { key: "all" | Status; label: string }[] = [
    { key: "all",       label: "All"       },
    { key: "pending",   label: "Pending"   },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <HRIconSidebar />
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1280px] p-6">

          {/* ── Page header ───────────────────────────────── */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Interview Schedule</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Manage and track all candidate interviews
              </p>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
            >
              <Plus className="size-4" />
              Add Schedule
            </Button>
          </div>

          {/* ── Stat cards ────────────────────────────────── */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Interviews" value={counts.all}       color="text-foreground" />
            <StatCard label="Pending"          value={counts.pending}   color="text-amber-600"  />
            <StatCard label="Completed"        value={counts.completed} color="text-emerald-600"/>
            <StatCard label="Cancelled"        value={counts.cancelled} color="text-rose-500"   />
          </div>

          {/* ── Filters ───────────────────────────────────── */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1 shadow-sm">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[13px] font-medium transition-colors",
                    activeTab === t.key
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0 text-[11px] font-semibold",
                      activeTab === t.key
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {counts[t.key]}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate or interviewer…"
                className="w-[220px] bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X className="size-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* ── Table ─────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Candidate
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Interviewer
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Date & Time
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Type
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center text-sm text-muted-foreground">
                        No interviews found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((iv) => (
                      <InterviewRow
                        key={iv.id}
                        interview={iv}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      <ScheduleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSchedule={handleSchedule}
      />
    </div>
  )
}
