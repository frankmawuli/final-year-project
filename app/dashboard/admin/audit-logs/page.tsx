"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Ban,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  Globe2,
  KeyRound,
  Laptop,
  LogIn,
  LogOut,
  MoreHorizontal,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type EventType = "Authentication" | "Access" | "Company" | "Data" | "Security"
type AuditEvent = {
  id: number
  type: EventType
  action: string
  actor: string
  actorEmail: string
  target: string
  details: string
  ip: string
  timestamp: string
  severity: "Normal" | "Warning" | "Critical"
}
type Device = { id: number; user: string; email: string; device: string; location: string; ip: string; lastActive: string; current: boolean }
type ConfirmAction = "revoke-all" | "delete-logs" | "lock-account" | null

const initialEvents: AuditEvent[] = [
  { id: 1, type: "Access", action: "Role changed", actor: "Avery Morgan", actorEmail: "avery@corerecruiter.com", target: "James Wilson", details: "EMPLOYEE → HR_ADMIN", ip: "185.42.18.91", timestamp: "Sep 30, 2026 · 10:42 AM", severity: "Warning" },
  { id: 2, type: "Authentication", action: "Successful login", actor: "Olivia Bennett", actorEmail: "olivia@northstarlabs.com", target: "Northstar Labs", details: "Google SSO · 2FA verified", ip: "82.19.44.210", timestamp: "Sep 30, 2026 · 10:38 AM", severity: "Normal" },
  { id: 3, type: "Company", action: "Company updated", actor: "Avery Morgan", actorEmail: "avery@corerecruiter.com", target: "Brightpath Technologies", details: "Subscription: Professional → Enterprise", ip: "185.42.18.91", timestamp: "Sep 30, 2026 · 10:16 AM", severity: "Normal" },
  { id: 4, type: "Data", action: "Data exported", actor: "Maya Patel", actorEmail: "maya@brightpath.io", target: "Applications report", details: "CSV · 847 records", ip: "91.204.12.66", timestamp: "Sep 30, 2026 · 09:54 AM", severity: "Normal" },
  { id: 5, type: "Security", action: "Impersonation started", actor: "Avery Morgan", actorEmail: "avery@corerecruiter.com", target: "Daniel Jones", details: "Greenfield Health · 12 min session", ip: "185.42.18.91", timestamp: "Sep 30, 2026 · 09:31 AM", severity: "Critical" },
  { id: 6, type: "Authentication", action: "Failed login", actor: "Unknown", actorEmail: "unknown@external.com", target: "Admin portal", details: "5 failed attempts · account protected", ip: "103.77.14.8", timestamp: "Sep 30, 2026 · 09:18 AM", severity: "Warning" },
  { id: 7, type: "Data", action: "Company archived", actor: "Avery Morgan", actorEmail: "avery@corerecruiter.com", target: "Oak & Stone Design", details: "Reason: account closure", ip: "185.42.18.91", timestamp: "Sep 29, 2026 · 04:22 PM", severity: "Critical" },
  { id: 8, type: "Authentication", action: "Logout", actor: "Ethan Brown", actorEmail: "ethan@northstarlabs.com", target: "Northstar Labs", details: "User initiated", ip: "72.11.5.41", timestamp: "Sep 29, 2026 · 03:47 PM", severity: "Normal" },
]

const initialDevices: Device[] = [
  { id: 1, user: "Avery Morgan", email: "avery@corerecruiter.com", device: "Chrome on Windows", location: "London, UK", ip: "185.42.18.91", lastActive: "Now", current: true },
  { id: 2, user: "Avery Morgan", email: "avery@corerecruiter.com", device: "Safari on iPhone", location: "London, UK", ip: "185.42.18.92", lastActive: "2 hours ago", current: false },
  { id: 3, user: "Olivia Bennett", email: "olivia@northstarlabs.com", device: "Chrome on macOS", location: "Manchester, UK", ip: "82.19.44.210", lastActive: "12 min ago", current: false },
  { id: 4, user: "Maya Patel", email: "maya@brightpath.io", device: "Edge on Windows", location: "Dublin, Ireland", ip: "91.204.12.66", lastActive: "1 hour ago", current: false },
]

const eventIcons: Record<EventType, typeof LogIn> = { Authentication: LogIn, Access: Users, Company: Globe2, Data: Download, Security: ShieldAlert }

function severityClass(severity: AuditEvent["severity"]) {
  if (severity === "Critical") return "bg-rose-500/10 text-rose-700 dark:text-rose-400"
  if (severity === "Warning") return "bg-amber-500/10 text-amber-700 dark:text-amber-400"
  return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
}

function eventClass(type: EventType) {
  if (type === "Security") return "bg-rose-500/10 text-rose-600"
  if (type === "Authentication") return "bg-emerald-500/10 text-emerald-600"
  if (type === "Data") return "bg-violet-500/10 text-violet-600"
  return "bg-primary/10 text-primary"
}

export default function AdminAuditLogsPage() {
  const [events, setEvents] = useState(initialEvents)
  const [devices, setDevices] = useState(initialDevices)
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<EventType | "All">("All")
  const [severityFilter, setSeverityFilter] = useState<AuditEvent["severity"] | "All">("All")
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)
  const [notice, setNotice] = useState("")
  const [lockoutEnabled, setLockoutEnabled] = useState(true)
  const [twoFactorRequired, setTwoFactorRequired] = useState(true)
  const [rateLimit, setRateLimit] = useState("5")

  const filteredEvents = useMemo(() => events.filter((event) => {
    const searchable = `${event.action} ${event.actor} ${event.actorEmail} ${event.target} ${event.details} ${event.ip}`.toLowerCase()
    return searchable.includes(query.toLowerCase()) && (typeFilter === "All" || event.type === typeFilter) && (severityFilter === "All" || event.severity === severityFilter)
  }), [events, query, severityFilter, typeFilter])

  function confirmSecurityAction() {
    if (confirmAction === "revoke-all") {
      setDevices((current) => current.filter((device) => device.current))
      setNotice("All non-current sessions were revoked and the action was added to the audit log.")
    }
    if (confirmAction === "delete-logs") {
      setEvents((current) => current.slice(0, 3))
      setNotice("Older audit records were removed according to the retention policy.")
    }
    if (confirmAction === "lock-account") {
      setNotice("The suspicious account was locked and all sessions were revoked.")
    }
    setConfirmAction(null)
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-7">
        <div className="mx-auto max-w-350 space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Security center</p></div>
            <Button variant="outline" onClick={() => setNotice("Audit log export queued. The export event was recorded.")}><Download /> Export log</Button>
          </header>

          {notice && <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-700 dark:text-emerald-400"><span className="flex items-center gap-2"><Check className="size-4" /> {notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification"><X className="size-4" /></button></div>}

          <section className="grid gap-3 sm:grid-cols-4">
            {[{ label: "Events today", value: events.length.toString(), detail: "Across all workspaces", icon: Clock3, tone: "text-primary bg-primary/10" }, { label: "Active sessions", value: devices.length.toString(), detail: "Across platform users", icon: Laptop, tone: "text-emerald-600 bg-emerald-500/10" }, { label: "Security alerts", value: events.filter((event) => event.severity !== "Normal").length.toString(), detail: "Require monitoring", icon: ShieldAlert, tone: "text-amber-600 bg-amber-500/10" }, { label: "2FA coverage", value: "68%", detail: "Target: 100% for admins", icon: KeyRound, tone: "text-violet-600 bg-violet-500/10" }].map((stat) => { const Icon = stat.icon; return <Card key={stat.label} className="shadow-sm"><CardContent className="flex items-center gap-3 p-4"><div className={`flex size-9 items-center justify-center rounded-lg ${stat.tone}`}><Icon className="size-4" /></div><div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="mt-1 text-xl font-bold tracking-tight">{stat.value}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{stat.detail}</p></div></CardContent></Card> })}
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <Card className="overflow-visible shadow-sm"><CardHeader className="flex-row items-center justify-between border-b border-border/70 pb-4"><div><CardTitle>Activity log</CardTitle><p className="mt-1 text-xs text-muted-foreground">Every login, access change, export, deletion, and impersonation is recorded.</p></div><Button variant="ghost" size="icon-sm" aria-label="Refresh audit log" onClick={() => setNotice("Audit log refreshed just now.")}><RotateCcw /></Button></CardHeader><CardContent className="p-0"><div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row"><div className="relative flex-1"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, actors, targets, or IPs" className="h-9 pl-9 text-xs" /></div><div className="relative"><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as EventType | "All")} className="h-9 appearance-none rounded-lg border border-input bg-background py-1 pr-8 pl-3 text-xs font-medium outline-none focus:border-ring"><option value="All">All event types</option>{["Authentication", "Access", "Company", "Data", "Security"].map((type) => <option key={type}>{type}</option>)}</select><ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground" /></div><div className="relative"><select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value as AuditEvent["severity"] | "All")} className="h-9 appearance-none rounded-lg border border-input bg-background py-1 pr-8 pl-3 text-xs font-medium outline-none focus:border-ring"><option value="All">All severity</option><option>Normal</option><option>Warning</option><option>Critical</option></select><ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground" /></div></div><div className="divide-y divide-border/70">{filteredEvents.map((event) => { const Icon = eventIcons[event.type]; return <button type="button" key={event.id} onClick={() => setSelectedEvent(event)} className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/30"><span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${eventClass(event.type)}`}><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold">{event.action}</span><span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${severityClass(event.severity)}`}>{event.severity}</span></span><span className="mt-1 block truncate text-[11px] text-muted-foreground"><strong className="font-medium text-foreground">{event.actor}</strong> · {event.target} · {event.details}</span><span className="mt-1 block text-[10px] text-muted-foreground">{event.timestamp}</span></span><span className="hidden shrink-0 items-center gap-1 text-[10px] text-muted-foreground sm:flex"><Globe2 className="size-3" /> {event.ip}</span><MoreHorizontal className="mt-1 size-4 shrink-0 text-muted-foreground" /></button> })}</div>{filteredEvents.length === 0 && <div className="px-6 py-14 text-center text-xs text-muted-foreground">No audit events match the current filters.</div>}<div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-[11px] text-muted-foreground"><span>Showing {filteredEvents.length} of {events.length} events</span><span>Retention: 180 days</span></div></CardContent></Card>

            <div className="space-y-5"><Card className="shadow-sm"><CardHeader className="flex-row items-center justify-between border-b border-border/70 pb-4"><div><CardTitle>Security controls</CardTitle><p className="mt-1 text-xs text-muted-foreground">Global account protection</p></div><ShieldCheck className="size-4 text-primary" /></CardHeader><CardContent className="space-y-4 pt-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold">Require 2FA for admins</p><p className="mt-1 text-[11px] text-muted-foreground">HR and platform administrators</p></div><button type="button" onClick={() => setTwoFactorRequired((value) => !value)} aria-pressed={twoFactorRequired} className={`relative h-5 w-9 rounded-full transition-colors ${twoFactorRequired ? "bg-primary" : "bg-muted"}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${twoFactorRequired ? "left-4" : "left-0.5"}`} /></button></div><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold">Account lockout</p><p className="mt-1 text-[11px] text-muted-foreground">Lock after repeated failures</p></div><button type="button" onClick={() => setLockoutEnabled((value) => !value)} aria-pressed={lockoutEnabled} className={`relative h-5 w-9 rounded-full transition-colors ${lockoutEnabled ? "bg-primary" : "bg-muted"}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${lockoutEnabled ? "left-4" : "left-0.5"}`} /></button></div><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold">Login rate limit</p><p className="mt-1 text-[11px] text-muted-foreground">Failed attempts per 15 minutes</p></div><select value={rateLimit} onChange={(event) => setRateLimit(event.target.value)} className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-medium outline-none focus:border-ring"><option value="3">3 attempts</option><option value="5">5 attempts</option><option value="10">10 attempts</option></select></div><div className="rounded-lg bg-muted/60 p-3 text-[11px] text-muted-foreground"><p className="font-semibold text-foreground">Current policy</p><p className="mt-1">{lockoutEnabled ? `Lock account after ${rateLimit} failed attempts for 30 minutes.` : "Account lockout is disabled."}</p></div></CardContent></Card><Card className="shadow-sm"><CardHeader className="border-b border-border/70 pb-4"><CardTitle>Session management</CardTitle><p className="mt-1 text-xs text-muted-foreground">{devices.length} active devices across the platform</p></CardHeader><CardContent className="space-y-3 pt-4"><div className="space-y-3">{devices.slice(0, 3).map((device) => <div key={device.id} className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">{device.device.includes("iPhone") ? <Smartphone className="size-4" /> : <Laptop className="size-4" />}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{device.user}</p><p className="truncate text-[10px] text-muted-foreground">{device.device} · {device.lastActive}</p></div>{device.current && <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">Current</span>}</div>)}</div><Button variant="outline" className="w-full" onClick={() => setConfirmAction("revoke-all")}><LogOut /> Revoke all other sessions</Button></CardContent></Card></div>
          </section>

          <div className="flex flex-col gap-3 rounded-lg border border-amber-500/25 bg-amber-500/5 p-4 text-xs text-amber-800 dark:text-amber-300 sm:flex-row sm:items-center"><AlertTriangle className="size-4 shrink-0" /><p className="flex-1"><strong>Security events need review:</strong> {events.filter((event) => event.severity === "Critical").length} critical events and {events.filter((event) => event.severity === "Warning").length} warnings are in this log.</p><Button variant="outline" size="sm" onClick={() => setSeverityFilter("Critical")}>Review critical events</Button></div>
          <div className="flex justify-end"><Button variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirmAction("delete-logs")}><Trash2 /> Manage log retention</Button></div>
        </div>
      </main>

      <Dialog open={confirmAction !== null} onOpenChange={(open) => !open && setConfirmAction(null)}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>{confirmAction === "revoke-all" ? "Revoke all other sessions?" : confirmAction === "delete-logs" ? "Manage audit log retention?" : "Lock suspicious account?"}</DialogTitle><DialogDescription>{confirmAction === "revoke-all" ? "Every active device except your current session will be signed out immediately." : confirmAction === "delete-logs" ? "Older events will be removed according to the configured retention policy. This action cannot be undone." : "The account will be locked and its sessions revoked until an administrator reviews it."}</DialogDescription></DialogHeader><div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-800 dark:text-amber-300"><div className="flex gap-3"><AlertTriangle className="size-4 shrink-0" /><p>This is a privileged security action. The actor, timestamp, scope, and outcome will be recorded in the audit log.</p></div></div><DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button variant={confirmAction === "delete-logs" ? "destructive" : "default"} onClick={confirmSecurityAction}>Confirm action</Button></DialogFooter></DialogContent></Dialog>

      <Dialog open={selectedEvent !== null} onOpenChange={(open) => !open && setSelectedEvent(null)}><DialogContent className="max-w-lg">{selectedEvent && <><DialogHeader><DialogTitle>{selectedEvent.action}</DialogTitle><DialogDescription>{selectedEvent.type} event · {selectedEvent.timestamp}</DialogDescription></DialogHeader><div className="space-y-3 rounded-lg border border-border/70 p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Actor</span><span className="text-right text-xs font-semibold">{selectedEvent.actor}<br /><span className="font-normal text-muted-foreground">{selectedEvent.actorEmail}</span></span></div><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Target</span><span className="text-xs font-semibold">{selectedEvent.target}</span></div><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">IP address</span><span className="flex items-center gap-1.5 font-mono text-xs"><Globe2 className="size-3.5 text-muted-foreground" />{selectedEvent.ip}</span></div><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Action details</span><span className="text-xs font-semibold">{selectedEvent.details}</span></div></div><DialogFooter><Button variant="outline" onClick={() => setSelectedEvent(null)}>Close</Button>{selectedEvent.action === "Failed login" && <Button variant="destructive" onClick={() => { setSelectedEvent(null); setConfirmAction("lock-account") }}><Ban /> Lock account</Button>}</DialogFooter></>}</DialogContent></Dialog>
    </div>
  )
}
