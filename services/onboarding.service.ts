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

interface InviteLinkResult {
  inviteUrl: string
  token: string
  expiresAt: string | null
  role: string
}

export interface BulkInviteResult {
  total: number
  invitedCount: number
  failedCount: number
  invited: { email: string; name: string }[]
  failed: { email: string; reason: string }[]
}

export type InviteLinkRole = "HR_ADMIN" | "HR_MANAGER" | "SUPER_ADMIN" | "EMPLOYEE"

export interface CompanyInviteLink {
  id: number
  inviteUrl: string
  role: InviteLinkRole
  isActive: boolean
  maxUses: number | null
  useCount: number
  expiresAt: string | null
  createdAt: string
  createdByName: string | null
}

interface UpdateCompanyBody {
  name?: string
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

  getCompany: (accessToken: string) =>
    api.get<{ success: boolean; data: Company }>(
      "/onboarding/company",
      { Authorization: `Bearer ${accessToken}` }
    ),

  updateCompany: (accessToken: string, body: UpdateCompanyBody) =>
    api.put<{ success: boolean; data: Company }>(
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

  generateInviteLink: (
    accessToken: string,
    opts?: { role?: InviteLinkRole; maxUses?: number; expiresInDays?: number }
  ) =>
    api.post<{ success: boolean; data: InviteLinkResult }>(
      "/onboarding/invite-link",
      opts ?? {},
      { Authorization: `Bearer ${accessToken}` }
    ),

  listInviteLinks: (accessToken: string) =>
    api.get<{ success: boolean; data: CompanyInviteLink[] }>(
      "/onboarding/invite-links",
      { Authorization: `Bearer ${accessToken}` }
    ),

  revokeInviteLink: (accessToken: string, id: number) =>
    api.delete<{ success: boolean; message: string }>(
      `/onboarding/invite-link/${id}`,
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
