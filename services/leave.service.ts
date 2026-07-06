import { api } from "@/lib/api-client"

export type ApiLeaveType   = "ANNUAL" | "SICK" | "MATERNITY" | "PATERNITY" | "UNPAID" | "OTHER"
export type ApiLeaveStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface ApiLeaveRequest {
  id:         number
  type:       ApiLeaveType
  status:     ApiLeaveStatus
  startDate:  string
  endDate:    string
  reason:     string | null
  createdAt?: string
  employee: {
    id:   number
    user: { name: string; email: string; avatarUrl: string | null }
    department: { id: number; name: string } | null
  }
}

interface PaginationMeta {
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

export const leaveService = {
  list: (
    params: {
      status?: ApiLeaveStatus
      type?:   ApiLeaveType
      search?: string
      page?:   number
      limit?:  number
    } = {},
    token: string,
  ) => {
    const qs = new URLSearchParams()
    if (params.status) qs.set("status", params.status)
    if (params.type)   qs.set("type",   params.type)
    if (params.search) qs.set("search", params.search)
    if (params.page)   qs.set("page",   String(params.page))
    if (params.limit)  qs.set("limit",  String(params.limit))
    const q = qs.toString()
    return api.get<{ success: boolean; data: ApiLeaveRequest[]; meta: PaginationMeta }>(
      `/leave${q ? `?${q}` : ""}`,
      { Authorization: `Bearer ${token}` },
    )
  },

  create: (
    body: { type: ApiLeaveType; startDate: string; endDate: string; reason?: string },
    token: string,
  ) =>
    api.post<{ success: boolean; data: ApiLeaveRequest }>("/leave", body, {
      Authorization: `Bearer ${token}`,
    }),

  updateStatus: (id: number, status: "APPROVED" | "REJECTED", token: string) =>
    api.patch<{ success: boolean; data: ApiLeaveRequest }>(
      `/leave/${id}/status`,
      { status },
      { Authorization: `Bearer ${token}` },
    ),
}
