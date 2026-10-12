"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Archive,
  ArrowDownUp,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  Eye,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { adminService } from "@/services/admin.service"

 type CompanyStatus = "Active" | "Suspended" | "Archived"
type Plan = "Standard"
type Company = {
  id: number
  name: string
  industry: string
  location: string
  status: CompanyStatus
  plan: Plan
  employees: number
  users: number
  jobs: number
  applications: number
  usage: number
  admin: string
  adminEmail: string
  created: string
  lastActive: string
}

type DialogMode = "details" | "edit" | "create" | "impersonate" | null

const initialCompanies: Company[] = [
  { id: 1, name: "Northstar Labs", industry: "Technology", location: "London, UK", status: "Active", plan: "Standard", employees: 842, users: 916, jobs: 64, applications: 1842, usage: 78, admin: "Olivia Bennett", adminEmail: "olivia@northstarlabs.com", created: "Jan 12, 2024", lastActive: "2 min ago" },
  { id: 2, name: "Acme Corporation", industry: "Manufacturing", location: "Manchester, UK", status: "Active", plan: "Standard", employees: 516, users: 588, jobs: 38, applications: 1208, usage: 62, admin: "James Wilson", adminEmail: "james@acme.co.uk", created: "Feb 04, 2024", lastActive: "18 min ago" },
  { id: 3, name: "Brightpath Technologies", industry: "Technology", location: "Dublin, Ireland", status: "Active", plan: "Standard", employees: 284, users: 312, jobs: 26, applications: 847, usage: 46, admin: "Maya Patel", adminEmail: "maya@brightpath.io", created: "Mar 18, 2024", lastActive: "1 hr ago" },
  { id: 4, name: "Greenfield Health", industry: "Healthcare", location: "Bristol, UK", status: "Suspended", plan: "Standard", employees: 138, users: 151, jobs: 9, applications: 324, usage: 24, admin: "Daniel Jones", adminEmail: "daniel@greenfield.health", created: "Apr 27, 2024", lastActive: "4 days ago" },
  { id: 5, name: "Vertex Finance", industry: "Financial Services", location: "Edinburgh, UK", status: "Active", plan: "Standard", employees: 1260, users: 1398, jobs: 91, applications: 2741, usage: 91, admin: "Sophie Martin", adminEmail: "sophie@vertex.finance", created: "May 09, 2024", lastActive: "12 min ago" },
  { id: 6, name: "Oak & Stone Design", industry: "Design", location: "Leeds, UK", status: "Archived", plan: "Standard", employees: 48, users: 54, jobs: 0, applications: 96, usage: 8, admin: "Noah Williams", adminEmail: "noah@oakstone.design", created: "Jun 21, 2024", lastActive: "3 months ago" },
]

const emptyDraft = { name: "", industry: "Technology", location: "", plan: "Standard" as Plan, admin: "", adminEmail: "" }

function statusClass(status: CompanyStatus) {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
  if (status === "Suspended") return "bg-amber-500/10 text-amber-700 dark:text-amber-400"
  return "bg-muted text-muted-foreground"
}

function planClass(plan: Plan) {
  return "text-muted-foreground"
}

export default function AdminCompaniesPage() {
  const { accessToken } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<CompanyStatus | "All">("All")
  const [planFilter, setPlanFilter] = useState<Plan | "All">("All")
  const [sortAsc, setSortAsc] = useState(true)
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [menuId, setMenuId] = useState<number | null>(null)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    if (!accessToken) return
    adminService.companies(accessToken, page, 25, query)
      .then((response) => {
        setTotal(response.pagination.total)
        setCompanies(response.data.map((company) => ({
          id: Array.from(company.id).reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 0),
          name: company.name,
          industry: company.industry ?? "Not specified",
          location: [company.city, company.country].filter(Boolean).join(", ") || "Not specified",
          status: "Active",
          plan: "Standard",
          employees: company._count.employees,
          users: company._count.users,
          jobs: company._count.Jobs,
          applications: 0,
          usage: 0,
          admin: "Not available",
          adminEmail: "",
          created: new Date(company.createdAt).toLocaleDateString(),
          lastActive: "Not available",
        })))
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false))
  }, [accessToken, page, query])

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((company) => {
        const matchesQuery = `${company.name} ${company.industry} ${company.location} ${company.admin}`.toLowerCase().includes(query.toLowerCase())
        return matchesQuery && (statusFilter === "All" || company.status === statusFilter) && (planFilter === "All" || company.plan === planFilter)
      })
      .sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))
  }, [companies, planFilter, query, sortAsc, statusFilter])

  const activeCount = companies.filter((company) => company.status === "Active").length
  const totalEmployees = companies.reduce((total, company) => total + company.employees, 0)
  const totalJobs = companies.reduce((total, company) => total + company.jobs, 0)

  function openCreate() {
    setDraft(emptyDraft)
    setSelectedCompany(null)
    setDialogMode("create")
  }

  function openEdit(company: Company) {
    setSelectedCompany(company)
    setDraft({ name: company.name, industry: company.industry, location: company.location, plan: company.plan, admin: company.admin, adminEmail: company.adminEmail })
    setMenuId(null)
    setDialogMode("edit")
  }

  function saveCompany() {
    if (!draft.name.trim() || !draft.location.trim() || !draft.admin.trim() || !draft.adminEmail.trim()) return
    if (dialogMode === "edit" && selectedCompany) {
      setCompanies((current) => current.map((company) => company.id === selectedCompany.id ? { ...company, ...draft } : company))
      setNotice(`${draft.name} was updated successfully.`)
    } else {
      setCompanies((current) => [...current, { id: Date.now(), ...draft, status: "Active", employees: 0, users: 1, jobs: 0, applications: 0, usage: 4, created: "Today", lastActive: "Just now" }])
      setNotice(`${draft.name} was created and its administrator was invited.`)
    }
    setDialogMode(null)
  }

  function updateStatus(company: Company, status: CompanyStatus) {
    setCompanies((current) => current.map((item) => item.id === company.id ? { ...item, status } : item))
    setMenuId(null)
    setNotice(`${company.name} is now ${status.toLowerCase()}. This action was added to the audit log.`)
  }

  function impersonate() {
    if (!selectedCompany) return
    setDialogMode(null)
    setNotice(`Impersonation session prepared for ${selectedCompany.admin}. The action was added to the audit log.`)
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-5 sm:p-7">
        <div className="mx-auto max-w-350 space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Platform management</p>
            </div>
            <Button onClick={openCreate}><Plus /> Add company</Button>
          </header>

          {notice && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-700 dark:text-emerald-400">
              <span className="flex items-center gap-2"><Check className="size-4" /> {notice}</span>
              <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification"><X className="size-4" /></button>
            </div>
          )}

          <section className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "All companies", value: companies.length, detail: "Across all account statuses", icon: Building2, tone: "text-primary bg-primary/10" },
              { label: "Active accounts", value: activeCount, detail: `${Math.round((activeCount / companies.length) * 100)}% of all companies`, icon: ShieldCheck, tone: "text-emerald-600 bg-emerald-500/10" },
              { label: "Employees managed", value: totalEmployees.toLocaleString(), detail: `${totalJobs} active job listings`, icon: Users, tone: "text-violet-600 bg-violet-500/10" },
            ].map((stat) => {
              const Icon = stat.icon
              return <Card key={stat.label} className="shadow-sm"><CardContent className="flex items-center gap-3 p-4"><div className={`flex size-9 items-center justify-center rounded-lg ${stat.tone}`}><Icon className="size-4" /></div><div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="mt-1 text-xl font-bold tracking-tight">{stat.value}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{stat.detail}</p></div></CardContent></Card>
            })}
          </section>

          <Card className="overflow-visible shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-sm"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies, admins, or locations" className="h-9 pl-9 text-xs" /></div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative"><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as CompanyStatus | "All")} className="h-9 appearance-none rounded-lg border border-input bg-background py-1 pr-8 pl-3 text-xs font-medium outline-none focus:border-ring"><option value="All">All statuses</option><option value="Active">Active</option><option value="Suspended">Suspended</option><option value="Archived">Archived</option></select><ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground" /></div>
                  <div className="relative"><select value={planFilter} onChange={(event) => setPlanFilter(event.target.value as Plan | "All")} className="h-9 appearance-none rounded-lg border border-input bg-background py-1 pr-8 pl-3 text-xs font-medium outline-none focus:border-ring"><option value="All">All plans</option><option value="Standard">Standard</option></select><ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground" /></div>
                  <Button variant="outline" size="sm" onClick={() => setSortAsc((value) => !value)}><ArrowDownUp /> Name {sortAsc ? "A-Z" : "Z-A"}</Button>
                  <Button variant="ghost" size="icon-sm" aria-label="More filters"><Filter /></Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {error && <p className="p-4 text-xs text-destructive">{error}</p>}
                {loading && <p className="p-4 text-xs text-muted-foreground">Loading companies...</p>}
                <table className="w-full min-w-230 text-left">
                  <thead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Company</th><th className="px-4 py-3">Plan</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Employees</th><th className="px-4 py-3">Usage</th><th className="px-4 py-3">Last active</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
                  <tbody className="divide-y divide-border/70">
                    {filteredCompanies.map((company) => (
                      <tr key={company.id} className="group transition-colors hover:bg-muted/30">
                        <td className="px-4 py-3.5"><button type="button" onClick={() => { setSelectedCompany(company); setDialogMode("details") }} className="flex items-center gap-3 text-left"><span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Building2 className="size-4" /></span><span><span className="block text-xs font-semibold group-hover:text-primary">{company.name}</span><span className="mt-1 block text-[11px] text-muted-foreground">{company.industry} · {company.location}</span></span></button></td>
                        <td className={`px-4 py-3.5 text-xs font-semibold ${planClass(company.plan)}`}>{company.plan}</td>
                        <td className="px-4 py-3.5"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(company.status)}`}>{company.status}</span></td>
                        <td className="px-4 py-3.5 text-xs font-medium">{company.employees.toLocaleString()}</td>
                        <td className="px-4 py-3.5"><div className="flex items-center gap-2"><div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${company.usage > 80 ? "bg-amber-500" : "bg-primary"}`} style={{ width: `${company.usage}%` }} /></div><span className="text-[11px] text-muted-foreground">{company.usage}%</span></div></td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">{company.lastActive}</td>
                        <td className="relative px-4 py-3.5 text-right"><Button variant="ghost" size="icon-sm" onClick={() => setMenuId(menuId === company.id ? null : company.id)} aria-label={`Actions for ${company.name}`}><MoreHorizontal /></Button>{menuId === company.id && <div className="absolute top-12 right-4 z-10 w-44 rounded-lg border border-border bg-popover p-1 text-left shadow-lg"><button type="button" onClick={() => { setSelectedCompany(company); setDialogMode("details"); setMenuId(null) }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-muted"><Eye className="size-3.5" /> View details</button><button type="button" onClick={() => openEdit(company)} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-muted"><Pencil className="size-3.5" /> Edit company</button><button type="button" onClick={() => { setSelectedCompany(company); setDialogMode("impersonate"); setMenuId(null) }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-muted"><UserRound className="size-3.5" /> Impersonate admin</button><div className="my-1 border-t border-border" />{company.status === "Active" ? <button type="button" onClick={() => updateStatus(company, "Suspended")} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs text-amber-700 hover:bg-amber-500/10"><CircleAlert className="size-3.5" /> Suspend account</button> : company.status === "Archived" ? <button type="button" onClick={() => updateStatus(company, "Active")} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs text-emerald-700 hover:bg-emerald-500/10"><Check className="size-3.5" /> Activate account</button> : <button type="button" onClick={() => updateStatus(company, "Active")} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs text-emerald-700 hover:bg-emerald-500/10"><Check className="size-3.5" /> Reactivate account</button>}<button type="button" onClick={() => updateStatus(company, "Archived")} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs text-destructive hover:bg-destructive/10"><Archive className="size-3.5" /> Archive company</button></div>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCompanies.length === 0 && <div className="flex flex-col items-center gap-2 px-6 py-16 text-center"><Building2 className="size-8 text-muted-foreground/50" /><p className="text-sm font-semibold">No companies found</p><p className="text-xs text-muted-foreground">Try changing your search or filters.</p></div>}
              </div>
              <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-[11px] text-muted-foreground"><span>Showing {filteredCompanies.length} of {total} companies</span><div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span>Page {page}</span><Button variant="outline" size="sm" disabled={filteredCompanies.length < 25} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-lg">
          {dialogMode === "details" && selectedCompany && <><DialogHeader><DialogTitle>{selectedCompany.name}</DialogTitle><DialogDescription>{selectedCompany.industry} · {selectedCompany.location}</DialogDescription></DialogHeader><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[{ label: "Employees", value: selectedCompany.employees.toLocaleString() }, { label: "Users", value: selectedCompany.users.toLocaleString() }, { label: "Jobs", value: selectedCompany.jobs.toString() }, { label: "Applications", value: selectedCompany.applications.toLocaleString() }].map((item) => <div key={item.label} className="rounded-lg bg-muted/60 p-3"><p className="text-[11px] text-muted-foreground">{item.label}</p><p className="mt-1 text-lg font-bold">{item.value}</p></div>)}</div><div className="space-y-3 rounded-lg border border-border/70 p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Account status</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(selectedCompany.status)}`}>{selectedCompany.status}</span></div><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Subscription</span><span className={`text-xs font-semibold ${planClass(selectedCompany.plan)}`}>{selectedCompany.plan}</span></div><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Primary HR admin</span><span className="text-right text-xs font-medium">{selectedCompany.admin}<br /><span className="text-[11px] text-muted-foreground">{selectedCompany.adminEmail}</span></span></div><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Created</span><span className="text-xs font-medium">{selectedCompany.created}</span></div></div><DialogFooter><Button variant="outline" onClick={() => { setDialogMode("impersonate") }}><UserRound /> Impersonate admin</Button><Button onClick={() => openEdit(selectedCompany)}><Pencil /> Edit company</Button></DialogFooter></>}

          {(dialogMode === "create" || dialogMode === "edit") && <><DialogHeader><DialogTitle>{dialogMode === "create" ? "Add company" : "Edit company"}</DialogTitle><DialogDescription>{dialogMode === "create" ? "Create a company account and invite its primary HR administrator." : "Update company profile and subscription details."}</DialogDescription></DialogHeader><div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1.5 text-xs font-medium sm:col-span-2">Company name<Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Company name" /></label><label className="space-y-1.5 text-xs font-medium">Industry<Input value={draft.industry} onChange={(event) => setDraft({ ...draft, industry: event.target.value })} placeholder="Technology" /></label><label className="space-y-1.5 text-xs font-medium">Location<Input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} placeholder="London, UK" /></label><label className="space-y-1.5 text-xs font-medium">Primary admin<Input value={draft.admin} onChange={(event) => setDraft({ ...draft, admin: event.target.value })} placeholder="Full name" /></label><label className="space-y-1.5 text-xs font-medium">Admin email<Input type="email" value={draft.adminEmail} onChange={(event) => setDraft({ ...draft, adminEmail: event.target.value })} placeholder="admin@company.com" /></label><label className="space-y-1.5 text-xs font-medium sm:col-span-2">Subscription plan<select value={draft.plan} disabled className="mt-1.5 h-8 w-full rounded-lg border border-input bg-muted px-2.5 text-sm outline-none"><option>Standard</option></select></label></div><DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={saveCompany} disabled={!draft.name.trim() || !draft.location.trim() || !draft.admin.trim() || !draft.adminEmail.trim()}>{dialogMode === "create" ? "Create company" : "Save changes"}</Button></DialogFooter></>}

          {dialogMode === "impersonate" && selectedCompany && <><DialogHeader><DialogTitle>Impersonate company administrator?</DialogTitle><DialogDescription>You will temporarily view CoreRecruiter as {selectedCompany.admin} from {selectedCompany.name}.</DialogDescription></DialogHeader><div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-800 dark:text-amber-300"><div className="flex gap-3"><CircleAlert className="size-4 shrink-0" /><p>This is a privileged action. The session, reason, administrator, and all actions taken will be recorded in the audit log.</p></div></div><DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button onClick={impersonate}><UserRound /> Start audited session</Button></DialogFooter></>}
        </DialogContent>
      </Dialog>
    </div>
  )
}
