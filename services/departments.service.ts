import { api } from "@/lib/api-client"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Department {
  id: string
  name: string
  description?: string
  companyId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDepartmentPayload {
  name: string
  description?: string
}

export interface OfficeLocation {
  id: string
  name: string
  address?: string
  city?: string
  country?: string
  companyId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOfficeLocationPayload {
  name: string
  address?: string
  city?: string
  country?: string
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

// ── Departments ───────────────────────────────────────────────────────────────
export const departmentsService = {
  async getAll(): Promise<Department[]> {
    const raw = await api.get<unknown>("/employee-management/departments")
    return extractList<Department>(raw)
  },

  async getById(id: string): Promise<Department> {
    const raw = await api.get<unknown>(`/employee-management/departments/${id}`)
    return extractItem<Department>(raw)
  },

  async create(payload: CreateDepartmentPayload): Promise<Department> {
    const raw = await api.post<unknown>("/employee-management/departments", payload)
    return extractItem<Department>(raw)
  },

  async update(id: string, payload: Partial<CreateDepartmentPayload>): Promise<Department> {
    const raw = await api.patch<unknown>(`/employee-management/departments/${id}`, payload)
    return extractItem<Department>(raw)
  },

  delete(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/employee-management/departments/${id}`)
  },
}

// ── Office Locations ──────────────────────────────────────────────────────────
export const officeLocationsService = {
  async getAll(): Promise<OfficeLocation[]> {
    const raw = await api.get<unknown>("/employee-management/office-locations")
    return extractList<OfficeLocation>(raw)
  },

  async getById(id: string): Promise<OfficeLocation> {
    const raw = await api.get<unknown>(`/employee-management/office-locations/${id}`)
    return extractItem<OfficeLocation>(raw)
  },

  async create(payload: CreateOfficeLocationPayload): Promise<OfficeLocation> {
    const raw = await api.post<unknown>("/employee-management/office-locations", payload)
    return extractItem<OfficeLocation>(raw)
  },

  async update(
    id: string,
    payload: Partial<CreateOfficeLocationPayload>,
  ): Promise<OfficeLocation> {
    const raw = await api.patch<unknown>(
      `/employee-management/office-locations/${id}`,
      payload,
    )
    return extractItem<OfficeLocation>(raw)
  },

  delete(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/employee-management/office-locations/${id}`)
  },
}
