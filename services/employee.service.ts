import { api } from "@/lib/api-client"

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN"

export interface ApiEmployee {
  id: number
  employeeId: string
  jobTitle: string | null
  employmentType: EmploymentType | null
  isActive: boolean
  joinDate: string | null
  phone: string | null
  bio: string | null
  user: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
    status: string
    role: string
    lastLoginAt?: string
  } | null
  department: { id: number; name: string } | null
  officeLocation: { id: number; name: string; city: string } | null
  skills: Array<string | { id?: number; name: string }>
  leaveRequests?: unknown[]
}

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export const employeeService = {
  list: (
    params: {
      search?: string
      departmentId?: number
      employmentType?: EmploymentType
      isActive?: boolean
      page?: number
      limit?: number
    } = {},
    token: string,
  ) => {
    const qs = new URLSearchParams()
    if (params.search)                    qs.set("search",         params.search)
    if (params.departmentId !== undefined) qs.set("departmentId",   String(params.departmentId))
    if (params.employmentType)            qs.set("employmentType",  params.employmentType)
    if (params.isActive !== undefined)    qs.set("isActive",        String(params.isActive))
    if (params.page)                      qs.set("page",            String(params.page))
    if (params.limit)                     qs.set("limit",           String(params.limit))
    const q = qs.toString()
    return api.get<{ success: boolean; data: ApiEmployee[]; meta: PaginationMeta }>(
      `/employees${q ? `?${q}` : ""}`,
      { Authorization: `Bearer ${token}` },
    )
  },

  get: (id: number, token: string) =>
    api.get<{ success: boolean; data: ApiEmployee }>(`/employees/${id}`, {
      Authorization: `Bearer ${token}`,
    }),

  create: (
    body: {
      name: string
      email: string
      employeeId: string
      jobTitle?: string
      employmentType?: EmploymentType
      departmentId?: number
      officeLocationId?: number
      phone?: string
      bio?: string
      joinDate?: string
    },
    token: string,
  ) =>
    api.post<{ success: boolean; data: ApiEmployee }>("/employees", body, {
      Authorization: `Bearer ${token}`,
    }),

  update: (
    id: string | number,
    body: {
      employeeId?: string
      jobTitle?: string
      employmentType?: EmploymentType
      departmentId?: number | null
      officeLocationId?: number | null
      phone?: string
      bio?: string
      joinDate?: string
      endDate?: string
      isActive?: boolean
    },
    token: string,
  ) =>
    api.patch<{ success: boolean; data: ApiEmployee }>(`/employees/${id}`, body, {
      Authorization: `Bearer ${token}`,
    }),

  remove: (id: number, token: string) =>
    api.delete<{ success: boolean; message: string }>(`/employees/${id}`, {
      Authorization: `Bearer ${token}`,
    }),

  listLeave: (
    id: number,
    params: {
      status?: "PENDING" | "APPROVED" | "REJECTED"
      type?: "ANNUAL" | "SICK" | "MATERNITY" | "PATERNITY" | "UNPAID" | "OTHER"
      page?: number
      limit?: number
    } = {},
    token: string,
  ) => {
    const qs = new URLSearchParams()
    if (params.status) qs.set("status", params.status)
    if (params.type)   qs.set("type",   params.type)
    if (params.page)   qs.set("page",   String(params.page))
    if (params.limit)  qs.set("limit",  String(params.limit))
    const q = qs.toString()
    return api.get<{
      success: boolean
      data: Array<{
        id: number
        type: string
        status: "PENDING" | "APPROVED" | "REJECTED"
        startDate: string
        endDate: string
        reason?: string
      }>
      summary: { PENDING: number; APPROVED: number; REJECTED: number }
      meta: PaginationMeta
    }>(`/employees/${id}/leave${q ? `?${q}` : ""}`, {
      Authorization: `Bearer ${token}`,
    })
  },
}
