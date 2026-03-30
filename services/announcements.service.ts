import { api } from "@/lib/api-client"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Announcement {
  id: string
  title: string
  body: string
  companyId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAnnouncementPayload {
  title: string
  body: string
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
export const announcementsService = {
  async getAll(): Promise<Announcement[]> {
    const raw = await api.get<unknown>("/hr-admin/announcements")
    return extractList<Announcement>(raw)
  },

  async create(payload: CreateAnnouncementPayload): Promise<Announcement> {
    const raw = await api.post<unknown>("/hr-admin/announcements", payload)
    return extractItem<Announcement>(raw)
  },

  delete(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/hr-admin/announcements/${id}`)
  },
}
