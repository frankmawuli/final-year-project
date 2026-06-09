import { api } from "@/lib/api-client"

export type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED"

export interface ApiInterviewGuest {
  id:          string
  interviewId: string
  candidateId: string
  candidate:   { id: string; name: string; email: string }
}

export interface ApiInterview {
  id:          string
  title:       string
  startTime:   string          // ISO-8601 UTC
  endTime:     string          // ISO-8601 UTC
  meetLink:    string | null
  description: string | null   // NOTE: request body uses "desc", response uses "description"
  colorIdx:    number
  guestEmails: string[]        // NOTE: request body uses "guests", response uses "guestEmails"
  status:      InterviewStatus
  createdAt:   string
  updatedAt:   string
  createdBy?:  { id: string; name: string; email: string }
  guests:      ApiInterviewGuest[]
}

export interface CreateInterviewBody {
  title:     string
  date:      string    // "YYYY-MM-DD"
  startMin:  number    // 0–1439, UTC minutes from midnight
  endMin:    number    // 1–1440, must be > startMin
  colorIdx?: number    // 0–4, defaults to 2
  guests?:   string[]  // email addresses
  meetLink?: string
  desc?:     string
}

export const interviewsService = {
  create: (body: CreateInterviewBody, token: string) =>
    api.post<{ success: boolean; data: ApiInterview }>(
      "/hr/interviews",
      body,
      { Authorization: `Bearer ${token}` },
    ),

  list: (token: string) =>
    api.get<{ success: boolean; data: ApiInterview[] }>(
      "/hr/interviews",
      { Authorization: `Bearer ${token}` },
    ),

  getById: (id: string, token: string) =>
    api.get<{ success: boolean; data: ApiInterview }>(
      `/hr/interviews/${id}`,
      { Authorization: `Bearer ${token}` },
    ),

  cancel: (id: string, token: string) =>
    api.patch<{ success: boolean; data: ApiInterview }>(
      `/hr/interviews/${id}/cancel`,
      undefined,
      { Authorization: `Bearer ${token}` },
    ),
}
