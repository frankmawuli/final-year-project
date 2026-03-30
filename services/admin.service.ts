import { api } from "@/lib/api-client"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractList<T>(raw: unknown): T[] {
  const r = raw as Record<string, unknown>
  if (Array.isArray(r)) return r as T[]
  if (Array.isArray(r.data)) return r.data as T[]
  return []
}

// ── Service ───────────────────────────────────────────────────────────────────
export const adminService = {
  async getAllUsers(): Promise<AdminUser[]> {
    const raw = await api.get<unknown>("/admin/users")
    return extractList<AdminUser>(raw)
  },

  promoteToAdmin(userId: string): Promise<{ message: string }> {
    return api.patch<{ message: string }>(`/admin/users/${userId}/promote`)
  },

  demoteFromAdmin(userId: string): Promise<{ message: string }> {
    return api.patch<{ message: string }>(`/admin/users/${userId}/demote`)
  },

  suspendUser(userId: string): Promise<{ message: string }> {
    return api.patch<{ message: string }>(`/admin/users/${userId}/suspend`)
  },

  reactivateUser(userId: string): Promise<{ message: string }> {
    return api.patch<{ message: string }>(`/admin/users/${userId}/reactivate`)
  },

  deleteUser(userId: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/admin/users/${userId}`)
  },
}
