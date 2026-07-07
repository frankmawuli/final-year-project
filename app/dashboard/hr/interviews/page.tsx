"use client"

import { useState, useRef, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  HelpCircle,
  Settings,
  X,
  Calendar as CalendarIcon,
  Clock,
  UserPlus,
  Link2,
  AlignJustify,
  Loader2,
  Briefcase,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { interviewsService, type ApiInterview, type InterviewStatus } from "@/services/interviews.service"
import { jobsService, type ApiJobListItem } from "@/services/jobs.service"
import { ApiError } from "@/lib/api-client"

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
  id:        string
  name:      string
  email:     string
  avatarUrl: string | null
  jobTitle:  string
}

interface Interview {
  id:        string
  title:     string
  date:      string
  startMin:  number
  endMin:    number
  colorIdx:  number
  guests?:   string[]
  meetLink?: string
  desc?:     string
  status:    InterviewStatus
}

// ── Color palette ─────────────────────────────────────────────
const COLORS = [
  { bg: "#fce7f3", text: "#9d174d", dot: "#f472b6" },
  { bg: "#ccfbf1", text: "#0f766e", dot: "#2dd4bf" },
  { bg: "#dbeafe", text: "#1d4ed8", dot: "#60a5fa" },
  { bg: "#fef3c7", text: "#92400e", dot: "#fbbf24" },
  { bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" },
]

// ── Grid constants ────────────────────────────────────────────
const HOUR_PX    = 64
const GRID_START = 7
const GRID_END   = 20

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

function fromApi(iv: ApiInterview): Interview {
  const start = new Date(iv.startTime)
  const end   = new Date(iv.endTime)
  const pad   = (n: number) => String(n).padStart(2, "0")
  const date  = `${start.getUTCFullYear()}-${pad(start.getUTCMonth()+1)}-${pad(start.getUTCDate())}`
  return {
    id:       iv.id,
    title:    iv.title,
    date,
    startMin: start.getUTCHours() * 60 + start.getUTCMinutes(),
    endMin:   end.getUTCHours() * 60 + end.getUTCMinutes(),
    colorIdx: iv.colorIdx,
    guests:   iv.guestEmails.length > 0 ? iv.guestEmails : undefined,
    meetLink: iv.meetLink    ?? undefined,
    desc:     iv.description ?? undefined,
    status:   iv.status,
  }
}

function handleApiError(err: unknown, router: ReturnType<typeof useRouter>) {
  if (err instanceof ApiError) {
    if (err.status === 401) { router.push("/auth/login"); return }
    toast.error(err.message)
  } else {
    toast.error("Something went wrong. Please try again.")
  }
}

function CandidateAvatar({ name, avatarUrl, size = "sm" }: { name: string; avatarUrl: string | null; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "size-4 text-[8px]" : "size-8 text-xs"
  if (avatarUrl) return <img src={avatarUrl} className={cn(sz, "shrink-0 rounded-full object-cover")} />
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div className={cn(sz, "flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary")}>
      {initials}
    </div>
  )
}

// ── Add Schedule Modal ────────────────────────────────────────
interface ModalProps {
  onClose:           () => void
  onSave:            (iv: Interview) => void
  defaultDate?:      string
  defaultStart?:     number
  defaultEnd?:       number
  prefillJobId?:     string
  prefillJobTitle?:  string
  prefillCandidate?: CandidateOption
}

function AddScheduleModal({
  onClose, onSave,
  defaultDate, defaultStart = 9*60, defaultEnd = 10*60,
  prefillJobId = "", prefillJobTitle = "", prefillCandidate,
}: ModalProps) {
  const { accessToken } = useAuth()
  const router = useRouter()

  const [title,             setTitle]             = useState(
    prefillCandidate && prefillJobTitle ? `${prefillCandidate.name} – ${prefillJobTitle}` : ""
  )
  const [date,              setDate]              = useState(defaultDate ?? toIso(new Date()))
  const [startMin,          setStartMin]          = useState(defaultStart)
  const [endMin,            setEndMin]            = useState(defaultEnd)
  const [guests,            setGuests]            = useState<CandidateOption[]>(prefillCandidate ? [prefillCandidate] : [])
  const [guestSearch,       setGuestSearch]       = useState("")
  const [showDrop,          setShowDrop]          = useState(false)
  const [meetLink,          setMeetLink]          = useState("https://meet.google.com/new")
  const [desc,              setDesc]              = useState("")
  const [colorIdx,          setColorIdx]          = useState(2)
  const [error,             setError]             = useState("")
  const [saving,            setSaving]            = useState(false)

  // Job selector
  const [jobId,             setJobId]             = useState(prefillJobId)
  const [jobTitle,          setJobTitle]          = useState(prefillJobTitle)
  const [jobs,              setJobs]              = useState<ApiJobListItem[]>([])
  const [loadingJobs,       setLoadingJobs]       = useState(false)
  const [showJobDrop,       setShowJobDrop]       = useState(false)

  // Applicant list for selected job
  const [jobApplicants,     setJobApplicants]     = useState<CandidateOption[]>([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)

  const guestRef      = useRef<HTMLDivElement>(null)
  const jobDropRef    = useRef<HTMLDivElement>(null)

  // Load job list on mount
  useEffect(() => {
    if (!accessToken) return
    setLoadingJobs(true)
    jobsService.list({ status: "OPEN", limit: 100 }, accessToken)
      .then(res => setJobs(res.data))
      .catch(() => toast.error("Could not load job postings"))
      .finally(() => setLoadingJobs(false))
  }, [accessToken])

  // Load applicants whenever job selection changes
  useEffect(() => {
    if (!jobId || !accessToken) { setJobApplicants([]); return }
    setLoadingApplicants(true)
    jobsService.getAllApplicants({ jobId, limit: 100 }, accessToken)
      .then(res => {
        setJobApplicants(res.data.map(a => ({
          id:        a.candidate.id,
          name:      a.candidate.name,
          email:     a.candidate.email,
          avatarUrl: a.candidate.avatarUrl,
          jobTitle:  a.job.title,
        })))
      })
      .catch(() => toast.error("Could not load applicants"))
      .finally(() => setLoadingApplicants(false))
  }, [jobId, accessToken])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (guestRef.current   && !guestRef.current.contains(e.target as Node))   setShowDrop(false)
      if (jobDropRef.current && !jobDropRef.current.contains(e.target as Node)) setShowJobDrop(false)
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  const filteredApplicants = jobApplicants.filter(
    c => !guests.some(g => g.id === c.id) &&
    (guestSearch === "" ||
      c.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(guestSearch.toLowerCase()))
  )

  function addGuest(c: CandidateOption) {
    setGuests(prev => [...prev, c])
    setGuestSearch("")
    // Auto-fill title with first guest's name + job
    if (!title.trim()) setTitle(`${c.name} – ${jobTitle}`)
  }

  async function handleSave() {
    if (!title.trim())      { setError("Please enter an event title."); return }
    if (endMin <= startMin) { setError("End time must be after start time."); return }
    if (!accessToken)       { router.push("/auth/login"); return }

    setSaving(true)
    setError("")
    try {
      const res = await interviewsService.create({
        title:    title.trim(),
        date,
        startMin,
        endMin,
        colorIdx,
        guests:   guests.length > 0 ? guests.map(g => g.email) : undefined,
        meetLink: meetLink || undefined,
        desc:     desc     || undefined,
      }, accessToken)
      onSave(fromApi(res.data))
      onClose()
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) { router.push("/auth/login"); return }
        setError(err.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-120 rounded-2xl bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-xs font-semibold text-foreground">Add Schedule</h2>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2 px-4 py-3">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Interview title (auto-fills when you pick a candidate)"
            autoFocus
            className="w-full rounded-lg border border-border px-2.5 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {/* Date */}
          <div className="flex items-center gap-2.5 rounded-lg border border-border px-2.5 py-2 focus-within:border-primary">
            <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 bg-transparent text-xs text-foreground outline-none"
            />
          </div>

          {/* Time range */}
          <div className="flex items-center gap-1.5">
            <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 focus-within:border-primary">
              <Clock className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                type="time"
                value={toTimeStr(startMin)}
                onChange={(e) => setStartMin(parseTimeStr(e.target.value))}
                className="w-full bg-transparent text-xs text-foreground outline-none"
              />
            </div>
            <span className="text-xs text-muted-foreground">→</span>
            <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 focus-within:border-primary">
              <Clock className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                type="time"
                value={toTimeStr(endMin)}
                onChange={(e) => setEndMin(parseTimeStr(e.target.value))}
                className="w-full bg-transparent text-xs text-foreground outline-none"
              />
            </div>
          </div>

          {/* ── Job selector ── */}
          <div ref={jobDropRef} className="relative">
            <button
              type="button"
              onClick={() => setShowJobDrop(v => !v)}
              className="flex w-full items-center gap-2.5 rounded-lg border border-border px-2.5 py-2 text-xs focus:border-primary focus:outline-none"
            >
              <Briefcase className="size-4 shrink-0 text-muted-foreground" />
              <span className={cn("flex-1 truncate text-left", jobId ? "text-foreground" : "text-muted-foreground")}>
                {loadingJobs ? "Loading jobs…" : jobId ? jobTitle : "Select a job posting"}
              </span>
              {loadingJobs
                ? <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />
                : <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
              }
            </button>

            {showJobDrop && !loadingJobs && (
              <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                {jobs.length > 0 ? jobs.map(j => (
                  <button
                    key={j.id}
                    type="button"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => {
                      setJobId(j.id)
                      setJobTitle(j.title)
                      setShowJobDrop(false)
                      setGuests([])         // clear guests when job changes
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-2.5 py-2 text-left hover:bg-muted",
                      j.id === jobId && "bg-primary/5"
                    )}
                  >
                    <span className="truncate text-xs text-foreground">{j.title}</span>
                    <span className="ml-1.5 shrink-0 text-[10px] text-muted-foreground">
                      {j._count.applications} applicant{j._count.applications !== 1 ? "s" : ""}
                    </span>
                  </button>
                )) : (
                  <p className="px-2.5 py-2.5 text-xs text-muted-foreground">No open job postings found</p>
                )}
              </div>
            )}
          </div>

          {/* ── Applicant guest picker (shown once a job is selected) ── */}
          {jobId && (
            <div ref={guestRef} className="relative">
              <div
                className="flex min-h-10.5 flex-wrap items-center gap-1 cursor-text rounded-lg border border-border px-2.5 py-1.5 focus-within:border-primary"
                onClick={() => setShowDrop(true)}
              >
                <UserPlus className="size-4 shrink-0 text-muted-foreground" />
                {guests.map(g => (
                  <span
                    key={g.id}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
                  >
                    <CandidateAvatar name={g.name} avatarUrl={g.avatarUrl} size="sm" />
                    {g.name}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setGuests(prev => prev.filter(x => x.id !== g.id)) }}
                      className="ml-0.5 text-primary/60 hover:text-primary"
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
                  placeholder={
                    loadingApplicants ? "Loading applicants…" :
                    guests.length === 0 ? "Search applicants by name or email" : ""
                  }
                  disabled={loadingApplicants}
                  className="min-w-20 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-wait"
                />
                {loadingApplicants && <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />}
              </div>

              {showDrop && !loadingApplicants && (
                <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                  {filteredApplicants.length > 0 ? filteredApplicants.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => addGuest(c)}
                      className="flex w-full items-center gap-2.5 px-2.5 py-1.5 text-left hover:bg-muted"
                    >
                      <CandidateAvatar name={c.name} avatarUrl={c.avatarUrl} size="md" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">{c.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </button>
                  )) : (
                    <p className="px-2.5 py-2.5 text-xs text-muted-foreground">
                      {guestSearch ? "No matching applicants" : "No applicants for this job"}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Meet link */}
          <div className="flex items-center gap-2.5 rounded-lg border border-border px-2.5 py-2 focus-within:border-primary">
            <Link2 className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="url"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              placeholder="https://meet.google.com/…"
              className="flex-1 truncate bg-transparent text-xs text-primary outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Description */}
          <div className="flex items-center gap-2.5 rounded-lg border border-border px-2.5 py-2 focus-within:border-primary">
            <AlignJustify className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Add description"
              className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Color pickers */}
          <div className="flex items-center gap-1.5 pt-1">
            {COLORS.map((c, i) => (
              <button
                key={i}
                onClick={() => setColorIdx(i)}
                className={cn(
                  "size-6 rounded-full border-2 transition-transform hover:scale-110",
                  colorIdx === i ? "scale-110 border-foreground" : "border-transparent"
                )}
                style={{ backgroundColor: c.dot }}
              />
            ))}
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-1.5 border-t border-border px-4 py-2.5">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {saving && <Loader2 className="size-3.5 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function InterviewsPage() {
  const { accessToken, loading: authLoading } = useAuth()
  const router = useRouter()
  const today = new Date()

  const [weekStart,        setWeekStart]        = useState(() => getWeekStart(today))
  const [view,             setView]             = useState<"Day"|"Week"|"Month">("Week")
  const [interviews,       setInterviews]       = useState<Interview[]>([])
  const [loadingData,      setLoadingData]      = useState(true)
  const [showModal,        setShowModal]        = useState(false)
  const [modalDate,        setModalDate]        = useState<string>()
  const [modalStart,       setModalStart]       = useState<number>()
  const [modalEnd,         setModalEnd]         = useState<number>()

  // Prefill state — populated from URL query params (Path B: from applicants page)
  const [prefillJobId,     setPrefillJobId]     = useState("")
  const [prefillJobTitle,  setPrefillJobTitle]  = useState("")
  const [prefillCandidate, setPrefillCandidate] = useState<CandidateOption | undefined>()

  // Read URL params once on mount (Path B entry point)
  useEffect(() => {
    const params        = new URLSearchParams(window.location.search)
    const candidateId   = params.get("candidateId")
    const candidateName = params.get("candidateName")
    const candidateEmail = params.get("candidateEmail")
    const candidateAvatar = params.get("candidateAvatar")
    const jobId         = params.get("jobId")
    const jobTitle      = params.get("jobTitle")

    if (candidateId && candidateName && candidateEmail && jobId && jobTitle) {
      setPrefillJobId(jobId)
      setPrefillJobTitle(jobTitle)
      setPrefillCandidate({
        id:        candidateId,
        name:      candidateName,
        email:     candidateEmail,
        avatarUrl: candidateAvatar || null,
        jobTitle,
      })
      setShowModal(true)
      // Remove params from URL so refreshing doesn't reopen the modal
      window.history.replaceState({}, "", "/dashboard/hr/interviews")
    }
  }, [])

  // Load interviews from API
  useEffect(() => {
    if (authLoading) return
    if (!accessToken) { router.push("/auth/login"); return }

    setLoadingData(true)
    interviewsService.list(accessToken)
      .then(res => setInterviews(res.data.map(fromApi)))
      .catch(err => handleApiError(err, router))
      .finally(() => setLoadingData(false))
  }, [accessToken, authLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCancel(id: string) {
    if (!accessToken) return
    try {
      const res = await interviewsService.cancel(id, accessToken)
      setInterviews(prev => prev.map(iv => iv.id === id ? fromApi(res.data) : iv))
      toast.success("Interview cancelled")
    } catch (err) {
      handleApiError(err, router)
    }
  }

  function addInterview(iv: Interview) {
    setInterviews(prev => [...prev, iv])
  }

  function closeModal() {
    setShowModal(false)
    // Clear prefill so re-opening via click doesn't re-use it
    setPrefillJobId("")
    setPrefillJobTitle("")
    setPrefillCandidate(undefined)
  }

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

  const nowMin = today.getHours() * 60 + today.getMinutes()
  const nowTop = ((nowMin - GRID_START * 60) / 60) * HOUR_PX
  const hours  = Array.from({ length: GRID_END - GRID_START }, (_, i) => GRID_START + i)

  function getDayInterviews(iso: string) {
    return interviews.filter(iv => iv.date === iso)
  }

  function openModal(dayIso: string, clickY: number) {
    const rawMin  = GRID_START * 60 + (clickY / HOUR_PX) * 60
    const rounded = Math.round(rawMin / 30) * 30
    const clamped = Math.max(GRID_START * 60, Math.min(GRID_END * 60 - 30, rounded))
    setModalDate(dayIso)
    setModalStart(clamped)
    setModalEnd(clamped + 60)
    setShowModal(true)
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 flex-col overflow-hidden bg-card">
        {/* ── Top bar ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[15px] font-semibold text-foreground">{headerLabel}</h1>
            <button
              onClick={goToday}
              className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/50"
            >
              Today
            </button>
            <button onClick={prevWeek} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={nextWeek} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="rounded-full p-1 text-muted-foreground hover:bg-muted">
              <Search className="size-4" />
            </button>
            <button className="rounded-full p-1 text-muted-foreground hover:bg-muted">
              <HelpCircle className="size-4" />
            </button>
            <button className="rounded-full p-1 text-muted-foreground hover:bg-muted">
              <Settings className="size-4" />
            </button>
            <div className="ml-1 flex rounded-lg border border-border bg-muted/50 p-0.5">
              {(["Day","Week","Month"] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    view === v
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Calendar body ── */}
        <div className="relative flex flex-1 overflow-hidden">
          {loadingData && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-card/60">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}

          <div className="flex flex-1 overflow-auto">
            <div className="flex min-w-0 flex-1 flex-col">

              {/* Sticky day-header row */}
              <div className="sticky top-0 z-20 flex border-b border-border bg-card">
                <div className="w-16 shrink-0 border-r border-border">
                  <div className="flex h-14 items-end justify-center pb-1.5">
                    <span className="text-[10px] font-medium text-muted-foreground">UTC</span>
                  </div>
                </div>
                {weekDays.map((d, i) => {
                  const tod = isToday(d)
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center justify-center gap-1 border-r border-border py-1.5 last:border-r-0">
                      <span className={cn("text-[11px] font-semibold uppercase tracking-wide", tod ? "text-primary" : "text-muted-foreground")}>
                        {DAY_ABBR[d.getDay()]}
                      </span>
                      <span className={cn(
                        "flex size-8 items-center justify-center rounded-full text-xs font-bold",
                        tod ? "bg-primary text-primary-foreground" : "text-foreground"
                      )}>
                        {d.getDate()}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Time grid */}
              <div className="flex flex-1">
                <div className="relative w-16 shrink-0 border-r border-border">
                  <div style={{ height: `${(GRID_END - GRID_START) * HOUR_PX}px` }} className="relative">
                    {hours.map(h => (
                      <div
                        key={h}
                        className="absolute right-0 flex w-full justify-end pr-1.5"
                        style={{ top: `${(h - GRID_START) * HOUR_PX - 8}px` }}
                      >
                        <span className="text-[10px] text-muted-foreground">
                          {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative flex flex-1" style={{ height: `${(GRID_END - GRID_START) * HOUR_PX}px` }}>
                  {hours.map(h => (
                    <div
                      key={h}
                      className="pointer-events-none absolute left-0 right-0 border-t border-border"
                      style={{ top: `${(h - GRID_START) * HOUR_PX}px` }}
                    />
                  ))}

                  {weekDays.map((day, colIdx) => {
                    const iso     = toIso(day)
                    const todDay  = isToday(day)
                    const dayIvs  = getDayInterviews(iso)
                    const showNow = todDay && nowMin >= GRID_START * 60 && nowMin <= GRID_END * 60

                    return (
                      <div
                        key={colIdx}
                        className={cn(
                          "relative flex-1 cursor-pointer border-r border-border last:border-r-0",
                          todDay && "bg-primary/5"
                        )}
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          openModal(iso, e.clientY - rect.top)
                        }}
                      >
                        {showNow && (
                          <div
                            className="pointer-events-none absolute left-0 right-0 z-20 flex items-center"
                            style={{ top: `${nowTop}px` }}
                          >
                            <div className="size-2.5 shrink-0 rounded-full bg-red-500" />
                            <div className="h-px flex-1 bg-red-400" />
                          </div>
                        )}

                        {dayIvs.map(iv => {
                          const cancelled = iv.status === "CANCELLED"
                          const c         = cancelled ? COLORS[4] : COLORS[iv.colorIdx]
                          const top       = ((iv.startMin - GRID_START * 60) / 60) * HOUR_PX
                          const height    = Math.max(22, ((iv.endMin - iv.startMin) / 60) * HOUR_PX - 2)
                          return (
                            <div
                              key={iv.id}
                              className={cn(
                                "group absolute left-1 right-1 overflow-hidden rounded-md px-1.5 py-1 text-xs shadow-sm",
                                cancelled && "opacity-50"
                              )}
                              style={{
                                top:             `${top}px`,
                                height:          `${height}px`,
                                backgroundColor: c.bg,
                                color:           c.text,
                                zIndex:          10,
                              }}
                              onClick={e => e.stopPropagation()}
                            >
                              <div className="flex items-start justify-between gap-0.5">
                                <p className={cn("truncate font-semibold leading-tight", cancelled && "line-through")}>
                                  {iv.title}
                                </p>
                                {!cancelled && (
                                  <button
                                    title="Cancel interview"
                                    className="ml-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100"
                                    onClick={(e) => { e.stopPropagation(); handleCancel(iv.id) }}
                                  >
                                    <X className="size-3" />
                                  </button>
                                )}
                              </div>
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

      {showModal && (
        <AddScheduleModal
          onClose={closeModal}
          onSave={addInterview}
          defaultDate={modalDate}
          defaultStart={modalStart}
          defaultEnd={modalEnd}
          prefillJobId={prefillJobId}
          prefillJobTitle={prefillJobTitle}
          prefillCandidate={prefillCandidate}
        />
      )}
    </>
  )
}
