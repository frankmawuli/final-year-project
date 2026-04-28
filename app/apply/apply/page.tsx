"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Upload,
  X as XIcon,
  ChevronDown,
  User,
  Briefcase,
  GraduationCap,
  Link2,
  FileText,
  Check,
  Plus,
  Trash2,
  Linkedin,
  Github,
  Globe,
  Twitter,
  Phone,
  Mail,
  Camera,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Step definitions ────────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Name, contact & profile photo",
    icon: User,
  },
  {
    id: 2,
    title: "Professional Details",
    description: "Role, skills & resume",
    icon: Briefcase,
  },
  {
    id: 3,
    title: "Education",
    description: "Degree, school & graduation",
    icon: GraduationCap,
  },
  {
    id: 4,
    title: "Social & Portfolio",
    description: "LinkedIn, GitHub & links",
    icon: Link2,
  },
  {
    id: 5,
    title: "Additional Info",
    description: "Cover letter & consent",
    icon: FileText,
  },
]

const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1–2 years",
  "2–3 years",
  "3–5 years",
  "5–7 years",
  "7–10 years",
  "10–15 years",
  "15+ years",
]

const DEGREE_OPTIONS = [
  "High School Diploma / GED",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "MBA",
  "PhD / Doctorate",
  "Professional Certification",
  "Bootcamp / Vocational Training",
  "Self-taught / No formal degree",
  "Other",
]

const GRAD_YEARS = Array.from({ length: 40 }, (_, i) => String(new Date().getFullYear() - i))

// ── Shared field components ─────────────────────────────────────
function FieldLabel({
  children,
  required,
  optional,
}: {
  children: React.ReactNode
  required?: boolean
  optional?: boolean
}) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-foreground">
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
      {optional && (
        <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">(optional)</span>
      )}
    </label>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  error,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  prefix?: React.ReactNode
  error?: string
  disabled?: boolean
}) {
  return (
    <div>
      <div
        className={cn(
          "flex h-[44px] items-center overflow-hidden rounded-lg border bg-muted",
          disabled && "opacity-60",
          error
            ? "border-rose-400"
            : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        )}
      >
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
          disabled={disabled}
          className="h-full flex-1 bg-transparent px-3.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </div>
      {error && <p className="mt-1 text-[11px] text-rose-500">{error}</p>}
    </div>
  )
}

function SelectInput({
  value,
  onChange,
  placeholder,
  options,
  error,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: string[]
  error?: string
}) {
  return (
    <div>
      <div
        className={cn(
          "relative flex h-[44px] items-center overflow-hidden rounded-lg border bg-muted",
          error
            ? "border-rose-400"
            : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        )}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full appearance-none bg-transparent px-3.5 text-[13px] text-foreground outline-none"
          style={{ color: value ? "var(--foreground)" : "var(--muted-foreground)" }}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
      </div>
      {error && <p className="mt-1 text-[11px] text-rose-500">{error}</p>}
    </div>
  )
}

function TagInput({
  items,
  onRemove,
  placeholder,
  onAdd,
}: {
  items: string[]
  onRemove: (i: number) => void
  placeholder: string
  onAdd: (v: string) => void
}) {
  const [input, setInput] = useState("")
  function add() {
    const v = input.trim()
    if (v && !items.includes(v)) {
      onAdd(v)
      setInput("")
    }
  }
  return (
    <div className="min-h-[80px] rounded-lg border border-border bg-muted p-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[12px] font-medium text-primary"
          >
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
        <button
          type="button"
          onClick={add}
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

function AvatarUpload({
  preview,
  onChange,
}: {
  preview: string | null
  onChange: (url: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return
    onChange(URL.createObjectURL(file))
  }

  return (
    <div className="flex items-center gap-5">
      <div className="relative">
        <div className="flex size-[80px] items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted">
          {preview ? (
            <img src={preview} alt="Profile" className="size-full object-cover" />
          ) : (
            <User className="size-8 text-muted-foreground" strokeWidth={1.5} />
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <Camera className="size-3.5" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
      </div>
      <div>
        <p className="text-[13px] font-medium text-foreground">Profile Photo</p>
        <p className="mt-0.5 text-[12px] text-muted-foreground">JPG, PNG or GIF · max 2 MB</p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-muted"
          >
            Upload photo
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-muted"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ResumeUpload({
  fileName,
  onChange,
  error,
}: {
  fileName: string | null
  onChange: (name: string | null) => void
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowed.includes(file.type)) return
    onChange(file.name)
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-6 transition-colors",
          dragging
            ? "border-primary bg-primary/10"
            : error
            ? "border-rose-400 bg-muted"
            : "border-border bg-muted hover:border-primary hover:bg-primary/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
        {fileName ? (
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">{fileName}</p>
              <p className="text-[11px] text-muted-foreground">Click to replace</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null) }}
              className="ml-2 rounded-full p-1 hover:bg-muted"
            >
              <XIcon className="size-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex size-10 items-center justify-center rounded-lg bg-card shadow-sm">
              <Upload className="size-5 text-primary" />
            </div>
            <p className="text-center text-[13px] text-muted-foreground">
              <span className="font-medium text-primary">Click to upload</span> or drag & drop
            </p>
            <p className="text-[11px] text-muted-foreground">PDF, DOC or DOCX (max 5 MB)</p>
          </>
        )}
      </div>
      {error && <p className="mt-1 text-[11px] text-rose-500">{error}</p>}
    </div>
  )
}

// ── Extra link row ──────────────────────────────────────────────
interface ExtraLink { label: string; url: string }

// ── Form data types ─────────────────────────────────────────────
interface Step1Data {
  fullName: string
  email: string
  phone: string
}
interface Step2Data {
  jobTitle: string
  skills: string[]
  experience: string
  resumeFileName: string | null
}
interface Step3Data {
  degree: string
  school: string
  gradYear: string
  gpa: string
}
interface Step4Data {
  linkedin: string
  github: string
  website: string
  twitter: string
  extraLinks: ExtraLink[]
}
interface Step5Data {
  coverLetter: string
  references: string
  consent: boolean
}

// ── Step content ────────────────────────────────────────────────
function Step1({
  data,
  errors,
  onChange,
  avatarPreview,
  onAvatarChange,
}: {
  data: Step1Data
  errors: Partial<Record<keyof Step1Data, string>>
  onChange: (f: keyof Step1Data, v: string) => void
  avatarPreview: string | null
  onAvatarChange: (url: string | null) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Profile Photo</FieldLabel>
        <AvatarUpload preview={avatarPreview} onChange={onAvatarChange} />
      </div>

      <div>
        <FieldLabel required>Full Name</FieldLabel>
        <TextInput
          value={data.fullName}
          onChange={(v) => onChange("fullName", v)}
          placeholder="e.g. Jane Smith"
          prefix={<User className="size-4" />}
          error={errors.fullName}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Email Address</FieldLabel>
          <TextInput
            value={data.email}
            onChange={(v) => onChange("email", v)}
            placeholder="jane@example.com"
            type="email"
            prefix={<Mail className="size-4" />}
            error={errors.email}
          />
        </div>
        <div>
          <FieldLabel required>Phone Number</FieldLabel>
          <TextInput
            value={data.phone}
            onChange={(v) => onChange("phone", v)}
            placeholder="+1 (555) 000-0000"
            type="tel"
            prefix={<Phone className="size-4" />}
            error={errors.phone}
          />
        </div>
      </div>
    </div>
  )
}

function Step2({
  data,
  errors,
  onChange,
}: {
  data: Step2Data
  errors: Partial<Record<keyof Step2Data, string>>
  onChange: (next: Partial<Step2Data>) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel required>Current Job Title / Role</FieldLabel>
        <TextInput
          value={data.jobTitle}
          onChange={(v) => onChange({ jobTitle: v })}
          placeholder="e.g. Senior Product Designer"
          prefix={<Briefcase className="size-4" />}
          error={errors.jobTitle}
        />
      </div>

      <div>
        <FieldLabel required>Skills & Expertise</FieldLabel>
        <p className="mb-2 text-[12px] text-muted-foreground">
          Type a skill and press Enter or click +
        </p>
        <TagInput
          items={data.skills}
          onRemove={(i) =>
            onChange({ skills: data.skills.filter((_, idx) => idx !== i) })
          }
          onAdd={(v) => onChange({ skills: [...data.skills, v] })}
          placeholder="e.g. Figma, React, Python…"
        />
        {errors.skills && (
          <p className="mt-1 text-[11px] text-rose-500">{errors.skills}</p>
        )}
      </div>

      <div>
        <FieldLabel required>Years of Experience</FieldLabel>
        <SelectInput
          value={data.experience}
          onChange={(v) => onChange({ experience: v })}
          placeholder="Select experience range"
          options={EXPERIENCE_OPTIONS}
          error={errors.experience}
        />
      </div>

      <div>
        <FieldLabel required>Resume / CV</FieldLabel>
        <ResumeUpload
          fileName={data.resumeFileName}
          onChange={(name) => onChange({ resumeFileName: name })}
          error={errors.resumeFileName}
        />
      </div>
    </div>
  )
}

function Step3({
  data,
  errors,
  onChange,
}: {
  data: Step3Data
  errors: Partial<Record<keyof Step3Data, string>>
  onChange: (f: keyof Step3Data, v: string) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel required>Highest Degree / Certification</FieldLabel>
        <SelectInput
          value={data.degree}
          onChange={(v) => onChange("degree", v)}
          placeholder="Select your highest qualification"
          options={DEGREE_OPTIONS}
          error={errors.degree}
        />
      </div>

      <div>
        <FieldLabel required>School / Institution</FieldLabel>
        <TextInput
          value={data.school}
          onChange={(v) => onChange("school", v)}
          placeholder="e.g. Massachusetts Institute of Technology"
          prefix={<GraduationCap className="size-4" />}
          error={errors.school}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Year of Graduation</FieldLabel>
          <SelectInput
            value={data.gradYear}
            onChange={(v) => onChange("gradYear", v)}
            placeholder="Select year"
            options={GRAD_YEARS}
            error={errors.gradYear}
          />
        </div>
        <div>
          <FieldLabel optional>GPA / CGPA</FieldLabel>
          <TextInput
            value={data.gpa}
            onChange={(v) => onChange("gpa", v)}
            placeholder="e.g. 3.8 / 4.0"
          />
        </div>
      </div>
    </div>
  )
}

function Step4({
  data,
  onChange,
}: {
  data: Step4Data
  onChange: (next: Partial<Step4Data>) => void
}) {
  function addExtraLink() {
    onChange({ extraLinks: [...data.extraLinks, { label: "", url: "" }] })
  }
  function removeExtraLink(i: number) {
    onChange({ extraLinks: data.extraLinks.filter((_, idx) => idx !== i) })
  }
  function updateExtraLink(i: number, field: keyof ExtraLink, val: string) {
    onChange({
      extraLinks: data.extraLinks.map((l, idx) =>
        idx === i ? { ...l, [field]: val } : l
      ),
    })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-muted/50 p-4">
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          Professional Networks
        </p>
        <div className="space-y-3">
          <div>
            <FieldLabel optional>LinkedIn</FieldLabel>
            <TextInput
              value={data.linkedin}
              onChange={(v) => onChange({ linkedin: v })}
              placeholder="linkedin.com/in/yourprofile"
              prefix={<Linkedin className="size-4" />}
            />
          </div>
          <div>
            <FieldLabel optional>GitHub / GitLab</FieldLabel>
            <TextInput
              value={data.github}
              onChange={(v) => onChange({ github: v })}
              placeholder="github.com/yourusername"
              prefix={<Github className="size-4" />}
            />
          </div>
          <div>
            <FieldLabel optional>Personal Website / Portfolio</FieldLabel>
            <TextInput
              value={data.website}
              onChange={(v) => onChange({ website: v })}
              placeholder="https://yourportfolio.com"
              type="url"
              prefix={<Globe className="size-4" />}
            />
          </div>
          <div>
            <FieldLabel optional>Twitter / X or Other Social</FieldLabel>
            <TextInput
              value={data.twitter}
              onChange={(v) => onChange({ twitter: v })}
              placeholder="twitter.com/yourhandle"
              prefix={<Twitter className="size-4" />}
            />
          </div>
        </div>
      </div>

      {/* Extra links */}
      {data.extraLinks.length > 0 && (
        <div className="space-y-2">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Additional Links
          </p>
          {data.extraLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-[130px] shrink-0">
                <input
                  value={link.label}
                  onChange={(e) => updateExtraLink(i, "label", e.target.value)}
                  placeholder="Label"
                  className="h-[44px] w-full rounded-lg border border-border bg-muted px-3 text-[12px] text-foreground outline-none focus:border-primary"
                />
              </div>
              <div className="flex-1">
                <input
                  value={link.url}
                  onChange={(e) => updateExtraLink(i, "url", e.target.value)}
                  placeholder="https://…"
                  className="h-[44px] w-full rounded-lg border border-border bg-muted px-3 text-[12px] text-foreground outline-none focus:border-primary"
                />
              </div>
              <button
                type="button"
                onClick={() => removeExtraLink(i)}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-500"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addExtraLink}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-[12px] font-medium text-primary hover:border-primary hover:bg-primary/5"
      >
        <Plus className="size-3.5" /> Add another link
      </button>
    </div>
  )
}

function Step5({
  data,
  errors,
  onChange,
}: {
  data: Step5Data
  errors: Partial<Record<keyof Step5Data, string>>
  onChange: (next: Partial<Step5Data>) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel required>Cover Letter / Bio</FieldLabel>
        <p className="mb-2 text-[12px] text-muted-foreground">
          Tell us why you're a great fit for this role.
        </p>
        <div
          className={cn(
            "rounded-lg border bg-muted p-4",
            errors.coverLetter ? "border-rose-400" : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          )}
        >
          <textarea
            value={data.coverLetter}
            onChange={(e) => onChange({ coverLetter: e.target.value })}
            placeholder="I'm excited to apply for this position because…"
            rows={6}
            className="w-full resize-none bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <p className="mt-1 text-right text-[11px] text-muted-foreground">
            {data.coverLetter.length} / 2000
          </p>
        </div>
        {errors.coverLetter && (
          <p className="mt-1 text-[11px] text-rose-500">{errors.coverLetter}</p>
        )}
      </div>

      <div>
        <FieldLabel optional>References</FieldLabel>
        <p className="mb-2 text-[12px] text-muted-foreground">
          Name, title, and contact info for any professional references.
        </p>
        <div className="rounded-lg border border-border bg-muted p-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <textarea
            value={data.references}
            onChange={(e) => onChange({ references: e.target.value })}
            placeholder="e.g. John Doe, Engineering Manager at Acme Corp — john@acme.com"
            rows={3}
            className="w-full resize-none bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Privacy notice */}
      <div className="rounded-xl border border-border bg-primary/5 p-4">
        <p className="mb-1 text-[13px] font-semibold text-foreground">Data & Privacy</p>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Your application data will be stored securely and used solely for recruitment purposes.
          We will not share your information with third parties without your consent.
        </p>
      </div>

      {/* Consent checkbox */}
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
          data.consent ? "border-primary bg-primary/5" : "border-border bg-muted hover:border-primary/50",
          errors.consent && "border-rose-400"
        )}
      >
        <div
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
            data.consent ? "border-primary bg-primary" : "border-border bg-card"
          )}
        >
          {data.consent && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
        </div>
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => onChange({ consent: e.target.checked })}
          className="sr-only"
        />
        <div>
          <p className="text-[13px] font-medium text-foreground">
            I agree to the Privacy Policy and Terms of Use
          </p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            By submitting, you consent to the processing of your personal data for recruitment.
          </p>
        </div>
      </label>
      {errors.consent && (
        <p className="text-[11px] text-rose-500">{errors.consent}</p>
      )}
    </div>
  )
}

// ── Left sidebar ────────────────────────────────────────────────
function SidebarStepList({ current }: { current: number }) {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col bg-primary/5 p-6">
      <div className="mb-8">
        <div
          className="flex size-9 items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
        >
          <FileText className="size-5 text-white" />
        </div>
        <h2 className="mt-3 text-[15px] font-bold text-foreground">Job Application</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">Complete all steps to apply</p>
      </div>

      <div className="flex flex-col gap-1">
        {STEPS.map(({ id, title, description, icon: Icon }) => {
          const isCompleted = id < current
          const isActive = id === current
          return (
            <div
              key={id}
              className={cn(
                "flex items-start gap-3 rounded-xl p-3 transition-colors",
                isActive ? "bg-card shadow-sm" : isCompleted ? "opacity-80" : "opacity-50"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
                  isCompleted || isActive ? "bg-primary" : "bg-muted"
                )}
              >
                {isCompleted ? (
                  <Check className="size-3.5 text-primary-foreground" />
                ) : (
                  <Icon
                    className={cn(
                      "size-3.5",
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    )}
                  />
                )}
              </div>
              <div>
                <p
                  className={cn(
                    "text-[13px] font-semibold",
                    isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {title}
                </p>
                <p className="text-[11px] text-muted-foreground">{description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress */}
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

// ── Success screen ──────────────────────────────────────────────
function SuccessScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div
        className="mb-5 flex size-16 items-center justify-center rounded-full"
        style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
      >
        <Check className="size-8 text-white" strokeWidth={2.5} />
      </div>
      <h2 className="mb-2 text-[22px] font-bold text-foreground">Application Submitted!</h2>
      <p className="mb-1 text-[14px] text-muted-foreground">
        Thank you for applying. We've received your application.
      </p>
      <p className="mb-8 text-[13px] text-muted-foreground">
        Our team will review your profile and reach out within 5–7 business days.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-border px-6 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted"
        >
          ← Back to Jobs
        </button>
        <button
          type="button"
          className="rounded-xl px-6 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
        >
          Check Application Status
        </button>
      </div>
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────
export default function JobApplicationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [step1, setStep1] = useState<Step1Data>({ fullName: "", email: "", phone: "" })
  const [step2, setStep2] = useState<Step2Data>({
    jobTitle: "", skills: [], experience: "", resumeFileName: null,
  })
  const [step3, setStep3] = useState<Step3Data>({
    degree: "", school: "", gradYear: "", gpa: "",
  })
  const [step4, setStep4] = useState<Step4Data>({
    linkedin: "", github: "", website: "", twitter: "", extraLinks: [],
  })
  const [step5, setStep5] = useState<Step5Data>({
    coverLetter: "", references: "", consent: false,
  })

  function setS1(field: keyof Step1Data, val: string) {
    setStep1((f) => ({ ...f, [field]: val }))
    setErrors((e) => { const n = { ...e }; delete n[field]; return n })
  }
  function setS3(field: keyof Step3Data, val: string) {
    setStep3((f) => ({ ...f, [field]: val }))
    setErrors((e) => { const n = { ...e }; delete n[field]; return n })
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}

    if (step === 1) {
      if (!step1.fullName.trim()) errs.fullName = "Full name is required."
      if (!step1.email.trim()) errs.email = "Email address is required."
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email))
        errs.email = "Enter a valid email address."
      if (!step1.phone.trim()) errs.phone = "Phone number is required."
    }

    if (step === 2) {
      if (!step2.jobTitle.trim()) errs.jobTitle = "Current role is required."
      if (step2.skills.length === 0) errs.skills = "Add at least one skill."
      if (!step2.experience) errs.experience = "Please select your experience."
      if (!step2.resumeFileName) errs.resumeFileName = "Please upload your resume."
    }

    if (step === 3) {
      if (!step3.degree) errs.degree = "Please select your highest degree."
      if (!step3.school.trim()) errs.school = "School / institution is required."
      if (!step3.gradYear) errs.gradYear = "Please select graduation year."
    }

    if (step === 5) {
      if (!step5.coverLetter.trim()) errs.coverLetter = "Cover letter is required."
      if (!step5.consent) errs.consent = "You must agree to the privacy policy to proceed."
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleNext() {
    if (!validate()) return
    if (step < STEPS.length) {
      setStep((s) => s + 1)
    } else {
      setSubmitted(true)
    }
  }

  const stepLabels: Record<number, string> = {
    1: "Basic Information",
    2: "Professional Details",
    3: "Education",
    4: "Social & Portfolio Links",
    5: "Additional Info & Submission",
  }
  const stepSubtitles: Record<number, string> = {
    1: "Let's start with your personal details.",
    2: "Tell us about your professional background.",
    3: "Share your educational qualifications.",
    4: "Add your online profiles and portfolio — all optional.",
    5: "Final step: cover letter and consent.",
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="flex w-full max-w-[940px] overflow-hidden rounded-2xl bg-card shadow-xl">

        {/* Sidebar */}
        <SidebarStepList current={step} />

        {/* Form area */}
        {submitted ? (
          <SuccessScreen onBack={() => router.push("/apply")} />
        ) : (
          <div className="flex flex-1 flex-col p-8">
            {/* Header */}
            <p className="mb-1 text-[12px] font-semibold uppercase tracking-widest text-primary">
              STEP {step} OF {STEPS.length}
            </p>
            <h1 className="mb-1 text-[24px] font-bold leading-tight tracking-tight text-foreground">
              {stepLabels[step]}
            </h1>
            <p className="mb-6 text-[13px] text-muted-foreground">{stepSubtitles[step]}</p>

            {/* Step content */}
            <div className="flex-1 overflow-y-auto pr-1">
              {step === 1 && (
                <Step1
                  data={step1}
                  errors={errors as Partial<Record<keyof Step1Data, string>>}
                  onChange={setS1}
                  avatarPreview={avatarPreview}
                  onAvatarChange={setAvatarPreview}
                />
              )}
              {step === 2 && (
                <Step2
                  data={step2}
                  errors={errors as Partial<Record<keyof Step2Data, string>>}
                  onChange={(next) => {
                    setStep2((f) => ({ ...f, ...next }))
                    const cleared = Object.keys(next).reduce((acc, k) => {
                      const n = { ...acc }; delete n[k]; return n
                    }, errors)
                    setErrors(cleared)
                  }}
                />
              )}
              {step === 3 && (
                <Step3
                  data={step3}
                  errors={errors as Partial<Record<keyof Step3Data, string>>}
                  onChange={setS3}
                />
              )}
              {step === 4 && (
                <Step4
                  data={step4}
                  onChange={(next) => setStep4((f) => ({ ...f, ...next }))}
                />
              )}
              {step === 5 && (
                <Step5
                  data={step5}
                  errors={errors as Partial<Record<keyof Step5Data, string>>}
                  onChange={(next) => {
                    setStep5((f) => ({ ...f, ...next }))
                    const cleared = Object.keys(next).reduce((acc, k) => {
                      const n = { ...acc }; delete n[k]; return n
                    }, errors)
                    setErrors(cleared)
                  }}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <button
                type="button"
                onClick={() => (step > 1 ? setStep((s) => s - 1) : router.back())}
                className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>

              <div className="flex items-center gap-3">
                {step === 4 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="text-[12px] font-medium text-muted-foreground underline hover:text-foreground"
                  >
                    Skip for now
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl px-7 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
                >
                  {step === STEPS.length ? "Submit Application →" : "Save and continue →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
