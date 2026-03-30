import { api } from "@/lib/api-client"
import type { EmploymentType } from "@/services/employees.service"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OnboardCompanyPayload {
  name: string
  industry?: string
  size?: string
  foundingYear?: number
  website?: string
  logo?: string
  registrationNo?: string
  address?: {
    country?: string
    state?: string
    city?: string
    postalCode?: string
    timezone?: string
  }
}

export interface OnboardEmployeePayload {
  name: string
  email: string
  employeeId: string
  jobTitle?: string
  employmentType?: EmploymentType
  departmentId?: string
  officeLocationId?: string
  phone?: string
  bio?: string
  joinDate?: string
}

export interface BulkOnboardResult {
  succeeded: OnboardEmployeePayload[]
  failed: Array<{ row: OnboardEmployeePayload; reason: string }>
}

export interface AssignRolePayload {
  userId: string
  role: "HR_ADMIN" | "EMPLOYEE"
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractItem<T>(raw: unknown): T {
  const r = raw as Record<string, unknown>
  if (r.data !== undefined) return r.data as T
  return raw as T
}

// ── Service ───────────────────────────────────────────────────────────────────
export const hrAdminService = {
  async onboardCompany(payload: OnboardCompanyPayload) {
    const raw = await api.post<unknown>("/hr-admin/onboard/company", payload)
    return extractItem<{ message: string; data?: unknown }>(raw)
  },

  async onboardEmployee(payload: OnboardEmployeePayload) {
    const raw = await api.post<unknown>("/hr-admin/onboard/employee", payload)
    return extractItem<{ message: string; data?: unknown }>(raw)
  },

  async bulkOnboardEmployees(file: File): Promise<BulkOnboardResult> {
    const formData = new FormData()
    formData.append("file", file)
    const raw = await api.upload<unknown>("/hr-admin/onboard/employees/csv", formData)
    const r = raw as Record<string, unknown>
    if (r.data && typeof r.data === "object") return r.data as BulkOnboardResult
    return raw as BulkOnboardResult
  },

  assignRole(payload: AssignRolePayload): Promise<{ message: string }> {
    return api.patch<{ message: string }>("/hr-admin/onboard/assign-role", payload)
  },
}
