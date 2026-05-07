import { api } from "@/lib/api-client"

export interface ApiDeptEmployee {
  id:             number
  employeeId:     string
  jobTitle:       string | null
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
  _count?:     { employees: number; jobs?: number }
  employees?:  ApiDeptEmployee[]   // only present on GET /:id
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

  create: (body: { companyId: string; name: string; description?: string }, token: string) =>
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
