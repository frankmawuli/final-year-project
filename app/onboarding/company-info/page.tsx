"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Upload,
  Globe,
  X as XIcon,
  ChevronDown,
  Building2,
  MapPin,
  Network,
  Mail,
  Check,
  Plus,
  Trash2,
  Link as LinkIcon,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Step definitions ───────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    title: "Company Basic Info",
    description: "Name, industry, size and logo",
    icon: Building2,
  },
  {
    id: 2,
    title: "Address & Location",
    description: "Country, city and timezone",
    icon: MapPin,
  },
  {
    id: 3,
    title: "Company Structure",
    description: "Departments, roles and offices",
    icon: Network,
  },
  {
    id: 4,
    title: "Employee Invitations",
    description: "Invite your team to join",
    icon: Mail,
  },
]

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance & Banking", "Education",
  "Retail & E-commerce", "Manufacturing", "Media & Entertainment",
  "Consulting", "Real Estate", "Transportation & Logistics",
  "Energy & Utilities", "Legal Services", "Non-profit", "Agriculture",
  "Construction", "Hospitality & Tourism", "Telecommunications",
  "Pharmaceuticals", "Automotive", "Aerospace & Defense",
  "Fashion & Apparel", "Food & Beverage", "Sports & Recreation",
  "Government & Public Sector", "Other",
]

const COMPANY_SIZES = [
  "1–10 employees", "11–50 employees", "51–200 employees",
  "201–500 employees", "501–1,000 employees", "1,001–5,000 employees",
  "5,000+ employees",
]

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Netherlands", "Singapore", "India", "Nigeria", "Kenya",
  "South Africa", "Brazil", "Mexico", "UAE", "Saudi Arabia", "Other",
]

const TIMEZONES = [
  "UTC-12:00", "UTC-11:00", "UTC-10:00 (HST)", "UTC-08:00 (PST)",
  "UTC-07:00 (MST)", "UTC-06:00 (CST)", "UTC-05:00 (EST)",
  "UTC-04:00 (AST)", "UTC-03:00 (BRT)", "UTC+00:00 (GMT/UTC)",
  "UTC+01:00 (CET)", "UTC+02:00 (EET/CAT)", "UTC+03:00 (EAT/MSK)",
  "UTC+04:00 (GST)", "UTC+05:30 (IST)", "UTC+07:00 (ICT)",
  "UTC+08:00 (CST/SGT)", "UTC+09:00 (JST/KST)", "UTC+10:00 (AEST)",
  "UTC+12:00 (NZST)",
]

// ── Shared field components ────────────────────────────────────
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-foreground">
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  )
}

function TextInput({
  value, onChange, placeholder, type = "text", prefix, error,
}: {
  value: string; onChange: (v: string) => void; placeholder: string
  type?: string; prefix?: React.ReactNode; error?: string
}) {
  return (
    <div>
      <div className={cn(
        "flex h-[44px] items-center overflow-hidden rounded-lg border bg-muted",
        error
          ? "border-rose-400"
          : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
      )}>
        {prefix && (
          <div className="flex shrink-0 items-center border-r border-border px-3 text-muted-foreground">
            {prefix}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full flex-1 bg-transparent px-3.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      {error && <p className="mt-1 text-[11px] text-rose-500">{error}</p>}
    </div>
  )
}

function SelectInput({
  value, onChange, placeholder, options, error,
}: {
  value: string; onChange: (v: string) => void
  placeholder: string; options: string[]; error?: string
}) {
  return (
    <div>
      <div className={cn(
        "relative flex h-[44px] items-center overflow-hidden rounded-lg border bg-muted",
        error
          ? "border-rose-400"
          : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
      )}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full appearance-none bg-transparent px-3.5 text-[13px] text-foreground outline-none"
          style={{ color: value ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
      </div>
      {error && <p className="mt-1 text-[11px] text-rose-500">{error}</p>}
    </div>
  )
}

function LogoUpload({ preview, onChange }: {
  preview: string | null
  onChange: (url: string | null, file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return
    onChange(URL.createObjectURL(file), file)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault(); setDragging(false)
        const f = e.dataTransfer.files[0]; if (f) handleFile(f)
      }}
      className={cn(
        "flex h-[100px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-colors",
        dragging
          ? "border-primary bg-primary/10"
          : "border-border bg-muted hover:border-primary hover:bg-primary/5"
      )}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      {preview ? (
        <div className="relative flex size-full items-center justify-center">
          <img src={preview} alt="Logo" className="h-full max-h-[80px] w-auto rounded object-contain p-2" />
          <button type="button" onClick={(e) => { e.stopPropagation(); onChange(null, null) }}
            className="absolute right-2 top-2 rounded-full bg-card p-0.5 shadow">
            <XIcon className="size-3 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex size-8 items-center justify-center rounded-lg bg-card shadow-sm">
            <Upload className="size-4 text-primary" />
          </div>
          <p className="text-center text-[12px] text-muted-foreground">
            <span className="font-medium text-primary">Click to upload</span> or drag & drop
          </p>
          <p className="text-[11px] text-muted-foreground">PNG, JPG or SVG (max 2 MB)</p>
        </>
      )}
    </div>
  )
}

// ── Tag chip for departments / roles ──────────────────────────
function TagList({
  items, onRemove, placeholder, onAdd,
}: {
  items: string[]; onRemove: (i: number) => void
  placeholder: string; onAdd: (v: string) => void
}) {
  const [input, setInput] = useState("")
  function add() {
    const v = input.trim()
    if (v && !items.includes(v)) { onAdd(v); setInput("") }
  }
  return (
    <div className="rounded-lg border border-border bg-muted p-3">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[12px] font-medium text-primary">
            {item}
            <button type="button" onClick={() => onRemove(i)}>
              <XIcon className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button type="button" onClick={add}
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

// ── Employee invite row ────────────────────────────────────────
interface InviteRow { name: string; email: string; department: string; role: string; startDate: string }

function InviteTable({
  rows, onChange, departments,
}: {
  rows: InviteRow[]
  onChange: (rows: InviteRow[]) => void
  departments: string[]
}) {
  function update(i: number, field: keyof InviteRow, val: string) {
    const next = rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r)
    onChange(next)
  }
  function remove(i: number) { onChange(rows.filter((_, idx) => idx !== i)) }
  function addRow() { onChange([...rows, { name: "", email: "", department: "", role: "", startDate: "" }]) }

  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center">
          <input value={row.name} onChange={(e) => update(i, "name", e.target.value)}
            placeholder="Full name"
            className="h-[38px] rounded-lg border border-border bg-muted px-3 text-[12px] text-foreground outline-none focus:border-primary" />
          <input value={row.email} onChange={(e) => update(i, "email", e.target.value)}
            placeholder="Email address"
            className="h-[38px] rounded-lg border border-border bg-muted px-3 text-[12px] text-foreground outline-none focus:border-primary" />
          <select value={row.department} onChange={(e) => update(i, "department", e.target.value)}
            className="h-[38px] rounded-lg border border-border bg-muted px-3 text-[12px] text-foreground outline-none focus:border-primary"
            style={{ color: row.department ? "var(--foreground)" : "var(--muted-foreground)" }}>
            <option value="" disabled hidden>Department</option>
            {departments.length > 0
              ? departments.map((d) => <option key={d} value={d}>{d}</option>)
              : <option value="General">General</option>
            }
          </select>
          <input value={row.role} onChange={(e) => update(i, "role", e.target.value)}
            placeholder="Role / Title"
            className="h-[38px] rounded-lg border border-border bg-muted px-3 text-[12px] text-foreground outline-none focus:border-primary" />
          <input type="date" value={row.startDate} onChange={(e) => update(i, "startDate", e.target.value)}
            className="h-[38px] rounded-lg border border-border bg-muted px-3 text-[12px] text-foreground outline-none focus:border-primary" />
          <button type="button" onClick={() => remove(i)}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-500">
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow}
        className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-[12px] font-medium text-primary hover:border-primary hover:bg-primary/5 w-full justify-center">
        <Plus className="size-3.5" /> Add employee
      </button>
    </div>
  )
}

// ── Step content components ────────────────────────────────────
function Step1({
  data, errors, onChange, logoPreview, onLogoChange,
}: {
  data: Step1Data; errors: Partial<Record<keyof Step1Data, string>>
  onChange: (f: keyof Step1Data, v: string) => void
  logoPreview: string | null
  onLogoChange: (url: string | null, file: File | null) => void
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Company Name</FieldLabel>
          <TextInput value={data.companyName} onChange={(v) => onChange("companyName", v)}
            placeholder="e.g. Acme Corporation" error={errors.companyName} />
        </div>
        <div>
          <FieldLabel>Registration Number</FieldLabel>
          <TextInput value={data.registrationNumber} onChange={(v) => onChange("registrationNumber", v)}
            placeholder="e.g. RC-123456" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Industry</FieldLabel>
          <SelectInput value={data.industry} onChange={(v) => onChange("industry", v)}
            placeholder="Select industry" options={INDUSTRIES} error={errors.industry} />
        </div>
        <div>
          <FieldLabel required>Company Size</FieldLabel>
          <SelectInput value={data.companySize} onChange={(v) => onChange("companySize", v)}
            placeholder="Select size" options={COMPANY_SIZES} error={errors.companySize} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Year Founded</FieldLabel>
          <TextInput value={data.yearFounded} onChange={(v) => onChange("yearFounded", v)}
            placeholder="e.g. 2015" type="number" />
        </div>
        <div>
          <FieldLabel>Company Website</FieldLabel>
          <TextInput value={data.website} onChange={(v) => onChange("website", v)}
            placeholder="https://yourcompany.com" type="url"
            prefix={<Globe className="size-4" />} error={errors.website} />
        </div>
      </div>

      <div>
        <FieldLabel>Company Logo</FieldLabel>
        <LogoUpload preview={logoPreview} onChange={onLogoChange} />
      </div>
    </div>
  )
}

function Step2({ data, errors, onChange }: {
  data: Step2Data; errors: Partial<Record<keyof Step2Data, string>>
  onChange: (f: keyof Step2Data, v: string) => void
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Country</FieldLabel>
          <SelectInput value={data.country} onChange={(v) => onChange("country", v)}
            placeholder="Select country" options={COUNTRIES} error={errors.country} />
        </div>
        <div>
          <FieldLabel>State / Region</FieldLabel>
          <TextInput value={data.state} onChange={(v) => onChange("state", v)}
            placeholder="e.g. California" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>City</FieldLabel>
          <TextInput value={data.city} onChange={(v) => onChange("city", v)}
            placeholder="e.g. San Francisco" error={errors.city} />
        </div>
        <div>
          <FieldLabel>Postal Code</FieldLabel>
          <TextInput value={data.postalCode} onChange={(v) => onChange("postalCode", v)}
            placeholder="e.g. 94105" />
        </div>
      </div>

      <div>
        <FieldLabel>Full Address</FieldLabel>
        <TextInput value={data.address} onChange={(v) => onChange("address", v)}
          placeholder="Street address, suite, building…"
          prefix={<MapPin className="size-4" />} />
      </div>

      <div>
        <FieldLabel required>Time Zone</FieldLabel>
        <SelectInput value={data.timezone} onChange={(v) => onChange("timezone", v)}
          placeholder="Select timezone" options={TIMEZONES} error={errors.timezone} />
      </div>
    </div>
  )
}

function Step3({ data, onChange }: { data: Step3Data; onChange: (next: Step3Data) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Departments</FieldLabel>
        <p className="mb-2 text-[12px] text-muted-foreground">Type a department name and press Enter or click +</p>
        <TagList items={data.departments}
          onRemove={(i) => onChange({ ...data, departments: data.departments.filter((_, idx) => idx !== i) })}
          onAdd={(v) => onChange({ ...data, departments: [...data.departments, v] })}
          placeholder="e.g. Engineering, HR, Sales…" />
      </div>

      <div>
        <FieldLabel>Office Locations</FieldLabel>
        <p className="mb-2 text-[12px] text-muted-foreground">Add branch/office locations if you have multiple sites</p>
        <TagList items={data.officeLocations}
          onRemove={(i) => onChange({ ...data, officeLocations: data.officeLocations.filter((_, idx) => idx !== i) })}
          onAdd={(v) => onChange({ ...data, officeLocations: [...data.officeLocations, v] })}
          placeholder="e.g. New York HQ, London Office…" />
      </div>

      <div className="rounded-lg border border-border bg-muted p-4">
        <FieldLabel>Reporting Structure</FieldLabel>
        <textarea
          value={data.reportingStructure}
          onChange={(e) => onChange({ ...data, reportingStructure: e.target.value })}
          placeholder="Briefly describe your hierarchy or reporting lines (optional)…"
          rows={3}
          className="mt-1.5 w-full resize-none bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}

function Step4({ data, onChange, departments }: {
  data: Step4Data; onChange: (next: Step4Data) => void; departments: string[]
}) {
  const [inviteMethod, setInviteMethod] = useState<"manual" | "csv" | "link">("manual")

  return (
    <div className="space-y-5 w-full">
      {/* Method selector */}
      <div>
        <FieldLabel>Invitation Method</FieldLabel>
        <div className="mt-2 flex gap-2">
          {([
            { id: "csv",    label: "Bulk Upload (CSV)", icon: Users },
            { id: "link",   label: "Generate Link",    icon: LinkIcon },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => setInviteMethod(id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-[12px] font-medium transition-colors",
                inviteMethod === id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted text-foreground hover:border-primary/50"
              )}>
              <Icon className="size-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {inviteMethod === "csv" && (
        <div className="flex h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted hover:border-primary hover:bg-primary/5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-card shadow-sm">
            <Upload className="size-5 text-primary" />
          </div>
          <p className="text-[13px] text-muted-foreground">
            <span className="font-medium text-primary">Upload CSV file</span> with employee details
          </p>
          <p className="text-[11px] text-muted-foreground">Columns: Name, Email, Department, Role, Start Date</p>
          <button type="button" className="mt-1 rounded-lg bg-primary px-4 py-1.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">
            Choose File
          </button>
        </div>
      )}

      {inviteMethod === "link" && (
        <div className="rounded-lg border border-border bg-muted p-4">
          <p className="mb-3 text-[13px] text-foreground">
            Share this link with your team. Anyone with the link can create their account and join your workspace.
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
            <LinkIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-[12px] text-muted-foreground">
              https://app.corerecruiter.com/join/invite-link-placeholder
            </span>
            <button type="button"
              className="shrink-0 rounded-md bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/90">
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-border bg-amber-50 p-3">
        <span className="text-[12px] text-amber-800">
          💡 You can always invite more employees later from the Employees section.
        </span>
      </div>
    </div>
  )
}

// ── Form data types ────────────────────────────────────────────
interface Step1Data {
  companyName: string; registrationNumber: string; industry: string
  companySize: string; yearFounded: string; website: string
}
interface Step2Data {
  country: string; state: string; city: string; address: string; postalCode: string; timezone: string
}
interface Step3Data {
  departments: string[]; roles: string[]; officeLocations: string[]; reportingStructure: string
}
interface Step4Data {
  inviteRows: InviteRow[]
}

// ── Left sidebar step list ─────────────────────────────────────
function SidebarStepList({ current }: { current: number }) {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col bg-primary/5 p-6">
      <div className="mb-8">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary">
          <Building2 className="size-5 text-primary-foreground" />
        </div>
        <h2 className="mt-3 text-[15px] font-bold text-foreground">Company Setup</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">Complete all steps to get started</p>
      </div>

      <div className="flex flex-col gap-1">
        {STEPS.map(({ id, title, description, icon: Icon }) => {
          const isCompleted = id < current
          const isActive    = id === current
          return (
            <div key={id} className={cn(
              "flex items-start gap-3 rounded-xl p-3 transition-colors",
              isActive ? "bg-card shadow-sm" : isCompleted ? "opacity-80" : "opacity-50"
            )}>
              <div className={cn(
                "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
                isCompleted || isActive ? "bg-primary" : "bg-muted"
              )}>
                {isCompleted
                  ? <Check className="size-3.5 text-primary-foreground" />
                  : <Icon className={cn("size-3.5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                }
              </div>
              <div>
                <p className={cn(
                  "text-[13px] font-semibold",
                  isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>{title}</p>
                <p className="text-[11px] text-muted-foreground">{description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-auto pt-8">
        <div className="mb-1.5 flex justify-between text-[11px] text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(((current - 1) / STEPS.length) * 100)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((current - 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  )
}

// ── Main page ──────────────────────────────────────────────────
export default function CompanyOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const [step1, setStep1] = useState<Step1Data>({
    companyName: "", registrationNumber: "", industry: "",
    companySize: "", yearFounded: "", website: "",
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [step2, setStep2] = useState<Step2Data>({
    country: "", state: "", city: "", address: "", postalCode: "", timezone: "",
  })
  const [step3, setStep3] = useState<Step3Data>({
    departments: [], roles: [], officeLocations: [], reportingStructure: "",
  })
  const [step4, setStep4] = useState<Step4Data>({
    inviteRows: [{ name: "", email: "", department: "", role: "", startDate: "" }],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function setS1(field: keyof Step1Data, val: string) {
    setStep1((f) => ({ ...f, [field]: val }))
    setErrors((e) => { const n = { ...e }; delete n[field]; return n })
  }
  function setS2(field: keyof Step2Data, val: string) {
    setStep2((f) => ({ ...f, [field]: val }))
    setErrors((e) => { const n = { ...e }; delete n[field]; return n })
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (step === 1) {
      if (!step1.companyName.trim())  errs.companyName  = "Company name is required."
      if (!step1.industry)            errs.industry     = "Please select an industry."
      if (!step1.companySize)         errs.companySize  = "Please select a company size."
      if (step1.website && !/^https?:\/\/.+/.test(step1.website))
        errs.website = "Enter a valid URL starting with https://"
    }
    if (step === 2) {
      if (!step2.country) errs.country  = "Please select a country."
      if (!step2.city.trim()) errs.city = "City is required."
      if (!step2.timezone) errs.timezone = "Please select a timezone."
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleNext() {
    if (!validate()) return
    if (step < STEPS.length) setStep((s) => s + 1)
    else router.push("/dashboard/hr")
  }

  const stepLabels: Record<number, string> = {
    1: "Company Basic Information",
    2: "Address & Location",
    3: "Company Structure",
    4: "Employee Invitations",
  }
  const stepSubtitles: Record<number, string> = {
    1: "Tell us the essentials about your company.",
    2: "Where is your company headquartered?",
    3: "Define your organization's structure — or skip and set it up later.",
    4: "Invite your team to join your workspace.",
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="flex w-full max-w-[920px] overflow-hidden rounded-2xl bg-card shadow-xl">

        {/* Left sidebar */}
        <SidebarStepList current={step} />

        {/* Right form area */}
        <div className="flex flex-1 flex-col p-8">
          {/* Step label */}
          <p className="mb-1 text-[12px] font-semibold uppercase tracking-widest text-primary">
            STEP {step} OF {STEPS.length}
          </p>
          <h1 className="mb-1 text-[26px] font-bold leading-tight tracking-tight text-foreground">
            {stepLabels[step]}
          </h1>
          <p className="mb-6 text-[13px] text-muted-foreground">{stepSubtitles[step]}</p>

          {/* Form content */}
          <div className="flex-1 overflow-y-auto">
            {step === 1 && (
              <Step1 data={step1} errors={errors as Partial<Record<keyof Step1Data, string>>}
                onChange={setS1} logoPreview={logoPreview} onLogoChange={(url) => setLogoPreview(url)} />
            )}
            {step === 2 && (
              <Step2 data={step2} errors={errors as Partial<Record<keyof Step2Data, string>>} onChange={setS2} />
            )}
            {step === 3 && (
              <>
                <Step3 data={step3} onChange={setStep3} />
                <div className="mt-4 flex items-center gap-2">
                  <button type="button" onClick={handleNext}
                    className="text-[12px] font-medium text-muted-foreground underline hover:text-foreground">
                    Skip and set later
                  </button>
                </div>
              </>
            )}
            {step === 4 && (
              <Step4 data={step4} onChange={setStep4} departments={step3.departments} />
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <button
              type="button"
              onClick={() => step > 1 ? setStep((s) => s - 1) : router.back()}
              className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl bg-primary px-7 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
            >
              {step === STEPS.length ? "Process and set up →" : "Save and continue →"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
