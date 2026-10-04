import { api } from "@/lib/api-client"

export interface AdminOverviewData {
  companies: { total: number; active: number | null; activeCountAvailable: boolean }
  users: { total: number; active: number }
  employees: { total: number; active: number }
  jobs: { active: number }
  applications: { total: number }
  interviews: { total: number }
  subscriptions: unknown
  recentActivity: Array<{
    id: number
    action: string
    details: unknown
    timestamp: string
    actor: { id: string; name: string; email: string } | null
    company: { id: string; name: string } | null
  }>
}

export interface AdminCompany {
  id: string
  name: string
  industry: string | null
  city: string | null
  country: string | null
  createdAt: string
  _count: { users: number; employees: number; Jobs: number }
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "SUPER_ADMIN" | "HR_ADMIN" | "HR_MANAGER" | "RECRUITER" | "EMPLOYEE"
  status: "active" | "invited" | "suspended" | "deactivated"
  emailVerified: boolean
  twoFAEnabled: boolean
  mustChangePassword: boolean
  lastLoginAt: string | null
  createdAt: string
  company: { id: string; name: string } | null
  _count: { sessions: number }
}

export interface AdminAuditLog {
  id: number
  companyId: string
  userId: string | null
  action: string
  metadata: unknown
  createdAt: string
  user: { id: string; name: string; email: string } | null
  company: { id: string; name: string } | null
}

export interface AdminPagination {
  page: number
  limit: number
  total: number
  pages: number
}

type ListResponse<T> = { success: boolean; data: T[]; pagination: AdminPagination }

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` })

export const adminService = {
  overview: (token: string) =>
    api.get<{ success: boolean; data: AdminOverviewData }>("/admin/overview", authHeaders(token)),

  companies: (token: string, page = 1, limit = 25, query = "") =>
    api.get<ListResponse<AdminCompany>>(
      `/admin/companies?page=${page}&limit=${limit}&q=${encodeURIComponent(query)}`,
      authHeaders(token),
    ),

  users: (token: string, page = 1, limit = 25, query = "", role = "", status = "") =>
    api.get<ListResponse<AdminUser>>(
      `/admin/users?page=${page}&limit=${limit}&q=${encodeURIComponent(query)}&role=${encodeURIComponent(role)}&status=${encodeURIComponent(status)}`,
      authHeaders(token),
    ),

  auditLogs: (token: string, page = 1, limit = 25, query = "") =>
    api.get<ListResponse<AdminAuditLog>>(
      `/admin/audit-logs?page=${page}&limit=${limit}&q=${encodeURIComponent(query)}`,
      authHeaders(token),
    ),
}
