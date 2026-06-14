"use client"

import { useState, useRef, useEffect } from "react"
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
  Building2,
  Search,
  X,
  Heading1,
  Heading2,
  Megaphone,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { useAuth } from "@/context/auth-context"
import { announcementService, type ApiAnnouncement } from "@/services/anouncement.service"
import { employeeService, type ApiEmployee } from "@/services/employee.service"

const sidebarNav = [
  { label: "Overview",     href: "/dashboard/hr"              },
  { label: "Calendar",     href: "/dashboard/hr/calendar"     },
  { label: "Announcement", href: "/dashboard/hr/announcement" },
]

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
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-border" />
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  })
}

export default function AnnouncementPage() {
  const { accessToken } = useAuth()
  const editorRef = useRef<HTMLDivElement>(null)

  // form state
  const [subject,  setSubject]  = useState("")
  const [toMode,   setToMode]   = useState<"ALL" | "INDIVIDUAL">("ALL")
  const [search,   setSearch]   = useState("")
  const [selected, setSelected] = useState<ApiEmployee | null>(null)
  const [dropdown, setDropdown] = useState(false)

  // send state
  const [sending,   setSending]   = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [success,   setSuccess]   = useState(false)

  // announcements list
  const [announcements, setAnnouncements] = useState<ApiAnnouncement[]>([])
  const [listLoading,   setListLoading]   = useState(true)
  const [listError,     setListError]     = useState<string | null>(null)

  // employees for individual picker
  const [employees, setEmployees] = useState<ApiEmployee[]>([])

  // load sent announcements
  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    setListLoading(true)
    setListError(null)
    announcementService
      .list(accessToken)
      .then((res) => { if (!cancelled) setAnnouncements(res.data) })
      .catch((e: unknown) => {
        if (!cancelled) setListError(e instanceof Error ? e.message : "Failed to load announcements")
      })
      .finally(() => { if (!cancelled) setListLoading(false) })
    return () => { cancelled = true }
  }, [accessToken])

  // load employees once for individual picker
  useEffect(() => {
    if (!accessToken) return
    employeeService
      .list({ limit: 100 }, accessToken)
      .then((res) => setEmployees(res.data))
      .catch(() => { /* non-critical — dropdown just stays empty */ })
  }, [accessToken])

  // close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      const el = document.getElementById("emp-dropdown")
      if (el && !el.contains(e.target as Node)) setDropdown(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value)
    editorRef.current?.focus()
  }

  function isActive(cmd: string) {
    try { return document.queryCommandState(cmd) } catch { return false }
  }

  const filteredEmployees = employees.filter((e) => {
    const q = search.toLowerCase()
    return (
      e.user.name.toLowerCase().includes(q) ||
      (e.jobTitle ?? "").toLowerCase().includes(q)
    )
  })

  async function handleSend() {
    const bodyHtml = editorRef.current?.innerHTML?.trim() ?? ""
    const bodyText = editorRef.current?.innerText?.trim() ?? ""
    if (!subject.trim() || !bodyText || !accessToken) return
    if (toMode === "INDIVIDUAL" && !selected) return

    setSending(true)
    setSendError(null)
    try {
      const res = await announcementService.create(
        {
          subject: subject.trim(),
          bodyHtml,
          bodyText,
          recipientType: toMode,
          status: "SENT",
          ...(toMode === "INDIVIDUAL" && { recipientEmployeeId: selected!.user.id }),
        },
        accessToken,
      )
      setAnnouncements((prev) => [res.data, ...prev])
      setSubject("")
      setSelected(null)
      setToMode("ALL")
      setSearch("")
      if (editorRef.current) editorRef.current.innerHTML = ""
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e: unknown) {
      setSendError(e instanceof Error ? e.message : "Failed to send announcement")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden mx-auto w-full max-w-[1280px]">

          {/* ── Compose panel ── */}
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
              {/* Recipient */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-foreground">Recipient</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setToMode("ALL"); setSelected(null); setSearch("") }}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors",
                      toMode === "ALL"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    <Users className="size-3.5" /> All Employees
                  </button>
                  <button
                    type="button"
                    onClick={() => setToMode("INDIVIDUAL")}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors",
                      toMode === "INDIVIDUAL"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    <User className="size-3.5" /> Individual
                  </button>
                </div>

                {toMode === "INDIVIDUAL" && (
                  <div id="emp-dropdown" className="relative">
                    {selected ? (
                      <div className="flex h-[44px] items-center justify-between rounded-lg border border-primary bg-primary/5 px-3">
                        <div className="flex items-center gap-2">
                          {selected.user.avatarUrl ? (
                            <img src={selected.user.avatarUrl} alt={selected.user.name} className="size-6 rounded-full object-cover" />
                          ) : (
                            <div className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
                              {selected.user.name.charAt(0)}
                            </div>
                          )}
                          <span className="text-[13px] font-medium text-foreground">{selected.user.name}</span>
                          {selected.jobTitle && (
                            <span className="text-[12px] text-muted-foreground">— {selected.jobTitle}</span>
                          )}
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
                                {emp.user.avatarUrl ? (
                                  <img src={emp.user.avatarUrl} alt={emp.user.name} className="size-7 rounded-full object-cover" />
                                ) : (
                                  <div className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-[11px] font-semibold text-primary">
                                    {emp.user.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <p className="text-[13px] font-medium text-foreground">{emp.user.name}</p>
                                  <p className="text-[11px] text-muted-foreground">{emp.jobTitle ?? emp.user.email}</p>
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
                    "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none",
                  )}
                />
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-2 pt-1">
                {sendError && (
                  <p className="text-[12px] text-red-600">{sendError}</p>
                )}
                <div className="flex items-center justify-between">
                  {success ? (
                    <span className="text-[13px] font-medium text-emerald-600">
                      ✓ Announcement sent successfully
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted-foreground">
                      {toMode === "ALL"
                        ? "Will be sent to all employees"
                        : selected
                          ? `Will be sent to ${selected.user.name}`
                          : "Select a recipient to continue"}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending || !subject.trim() || (toMode === "INDIVIDUAL" && !selected)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-6 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-all",
                      "bg-primary hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50",
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
            </div>
          </section>

          {/* ── Sent history panel ── */}
          <section className="flex w-[320px] shrink-0 flex-col overflow-y-auto bg-white">
            <div className="sticky top-0 border-b border-border bg-white px-5 py-4">
              <p className="text-sm font-semibold text-foreground">Sent Announcements</p>
              <p className="text-xs text-muted-foreground">
                {listLoading ? "Loading…" : `${announcements.length} total`}
              </p>
            </div>

            {listLoading ? (
              <div className="flex flex-1 items-center justify-center py-16">
                <span className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
              </div>
            ) : listError ? (
              <div className="px-5 py-6 text-[13px] text-red-500">{listError}</div>
            ) : announcements.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
                <Megaphone className="size-8 text-muted-foreground/40" />
                <p className="text-[13px] text-muted-foreground">No announcements yet</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {announcements.map((item) => (
                  <div key={item.id} className="flex flex-col gap-1.5 px-5 py-4 transition-colors hover:bg-muted/40">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-semibold leading-snug text-foreground">{item.subject}</p>
                      <span className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        item.recipientType === "ALL"
                          ? "bg-primary/10 text-primary"
                          : item.recipientType === "DEPARTMENT"
                            ? "bg-violet-50 text-violet-700"
                            : "bg-amber-50 text-amber-700",
                      )}>
                        {item.recipientType === "ALL" ? "All" : item.recipientType === "DEPARTMENT" ? "Dept" : "Individual"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      {item.recipientType === "ALL" ? (
                        <><Users className="size-3.5" /> All Employees</>
                      ) : item.recipientType === "DEPARTMENT" ? (
                        <><Building2 className="size-3.5" /> {item.recipientDepartment?.name ?? "Department"}</>
                      ) : (
                        <><User className="size-3.5" /> {item.recipientEmployee?.employeeId ?? "Individual"}</>
                      )}
                      {item.totalRecipients != null && (
                        <span className="ml-auto text-[11px]">
                          {item.totalRecipients} recipient{item.totalRecipients !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                      {item.bodyText}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
                      <Clock className="size-3" />
                      {formatDate(item.sentAt ?? item.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </>
  )
}
