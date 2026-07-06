import { api } from "@/lib/api-client"
import type { ApiApplicant, ApiApplicantStatus } from "@/services/jobs.service"

interface PaginationMeta {
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

export interface ApiApplicantDetail extends Omit<ApiApplicant, "candidate"> {
  candidate: ApiApplicant["candidate"] & {
    skills: { name: string }[]
    experience: {
      id:         string
      position:   number
      title?:     string   // API sends "title" — mapped to "role" in the UI layer
      company?:   string
      startDate?: string
      endDate?:   string | null
    }[]
    education: {
      id:         string
      position:   number
      school?:    string
      degree?:    string
      field?:     string
      startDate?: string
      endDate?:   string | null
    }[]
  }
}

export type ApplicationListQuery = {
  search?: string
  status?: ApiApplicantStatus
  jobId?:  string
  page?:   number
  limit?:  number
}

export const applicationsService = {
  list: (params: ApplicationListQuery = {}, token: string) => {
    const qs = new URLSearchParams()
    if (params.search) qs.set("search", params.search)
    if (params.status) qs.set("status", params.status)
    if (params.jobId)  qs.set("jobId",  params.jobId)
    if (params.page)   qs.set("page",   String(params.page))
    if (params.limit)  qs.set("limit",  String(params.limit))
    const q = qs.toString()
    return api.get<{ success: boolean; data: ApiApplicant[]; meta: PaginationMeta }>(
      `/applications${q ? `?${q}` : ""}`,
      { Authorization: `Bearer ${token}` },
    )
  },

  getById: (id: string, token: string) =>
    api.get<{ success: boolean; data: ApiApplicantDetail }>(
      `/applications/${id}`,
      { Authorization: `Bearer ${token}` },
    ),

  updateStatus: (id: string, status: ApiApplicantStatus, token: string) =>
    api.patch<{ success: boolean; data: ApiApplicant }>(
      `/applications/${id}/status`,
      { status },
      { Authorization: `Bearer ${token}` },
    ),
}
