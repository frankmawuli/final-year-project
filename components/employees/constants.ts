import type { EmploymentType } from "@/services/employee.service"

export const CARDS_PER_PAGE = 6

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT:  "Contract",
  INTERN:    "Intern",
}
export const EMPLOYMENT_TYPE_OPTIONS = Object.values(EMPLOYMENT_TYPE_LABELS)

export const STATUS_OPTIONS = ["Active", "Inactive"] as const

export const sidebarNav = [
  { label: "Employees",   href: "/dashboard/hr/employees",   active: true  },
  { label: "Departments", href: "/dashboard/hr/departments", active: false },
  { label: "Leave",       href: "/dashboard/hr/leave",       active: false },
  { label: "Payroll",     href: "/dashboard/hr/payroll",     active: false },
  { label: "History",     href: "#",                         active: false },
]
