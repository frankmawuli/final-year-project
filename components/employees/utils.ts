import type { ApiEmployee } from "@/services/employee.service"
import type { Employee } from "@/components/employees/types"

export function generateEmpId(): string {
  return `EMP-${Math.floor(2500 + Math.random() * 500)}`
}

export function formatJoinDate(iso: string | null | undefined): string {
  if (!iso) return ""
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
  } catch {
    return iso
  }
}

export function mapEmployee(a: ApiEmployee): Employee {
  return {
    id:             a.id,
    empId:          a.employeeId,
    name:           a.user?.name ?? a.employeeId,
    photo:          a.user?.avatarUrl ?? null,
    role:           a.jobTitle ?? "",
    department:     a.department?.name ?? "",
    email:          a.user?.email ?? "",
    phone:          a.phone ?? "",
    location:       a.officeLocation?.city ?? a.officeLocation?.name ?? "",
    joinDate:       formatJoinDate(a.joinDate),
    joinDateIso:    a.joinDate ? a.joinDate.slice(0, 10) : "",
    bio:            a.bio ?? "",
    skills:         (a.skills ?? []).map((s) => (typeof s === "string" ? s : s.name)),
    isActive:       a.isActive,
    employmentType: a.employmentType ?? null,
  }
}
