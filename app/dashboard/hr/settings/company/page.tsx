"use client"

import { useState, useRef } from "react"
import { Building2, XCircle, Upload, ChevronDown, Clock, MapPin, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { uploadService } from "@/services/upload.service"

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
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function Divider() {
  return <hr className="my-3 border-border" />
}

function SaveRow({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end pt-1.5">
      <button
        onClick={onSave}
        className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
      >
        Save changes
      </button>
    </div>
  )
}

// ── Shared style strings ──────────────────────────────────────
const inputCls =
  "w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 bg-transparent"

const selectCls =
  "w-full appearance-none rounded-xl border border-border bg-muted/50 px-3 py-2 pr-7 text-xs text-foreground outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 bg-transparent"

// ── Page ──────────────────────────────────────────────────────
export default function CompanySettings() {
  const { accessToken } = useAuth()
  const [logoPreview,     setLogoPreview]     = useState<string | null>(null)
  const [logoUrl,         setLogoUrl]         = useState<string | null>(null)
  const [logoUploading,   setLogoUploading]   = useState(false)
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null)
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

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoPreview(URL.createObjectURL(file))
    setLogoUploadError(null)
    setLogoUploading(true)
    try {
      const result = await uploadService.image(file, accessToken ?? "")
      setLogoUrl(result.url)
      setLogoPreview(result.url)
    } catch {
      setLogoUploadError("Logo upload failed. Please try again.")
    } finally {
      setLogoUploading(false)
    }
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
    <div className="flex flex-col gap-5">
      <Card title="Company Profile" subtitle="Public-facing identity of your organisation" icon={Building2}>
        {/* Logo */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative">
            <div className={cn(
              "flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/50",
              logoPreview && "border-solid border-primary"
            )}>
              {logoPreview
                ? <img src={logoPreview} alt="Logo" className="size-full object-cover" />
                : <Building2 className="size-7 text-muted-foreground/40" />
              }
            </div>
            {logoPreview && (
              <button
                onClick={() => { setLogoPreview(null); setLogoUrl(null) }}
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-rose-500 text-white shadow"
              >
                <XCircle className="size-3.5" />
              </button>
            )}
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-foreground">Company Logo</p>
            <p className="mb-2 text-xs text-muted-foreground">PNG or JPG · max 5 MB · 200×200 px</p>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={logoUploading}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-muted/50 disabled:opacity-60"
            >
              <Upload className="size-3.5" />
              {logoUploading ? "Uploading…" : "Upload logo"}
            </button>
            {logoUploadError && (
              <p className="mt-1 text-xs text-rose-500">{logoUploadError}</p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Company Name</label>
              <input
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className={inputCls}
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Website</label>
              <input
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className={inputCls}
                placeholder="https://"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Industry</label>
              <div className="relative">
                <select value={industry} onChange={e => setIndustry(e.target.value)} className={selectCls}>
                  {["Technology","Finance","Healthcare","Education","Retail","Manufacturing","Consulting","Other"].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Company Size</label>
              <div className="relative">
                <select value={companySize} onChange={e => setCompanySize(e.target.value)} className={selectCls}>
                  {["1–10","11–50","51–200","201–500","501–1000","1000+"].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Timezone</label>
              <div className="relative">
                <select value={timezone} onChange={e => setTimezone(e.target.value)} className={selectCls}>
                  {[
                    "UTC-8 — Los Angeles", "UTC-5 — New York",
                    "UTC+0 — London",      "UTC+1 — Lagos",
                    "UTC+1 — Accra",       "UTC+3 — Nairobi",
                    "UTC+5:30 — Mumbai",   "UTC+8 — Singapore",
                  ].map(v => <option key={v}>{v}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Currency</label>
              <div className="relative">
                <select value={currency} onChange={e => setCurrency(e.target.value)} className={selectCls}>
                  {[
                    "USD — US Dollar", "EUR — Euro", "GBP — British Pound",
                    "GHS — Ghanaian Cedi", "NGN — Nigerian Naira",
                    "KES — Kenyan Shilling", "INR — Indian Rupee",
                  ].map(v => <option key={v}>{v}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Fiscal Year Start</label>
              <div className="relative">
                <select value={fiscalYear} onChange={e => setFiscalYear(e.target.value)} className={selectCls}>
                  {["January","February","March","April","May","June","July","August","September","October","November","December"].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Date Format</label>
              <div className="relative">
                <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className={selectCls}>
                  {["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD","DD MMM YYYY"].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Working Hours" subtitle="Standard schedule applied across the organisation" icon={Clock}>
        <div className="flex flex-col gap-4">
          {/* Time pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Work Start</label>
              <input
                type="time"
                value={workStart}
                onChange={e => setWorkStart(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Work End</label>
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
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {h > 0 ? `${h}h ` : ""}{m > 0 ? `${m}m` : ""} working day
                </span>
              </div>
            )
          })()}

          <Divider />

          {/* Day toggles */}
          <div>
            <p className="mb-2 text-xs font-medium text-foreground">Working Days</p>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map(d => {
                const active = workDays.includes(d)
                return (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={cn(
                      "flex h-9 w-12 items-center justify-center rounded-xl text-xs font-semibold transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
                    )}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {workDays.length > 0
                ? `${workDays.length} day${workDays.length !== 1 ? "s" : ""} selected`
                : "No working days selected"}
            </p>
          </div>
        </div>
      </Card>

      <Card title="Office Locations" subtitle="Physical and remote locations your company operates from" icon={MapPin}>
        <div className="flex flex-col gap-2.5">
          {/* List */}
          {locations.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {locations.map(loc => (
                <div
                  key={loc.id}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/50 px-3 py-2.5"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
                    <MapPin className="size-3.5 text-muted-foreground" />
                  </div>
                  <span className="flex-1 text-xs font-medium text-foreground">{loc.name}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", locTypeBadge[loc.type] ?? "bg-muted text-muted-foreground")}>
                    {loc.type}
                  </span>
                  <button
                    onClick={() => removeLocation(loc.id)}
                    className="ml-1 rounded-lg p-1 text-muted-foreground transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-6 text-center">
              <MapPin className="mb-1.5 size-6 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">No locations added yet</p>
            </div>
          )}

          {/* Add row */}
          <div className="flex items-center gap-1.5 pt-1">
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
                className={cn(selectCls, "w-28 pr-6")}
              >
                {["HQ","Office","Branch","Remote"].map(t => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
            <button
              onClick={addLocation}
              className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-muted/50"
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
