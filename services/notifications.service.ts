import { api } from "@/lib/api-client"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedNotifications {
  data: Notification[]
  total: number
  page: number
  limit: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractPaginated(raw: unknown): PaginatedNotifications {
  const r = raw as Record<string, unknown>
  if (r.data && typeof r.data === "object") {
    const d = r.data as Record<string, unknown>
    return {
      data: (Array.isArray(d.data) ? d.data : Array.isArray(d) ? d : []) as Notification[],
      total: (d.total as number) ?? 0,
      page: (d.page as number) ?? 1,
      limit: (d.limit as number) ?? 20,
    }
  }
  const list = Array.isArray(r.data) ? r.data : Array.isArray(r) ? r : []
  return { data: list as Notification[], total: list.length, page: 1, limit: 20 }
}

// ── Service ───────────────────────────────────────────────────────────────────
export const notificationsService = {
  async getAll(page = 1, limit = 20): Promise<PaginatedNotifications> {
    const raw = await api.get<unknown>(`/notifications?page=${page}&limit=${limit}`)
    return extractPaginated(raw)
  },

  async getUnreadCount(): Promise<number> {
    const raw = await api.get<unknown>("/notifications/unread-count")
    const r = raw as Record<string, unknown>
    return (r.count as number) ?? (r.data as Record<string, unknown>)?.count ?? 0
  },

  markAllRead(): Promise<{ message: string }> {
    return api.patch<{ message: string }>("/notifications/read-all")
  },

  markRead(id: string): Promise<{ message: string }> {
    return api.patch<{ message: string }>(`/notifications/${id}/read`)
  },

  delete(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/notifications/${id}`)
  },
}
