import type { PublicJobType, PublicJobLevel } from "@/services/jobs.service"

export type FilterItem = {
  label:   string
  count:   number
  checked: boolean
}

export const EMPLOYMENT_TYPES: Omit<FilterItem, "checked">[] = [
  { label: "Full Time",  count: 0 },
  { label: "Part Time",  count: 0 },
  { label: "Contract",   count: 0 },
  { label: "Internship", count: 0 },
]

export const SENIORITY_LEVELS: Omit<FilterItem, "checked">[] = [
  { label: "Junior",    count: 0 },
  { label: "Mid Level", count: 0 },
  { label: "Senior",    count: 0 },
  { label: "Lead",      count: 0 },
  { label: "Executive", count: 0 },
]

export const EMPLOYMENT_MAP: Record<string, PublicJobType> = {
  "Full Time":  "full_time",
  "Part Time":  "part_time",
  "Contract":   "contract",
  "Internship": "internship",
}

export const SENIORITY_MAP: Record<string, PublicJobLevel[]> = {
  "Junior":    ["junior"],
  "Mid Level": ["mid"],
  "Senior":    ["senior"],
  "Lead":      ["lead"],
  "Executive": ["executive"],
}
