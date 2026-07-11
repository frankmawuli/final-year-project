import type {
  ApiJobType, ApiJobLevel, ApiJobWorkLocation,
  PublicJobType, PublicJobArrangement, PublicJobLevel, PublicJobStatus,
} from "@/services/jobs.service"

export const TYPE_LABEL: Record<ApiJobType, string> = {
  FULL_TIME: "Full-time", PART_TIME: "Part-time", CONTRACT: "Contract", INTERNSHIP: "Internship",
}
export const LEVEL_LABEL: Record<ApiJobLevel, string> = {
  JUNIOR: "Junior", MID_LEVEL: "Mid-level", SENIOR: "Senior", LEAD: "Lead", EXECUTIVE: "Executive",
}
export const LOCATION_LABEL: Record<ApiJobWorkLocation, string> = {
  REMOTE: "Remote", ON_SITE: "On-site", HYBRID: "Hybrid",
}
export const STATUS_LABEL = { OPEN: "Open", CLOSED: "Closed", DRAFT: "Draft" } as const

export const TYPE_API = Object.fromEntries(
  Object.entries(TYPE_LABEL).map(([k, v]) => [v, k as ApiJobType]),
) as Record<string, ApiJobType>

export const LEVEL_API = Object.fromEntries(
  Object.entries(LEVEL_LABEL).map(([k, v]) => [v, k as ApiJobLevel]),
) as Record<string, ApiJobLevel>

export const LOCATION_API = Object.fromEntries(
  Object.entries(LOCATION_LABEL).map(([k, v]) => [v, k as ApiJobWorkLocation]),
) as Record<string, ApiJobWorkLocation>

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"]
export const LOCATIONS  = ["Remote", "On-site", "Hybrid"]
export const LEVELS     = ["Junior", "Mid-level", "Senior", "Lead", "Executive"]

export const fieldCls = "h-10 w-full rounded-xl border border-border bg-muted/50 px-2.5 text-xs text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
export const areaCls  = "w-full resize-none rounded-xl border border-border bg-muted/50 px-2.5 py-2 text-xs text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"

// ── Public API label maps ──────────────────────────────────────────────────────
export const PUBLIC_TYPE_LABEL: Record<PublicJobType, string> = {
  full_time: "Full-time", part_time: "Part-time", contract: "Contract", internship: "Internship",
}
export const PUBLIC_LEVEL_LABEL: Record<PublicJobLevel, string> = {
  junior: "Junior", mid: "Mid-level", senior: "Senior", lead: "Lead", executive: "Executive",
}
export const PUBLIC_LOCATION_LABEL: Record<PublicJobArrangement, string> = {
  remote: "Remote", on_site: "On-site", hybrid: "Hybrid",
}
export const PUBLIC_STATUS_LABEL: Record<PublicJobStatus, string> = {
  active: "Open", closed: "Closed", draft: "Draft",
}

export function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return "Not specified"
  const fmt = (n: number) => (n >= 1000 ? `₵${Math.round(n / 1000)}k` : `₵${n}`)
  if (min && max) return `${fmt(min)}–${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max!)}`
}
