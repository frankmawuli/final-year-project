import { api } from "@/lib/api-client"

interface Company {
  id: string
  name: string
  industry?: string
  size?: string
  logoUrl?: string
  website?: string
  country?: string
  city?: string
  timezone?: string
  address?: string
  foundingYear?: number
  registrationNo?: string
  createdAt: string
}

interface Department {
  id: string
  companyId: string
  name: string
  description?: string
  createdAt: string
}

interface OfficeLocation {
  id: string
  companyId: string
  name: string
  address?: string
  city?: string
  country?: string
  createdAt: string
}

interface BulkInviteResult {
  total: number
  invitedCount: number
  failedCount: number
  invited: { email: string; name: string }[]
  failed: { email: string; reason: string }[]
}

export const onboardingService = {
  createCompany: (
    accessToken: string,
    body: {
      name: string
      industry?: string
      size?: string
      logoUrl?: string
      website?: string
      country?: string
      city?: string
      timezone?: string
      address?: string
      foundingYear?: number
      registrationNo?: string
    }
  ) =>
    api.post<{ success: boolean; data: Company }>(
      "/onboarding/company",
      body,
      { Authorization: `Bearer ${accessToken}` }
    ),

  createDepartment: (
    accessToken: string,
    companyId: string,
    name: string,
    description?: string
  ) =>
    api.post<{ success: boolean; data: Department }>(
      "/onboarding/department",
      { companyId, name, ...(description ? { description } : {}) },
      { Authorization: `Bearer ${accessToken}` }
    ),

  createOfficeLocation: (accessToken: string, companyId: string, name: string) =>
    api.post<{ success: boolean; data: OfficeLocation }>(
      "/onboarding/office-location",
      { companyId, name },
      { Authorization: `Bearer ${accessToken}` }
    ),

  bulkInvite: (accessToken: string, file: File) => {
    const fd = new FormData()
    fd.append("file", file)
    return api.upload<{ success: boolean; data: BulkInviteResult }>(
      "/onboarding/invite-bulk",
      fd,
      { Authorization: `Bearer ${accessToken}` }
    )
  },
}
