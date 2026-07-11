import { Building2, XCircle, Upload, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, Divider } from "./settings-primitives"
import { inputCls, selectCls } from "./constants"
import type { CompanyProfileData } from "./types"

export function CompanyProfileCard({
  data,
  onChange,
  logoPreview,
  logoUploading,
  logoUploadError,
  onLogoChange,
  onLogoRemove,
  fileRef,
}: {
  data: CompanyProfileData
  onChange: <K extends keyof CompanyProfileData>(field: K, value: CompanyProfileData[K]) => void
  logoPreview: string | null
  logoUploading: boolean
  logoUploadError: string | null
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onLogoRemove: () => void
  fileRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
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
              onClick={onLogoRemove}
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
            onChange={onLogoChange}
          />
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Company Name</label>
            <input
              value={data.companyName}
              onChange={e => onChange("companyName", e.target.value)}
              className={inputCls}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Website</label>
            <input
              value={data.website}
              onChange={e => onChange("website", e.target.value)}
              className={inputCls}
              placeholder="https://"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Industry</label>
            <div className="relative">
              <select value={data.industry} onChange={e => onChange("industry", e.target.value)} className={selectCls}>
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
              <select value={data.companySize} onChange={e => onChange("companySize", e.target.value)} className={selectCls}>
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
              <select value={data.timezone} onChange={e => onChange("timezone", e.target.value)} className={selectCls}>
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
              <select value={data.currency} onChange={e => onChange("currency", e.target.value)} className={selectCls}>
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
              <select value={data.fiscalYear} onChange={e => onChange("fiscalYear", e.target.value)} className={selectCls}>
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
              <select value={data.dateFormat} onChange={e => onChange("dateFormat", e.target.value)} className={selectCls}>
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
  )
}
