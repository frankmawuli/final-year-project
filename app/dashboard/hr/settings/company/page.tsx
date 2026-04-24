"use client"

import { useState, useRef } from "react"
import { Building2, XCircle, Upload, ChevronDown, Clock, MapPin, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Constants ─────────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const locTypeBadge: Record<string, string> = {
  HQ:     "bg-[#ede9fe] text-[#7c3aed]",
  Office: "bg-[#dbeafe] text-[#2563eb]",
  Branch: "bg-[#fef3c7] text-[#d97706]",
  Remote: "bg-[#dcfce7] text-[#16a34a]",
}

// ── Shared primitives ─────────────────────────────────────────
function Card({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string
  subtitle: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6]">
          <Icon className="size-4 text-[#6b7280]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#111827]">{title}</p>
          <p className="text-xs text-[#9ca3af]">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function Divider() {
  return <hr className="my-4 border-[#f3f4f6]" />
}

function SaveRow({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end pt-2">
      <button
        onClick={onSave}
        className="rounded-xl bg-[#5e81f4] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4c6ef5]"
      >
        Save changes
      </button>
    </div>
  )
}

// ── Shared style strings ──────────────────────────────────────
const inputCls =
  "w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5 text-sm text-[#111827] outline-none placeholder:text-[#d1d5db] focus:border-[#5e81f4] focus:bg-white focus:ring-2 focus:ring-[#5e81f4]/10"

const selectCls =
  "w-full appearance-none rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5 pr-9 text-sm text-[#111827] outline-none focus:border-[#5e81f4] focus:bg-white focus:ring-2 focus:ring-[#5e81f4]/10"

// ── Page ──────────────────────────────────────────────────────
export default function CompanySettings() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [website,     setWebsite]     = useState("")
  const [industry,    setIndustry]    = useState("Technology")
  const [companySize, setCompanySize] = useState("11–50")
  const [timezone,    setTimezone]    = useState("UTC+0 — London")
  const [currency,    setCurrency]    = useState("USD — US Dollar")
  const [fiscalYear,  setFiscalYear]  = useState("January")
  const [dateFormat,  setDateFormat]  = useState("DD/MM/YYYY")
  const [workStart,   setWorkStart]   = useState("09:00")
  const [workEnd,     setWorkEnd]     = useState("17:00")
  const [workDays,    setWorkDays]    = useState(["Mon", "Tue", "Wed", "Thu", "Fri"])
  const [locations,   setLocations]   = useState<{ id: string; name: string; type: string }[]>([])
  const [newLocName,  setNewLocName]  = useState("")
  const [newLocType,  setNewLocType]  = useState("Office")
  const fileRef = useRef<HTMLInputElement>(null)

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function toggleDay(d: string) {
    setWorkDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  function addLocation() {
    if (!newLocName.trim()) return
    setLocations(prev => [...prev, { id: crypto.randomUUID(), name: newLocName.trim(), type: newLocType }])
    setNewLocName("")
  }

  function removeLocation(id: string) {
    setLocations(prev => prev.filter(l => l.id !== id))
  }

  function onSave() {
    // TODO: persist settings
  }

  return (
    <div className="flex flex-col gap-6">
      <Card title="Company Profile" subtitle="Public-facing identity of your organisation" icon={Building2}>
        {/* Logo */}
        <div className="mb-5 flex items-center gap-5">
          <div className="relative">
            <div className={cn(
              "flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#e5e7eb] bg-[#f9fafb]",
              logoPreview && "border-solid border-[#5e81f4]"
            )}>
              {logoPreview
                ? <img src={logoPreview} alt="Logo" className="size-full object-cover" />
                : <Building2 className="size-7 text-[#d1d5db]" />
              }
            </div>
            {logoPreview && (
              <button
                onClick={() => setLogoPreview(null)}
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-rose-500 text-white shadow"
              >
                <XCircle className="size-3.5" />
              </button>
            )}
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-[#374151]">Company Logo</p>
            <p className="mb-2.5 text-xs text-[#9ca3af]">PNG or SVG recommended · max 2 MB · 200×200 px</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-semibold text-[#374151] shadow-sm hover:bg-[#f9fafb]"
            >
              <Upload className="size-3.5" />
              Upload logo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".png,.svg,.jpg,.jpeg"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Company Name</label>
              <input
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className={inputCls}
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Website</label>
              <input
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className={inputCls}
                placeholder="https://"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Industry</label>
              <div className="relative">
                <select value={industry} onChange={e => setIndustry(e.target.value)} className={selectCls}>
                  {["Technology","Finance","Healthcare","Education","Retail","Manufacturing","Consulting","Other"].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Company Size</label>
              <div className="relative">
                <select value={companySize} onChange={e => setCompanySize(e.target.value)} className={selectCls}>
                  {["1–10","11–50","51–200","201–500","501–1000","1000+"].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Timezone</label>
              <div className="relative">
                <select value={timezone} onChange={e => setTimezone(e.target.value)} className={selectCls}>
                  {[
                    "UTC-8 — Los Angeles", "UTC-5 — New York",
                    "UTC+0 — London",      "UTC+1 — Lagos",
                    "UTC+1 — Accra",       "UTC+3 — Nairobi",
                    "UTC+5:30 — Mumbai",   "UTC+8 — Singapore",
                  ].map(v => <option key={v}>{v}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Currency</label>
              <div className="relative">
                <select value={currency} onChange={e => setCurrency(e.target.value)} className={selectCls}>
                  {[
                    "USD — US Dollar", "EUR — Euro", "GBP — British Pound",
                    "GHS — Ghanaian Cedi", "NGN — Nigerian Naira",
                    "KES — Kenyan Shilling", "INR — Indian Rupee",
                  ].map(v => <option key={v}>{v}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Fiscal Year Start</label>
              <div className="relative">
                <select value={fiscalYear} onChange={e => setFiscalYear(e.target.value)} className={selectCls}>
                  {["January","February","March","April","May","June","July","August","September","October","November","December"].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Date Format</label>
              <div className="relative">
                <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className={selectCls}>
                  {["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD","DD MMM YYYY"].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Working Hours" subtitle="Standard schedule applied across the organisation" icon={Clock}>
        <div className="flex flex-col gap-5">
          {/* Time pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Work Start</label>
              <input
                type="time"
                value={workStart}
                onChange={e => setWorkStart(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Work End</label>
              <input
                type="time"
                value={workEnd}
                onChange={e => setWorkEnd(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Duration chip */}
          {workStart && workEnd && (() => {
            const [sh, sm] = workStart.split(":").map(Number)
            const [eh, em] = workEnd.split(":").map(Number)
            const mins = (eh * 60 + em) - (sh * 60 + sm)
            if (mins <= 0) return null
            const h = Math.floor(mins / 60), m = mins % 60
            return (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#f0fdf4] px-3 py-1 text-xs font-semibold text-[#16a34a]">
                  {h > 0 ? `${h}h ` : ""}{m > 0 ? `${m}m` : ""} working day
                </span>
              </div>
            )
          })()}

          <Divider />

          {/* Day toggles */}
          <div>
            <p className="mb-2.5 text-xs font-medium text-[#374151]">Working Days</p>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(d => {
                const active = workDays.includes(d)
                return (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={cn(
                      "flex h-9 w-12 items-center justify-center rounded-xl text-xs font-semibold transition-all",
                      active
                        ? "bg-[#5e81f4] text-white shadow-sm"
                        : "border border-[#e5e7eb] bg-white text-[#9ca3af] hover:border-[#5e81f4] hover:text-[#5e81f4]"
                    )}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-xs text-[#9ca3af]">
              {workDays.length > 0
                ? `${workDays.length} day${workDays.length !== 1 ? "s" : ""} selected`
                : "No working days selected"}
            </p>
          </div>
        </div>
      </Card>

      <Card title="Office Locations" subtitle="Physical and remote locations your company operates from" icon={MapPin}>
        <div className="flex flex-col gap-3">
          {/* List */}
          {locations.length > 0 ? (
            <div className="flex flex-col gap-2">
              {locations.map(loc => (
                <div
                  key={loc.id}
                  className="flex items-center gap-3 rounded-xl border border-[#f3f4f6] bg-[#f9fafb] px-4 py-3"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    <MapPin className="size-3.5 text-[#6b7280]" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-[#111827]">{loc.name}</span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", locTypeBadge[loc.type] ?? "bg-muted text-muted-foreground")}>
                    {loc.type}
                  </span>
                  <button
                    onClick={() => removeLocation(loc.id)}
                    className="ml-1 rounded-lg p-1.5 text-[#9ca3af] transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-[#e5e7eb] py-8 text-center">
              <MapPin className="mb-2 size-6 text-[#d1d5db]" />
              <p className="text-xs text-[#9ca3af]">No locations added yet</p>
            </div>
          )}

          {/* Add row */}
          <div className="flex items-center gap-2 pt-1">
            <input
              value={newLocName}
              onChange={e => setNewLocName(e.target.value)}
              placeholder="City, Country"
              className={cn(inputCls, "flex-1")}
              onKeyDown={e => { if (e.key === "Enter") addLocation() }}
            />
            <div className="relative shrink-0">
              <select
                value={newLocType}
                onChange={e => setNewLocType(e.target.value)}
                className={cn(selectCls, "w-28 pr-7")}
              >
                {["HQ","Office","Branch","Remote"].map(t => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
            </div>
            <button
              onClick={addLocation}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-xs font-semibold text-[#374151] shadow-sm hover:bg-[#f9fafb]"
            >
              <Plus className="size-3.5" />
              Add
            </button>
          </div>
        </div>
      </Card>

      <SaveRow onSave={onSave} />
    </div>
  )
}
