import { api } from "@/lib/api-client"

export type ComplaintCategory = "Workplace Harassment" | "Discrimination" | "Safety Concern" | "Manager Conduct" | "Policy Violation" | "Other"
export type ComplaintPriority = "Low" | "Medium" | "High" | "Critical"
export type ComplaintStatus = "Submitted" | "Under Investigation" | "Resolved" | "Closed"
export type ComplaintStatusCode = "SUBMITTED" | "UNDER_INVESTIGATION" | "RESOLVED" | "CLOSED"

export interface ApiComplaint {
  id: number
  ref: string
  title: string
  category: ComplaintCategory
  priority: ComplaintPriority
  submittedOn: string
  status: ComplaintStatus
  statusCode?: ComplaintStatusCode
  anonymous: boolean
  description: string
  attachmentUrl?: string | null
  updates: { date: string; text: string }[]
  employee?: {
    name: string
    email: string
    avatarUrl: string | null
    department: string
  }
}

const statusCodes: Record<ComplaintStatus, ComplaintStatusCode> = {
  Submitted: "SUBMITTED",
  "Under Investigation": "UNDER_INVESTIGATION",
  Resolved: "RESOLVED",
  Closed: "CLOSED",
}

export const complaintService = {
  list: (token: string) =>
    api.get<{ success: boolean; data: ApiComplaint[] }>("/complaints", {
      Authorization: `Bearer ${token}`,
    }),

  create: (
    body: {
      title: string
      category: ComplaintCategory
      priority: ComplaintPriority
      description: string
      anonymous: boolean
      attachmentUrl?: string
    },
    token: string,
  ) =>
    api.post<{ success: boolean; data: ApiComplaint }>("/complaints", body, {
      Authorization: `Bearer ${token}`,
    }),

  updateStatus: (id: number, status: ComplaintStatus, token: string) =>
    api.patch<{ success: boolean; data: ApiComplaint }>(
      `/complaints/${id}/status`,
      { status: statusCodes[status] },
      { Authorization: `Bearer ${token}` },
    ),
}