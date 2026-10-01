"use client"

import { useMemo, useState } from "react"
import {
  Ban,
  Check,
  ChevronDown,
  CircleAlert,
  KeyRound,
  LogOut,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type PlatformRole = "SUPER_ADMIN" | "HR_ADMIN" | "HR_MANAGER" | "RECRUITER" | "EMPLOYEE"
type AccountStatus = "Active" | "Invited" | "Suspended" | "Deactivated"
type User = {
  id: number
  name: string
  email: string
  company: string
  role: PlatformRole
  status: AccountStatus
  lastActive: string
  twoFactor: boolean
  mustChangePassword: boolean
  sessions: number
}

type DialogMode = "details" | "invite" | "reset" | "deactivate" | null

const roleLabels: Record<PlatformRole, string> = {
  SUPER_ADMIN: "Super Admin",
  HR_ADMIN: "HR Admin",
  HR_MANAGER: "HR Manager",
  RECRUITER: "Recruiter",
  EMPLOYEE: "Employee",
}

const roleDescriptions: Record<PlatformRole, string> = {
  SUPER_ADMIN: "Full platform access",
  HR_ADMIN: "Company administration",
  HR_MANAGER: "People and hiring management",
  RECRUITER: "Recruitment workflows",
  EMPLOYEE: "Employee self-service",
}

const initialUsers: User[] = [
  { id: 1, name: "Avery Morgan", email: "avery@corerecruiter.com", company: "CoreRecruiter", role: "SUPER_ADMIN", status: "Active", lastActive: "Just now", twoFactor: true, mustChangePassword: false, sessions: 2 },
  { id: 2, name: "Olivia Bennett", email: "olivia@northstarlabs.com", company: "Northstar Labs", role: "HR_ADMIN", status: "Active", lastActive: "2 min ago", twoFactor: true, mustChangePassword: false, sessions: 1 },
  { id: 3, name: "James Wilson", email: "james@acme.co.uk", company: "Acme Corporation", role: "HR_ADMIN", status: "Active", lastActive: "18 min ago", twoFactor: false, mustChangePassword: true, sessions: 2 },
  { id: 4, name: "Maya Patel", email: "maya@brightpath.io", company: "Brightpath Technologies", role: "HR_MANAGER", status: "Active", lastActive: "1 hr ago", twoFactor: true, mustChangePassword: false, sessions: 1 },
  { id: 5, name: "Ethan Brown", email: "ethan@northstarlabs.com", company: "Northstar Labs", role: "RECRUITER", status: "Active", lastActive: "3 hrs ago", twoFactor: false, mustChangePassword: false, sessions: 1 },
  { id: 6, name: "Daniel Jones", email: "daniel@greenfield.health", company: "Greenfield Health", role: "HR_ADMIN", status: "Suspended", lastActive: "4 days ago", twoFactor: false, mustChangePassword: false, sessions: 0 },
  { id: 7, name: "Sophie Martin", email: "sophie@vertex.finance", company: "Vertex Finance", role: "HR_MANAGER", status: "Invited", lastActive: "Never", twoFactor: false, mustChangePassword: true, sessions: 0 },
  { id: 8, name: "Noah Williams", email: "noah@oakstone.design", company: "Oak & Stone Design", role: "EMPLOYEE", status: "Deactivated", lastActive: "3 months ago", twoFactor: true, mustChangePassword: false, sessions: 0 },
]

function statusClass(status: AccountStatus) {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
  if (status === "Invited") return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
  if (status === "Suspended") return "bg-amber-500/10 text-amber-700 dark:text-amber-400"
  return "bg-muted text-muted-foreground"
}

function roleClass(role: PlatformRole) {
  if (role === "SUPER_ADMIN") return "text-violet-600"
  if (role === "HR_ADMIN") return "text-primary"
  if (role === "HR_MANAGER") return "text-cyan-600"
  if (role === "RECRUITER") return "text-amber-600"
  return "text-muted-foreground"
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<PlatformRole | "All">("All")
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "All">("All")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [menuId, setMenuId] = useState<number | null>(null)
  const [notice, setNotice] = useState("")
  const [roleDraft, setRoleDraft] = useState<PlatformRole>("EMPLOYEE")
  const [twoFactorDraft, setTwoFactorDraft] = useState(false)
  const [passwordDraft, setPasswordDraft] = useState(false)

  const filteredUsers = useMemo(() => users.filter((user) => {
    const searchable = `${user.name} ${user.email} ${user.company}`.toLowerCase()
    return searchable.includes(query.toLowerCase()) && (roleFilter === "All" || user.role === roleFilter) && (statusFilter === "All" || user.status === statusFilter)
  }), [query, roleFilter, statusFilter, users])

  function selectUser(user: User, mode: DialogMode = "details") {
    setSelectedUser(user)
    setRoleDraft(user.role)
    setTwoFactorDraft(user.twoFactor)
    setPasswordDraft(user.mustChangePassword)
    setDialogMode(mode)
    setMenuId(null)
  }

  function saveUserSecurity() {
    if (!selectedUser) return
    setUsers((current) => current.map((user) => user.id === selectedUser.id ? { ...user, role: roleDraft, twoFactor: twoFactorDraft, mustChangePassword: passwordDraft } : user))
    setDialogMode(null)
    setNotice(`${selectedUser.name}'s role and security settings were updated. The change was added to the audit log.`)
  }

  function updateStatus(status: AccountStatus) {
    if (!selectedUser) return
    setUsers((current) => current.map((user) => user.id === selectedUser.id ? { ...user, status, sessions: status === "Active" ? user.sessions : 0 } : user))
    setDialogMode(null)
    setNotice(`${selectedUser.name} is now ${status.toLowerCase()}. Active sessions were revoked and the action was audited.`)
  }

  function sendPasswordReset() {
    if (!selectedUser) return
    setDialogMode(null)
    setNotice(`A password reset link was sent to ${selectedUser.email}.`)
  }

  function resendInvitation(user?: User) {
    const target = users.find((item) => item.id === menuId) ?? user ?? selectedUser
    if (!target) return
    setMenuId(null)
    setNotice(`A new invitation was sent to ${target.email}.`)
  }

  function revokeSessions(user?: User) {
    const target = users.find((item) => item.id === menuId) ?? user ?? selectedUser
    if (!target) return
    setUsers((current) => current.map((item) => item.id === target.id ? { ...item, sessions: 0 } : item))
    setMenuId(null)
    setNotice(`All active sessions for ${target.name} were revoked. The action was added to the audit log.`)
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-7">
        <div className="mx-auto max-w-350 space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Access control</p>
            </div>
            <Button onClick={() => { setSelectedUser(null); setDialogMode("invite") }}><UserPlus /> Invite user</Button>
          </header>

          {notice && <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-700 dark:text-emerald-400"><span className="flex items-center gap-2"><Check className="size-4" /> {notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification"><X className="size-4" /></button></div>}

          <section className="grid gap-3 sm:grid-cols-4">
            {[
              { label: "All users", value: users.length.toString(), detail: "Platform accounts", icon: Users, tone: "text-primary bg-primary/10" },
              { label: "Active", value: users.filter((user) => user.status === "Active").length.toString(), detail: "Currently enabled", icon: ShieldCheck, tone: "text-emerald-600 bg-emerald-500/10" },
              { label: "Pending invites", value: users.filter((user) => user.status === "Invited").length.toString(), detail: "Awaiting acceptance", icon: Mail, tone: "text-blue-600 bg-blue-500/10" },
              { label: "2FA enabled", value: `${Math.round((users.filter((user) => user.twoFactor).length / users.length) * 100)}%`, detail: "Security coverage", icon: KeyRound, tone: "text-violet-600 bg-violet-500/10" },
            ].map((stat) => { const Icon = stat.icon; return <Card key={stat.label} className="shadow-sm"><CardContent className="flex items-center gap-3 p-4"><div className={`flex size-9 items-center justify-center rounded-lg ${stat.tone}`}><Icon className="size-4" /></div><div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="mt-1 text-xl font-bold tracking-tight">{stat.value}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{stat.detail}</p></div></CardContent></Card> })}
          </section>

          <Card className="overflow-visible shadow-sm"><CardContent className="p-0">
            <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users, email, or company" className="h-9 pl-9 text-xs" /></div>
              <div className="flex flex-wrap items-center gap-2"><div className="relative"><select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as PlatformRole | "All")} className="h-9 appearance-none rounded-lg border border-input bg-background py-1 pr-8 pl-3 text-xs font-medium outline-none focus:border-ring"><option value="All">All roles</option>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground" /></div><div className="relative"><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as AccountStatus | "All")} className="h-9 appearance-none rounded-lg border border-input bg-background py-1 pr-8 pl-3 text-xs font-medium outline-none focus:border-ring"><option value="All">All statuses</option><option>Active</option><option>Invited</option><option>Suspended</option><option>Deactivated</option></select><ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground" /></div><Button variant="outline" size="sm" onClick={() => setNotice("Advanced user filters are ready for API integration.")}><Pencil /> Manage filters</Button></div>
            </div>
            <div className="overflow-x-auto"><table className="w-full min-w-260 text-left"><thead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Security</th><th className="px-4 py-3">Last active</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border/70">{filteredUsers.map((user) => <tr key={user.id} className="group transition-colors hover:bg-muted/30"><td className="px-4 py-3.5"><button type="button" onClick={() => selectUser(user)} className="flex items-center gap-3 text-left"><span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{user.name.split(" ").map((part) => part[0]).join("")}</span><span><span className="block text-xs font-semibold group-hover:text-primary">{user.name}</span><span className="mt-1 block text-[11px] text-muted-foreground">{user.email}</span></span></button></td><td className="px-4 py-3.5 text-xs text-muted-foreground">{user.company}</td><td className={`px-4 py-3.5 text-xs font-semibold ${roleClass(user.role)}`}>{roleLabels[user.role]}</td><td className="px-4 py-3.5"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(user.status)}`}>{user.status}</span></td><td className="px-4 py-3.5"><div className="flex flex-wrap gap-1.5">{user.twoFactor && <span className="rounded bg-emerald-500/10 px-1.5 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">2FA</span>}{user.mustChangePassword && <span className="rounded bg-amber-500/10 px-1.5 py-1 text-[10px] font-medium text-amber-700 dark:text-amber-400">Password change</span>}{!user.twoFactor && !user.mustChangePassword && <span className="text-[11px] text-muted-foreground">Standard</span>}</div></td><td className="px-4 py-3.5 text-xs text-muted-foreground">{user.lastActive}</td><td className="relative px-4 py-3.5 text-right"><Button variant="ghost" size="icon-sm" onClick={() => setMenuId(menuId === user.id ? null : user.id)} aria-label={`Actions for ${user.name}`}><MoreHorizontal /></Button>{menuId === user.id && <div className="absolute top-12 right-4 z-10 w-48 rounded-lg border border-border bg-popover p-1 text-left shadow-lg"><button type="button" onClick={() => selectUser(user)} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-muted"><Pencil className="size-3.5" /> Edit role & security</button><button type="button" onClick={() => { setSelectedUser(user); setDialogMode("reset"); setMenuId(null) }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-muted"><KeyRound className="size-3.5" /> Reset password</button>{user.status === "Invited" ? <button type="button" onClick={() => { setSelectedUser(user); resendInvitation() }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-muted"><RefreshCw className="size-3.5" /> Resend invitation</button> : <button type="button" onClick={() => revokeSessions()} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-muted"><LogOut className="size-3.5" /> Revoke sessions ({user.sessions})</button>}<div className="my-1 border-t border-border" />{user.status === "Active" ? <button type="button" onClick={() => { setSelectedUser(user); setDialogMode("deactivate"); setMenuId(null) }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs text-amber-700 hover:bg-amber-500/10"><Ban className="size-3.5" /> Suspend account</button> : <button type="button" onClick={() => { setSelectedUser(user); updateStatus("Active") }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs text-emerald-700 hover:bg-emerald-500/10"><Check className="size-3.5" /> Reactivate account</button>}</div>}</td></tr>)}</tbody></table>{filteredUsers.length === 0 && <div className="flex flex-col items-center gap-2 px-6 py-16 text-center"><Users className="size-8 text-muted-foreground/50" /><p className="text-sm font-semibold">No users found</p><p className="text-xs text-muted-foreground">Try changing your search or filters.</p></div>}</div><div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-[11px] text-muted-foreground"><span>Showing {filteredUsers.length} of {users.length} users</span><span>Mock data · all privileged actions are audited</span></div>
          </CardContent></Card>
        </div>
      </main>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && setDialogMode(null)}><DialogContent className="max-w-lg">
        {dialogMode === "details" && selectedUser && <><DialogHeader><DialogTitle>{selectedUser.name}</DialogTitle><DialogDescription>{selectedUser.email} · {selectedUser.company}</DialogDescription></DialogHeader><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{[{ label: "Role", value: roleLabels[selectedUser.role] }, { label: "Sessions", value: selectedUser.sessions.toString() }, { label: "Last active", value: selectedUser.lastActive }].map((item) => <div key={item.label} className="rounded-lg bg-muted/60 p-3"><p className="text-[11px] text-muted-foreground">{item.label}</p><p className="mt-1 text-sm font-bold">{item.value}</p></div>)}</div><div className="space-y-3 rounded-lg border border-border/70 p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Account status</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(selectedUser.status)}`}>{selectedUser.status}</span></div><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Two-factor authentication</span><span className="text-xs font-semibold">{selectedUser.twoFactor ? "Enabled" : "Not enabled"}</span></div><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Password policy</span><span className="text-xs font-semibold">{selectedUser.mustChangePassword ? "Change required" : "Up to date"}</span></div></div><DialogFooter><Button variant="outline" onClick={() => setDialogMode("reset")}><KeyRound /> Reset password</Button><Button onClick={() => selectUser(selectedUser)}><Pencil /> Edit access</Button></DialogFooter></>}
        {dialogMode === "reset" && selectedUser && <><DialogHeader><DialogTitle>Reset password</DialogTitle><DialogDescription>Send a secure password reset link to {selectedUser.email}.</DialogDescription></DialogHeader><div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-blue-800 dark:text-blue-300"><div className="flex gap-3"><KeyRound className="size-4 shrink-0" /><p>The current password will remain unchanged until the user completes the reset flow. This event will be recorded in the audit log.</p></div></div><DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={sendPasswordReset}>Send reset link</Button></DialogFooter></>}
        {dialogMode === "deactivate" && selectedUser && <><DialogHeader><DialogTitle>Suspend {selectedUser.name}?</DialogTitle><DialogDescription>This immediately blocks access and revokes all active sessions.</DialogDescription></DialogHeader><div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-800 dark:text-amber-300"><div className="flex gap-3"><CircleAlert className="size-4 shrink-0" /><p>Suspension is reversible. The reason, actor, timestamp, and affected account will be recorded in the audit log.</p></div></div><DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button variant="destructive" onClick={() => updateStatus("Suspended")}>Suspend account</Button></DialogFooter></>}
        {dialogMode === "invite" && <><DialogHeader><DialogTitle>Invite platform user</DialogTitle><DialogDescription>Send an invitation and assign a role. This is mock data for now.</DialogDescription></DialogHeader><div className="space-y-3"><label className="block space-y-1.5 text-xs font-medium">Email address<Input placeholder="name@company.com" type="email" /></label><label className="block space-y-1.5 text-xs font-medium">Role<select defaultValue="EMPLOYEE" className="mt-1.5 h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus:border-ring">{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div><DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={() => { setDialogMode(null); setNotice("Invitation queued. The event was added to the audit log.") }}><Mail /> Send invitation</Button></DialogFooter></>}
      </DialogContent></Dialog>
    </div>
  )
}
