"use client"

import { useEffect, useState } from "react"
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserRound,
  X,
} from "lucide-react"
import { Avatar } from "@/components/avatar"
import { useAuth } from "@/context/auth-context"
import { employeeService, type ApiEmployee, type EmploymentType } from "@/services/employee.service"

const fallbackPhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

type WorkExperience = {
  title: string
  company: string
  period: string
  description: string
}

function Detail({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Mail }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </p>
      <p className="truncate text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  )
}

function formatDate(value: string | null) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

type ProfileForm = {
  jobTitle: string
  employmentType: string
  phone: string
  joinDate: string
  bio: string
}

export default function EssProfilePage() {
  const { accessToken } = useAuth()
  const [employee, setEmployee] = useState<(ApiEmployee & { company: { id: string; name: string; timezone: string | null } }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [form, setForm] = useState<ProfileForm>({ jobTitle: "", employmentType: "", phone: "", joinDate: "", bio: "" })
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [cvUploading, setCvUploading] = useState(false)
  const [cvError, setCvError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return
    employeeService.getMe(accessToken)
      .then(({ data }) => {
        setEmployee(data)
        setSkills(data.skills.map((skill) => typeof skill === "string" ? skill : skill.name))
        setWorkExperience((data.experiences ?? []).map((experience) => ({
          title: experience.title,
          company: experience.company,
          period: experience.duration ?? "Experience",
          description: experience.responsibilities ?? "",
        })))
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [accessToken])

  if (loading) {
    return <main className="min-h-full bg-background p-4 sm:p-6"><div className="mx-auto max-w-[1180px] animate-pulse space-y-4"><div className="h-36 rounded-2xl bg-muted" /><div className="h-32 rounded-2xl bg-muted" /><div className="h-32 rounded-2xl bg-muted" /></div></main>
  }

  if (error || !employee) {
    return <main className="flex min-h-full items-center justify-center bg-background p-6"><div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm"><UserRound className="mx-auto mb-3 size-8 text-muted-foreground" /><h1 className="text-base font-semibold">Profile unavailable</h1><p className="mt-1 text-sm text-muted-foreground">We couldn&apos;t load your employee profile.</p></div></main>
  }

  const name = employee.user?.name ?? "Employee"
  const role = employee.jobTitle ?? employee.user?.role ?? "Employee"
  const department = employee.department?.name ?? "—"
  const location = employee.officeLocation?.city ?? employee.officeLocation?.name ?? "—"
  const employmentType = employee.employmentType?.replace("_", " ") ?? "—"

  const openEditor = () => {
    setForm({
      jobTitle: employee.jobTitle ?? "",
      employmentType: employee.employmentType ?? "",
      phone: employee.phone ?? "",
      joinDate: employee.joinDate ? employee.joinDate.slice(0, 10) : "",
      bio: employee.bio ?? "",
    })
    setSaveError(null)
    setEditing(true)
  }

  const updateForm = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleCv = async (file: File | undefined) => {
    if (!file || !accessToken) return
    if (file.type !== "application/pdf") {
      setCvError("Only PDF CVs can be analysed.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError("CV must be smaller than 5 MB.")
      return
    }

    setCvUploading(true)
    setCvError(null)
    try {
      const { data } = await employeeService.autofillFromCv(file, accessToken)
      setForm((current) => ({
        ...current,
        jobTitle: data.experience[0]?.role || current.jobTitle,
        bio: data.about || current.bio,
      }))
      if (data.skills.length > 0) setSkills(data.skills)
      if (data.experience.length > 0) {
        setWorkExperience(data.experience.map((experience) => ({
          title: experience.role,
          company: experience.company,
          period: experience.duration || "Experience",
          description: experience.responsibilities || "",
        })))
      }
    } catch (uploadError) {
      setCvError(uploadError instanceof Error ? uploadError.message : "Could not analyse this CV.")
    } finally {
      setCvUploading(false)
    }
  }

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!accessToken || saving) return
    setSaving(true)
    setSaveError(null)
    try {
      const { data } = await employeeService.update(employee.id, {
        jobTitle: form.jobTitle || undefined,
        employmentType: (form.employmentType || undefined) as EmploymentType | undefined,
        phone: form.phone,
        joinDate: form.joinDate || undefined,
        bio: form.bio,
        experience: workExperience.map((experience) => ({
          title: experience.title,
          company: experience.company,
          duration: experience.period,
          responsibilities: experience.description,
        })),
      }, accessToken)
      setEmployee((current) => current ? { ...data, company: current.company } : current)
      setEditing(false)
    } catch (saveErr) {
      setSaveError(saveErr instanceof Error ? saveErr.message : "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-full bg-background px-3 py-4 text-foreground sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>ESS Portal</span><ChevronRight className="size-3.5" /><span className="font-medium text-foreground">My Profile</span>
        </div>

        <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <button
            type="button"
            onClick={openEditor}
            className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:right-6 sm:top-5"
          >
            <Pencil className="size-3.5" /> Edit profile
          </button>
          <div className="h-24 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent sm:h-28" />
          <div className="-mt-11 flex flex-col gap-4 px-5 pb-5 sm:-mt-14 sm:flex-row sm:items-end sm:px-8 sm:pb-7">
            <Avatar src={employee.user?.avatarUrl ?? fallbackPhoto} alt={name} className="size-24 border-4 border-card shadow-md sm:size-28" />
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-medium text-primary">Employee profile</p>
              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{role} <span className="mx-1.5">·</span> {department}</p>
            </div>
            <div className="flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:self-end">
              <CheckCircle2 className="size-3.5" /> {employee.isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold"><UserRound className="size-4 text-primary" /> Personal information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Detail label="First name" value={name.split(" ")[0]} icon={UserRound} />
              <Detail label="Employee ID" value={employee.employeeId} icon={BriefcaseBusiness} />
              <Detail label="Email address" value={employee.user?.email ?? ""} icon={Mail} />
              <Detail label="Phone" value={employee.phone ?? ""} icon={Phone} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold"><BriefcaseBusiness className="size-4 text-primary" /> Employment details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Detail label="Job title" value={role} icon={BriefcaseBusiness} />
              <Detail label="Department" value={department} icon={Building2} />
              <Detail label="Start date" value={formatDate(employee.joinDate)} icon={CalendarDays} />
              <Detail label="Employment type" value={employmentType} icon={Clock3} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:col-span-2 sm:p-6">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold"><MapPin className="size-4 text-primary" /> Primary workplace</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <Detail label="Office" value={employee.officeLocation?.name ?? "—"} icon={Building2} />
              <Detail label="City" value={location} icon={MapPin} />
              <Detail label="Time zone" value={employee.company.timezone ?? "Local time"} icon={Clock3} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:col-span-2 sm:p-6">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold"><BriefcaseBusiness className="size-4 text-primary" /> Work experience</h2>
            {workExperience.length > 0 ? <div className="space-y-5">
              {workExperience.map((experience, index) => (
                <div key={`${experience.company}-${experience.title}`} className="relative flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary ring-4 ring-primary/10" />
                    {index < workExperience.length - 1 && <span className="mt-2 h-full w-px bg-border" />}
                  </div>
                  <div className="min-w-0 pb-1">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-4">
                      <h3 className="text-sm font-semibold text-foreground">{experience.title}</h3>
                      <span className="shrink-0 text-xs text-muted-foreground">{experience.period}</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-primary">{experience.company}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{experience.description}</p>
                  </div>
                </div>
              ))}
            </div> : <p className="text-sm text-muted-foreground">No work experience has been added yet.</p>}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="size-4 text-primary" /> Skills</h2>
            {skills.length > 0 ? <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">{skill}</span>
              ))}
            </div> : <p className="text-sm text-muted-foreground">No skills have been added yet.</p>}
          </section>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Edit profile</h2>
                <p className="mt-1 text-xs text-muted-foreground">Update the details shown on your employee profile.</p>
              </div>
              <button type="button" onClick={() => setEditing(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted" aria-label="Close edit profile">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">Fill from your CV</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Upload a PDF to extract your title, summary, skills, and experience.</p>
                  </div>
                  <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                    {cvUploading ? <Loader2 className="size-3.5 animate-spin" /> : <FileText className="size-3.5" />}
                    {cvUploading ? "Analysing..." : "Upload CV"}
                    <input type="file" accept="application/pdf" className="hidden" disabled={cvUploading} onChange={(event) => { void handleCv(event.target.files?.[0]); event.currentTarget.value = "" }} />
                  </label>
                </div>
                {cvError && <p className="mt-2 text-xs font-medium text-rose-600">{cvError}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-medium">Job title<input value={form.jobTitle} onChange={(event) => updateForm("jobTitle", event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
                <label className="text-xs font-medium">Employment type<select value={form.employmentType} onChange={(event) => updateForm("employmentType", event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"><option value="">Select type</option><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="CONTRACT">Contract</option><option value="INTERN">Intern</option></select></label>
                <label className="text-xs font-medium">Phone<input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
                <label className="text-xs font-medium">Start date<input type="date" value={form.joinDate} onChange={(event) => updateForm("joinDate", event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
              </div>
              <label className="block text-xs font-medium">About<textarea value={form.bio} onChange={(event) => updateForm("bio", event.target.value)} className="mt-1.5 h-24 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>

              {saveError && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">{saveError}</p>}
              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}