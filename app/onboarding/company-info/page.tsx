"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, Globe, Linkedin, X as XIcon, ChevronDown, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Constants ─────────────────────────────────────────────────
const TOTAL_STEPS = 7
const CURRENT_STEP = 1

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance & Banking",
  "Education",
  "Retail & E-commerce",
  "Manufacturing",
  "Media & Entertainment",
  "Consulting",
  "Real Estate",
  "Transportation & Logistics",
  "Energy & Utilities",
  "Legal Services",
  "Non-profit",
  "Agriculture",
  "Construction",
  "Hospitality & Tourism",
  "Telecommunications",
  "Pharmaceuticals",
  "Automotive",
  "Aerospace & Defense",
  "Fashion & Apparel",
  "Food & Beverage",
  "Sports & Recreation",
  "Government & Public Sector",
  "Other",
]

const COMPANY_SIZES = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–500 employees",
  "501–1,000 employees",
  "1,001–5,000 employees",
  "5,000+ employees",
]

// ── Field helpers ─────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[14px] text-[#3a3541]">
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
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
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  prefix?: React.ReactNode
  error?: string
}) {
  return (
    <div>
      <div
        className={cn(
          "flex h-[46px] items-center overflow-hidden rounded-lg border bg-[#f4f5f9]",
          error ? "border-rose-400" : "border-[#dbdcde] focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/20"
        )}
      >
        {prefix && (
          <div className="flex shrink-0 items-center border-r border-[#dbdcde] px-3 text-[#89868d]">
            {prefix}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full flex-1 bg-transparent px-3.5 text-[14px] text-[#3a3541] outline-none placeholder:text-[#89868d]"
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
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
          "relative flex h-[46px] items-center overflow-hidden rounded-lg border bg-[#f4f5f9]",
          error ? "border-rose-400" : "border-[#dbdcde] focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/20"
        )}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full appearance-none bg-transparent px-3.5 text-[14px] text-[#3a3541] outline-none"
          style={{ color: value ? "#3a3541" : "#89868d" }}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 size-4 text-[#89868d]" />
      </div>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  )
}

// ── Logo upload ───────────────────────────────────────────────
function LogoUpload({
  preview,
  onChange,
}: {
  preview: string | null
  onChange: (url: string | null, file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return
    const url = URL.createObjectURL(file)
    onChange(url, file)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
      className={cn(
        "flex h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors",
        dragging
          ? "border-[#2563eb] bg-blue-50"
          : "border-[#dbdcde] bg-[#f4f5f9] hover:border-[#2563eb] hover:bg-blue-50/40"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {preview ? (
        <div className="relative flex size-full items-center justify-center">
          <img src={preview} alt="Logo preview" className="h-full max-h-[100px] w-auto rounded object-contain p-2" />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(null, null) }}
            className="absolute right-2 top-2 rounded-full bg-white p-1 shadow"
          >
            <XIcon className="size-3.5 text-[#89868d]" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-sm">
            <Upload className="size-5 text-[#2563eb]" />
          </div>
          <p className="text-center text-[13px] text-[#89868d]">
            <span className="font-medium text-[#2563eb]">Click to upload</span> or drag and drop
          </p>
          <p className="text-[11px] text-[#89868d]">PNG, JPG or SVG (max 2 MB)</p>
        </>
      )}
    </div>
  )
}

// ── Step indicator ────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const isActive    = step === current
        const isCompleted = step < current
        const isLast      = step === total
        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold tracking-tight",
                isActive || isCompleted ? "bg-[#2563eb] text-white" : "bg-[#d1d5db] text-[#4b5563]"
              )}
            >
              {step}
            </div>
            {!isLast && (
              <div className={cn("mx-1 h-0.5 w-[87px]", isCompleted ? "bg-[#2563eb]" : "bg-[#d1d5db]")} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
interface FormData {
  companyName: string
  industry:    string
  companySize: string
  website:     string
  linkedin:    string
  twitter:     string
}

export default function CompanyInfoPage() {
  const router = useRouter()

  const [form, setForm] = useState<FormData>({
    companyName: "",
    industry:    "",
    companySize: "",
    website:     "",
    linkedin:    "",
    twitter:     "",
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [errors, setErrors]           = useState<Partial<Record<keyof FormData, string>>>({})

  function set(field: keyof FormData) {
    return (val: string) => {
      setForm((f) => ({ ...f, [field]: val }))
      setErrors((e) => ({ ...e, [field]: undefined }))
    }
  }

  function validate(): boolean {
    const errs: typeof errors = {}
    if (!form.companyName.trim()) errs.companyName = "Company name is required."
    if (!form.industry)           errs.industry    = "Please select an industry."
    if (!form.companySize)        errs.companySize = "Please select a company size."
    if (form.website && !/^https?:\/\/.+/.test(form.website))
      errs.website = "Enter a valid URL starting with https://"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleContinue() {
    if (validate()) {
      // In a real app, persist form data then navigate to step 2
      router.push("/dashboard/hr")
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-[1152px] px-6 py-12">

        {/* Step indicator */}
        <div className="mb-12">
          <StepIndicator current={CURRENT_STEP} total={TOTAL_STEPS} />
        </div>

        {/* Form card */}
        <div className="mx-auto max-w-[680px]">
          {/* Heading */}
          <h1 className="mb-1 text-[30px] font-semibold leading-tight tracking-[-0.5px] text-[#111827]">
            Company Info
          </h1>
          <p className="mb-8 text-[16px] leading-6 tracking-[-0.5px] text-[#6b7280]">
            Tell us about your company
          </p>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6">

              {/* Company Name */}
              <div>
                <Label required>Company Name</Label>
                <TextInput
                  value={form.companyName}
                  onChange={set("companyName")}
                  placeholder="e.g. Acme Corporation"
                  error={errors.companyName}
                />
              </div>

              {/* Company Logo */}
              <div>
                <Label>Company Logo</Label>
                <LogoUpload
                  preview={logoPreview}
                  onChange={(url) => setLogoPreview(url)}
                />
              </div>

              {/* Industry + Company Size */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label required>Industry</Label>
                  <SelectInput
                    value={form.industry}
                    onChange={set("industry")}
                    placeholder="Select industry"
                    options={INDUSTRIES}
                    error={errors.industry}
                  />
                </div>
                <div>
                  <Label required>Company Size</Label>
                  <SelectInput
                    value={form.companySize}
                    onChange={set("companySize")}
                    placeholder="Select size"
                    options={COMPANY_SIZES}
                    error={errors.companySize}
                  />
                </div>
              </div>

              {/* Company Website */}
              <div>
                <Label>Company Website</Label>
                <TextInput
                  value={form.website}
                  onChange={set("website")}
                  placeholder="https://yourcompany.com"
                  type="url"
                  prefix={<Globe className="size-4" />}
                  error={errors.website}
                />
              </div>

              {/* Social links */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label>LinkedIn Page</Label>
                  <TextInput
                    value={form.linkedin}
                    onChange={set("linkedin")}
                    placeholder="linkedin.com/company/..."
                    prefix={<Linkedin className="size-4" />}
                  />
                </div>
                <div>
                  <Label>X (Twitter) Page</Label>
                  <TextInput
                    value={form.twitter}
                    onChange={set("twitter")}
                    placeholder="x.com/yourcompany"
                    prefix={
                      <span className="text-[13px] font-bold leading-none">𝕏</span>
                    }
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-sm font-medium text-[#6b7280] hover:text-[#111827]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="rounded-xl bg-[#2563eb] px-8 py-3 text-sm font-semibold text-white shadow-[0px_4px_6px_rgba(37,99,235,0.3)] hover:bg-[#1d4ed8]"
                >
                  Continue →
                </button>
              </div>

            </div>
          </div>

          {/* Step label */}
          <p className="mt-4 text-center text-sm text-[#6b7280]">
            Step {CURRENT_STEP} of {TOTAL_STEPS} — Company Information
          </p>
        </div>
      </div>
    </div>
  )
}
