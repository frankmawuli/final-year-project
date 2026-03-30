import { api } from "@/lib/api-client"

// ── Types ─────────────────────────────────────────────────────────────────────

export type LeaveType = "ANNUAL" | "SICK" | "MATERNITY" | "PATERNITY" | "UNPAID" | "OTHER"
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"

export interface LeaveRequest {
  id: string
  type: LeaveType
  startDate: string
  endDate: string
  reason?: string
  status: LeaveStatus
  employeeId: string
  employee?: { id: string; name: string; email: string }
  createdAt: string
  updatedAt: string
}

export interface CreateLeaveRequestPayload {
  type: LeaveType
  startDate: string
  endDate: string
  reason?: string
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
export const leaveService = {
  async getAll(): Promise<LeaveRequest[]> {
    const raw = await api.get<unknown>("/employee-management/leave-requests")
    return extractList<LeaveRequest>(raw)
  },

  async getById(id: string): Promise<LeaveRequest> {
    const raw = await api.get<unknown>(`/employee-management/leave-requests/${id}`)
    return extractItem<LeaveRequest>(raw)
  },

  async create(payload: CreateLeaveRequestPayload): Promise<LeaveRequest> {
    const raw = await api.post<unknown>("/employee-management/leave-requests", payload)
    return extractItem<LeaveRequest>(raw)
  },

  cancel(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/employee-management/leave-requests/${id}`)
  },

  /** Admin only: approve or reject */
  updateStatus(id: string, status: "APPROVED" | "REJECTED"): Promise<{ message: string }> {
    return api.patch<{ message: string }>(
      `/employee-management/leave-requests/${id}/status`,
      { status },
    )
  },
}
