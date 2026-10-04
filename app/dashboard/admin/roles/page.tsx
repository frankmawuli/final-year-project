"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Code2,
  Eye,
  FileDown,
  Pencil,
  Plus,
  Save,
  Server,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const roleNames = ["SUPER_ADMIN", "HR_ADMIN", "HR_MANAGER", "RECRUITER", "EMPLOYEE"] as const
type RoleName = (typeof roleNames)[number]
type PermissionKey = "view" | "edit" | "export" | "delete" | "administer"
type Permissions = Record<PermissionKey, boolean>

type Resource = {
  id: string
  label: string
  description: string
  permissions: Record<RoleName, Permissions>
}

const permissionLabels: Record<PermissionKey, string> = {
  view: "View",
  edit: "Edit",
  export: "Export",
  delete: "Delete",
  administer: "Administer",
}

const roleDescriptions: Record<RoleName, string> = {
  SUPER_ADMIN: "Full platform access across companies and system settings.",
  HR_ADMIN: "Manage the company workspace, people, and hiring operations.",
  HR_MANAGER: "Manage assigned people and recruitment workflows.",
  RECRUITER: "Work with jobs, candidates, and interviews.",
  EMPLOYEE: "Access personal employee self-service features.",
}

const allPermissions = { view: true, edit: true, export: true, delete: true, administer: true }
const noPermissions = { view: false, edit: false, export: false, delete: false, administer: false }

const initialResources: Resource[] = [
  {
    id: "companies",
    label: "Companies",
    description: "Organizations, plans, and account status",
    permissions: {
      SUPER_ADMIN: allPermissions,
      HR_ADMIN: { ...noPermissions, view: true },
      HR_MANAGER: { ...noPermissions, view: true },
      RECRUITER: { ...noPermissions, view: true },
      EMPLOYEE: { ...noPermissions },
    },
  },
  {
    id: "users",
    label: "Users & accounts",
    description: "Platform identities, roles, and security",
    permissions: {
      SUPER_ADMIN: allPermissions,
      HR_ADMIN: { view: true, edit: true, export: true, delete: false, administer: true },
      HR_MANAGER: { view: true, edit: false, export: false, delete: false, administer: false },
      RECRUITER: { view: true, edit: false, export: false, delete: false, administer: false },
      EMPLOYEE: { ...noPermissions },
    },
  },
  {
    id: "jobs",
    label: "Jobs & listings",
    description: "Job posts, pipelines, and publishing",
    permissions: {
      SUPER_ADMIN: allPermissions,
      HR_ADMIN: allPermissions,
      HR_MANAGER: { view: true, edit: true, export: true, delete: false, administer: false },
      RECRUITER: { view: true, edit: true, export: true, delete: false, administer: false },
      EMPLOYEE: { ...noPermissions },
    },
  },
  {
    id: "applications",
    label: "Applications & interviews",
    description: "Candidates, interviews, and hiring activity",
    permissions: {
      SUPER_ADMIN: allPermissions,
      HR_ADMIN: allPermissions,
      HR_MANAGER: { view: true, edit: true, export: true, delete: false, administer: false },
      RECRUITER: { view: true, edit: true, export: true, delete: false, administer: false },
      EMPLOYEE: { ...noPermissions },
    },
  },
  {
    id: "reports",
    label: "Reports & exports",
    description: "Analytics, dashboards, and downloaded data",
    permissions: {
      SUPER_ADMIN: allPermissions,
      HR_ADMIN: { view: true, edit: false, export: true, delete: false, administer: false },
      HR_MANAGER: { view: true, edit: false, export: true, delete: false, administer: false },
      RECRUITER: { view: true, edit: false, export: false, delete: false, administer: false },
      EMPLOYEE: { view: true, edit: false, export: false, delete: false, administer: false },
    },
  },
  {
    id: "settings",
    label: "System settings",
    description: "Global configuration and security policy",
    permissions: {
      SUPER_ADMIN: allPermissions,
      HR_ADMIN: { view: true, edit: true, export: false, delete: false, administer: false },
      HR_MANAGER: { ...noPermissions },
      RECRUITER: { ...noPermissions },
      EMPLOYEE: { ...noPermissions },
    },
  },
  {
    id: "audit",
    label: "Audit logs",
    description: "Security events and privileged actions",
    permissions: {
      SUPER_ADMIN: allPermissions,
      HR_ADMIN: { view: true, edit: false, export: true, delete: false, administer: false },
      HR_MANAGER: { ...noPermissions },
      RECRUITER: { ...noPermissions },
      EMPLOYEE: { ...noPermissions },
    },
  },
]

const endpointRules = [
  { method: "GET", path: "/admin/users", rule: "SUPER_ADMIN or users.view" },
  { method: "PATCH", path: "/admin/users/:id/role", rule: "SUPER_ADMIN only" },
  { method: "POST", path: "/admin/users/:id/revoke-sessions", rule: "SUPER_ADMIN or users.administer" },
  { method: "GET", path: "/admin/audit-logs", rule: "SUPER_ADMIN or audit.view" },
]

function cloneResources() {
  return initialResources.map((resource) => ({
    ...resource,
    permissions: Object.fromEntries(roleNames.map((role) => [role, { ...resource.permissions[role] }])) as Record<RoleName, Permissions>,
  }))
}

export default function AdminRolesPage() {
  const [resources, setResources] = useState(cloneResources)
  const [selectedRole, setSelectedRole] = useState<RoleName>("SUPER_ADMIN")
  const [notice, setNotice] = useState("")
  const [showAddResource, setShowAddResource] = useState(false)

  function togglePermission(resourceId: string, permission: PermissionKey) {
    setResources((current) => current.map((resource) => resource.id === resourceId
      ? { ...resource, permissions: { ...resource.permissions, [selectedRole]: { ...resource.permissions[selectedRole], [permission]: !resource.permissions[selectedRole][permission] } } }
      : resource))
  }

  function savePermissions() {
    setNotice(`${selectedRole} permissions saved. Server-side policy checks will use this matrix for every sensitive endpoint.`)
  }

  const rolePermissionCount = resources.reduce((total, resource) => total + Object.values(resource.permissions[selectedRole]).filter(Boolean).length, 0)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-7">
        <div className="mx-auto max-w-350 space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Access control</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Roles & permissions</h1>
              <p className="mt-1 text-sm text-muted-foreground">Define what each role can do across the CoreRecruiter platform.</p>
            </div>
            <Button onClick={savePermissions}><Save /> Save changes</Button>
          </header>

          {notice && <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-700 dark:text-emerald-400"><span className="flex items-center gap-2"><Check className="size-4" /> {notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification"><X className="size-4" /></button></div>}

          <Card className="shadow-sm"><CardContent className="grid gap-2 p-3 sm:grid-cols-5">{roleNames.map((role) => <button key={role} type="button" onClick={() => setSelectedRole(role)} className={`rounded-lg px-3 py-3 text-left transition-colors ${selectedRole === role ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted"}`}><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold">{role.replace("_", " ")}</span>{selectedRole === role && <Check className="size-3.5" />}</div><p className={`mt-1 text-[11px] ${selectedRole === role ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{roleDescriptions[role]}</p></button>)}</CardContent></Card>

          <section className="grid gap-5 xl:grid-cols-[1fr_330px]">
            <Card className="overflow-hidden shadow-sm">
              <CardHeader className="flex-row items-center justify-between border-b border-border/70 pb-4"><div><CardTitle>Permission matrix</CardTitle><p className="mt-1 text-xs text-muted-foreground">Editing {selectedRole.replace("_", " ")} · {rolePermissionCount} permissions enabled</p></div><Button variant="outline" size="sm" onClick={() => setShowAddResource((value) => !value)}><Plus /> Add resource</Button></CardHeader>
              <CardContent className="p-0">
                {showAddResource && <div className="flex items-center justify-between gap-3 border-b border-primary/20 bg-primary/5 px-4 py-3 text-xs"><span className="flex items-center gap-2 text-primary"><Plus className="size-4" /> New resource permissions can be added when connected to the API.</span><button type="button" onClick={() => setShowAddResource(false)} aria-label="Close add resource message"><X className="size-4 text-muted-foreground" /></button></div>}
                <div className="overflow-x-auto"><table className="w-full min-w-220 text-left"><thead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Resource</th>{Object.entries(permissionLabels).map(([key, label]) => <th key={key} className="px-3 py-3 text-center">{label}</th>)}</tr></thead><tbody className="divide-y divide-border/70">{resources.map((resource) => <tr key={resource.id} className="transition-colors hover:bg-muted/30"><td className="px-4 py-4"><p className="text-xs font-semibold">{resource.label}</p><p className="mt-1 text-[11px] text-muted-foreground">{resource.description}</p></td>{(Object.keys(permissionLabels) as PermissionKey[]).map((permission) => { const enabled = resource.permissions[selectedRole][permission]; return <td key={permission} className="px-3 py-4 text-center"><button type="button" onClick={() => togglePermission(resource.id, permission)} aria-label={`${enabled ? "Remove" : "Grant"} ${permissionLabels[permission]} permission for ${selectedRole}`} className={`mx-auto flex size-7 items-center justify-center rounded-md border transition-colors ${enabled ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"}`}>{enabled ? <Check className="size-4" /> : <X className="size-3.5" />}</button></td>})}</tr>)}</tbody></table></div>
                <div className="flex items-center gap-2 border-t border-border/70 bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground"><ShieldCheck className="size-3.5 text-primary" /> Changes are applied to API permission checks after saving.</div>
              </CardContent>
            </Card>

            <div className="space-y-5">
              <Card className="shadow-sm"><CardHeader className="border-b border-border/70 pb-4"><CardTitle className="flex items-center gap-2"><Server className="size-4 text-primary" /> Authorization boundary</CardTitle></CardHeader><CardContent className="space-y-3 pt-4"><div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3"><p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Server-side enforcement enabled</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Every sensitive request must validate the authenticated user, role, permission, and company scope on the server.</p></div><div className="space-y-2 text-[11px] text-muted-foreground"><p className="flex items-start gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" /> Frontend navigation is only a convenience.</p><p className="flex items-start gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" /> Direct API calls are checked independently.</p><p className="flex items-start gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" /> Denied actions return a consistent 403 response.</p></div></CardContent></Card>
              <Card className="shadow-sm"><CardHeader className="border-b border-border/70 pb-4"><CardTitle className="flex items-center gap-2"><Code2 className="size-4 text-primary" /> Endpoint policy preview</CardTitle></CardHeader><CardContent className="space-y-3 pt-4">{endpointRules.map((rule) => <div key={rule.path} className="space-y-1"><div className="flex items-center gap-2"><span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">{rule.method}</span><span className="truncate font-mono text-[10px] text-foreground">{rule.path}</span></div><p className="pl-11 text-[10px] text-muted-foreground">{rule.rule}</p></div>)}</CardContent></Card>
              <div className="flex gap-3 rounded-lg border border-amber-500/25 bg-amber-500/5 p-4 text-xs text-amber-800 dark:text-amber-300"><AlertTriangle className="size-4 shrink-0" /><p>Never treat a hidden button or sidebar item as authorization. The API must enforce this matrix for every request.</p></div>
            </div>
          </section>

          <Card className="shadow-sm"><CardHeader className="border-b border-border/70 pb-4"><CardTitle>Permission key</CardTitle></CardHeader><CardContent className="grid gap-4 pt-4 sm:grid-cols-5">{[{ icon: Eye, label: "View", detail: "Read records and dashboards" }, { icon: Pencil, label: "Edit", detail: "Create or update records" }, { icon: FileDown, label: "Export", detail: "Download permitted data" }, { icon: Trash2, label: "Delete", detail: "Permanently remove records" }, { icon: Users, label: "Administer", detail: "Manage access and policy" }].map(({ icon: Icon, label, detail }) => <div key={label} className="flex gap-2.5"><Icon className="mt-0.5 size-4 text-primary" /><div><p className="text-xs font-semibold">{label}</p><p className="mt-1 text-[11px] text-muted-foreground">{detail}</p></div></div>)}</CardContent></Card>
        </div>
      </main>
    </div>
  )
}
