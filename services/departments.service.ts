import { api } from "@/lib/api-client"

export interface ApiDeptEmployee {
  id:            string        // CUID e.g. "clemp789"
  employeeId:    string        // display ID e.g. "EMP-001"
  isActive:      boolean
  createdAt:     string
  departmentId?: number
  companyId?:    string
  user: {
    id:        string
    name:      string
    email:     string
    avatarUrl: string | null
  }
}

export interface ApiDepartment {
  id:          number
  name:        string
  description: string | null
  companyId?:  string
  createdAt?:  string
  employees?:  ApiDeptEmployee[]   // only present on GET /:id
  _count?:     { employees: number; jobs?: number }
}

export interface DeptMembersPagination {
  total:      number
  page:       number
  pageSize:   number   // NOT "limit" — spec uses "pageSize"
  totalPages: number
}

export const departmentService = {
  list: (token: string) =>
    api.get<{ success: boolean; data: ApiDepartment[] }>("/departments", {
      Authorization: `Bearer ${token}`,
    }),

  get: (id: number, token: string) =>
    api.get<{ success: boolean; data: ApiDepartment }>(`/departments/${id}`, {
      Authorization: `Bearer ${token}`,
    }),

  members: (
    id: number,
    params: { status?: "active" | "inactive" | "all"; page?: number; limit?: number } = {},
    token: string,
  ) => {
    const qs = new URLSearchParams()
    if (params.status) qs.set("status", params.status)
    if (params.page)   qs.set("page",   String(params.page))
    if (params.limit)  qs.set("limit",  String(params.limit))
    const q = qs.toString()
    return api.get<{
      success:    boolean
      data:       ApiDeptEmployee[]
      pagination: DeptMembersPagination
    }>(`/departments/${id}/members${q ? `?${q}` : ""}`, {
      Authorization: `Bearer ${token}`,
    })
  },

  create: (
    body: { name: string; description?: string },
    token: string,
  ) =>
    api.post<{ success: boolean; data: ApiDepartment }>("/departments", body, {
      Authorization: `Bearer ${token}`,
    }),

  update: (id: number, body: { name?: string; description?: string }, token: string) =>
    api.patch<{ success: boolean; data: ApiDepartment }>(`/departments/${id}`, body, {
      Authorization: `Bearer ${token}`,
    }),

  remove: (id: number, token: string) =>
    api.delete<{ success: boolean; message: string }>(`/departments/${id}`, {
      Authorization: `Bearer ${token}`,
    }),
}
