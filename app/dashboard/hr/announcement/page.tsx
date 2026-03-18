"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Send,
  Users,
  User,
  ChevronDown,
  Search,
  X,
  Heading1,
  Heading2,
  Megaphone,
  Clock,
} from "lucide-react"
import { HRIconSidebar } from "@/components/hr-icon-sidebar"
import { cn } from "@/lib/utils"

// ── Assets ────────────────────────────────────────────────────
const profilePhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

// ── Mock employee list ────────────────────────────────────────
const EMPLOYEES = [
  { id: "1",  name: "Sarah Johnson",  role: "UI Designer",        avatar: "/assets/9e3b4e81174edab916396a375259694534e63067.png" },
  { id: "2",  name: "David Mensah",   role: "Backend Engineer",   avatar: "/assets/aaaa09271295e3a0e2de430793dd620b97f19e60.png" },
  { id: "3",  name: "Anita Clarke",   role: "HR Coordinator",     avatar: "/assets/bc29c53acc3a7842572d5ad4194df98ca02711de.png" },
  { id: "4",  name: "Kevin Osei",     role: "Marketing Analyst",  avatar: "/assets/06f94aa9dc854a370f71bf1ebb26ed778dcf8302.png" },
  { id: "5",  name: "Michael Chen",   role: "Frontend Engineer",  avatar: "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png" },
  { id: "6",  name: "Sarah Williams", role: "Product Manager",    avatar: "/assets/c8f5ae43e33ebde623eb7d3b22aeb6930878a4ce.png" },
  { id: "7",  name: "James Anderson", role: "Finance Analyst",    avatar: "/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png" },
  { id: "8",  name: "Priya Patel",    role: "Data Scientist",     avatar: "/assets/635a3bf857069957b4442100197a1e910ea3121d.png" },
  { id: "9",  name: "Omar Hassan",    role: "DevOps Engineer",    avatar: "/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png" },
  { id: "10", name: "Lena Schmidt",   role: "UX Researcher",      avatar: "/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png" },
]

// ── Seed sent announcements ────────────────────────────────────
interface SentAnnouncement {
  id: number
  subject: string
  body: string
  recipient: "all" | string
  recipientName?: string
  sentAt: string
}

const SEED: SentAnnouncement[] = [
  {
    id: 1,
    subject: "Q1 Performance Reviews",
    body: "Hi team, Q1 performance reviews will begin next Monday. Please ensure your self-assessments are submitted by Friday.",
    recipient: "all",
    sentAt: "Mar 15, 2026 · 9:00 AM",
  },
  {
    id: 2,
    subject: "Office Closure – Public Holiday",
    body: "The office will be closed on March 21st for the public holiday. Remote work is permitted.",
    recipient: "all",
    sentAt: "Mar 12, 2026 · 2:30 PM",
  },
  {
    id: 3,
    subject: "Probation Confirmation",
    body: "Congratulations! Your probation period has been successfully completed. Welcome to the team officially.",
    recipient: "2",
    recipientName: "David Mensah",
    sentAt: "Mar 10, 2026 · 11:15 AM",
  },
]

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Overview",     href: "/dashboard/hr"              },
  { label: "Calendar",     href: "/dashboard/hr/calendar"     },
  { label: "Announcement", href: "/dashboard/hr/announcement" },
]

// ── Toolbar button ────────────────────────────────────────────
function ToolbarBtn({
  onClick,
  title,
  active,
  children,
}: {
  onClick: () => void
  title: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      className={cn(
        "flex size-8 items-center justify-center rounded-md text-sm transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

// ── Divider ───────────────────────────────────────────────────
function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-border" />
}

// ── Main Page ─────────────────────────────────────────────────
export default function AnnouncementPage() {
  const editorRef  = useRef<HTMLDivElement>(null)
  const [subject,  setSubject]  = useState("")
  const [toMode,   setToMode]   = useState<"all" | "individual">("all")
  const [search,   setSearch]   = useState("")
  const [selected, setSelected] = useState<typeof EMPLOYEES[0] | null>(null)
  const [dropdown, setDropdown] = useState(false)
  const [sent,     setSent]     = useState<SentAnnouncement[]>(SEED)
  const [sending,  setSending]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [nextId,   setNextId]   = useState(10)

  // close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      const el = document.getElementById("emp-dropdown")
      if (el && !el.contains(e.target as Node)) setDropdown(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  // execCommand helpers
  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value)
    editorRef.current?.focus()
  }

  function isActive(cmd: string) {
    try { return document.queryCommandState(cmd) } catch { return false }
  }

  const filteredEmployees = EMPLOYEES.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  )

  function handleSend() {
    const body = editorRef.current?.innerHTML?.trim() ?? ""
    const textBody = editorRef.current?.innerText?.trim() ?? ""
    if (!subject.trim() || !textBody) return
    if (toMode === "individual" && !selected) return

    setSending(true)
    setTimeout(() => {
      const now = new Date()
      const formatted = now.toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit",
      })
      setSent((prev) => [
        {
          id: nextId,
          subject: subject.trim(),
          body: textBody,
          recipient: toMode === "all" ? "all" : selected!.id,
          recipientName: toMode === "individual" ? selected!.name : undefined,
          sentAt: formatted,
        },
        ...prev,
      ])
      setNextId((n) => n + 1)
      setSubject("")
      setSelected(null)
      setToMode("all")
      setSearch("")
      if (editorRef.current) editorRef.current.innerHTML = ""
      setSending(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 800)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <HRIconSidebar />

      {/* ── Text sidebar ── */}
      <aside className="flex w-[220px] shrink-0 flex-col justify-between bg-white py-5 pl-5 pr-3 shadow-sm">
        <nav className="flex flex-col gap-1">
          {sidebarNav.map(({ label, href }) => {
            const isActive = href === "/dashboard/hr/announcement"
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "w-full rounded px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/5 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 rounded-lg px-3 py-2">
          <img src={profilePhoto} alt="Michael Smith" className="size-9 shrink-0 rounded-full object-cover" />
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-sm font-medium text-foreground">Michael Smith</p>
            <p className="truncate text-xs text-muted-foreground">HR Administrator</p>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden mx-auto w-full max-w-[1280px]">

        {/* Compose panel */}
        <section className="flex flex-1 flex-col overflow-y-auto border-r border-border p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <Megaphone className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">New Announcement</h1>
              <p className="text-xs text-muted-foreground">Send a message to your team or an individual</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            {/* To: row */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-foreground">Recipient</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setToMode("all"); setSelected(null); setSearch("") }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors",
                    toMode === "all"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <Users className="size-3.5" /> All Employees
                </button>
                <button
                  type="button"
                  onClick={() => setToMode("individual")}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors",
                    toMode === "individual"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <User className="size-3.5" /> Department
                </button>
              </div>

              {/* Individual search */}
              {toMode === "individual" && (
                <div id="emp-dropdown" className="relative">
                  {selected ? (
                    <div className="flex h-[44px] items-center justify-between rounded-lg border border-primary bg-primary/5 px-3">
                      <div className="flex items-center gap-2">
                        <img src={selected.avatar} alt={selected.name} className="size-6 rounded-full object-cover" />
                        <span className="text-[13px] font-medium text-foreground">{selected.name}</span>
                        <span className="text-[12px] text-muted-foreground">— {selected.role}</span>
                      </div>
                      <button type="button" onClick={() => { setSelected(null); setSearch("") }}>
                        <X className="size-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex h-[44px] items-center rounded-lg border border-border bg-muted px-3 gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                        <Search className="size-4 shrink-0 text-muted-foreground" />
                        <input
                          value={search}
                          onChange={(e) => { setSearch(e.target.value); setDropdown(true) }}
                          onFocus={() => setDropdown(true)}
                          placeholder="Search employee by name or role…"
                          className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
                        />
                      </div>
                      {dropdown && filteredEmployees.length > 0 && (
                        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                          {filteredEmployees.map((emp) => (
                            <button
                              key={emp.id}
                              type="button"
                              onMouseDown={(e) => { e.preventDefault(); setSelected(emp); setDropdown(false); setSearch("") }}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted"
                            >
                              <img src={emp.avatar} alt={emp.name} className="size-7 rounded-full object-cover" />
                              <div>
                                <p className="text-[13px] font-medium text-foreground">{emp.name}</p>
                                <p className="text-[11px] text-muted-foreground">{emp.role}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-foreground">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Q1 Performance Review Reminder"
                className="h-[44px] rounded-lg border border-border bg-muted px-3.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Rich text editor */}
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-[13px] font-medium text-foreground">Message</label>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border border-b-0 border-border bg-muted/50 px-2 py-1.5">
                <ToolbarBtn onClick={() => exec("bold")} title="Bold" active={isActive("bold")}>
                  <Bold className="size-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => exec("italic")} title="Italic" active={isActive("italic")}>
                  <Italic className="size-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => exec("underline")} title="Underline" active={isActive("underline")}>
                  <Underline className="size-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => exec("strikeThrough")} title="Strikethrough" active={isActive("strikeThrough")}>
                  <Strikethrough className="size-3.5" />
                </ToolbarBtn>

                <ToolbarDivider />

                <ToolbarBtn onClick={() => exec("formatBlock", "h1")} title="Heading 1">
                  <Heading1 className="size-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => exec("formatBlock", "h2")} title="Heading 2">
                  <Heading2 className="size-3.5" />
                </ToolbarBtn>

                <ToolbarDivider />

                <ToolbarBtn onClick={() => exec("insertUnorderedList")} title="Bullet list" active={isActive("insertUnorderedList")}>
                  <List className="size-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => exec("insertOrderedList")} title="Numbered list" active={isActive("insertOrderedList")}>
                  <ListOrdered className="size-3.5" />
                </ToolbarBtn>

                <ToolbarDivider />

                <ToolbarBtn onClick={() => exec("justifyLeft")} title="Align left">
                  <AlignLeft className="size-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => exec("justifyCenter")} title="Align center">
                  <AlignCenter className="size-3.5" />
                </ToolbarBtn>
                <ToolbarBtn onClick={() => exec("justifyRight")} title="Align right">
                  <AlignRight className="size-3.5" />
                </ToolbarBtn>
              </div>

              {/* Editable body */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Write your announcement here…"
                className={cn(
                  "min-h-[200px] flex-1 rounded-b-lg border border-border bg-white px-4 py-3 text-[13px] text-foreground outline-none",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20",
                  "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2",
                  "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-1.5",
                  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
                  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1",
                  "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
                )}
              />
            </div>

            {/* Footer: send button + feedback */}
            <div className="flex items-center justify-between pt-1">
              {success ? (
                <span className="text-[13px] font-medium text-emerald-600">
                  ✓ Announcement sent successfully
                </span>
              ) : (
                <span className="text-[12px] text-muted-foreground">
                  {toMode === "all"
                    ? "Will be sent to all 124 employees"
                    : selected
                      ? `Will be sent to ${selected.name}`
                      : "Select a recipient to continue"}
                </span>
              )}
              <button
                type="button"
                onClick={handleSend}
                disabled={
                  sending ||
                  !subject.trim() ||
                  (toMode === "individual" && !selected)
                }
                className={cn(
                  "flex items-center gap-2 rounded-xl px-6 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-all",
                  "bg-primary hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                {sending ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Send className="size-3.5" />
                )}
                {sending ? "Sending…" : "Send Announcement"}
              </button>
            </div>
          </div>
        </section>

        {/* Sent history panel */}
        <section className="flex w-[320px] shrink-0 flex-col overflow-y-auto bg-white">
          <div className="sticky top-0 border-b border-border bg-white px-5 py-4">
            <p className="text-sm font-semibold text-foreground">Sent Announcements</p>
            <p className="text-xs text-muted-foreground">{sent.length} total</p>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {sent.map((item) => (
              <div key={item.id} className="flex flex-col gap-1.5 px-5 py-4 hover:bg-muted/40 transition-colors">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold leading-snug text-foreground">{item.subject}</p>
                  <span className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    item.recipient === "all"
                      ? "bg-primary/10 text-primary"
                      : "bg-amber-50 text-amber-700"
                  )}>
                    {item.recipient === "all" ? "All" : "Individual"}
                  </span>
                </div>

                {/* Recipient */}
                <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  {item.recipient === "all" ? (
                    <><Users className="size-3.5" /> All Employees</>
                  ) : (
                    <><User className="size-3.5" /> {item.recipientName}</>
                  )}
                </div>

                {/* Body preview */}
                <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
                  <Clock className="size-3" />
                  {item.sentAt}
                </div>
              </div>
            ))}
          </div>
        </section>
        </div>{/* end max-w wrapper */}
      </main>
    </div>
  )
}
