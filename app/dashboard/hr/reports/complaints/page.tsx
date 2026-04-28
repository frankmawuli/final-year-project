"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search, ChevronDown, ChevronLeft, ChevronRight, X,
  ShieldAlert, AlertCircle, CheckCircle2, Clock, XCircle,
  EyeOff, Eye, MessageSquare, CalendarDays, Building2,
  SlidersHorizontal,
} from "lucide-react"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { cn } from "@/lib/utils"

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "All Reports",  href: "/dashboard/hr/reports"              },
  { label: "Performance",  href: "#"                                   },
  { label: "Incidents",    href: "#"                                   },
  { label: "Complaints",   href: "/dashboard/hr/reports/complaints"   },
]

// ── Types ─────────────────────────────────────────────────────
type ComplaintCategory = "Workplace Harassment" | "Discrimination" | "Safety Concern" | "Manager Conduct" | "Policy Violation" | "Other"
type ComplaintPriority = "Low" | "Medium" | "High" | "Critical"
type ComplaintStatus   = "Submitted" | "Under Investigation" | "Resolved" | "Closed"

interface Complaint {
  id:          number
  ref:         string
  name:        string        // "Anonymous" if anonymous
  photo:       string
  email:       string
  department:  string
  anonymous:   boolean
  title:       string
  category:    ComplaintCategory
  priority:    ComplaintPriority
  submittedOn: string
  status:      ComplaintStatus
  description: string
  updates:     { date: string; text: string }[]
}

// ── Style maps ────────────────────────────────────────────────
const categoryStyle: Record<ComplaintCategory, { bg: string; text: string }> = {
  "Workplace Harassment": { bg: "bg-[#fef2f2]", text: "text-[#dc2626]" },
  "Discrimination":       { bg: "bg-[#fff7ed]", text: "text-[#ea580c]" },
  "Safety Concern":       { bg: "bg-[#fffbeb]", text: "text-[#d97706]" },
  "Manager Conduct":      { bg: "bg-[#f5f3ff]", text: "text-[#7c3aed]" },
  "Policy Violation":     { bg: "bg-[#f0f9ff]", text: "text-[#0369a1]" },
  "Other":                { bg: "bg-[#f4f5f9]", text: "text-[#6b7280]" },
}

const priorityStyle: Record<ComplaintPriority, { badge: string; dot: string }> = {
  Low:      { badge: "bg-[#f4f5f9] text-[#6b7280]",   dot: "bg-[#9ca3af]"  },
  Medium:   { badge: "bg-[#fffbeb] text-[#d97706]",   dot: "bg-[#d97706]"  },
  High:     { badge: "bg-[#fff7ed] text-[#ea580c]",   dot: "bg-[#ea580c]"  },
  Critical: { badge: "bg-[#fef2f2] text-[#dc2626]",   dot: "bg-[#dc2626]"  },
}

const statusStyle: Record<ComplaintStatus, { badge: string; dot: string; icon: React.ElementType }> = {
  "Submitted":           { badge: "border-[#d97706] text-[#d97706]", dot: "bg-[#d97706]", icon: Clock        },
  "Under Investigation": { badge: "border-[#5e81f4] text-[#5e81f4]", dot: "bg-[#5e81f4]", icon: AlertCircle  },
  "Resolved":            { badge: "border-[#16a34a] text-[#16a34a]", dot: "bg-[#16a34a]", icon: CheckCircle2 },
  "Closed":              { badge: "border-[#8181a5] text-[#8181a5]", dot: "bg-[#8181a5]", icon: XCircle      },
}

const CATEGORIES: ComplaintCategory[] = [
  "Workplace Harassment", "Discrimination", "Safety Concern", "Manager Conduct", "Policy Violation", "Other",
]
const PRIORITIES: ComplaintPriority[] = ["Low", "Medium", "High", "Critical"]
const STATUSES:   ComplaintStatus[]   = ["Submitted", "Under Investigation", "Resolved", "Closed"]

// ── Photos ────────────────────────────────────────────────────
const photos: Record<string, string> = {
  "Michael Chen":     "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png",
  "Sarah Williams":   "/assets/c8f5ae43e33ebde623eb7d3b22aeb6930878a4ce.png",
  "David Rodriguez":  "/assets/cf9965b714128bf9b66e7daf6ad58bf5300b9eea.png",
  "James Anderson":   "/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png",
  "Jessica Martinez": "/assets/ba50d841bff1eb820c0b59f56f778fbbf8b8a8c3.png",
  "Robert Taylor":    "/assets/3b57a33d98b5a1b80a335988932aa248a0875725.png",
  "Priya Patel":      "/assets/635a3bf857069957b4442100197a1e910ea3121d.png",
  "Lena Schmidt":     "/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png",
  "Omar Hassan":      "/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png",
}

const ANON_AVATAR = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

// ── Seed data ─────────────────────────────────────────────────
const seed: Complaint[] = [
  {
    id: 1, ref: "CMP-1001",
    name: "Omar Hassan", photo: photos["Omar Hassan"], email: "omar.hassan@corecruiter.com", department: "Engineering",
    anonymous: false,
    title: "On-Call Rotation Fairness",
    category: "Policy Violation", priority: "High",
    submittedOn: "Mar 25, 2026", status: "Under Investigation",
    description: "On-call duties are distributed unevenly. Junior engineers carry significantly more weekend shifts than seniors. Over the past two months I have been on-call 6 weekends while senior engineers averaged 1. This is affecting morale and work-life balance.",
    updates: [
      { date: "Mar 26, 2026", text: "Complaint received and assigned to HR Specialist Lena Schmidt." },
      { date: "Mar 28, 2026", text: "Engineering manager notified. On-call data for the past 3 months being compiled." },
      { date: "Apr 02, 2026", text: "Data review confirmed imbalance. Policy revision meeting scheduled for Apr 10." },
    ],
  },
  {
    id: 2, ref: "CMP-1002",
    name: "Anonymous", photo: ANON_AVATAR, email: "", department: "Marketing",
    anonymous: true,
    title: "Repeated interruptions during presentations",
    category: "Manager Conduct", priority: "Medium",
    submittedOn: "Mar 20, 2026", status: "Under Investigation",
    description: "During the last three sprint reviews my manager repeatedly interrupted my presentations before I finish, dismissing my points in front of the team. This has affected my confidence and team dynamics significantly.",
    updates: [
      { date: "Mar 22, 2026", text: "Complaint received and assigned to HR. Initial review in progress." },
      { date: "Mar 25, 2026", text: "HR scheduled a private meeting with the relevant manager for April 3." },
    ],
  },
  {
    id: 3, ref: "CMP-1003",
    name: "Anonymous", photo: ANON_AVATAR, email: "", department: "Engineering",
    anonymous: true,
    title: "Unsafe electrical wiring in server room",
    category: "Safety Concern", priority: "Critical",
    submittedOn: "Feb 08, 2026", status: "Resolved",
    description: "Exposed wiring near the server rack on floor 2 poses a fire and electrocution risk. The issue was first noticed in January and has not been addressed by facilities despite multiple verbal reports.",
    updates: [
      { date: "Feb 09, 2026", text: "Facilities team notified immediately. Temporary safety barrier installed." },
      { date: "Feb 14, 2026", text: "Licensed electrician inspected and repaired all exposed wiring. Passed safety audit." },
      { date: "Feb 15, 2026", text: "Complaint resolved and closed with safety certificate issued." },
    ],
  },
  {
    id: 4, ref: "CMP-1004",
    name: "Jessica Martinez", photo: photos["Jessica Martinez"], email: "jessica.martinez@corecruiter.com", department: "Design",
    anonymous: false,
    title: "Gender-based pay disparity in Design team",
    category: "Discrimination", priority: "Critical",
    submittedOn: "Mar 10, 2026", status: "Under Investigation",
    description: "After a salary discussion with a male colleague of identical seniority and tenure, I discovered my compensation is approximately 18% lower with no documented justification. I am requesting a formal pay equity review for the entire Design department.",
    updates: [
      { date: "Mar 11, 2026", text: "Complaint escalated to HR Director. Pay equity audit initiated." },
      { date: "Mar 18, 2026", text: "Compensation data for the Design team compiled and under legal review." },
    ],
  },
  {
    id: 5, ref: "CMP-1005",
    name: "David Rodriguez", photo: photos["David Rodriguez"], email: "david.rodriguez@corecruiter.com", department: "Engineering",
    anonymous: false,
    title: "CRM Tool Access Denied Without Explanation",
    category: "Policy Violation", priority: "Low",
    submittedOn: "Feb 20, 2026", status: "Resolved",
    description: "My access to the CRM tool required for client integrations was revoked without prior notice or explanation. This blocked two sprint deliverables for three days. No one in IT could explain the reason.",
    updates: [
      { date: "Feb 21, 2026", text: "IT team contacted. Access revocation traced to an automated security policy sweep." },
      { date: "Feb 23, 2026", text: "Access restored. IT agreed to send advance notices before automated access changes." },
    ],
  },
  {
    id: 6, ref: "CMP-1006",
    name: "Priya Patel", photo: photos["Priya Patel"], email: "priya.patel@corecruiter.com", department: "Analytics",
    anonymous: false,
    title: "Hostile comment during team meeting",
    category: "Workplace Harassment", priority: "High",
    submittedOn: "Mar 05, 2026", status: "Resolved",
    description: "During a cross-team meeting on March 4, a colleague made a dismissive and culturally insensitive comment directed at me in front of eight colleagues. The comment went unchallenged by the meeting lead. I have a recording if required.",
    updates: [
      { date: "Mar 06, 2026", text: "Complaint received. HR reviewed the submitted recording." },
      { date: "Mar 09, 2026", text: "Formal conversation held with the involved colleague and their manager." },
      { date: "Mar 14, 2026", text: "Mandatory sensitivity training assigned. Written warning issued. Complaint resolved." },
    ],
  },
  {
    id: 7, ref: "CMP-1007",
    name: "Sarah Williams", photo: photos["Sarah Williams"], email: "sarah.williams@corecruiter.com", department: "Marketing",
    anonymous: false,
    title: "Inadequate mental health support resources",
    category: "Other", priority: "Medium",
    submittedOn: "Apr 01, 2026", status: "Submitted",
    description: "The company's EAP (Employee Assistance Programme) link on the intranet has been broken for over two months. Several colleagues have mentioned wanting to use it but being unable to access it. This is especially concerning during the current high-workload period.",
    updates: [
      { date: "Apr 01, 2026", text: "Complaint received and logged. Forwarded to People Operations." },
    ],
  },
  {
    id: 8, ref: "CMP-1008",
    name: "Anonymous", photo: ANON_AVATAR, email: "", department: "Sales",
    anonymous: true,
    title: "Pressure to falsify sales pipeline figures",
    category: "Manager Conduct", priority: "Critical",
    submittedOn: "Mar 28, 2026", status: "Under Investigation",
    description: "My direct manager has on two separate occasions asked me to move deals to 'Closed Won' in the CRM before contracts were actually signed, in order to meet end-of-quarter targets. This is inaccurate reporting and puts me in a very uncomfortable position.",
    updates: [
      { date: "Mar 29, 2026", text: "Complaint flagged as critical. Escalated to the VP of People and Legal team." },
      { date: "Apr 03, 2026", text: "Independent investigation commenced. CRM audit logs being reviewed." },
    ],
  },
  {
    id: 9, ref: "CMP-1009",
    name: "Robert Taylor", photo: photos["Robert Taylor"], email: "robert.taylor@corecruiter.com", department: "Engineering",
    anonymous: false,
    title: "Lack of remote work equipment support",
    category: "Policy Violation", priority: "Low",
    submittedOn: "Jan 15, 2026", status: "Closed",
    description: "My request for a second monitor for home office use was denied despite the company policy stating remote employees are eligible for up to $500 in equipment annually. My manager approved the request but IT purchasing declined without explanation.",
    updates: [
      { date: "Jan 16, 2026", text: "Procurement team contacted for clarification on the policy." },
      { date: "Jan 20, 2026", text: "Equipment approved. Budget code issue resolved. Monitor delivered Feb 3." },
      { date: "Feb 04, 2026", text: "Employee confirmed receipt. Complaint closed." },
    ],
  },
  {
    id: 10, ref: "CMP-1010",
    name: "James Anderson", photo: photos["James Anderson"], email: "james.anderson@corecruiter.com", department: "Sales",
    anonymous: false,
    title: "Exclusion from key client meetings",
    category: "Discrimination", priority: "Medium",
    submittedOn: "Feb 28, 2026", status: "Closed",
    description: "I have been systematically excluded from three client meetings that fell within my territory and account responsibility. A junior colleague with less experience was sent in my place without any explanation. I believe this is related to a comment made about my age during last year's team restructure.",
    updates: [
      { date: "Mar 01, 2026", text: "Complaint received. Sales leadership asked to provide meeting attendance rationale." },
      { date: "Mar 08, 2026", text: "Investigation found scheduling conflict was the primary cause. No discriminatory intent established." },
      { date: "Mar 10, 2026", text: "Process agreed for better communication on client meeting assignments. Closed." },
    ],
  },
  {
    id: 11, ref: "CMP-1011",
    name: "Michael Chen", photo: photos["Michael Chen"], email: "michael.chen@corecruiter.com", department: "Design",
    anonymous: false,
    title: "Broken air conditioning in design studio",
    category: "Safety Concern", priority: "Medium",
    submittedOn: "Apr 05, 2026", status: "Submitted",
    description: "The air conditioning unit in the design studio (Room 204) has been non-functional for 11 days. Indoor temperatures have exceeded 30°C on several afternoons. Three team members have reported headaches and difficulty concentrating. Facilities has not responded to two internal tickets.",
    updates: [
      { date: "Apr 05, 2026", text: "Complaint received. Facilities manager notified directly by HR." },
    ],
  },
  {
    id: 12, ref: "CMP-1012",
    name: "Lena Schmidt", photo: photos["Lena Schmidt"], email: "lena.schmidt@corecruiter.com", department: "HR",
    anonymous: false,
    title: "Confidential HR data shared without authorisation",
    category: "Policy Violation", priority: "High",
    submittedOn: "Mar 14, 2026", status: "Resolved",
    description: "An employee's salary and performance review details were shared by a department head in a team Slack channel without the employee's knowledge or consent. This is a clear breach of data confidentiality policy and GDPR obligations.",
    updates: [
      { date: "Mar 14, 2026", text: "Urgent: complaint flagged to HR Director and Data Protection Officer." },
      { date: "Mar 15, 2026", text: "Message deleted from Slack. Department head issued formal warning." },
      { date: "Mar 17, 2026", text: "Affected employee notified and apologised to. GDPR incident report filed. Resolved." },
    ],
  },
]

const PER_PAGE = 8

// ── Status dropdown (inline) ──────────────────────────────────
function StatusDropdown({ value, onChange }: { value: ComplaintStatus; onChange: (s: ComplaintStatus) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { badge } = statusStyle[value]

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-opacity hover:opacity-80", badge)}
      >
        {value}
        <ChevronDown className="size-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false) }}
              className={cn("flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium hover:bg-muted", s === value && "bg-muted/60")}
            >
              <span className={cn("size-2 shrink-0 rounded-full", statusStyle[s].dot)} />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Filter dropdown (generic) ──────────────────────────────────
function FilterDropdown<T extends string>({
  label, value, options, onChange,
}: {
  label: string; value: T | "All"; options: T[]; onChange: (v: T | "All") => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = value !== "All"

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "border-[#5e81f4] bg-[#eef2ff] text-[#5e81f4]"
            : "border-border text-[#8181a5] hover:bg-muted"
        )}
      >
        <SlidersHorizontal className="size-3.5" />
        {active ? value : label}
        <ChevronDown className="size-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-border bg-white shadow-lg">
          <button
            onClick={() => { onChange("All"); setOpen(false) }}
            className={cn("flex w-full px-4 py-2.5 text-left text-sm hover:bg-muted", value === "All" && "bg-muted/60 font-medium")}
          >
            All {label}s
          </button>
          {options.map(o => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false) }}
              className={cn("flex w-full px-4 py-2.5 text-left text-sm hover:bg-muted", value === o && "bg-muted/60 font-medium")}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Detail slide-over ─────────────────────────────────────────
function DetailPanel({ c, onClose, onStatusChange }: {
  c:              Complaint
  onClose:        () => void
  onStatusChange: (s: ComplaintStatus) => void
}) {
  const catStyle = categoryStyle[c.category]
  const { badge: statBadge } = statusStyle[c.status]
  const { badge: prioBadge } = priorityStyle[c.priority]

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-40 flex h-full w-[440px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8181a5]">{c.ref}</p>
            <h2 className="mt-0.5 text-sm font-bold text-[#1f2937]">{c.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Employee row */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-[#f8fafc] px-4 py-3">
            <div className="relative">
              <img
                src={c.photo}
                alt={c.anonymous ? "Anonymous" : c.name}
                className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white shadow"
              />
              {c.anonymous && (
                <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#6b7280] ring-2 ring-white">
                  <EyeOff className="size-2.5 text-white" />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#1f2937]">
                {c.anonymous ? "Anonymous Employee" : c.name}
              </p>
              {c.anonymous ? (
                <p className="text-xs text-[#8181a5]">Identity protected</p>
              ) : (
                <p className="text-xs text-[#8181a5]">{c.email}</p>
              )}
              {c.department && (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#f0f0ff] px-2 py-0.5 text-[11px] text-[#8a8cd9]">
                  <Building2 className="size-3" />{c.department}
                </span>
              )}
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <span className={cn("rounded-full px-3 py-1 text-[11px] font-semibold", catStyle.bg, catStyle.text)}>
              {c.category}
            </span>
            <span className={cn("rounded-full px-3 py-1 text-[11px] font-semibold", prioBadge)}>
              {c.priority} Priority
            </span>
            <span className={cn("flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold", statBadge)}>
              {c.status}
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-[#8181a5]">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" /> Submitted {c.submittedOn}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="size-3.5" /> {c.updates.length} update{c.updates.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Description */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#8181a5]">Description</p>
            <p className="text-sm leading-relaxed text-[#374151]">{c.description}</p>
          </div>

          {/* Timeline */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8181a5]">Activity Timeline</p>
            <div className="flex flex-col">
              {c.updates.map((u, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="mt-1 size-2.5 shrink-0 rounded-full bg-[#5e81f4] ring-2 ring-[#5e81f4]/20" />
                    {i < c.updates.length - 1 && <div className="my-0.5 w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-[11px] text-[#8181a5]">{u.date}</p>
                    <p className="mt-0.5 text-sm text-[#374151]">{u.text}</p>
                  </div>
                </div>
              ))}
              {c.status !== "Resolved" && c.status !== "Closed" && (
                <div className="flex gap-3">
                  <div className="mt-1 size-2.5 shrink-0 rounded-full border-2 border-border bg-white" />
                  <p className="text-sm text-[#8181a5]/60">Awaiting next update…</p>
                </div>
              )}
            </div>
          </div>

          {/* Status update */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#8181a5]">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => {
                const active = s === c.status
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(s)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                      active
                        ? statusStyle[s].badge
                        : "border-border text-[#8181a5] hover:border-[#5e81f4] hover:text-[#5e81f4]"
                    )}
                  >
                    <span className={cn("size-2 rounded-full", statusStyle[s].dot)} />
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function HRComplaintsPage() {
  const [complaints,   setComplaints]   = useState<Complaint[]>(seed)
  const [search,       setSearch]       = useState("")
  const [catFilter,    setCatFilter]    = useState<ComplaintCategory | "All">("All")
  const [prioFilter,   setPrioFilter]   = useState<ComplaintPriority | "All">("All")
  const [statFilter,   setStatFilter]   = useState<ComplaintStatus   | "All">("All")
  const [page,         setPage]         = useState(1)
  const [detail,       setDetail]       = useState<Complaint | null>(null)

  // Stats
  const total       = complaints.length
  const underInv    = complaints.filter(c => c.status === "Under Investigation").length
  const resolved    = complaints.filter(c => c.status === "Resolved").length
  const critical    = complaints.filter(c => c.priority === "Critical").length

  // Filtering
  const filtered = complaints.filter(c => {
    const q = search.toLowerCase()
    const matchSearch =
      c.ref.toLowerCase().includes(q)      ||
      c.title.toLowerCase().includes(q)    ||
      c.name.toLowerCase().includes(q)     ||
      c.department.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    const matchCat  = catFilter  === "All" || c.category === catFilter
    const matchPrio = prioFilter === "All" || c.priority === prioFilter
    const matchStat = statFilter === "All" || c.status   === statFilter
    return matchSearch && matchCat && matchPrio && matchStat
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const hasFilters = search !== "" || catFilter !== "All" || prioFilter !== "All" || statFilter !== "All"

  function updateStatus(id: number, status: ComplaintStatus) {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    if (detail?.id === id) setDetail(prev => prev ? { ...prev, status } : prev)
  }

  function clearFilters() {
    setSearch(""); setCatFilter("All"); setPrioFilter("All"); setStatFilter("All"); setPage(1)
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 flex-col overflow-hidden">

        {/* ── Stat cards ── */}
     

        {/* ── Toolbar ── */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border bg-white px-6 py-3">
          {/* Search */}
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-[#f4f5f9] px-4 py-2.5">
            <Search className="size-4 shrink-0 text-[#8181a5]" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name, title, category, ref…"
              className="flex-1 bg-transparent text-sm text-[#1c1c1c] outline-none placeholder:text-[#8181a5]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-[#8181a5] hover:text-[#1c1c1c]">
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <FilterDropdown label="Category" value={catFilter}  options={CATEGORIES} onChange={v => { setCatFilter(v);  setPage(1) }} />
          <FilterDropdown label="Priority" value={prioFilter} options={PRIORITIES} onChange={v => { setPrioFilter(v); setPage(1) }} />
          <FilterDropdown label="Status"   value={statFilter} options={STATUSES}   onChange={v => { setStatFilter(v); setPage(1) }} />

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="rounded-lg border border-border px-3 py-2.5 text-sm text-[#8181a5] hover:bg-muted"
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="flex-1 overflow-auto p-6">
          <div className="rounded-xl border border-border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Ref", "Employee", "Category", "Title", "Priority", "Submitted", "Status", ""].map(col => (
                    <th
                      key={col}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8181a5]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {paginated.map(c => {
                  const catSty  = categoryStyle[c.category]
                  const prioSty = priorityStyle[c.priority]
                  const statSty = statusStyle[c.status]

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setDetail(c)}
                      className="cursor-pointer hover:bg-[#f8fafc]"
                    >
                      {/* Ref */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="font-mono text-xs font-semibold text-[#5e81f4]">{c.ref}</span>
                      </td>

                      {/* Employee */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={c.photo}
                              alt={c.anonymous ? "Anonymous" : c.name}
                              className="size-9 shrink-0 rounded-full object-cover"
                            />
                            {c.anonymous && (
                              <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#6b7280] ring-1 ring-white">
                                <EyeOff className="size-2 text-white" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#1f2937]">
                              {c.anonymous ? "Anonymous" : c.name}
                            </p>
                            <p className="truncate text-xs text-[#8181a5]">
                              {c.anonymous ? "Identity protected" : c.department}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className={cn("whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold", catSty.bg, catSty.text)}>
                          {c.category}
                        </span>
                      </td>

                      {/* Title */}
                      <td className="max-w-[220px] px-5 py-4">
                        <p className="truncate font-medium text-[#1f2937]">{c.title}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-[#8181a5]">
                          <MessageSquare className="size-3" />
                          {c.updates.length} update{c.updates.length !== 1 ? "s" : ""}
                        </p>
                      </td>

                      {/* Priority */}
                      <td className="px-5 py-4">
                        <span className={cn("flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold", prioSty.badge)}>
                          <span className={cn("size-1.5 rounded-full", prioSty.dot)} />
                          {c.priority}
                        </span>
                      </td>

                      {/* Submitted */}
                      <td className="whitespace-nowrap px-5 py-4 text-[#667388]">{c.submittedOn}</td>

                      {/* Status dropdown */}
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <StatusDropdown value={c.status} onChange={s => updateStatus(c.id, s)} />
                      </td>

                      {/* View */}
                      <td className="px-4 py-4">
                        <button
                          onClick={e => { e.stopPropagation(); setDetail(c) }}
                          className="flex size-8 items-center justify-center rounded-lg text-[#8181a5] hover:bg-muted hover:text-[#5e81f4]"
                          title="View complaint"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <ShieldAlert className="mx-auto mb-3 size-10 text-[#8181a5]/30" />
                      <p className="text-sm text-[#8181a5]">
                        {hasFilters ? "No complaints match your filters." : "No complaints have been filed yet."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border px-5 py-3">
              <p className="text-xs text-[#8181a5]">
                {filtered.length === 0
                  ? "No results"
                  : `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length} complaint${filtered.length !== 1 ? "s" : ""}`}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex size-8 items-center justify-center rounded-lg text-[#4b5563] hover:bg-muted disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                      p === page ? "bg-[#5e81f4] text-white" : "text-[#8181a5] hover:bg-muted"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex size-8 items-center justify-center rounded-lg text-[#4b5563] hover:bg-muted disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {detail && (
        <DetailPanel
          c={detail}
          onClose={() => setDetail(null)}
          onStatusChange={s => updateStatus(detail.id, s)}
        />
      )}
    </>
  )
}
