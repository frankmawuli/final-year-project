import { api } from "@/lib/api-client"

export type AnnouncementRecipientType = "ALL" | "INDIVIDUAL" | "DEPARTMENT"
export type AnnouncementStatus = "DRAFT" | "SENT" | "SCHEDULED"

export interface ApiAnnouncement {
  id: string
  subject: string
  bodyHtml: string
  bodyText: string
  recipientType: AnnouncementRecipientType
  status: AnnouncementStatus
  scheduledAt: string | null
  sentAt: string | null
  totalRecipients: number | null
  createdAt: string
  updatedAt: string
  createdById: string
  createdBy: { id: string; name: string; email: string }
  recipientEmployeeId: string | null
  recipientDepartmentId: number | null
  recipientEmployee: { id: number; employeeId: string } | null
  recipientDepartment: { id: number; name: string } | null
}

export interface CreateAnnouncementBody {
  subject: string
  bodyHtml: string
  bodyText: string
  recipientType: AnnouncementRecipientType
  status?: AnnouncementStatus
  scheduledAt?: string | null
  recipientEmployeeId?: string | null
  recipientDepartmentId?: number | null
}

export interface UpdateAnnouncementBody {
  subject?: string
  bodyHtml?: string
  bodyText?: string
  recipientType?: AnnouncementRecipientType
  status?: AnnouncementStatus
  scheduledAt?: string | null
  recipientEmployeeId?: string | null
  recipientDepartmentId?: number | null
}

export const announcementService = {
  list: (token: string) =>
    api.get<{ success: boolean; data: ApiAnnouncement[] }>("/announcements", {
      Authorization: `Bearer ${token}`,
    }),

  get: (id: string, token: string) =>
    api.get<{ success: boolean; data: ApiAnnouncement }>(`/announcements/${id}`, {
      Authorization: `Bearer ${token}`,
    }),

  create: (body: CreateAnnouncementBody, token: string) =>
    api.post<{ success: boolean; data: ApiAnnouncement }>("/announcements", body, {
      Authorization: `Bearer ${token}`,
    }),

  update: (id: string, body: UpdateAnnouncementBody, token: string) =>
    api.patch<{ success: boolean; data: ApiAnnouncement }>(`/announcements/${id}`, body, {
      Authorization: `Bearer ${token}`,
    }),

  remove: (id: string, token: string) =>
    api.delete<{ success: boolean; message: string }>(`/announcements/${id}`, {
      Authorization: `Bearer ${token}`,
    }),
}
