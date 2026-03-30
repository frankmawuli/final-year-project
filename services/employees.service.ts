import { api } from "@/lib/api-client"

// ── Types ─────────────────────────────────────────────────────────────────────

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN"

export interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  jobTitle?: string
  employmentType?: EmploymentType
  departmentId?: string
  department?: { id: string; name: string }
  officeLocationId?: string
  officeLocation?: { id: string; name: string }
  phone?: string
  bio?: string
  joinDate?: string
  endDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateEmployeePayload {
  employeeId?: string
  departmentId?: string
  officeLocationId?: string
  jobTitle?: string
  employmentType?: EmploymentType
  phone?: string
  bio?: string
  joinDate?: string
  endDate?: string
  isActive?: boolean
}

export interface Skill {
  id: string
  skill: string
  level?: string
  employeeId: string
}

export interface AddSkillPayload {
  skill: string
  level?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractList<T>(raw: unknown): T[] {
  const r = raw as Record<string, unknown>
  if (Array.isArray(r)) return r as T[]
  if (Array.isArray(r.data)) return r.data as T[]
  return []
}

function extractItem<T>(raw: unknown): T {
  const r = raw as Record<string, unknown>
  if (r.data !== undefined) return r.data as T
  return raw as T
}

// ── Service ───────────────────────────────────────────────────────────────────
export const employeesService = {
  async getAll(): Promise<Employee[]> {
    const raw = await api.get<unknown>("/employee-management/employees")
    return extractList<Employee>(raw)
  },

  async getById(id: string): Promise<Employee> {
    const raw = await api.get<unknown>(`/employee-management/employees/${id}`)
    return extractItem<Employee>(raw)
  },

  async update(id: string, payload: UpdateEmployeePayload): Promise<Employee> {
    const raw = await api.patch<unknown>(`/employee-management/employees/${id}`, payload)
    return extractItem<Employee>(raw)
  },

  async deactivate(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/employee-management/employees/${id}`)
  },

  // ── Skills ──────────────────────────────────────────────────────────────
  async getSkills(employeeId: string): Promise<Skill[]> {
    const raw = await api.get<unknown>(`/employee-management/employees/${employeeId}/skills`)
    return extractList<Skill>(raw)
  },

  async addSkill(employeeId: string, payload: AddSkillPayload): Promise<Skill> {
    const raw = await api.post<unknown>(
      `/employee-management/employees/${employeeId}/skills`,
      payload,
    )
    return extractItem<Skill>(raw)
  },

  async updateSkill(
    employeeId: string,
    skillId: string,
    payload: AddSkillPayload,
  ): Promise<Skill> {
    const raw = await api.patch<unknown>(
      `/employee-management/employees/${employeeId}/skills/${skillId}`,
      payload,
    )
    return extractItem<Skill>(raw)
  },

  deleteSkill(employeeId: string, skillId: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(
      `/employee-management/employees/${employeeId}/skills/${skillId}`,
    )
  },
}
