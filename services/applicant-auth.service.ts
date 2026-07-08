import { api } from "@/lib/api-client"

export interface Applicant {
  id: string
  name: string
  email: string
}

export interface ApplicantExperience {
  id: string
  role: string
  company: string
  duration: string
  responsibilities: string | null
  position: number
}

export interface ApplicantEducation {
  id: string
  degree: string
  school: string
  year: string
  description: string | null
  position: number
}

export interface ApplicantSkill {
  id: string
  name: string
}

export interface ApplicantProfile {
  id: string
  name: string
  email: string
  phone: string | null
  location: string | null
  avatarUrl: string | null
  about: string | null
  linkedin: string | null
  twitter: string | null
  facebook: string | null
  cvUrl: string | null
  cvName: string | null
  status: string
  emailVerified: boolean
  headline: string | null
  qualification: string | null
  currentFunction: string | null
  preferredFunction: string | null
  preferredLocations: string[]
  experienceYears: string | null
  workType: string | null
  availability: string | null
  salaryCurrency: string | null
  salaryExpectation: string | null
  activelyLooking: boolean
  displayProfile: boolean
  willingToRelocate: boolean
  skills: ApplicantSkill[]
  experience: ApplicantExperience[]
  education: ApplicantEducation[]
}

export interface CvAutofillSuggestion {
  about: string | null
  skills: string[]
  experience: { role: string; company: string; duration: string; responsibilities: string | null }[]
  education: { degree: string; school: string; year: string; description: string | null }[]
}

export type MyApplicationStatus =
  | "PENDING_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "ACCEPTED"
  | "APPROVED"
  | "REJECTED"

export interface MyApplication {
  id: string
  status: MyApplicationStatus
  expectedSalary: number | null
  appliedAt: string
  updatedAt: string
  job: {
    id: string
    title: string
    type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"
    workLocation: "REMOTE" | "ON_SITE" | "HYBRID"
    status: string
    company: { name: string }
  }
}

export interface UpdateApplicantProfileBody {
  name?: string
  phone?: string
  location?: string
  about?: string
  avatarUrl?: string
  linkedin?: string
  twitter?: string
  facebook?: string
  /** Replaces all existing skills */
  skills?: string[]
  /** Replaces all existing experience rows (order = display order) */
  experience?: { role: string; company: string; duration: string; responsibilities?: string }[]
  /** Replaces all existing education rows (order = display order) */
  education?: { degree: string; school: string; year: string; description?: string }[]
  headline?: string
  qualification?: string
  currentFunction?: string
  preferredFunction?: string
  preferredLocations?: string[]
  experienceYears?: string
  workType?: string
  availability?: string
  salaryCurrency?: string
  /** Digits only */
  salaryExpectation?: string
  activelyLooking?: boolean
  displayProfile?: boolean
  willingToRelocate?: boolean
}

export const applicantAuthService = {
  register: (name: string, email: string, password: string) =>
    api.post<{ success: boolean; data: { id: string; name: string; email: string; status: string } }>(
      "/applicant/auth/register",
      { name, email, password }
    ),

  login: (email: string, password: string) =>
    api.post<{
      success: boolean
      data: { id: string; email: string; name: string; accessToken: string; refreshToken: string }
    }>("/applicant/auth/login", { email, password }),

  verifyEmail: (email: string, code: string) =>
    api.post<{ success: boolean; message: string }>("/applicant/auth/verify-email", {
      email,
      code,
      purpose: "EMAIL_VERIFICATION",
    }),

  resendOtp: (email: string) =>
    api.post<{ success: boolean; message: string }>("/applicant/auth/resend-otp", { email }),

  logout: (accessToken: string) =>
    api.post<{ success: boolean; message: string }>("/applicant/auth/logout", undefined, {
      Authorization: `Bearer ${accessToken}`,
    }),

  refreshToken: (refreshToken: string) =>
    api.post<{ success: boolean; data: { accessToken: string } }>("/applicant/auth/refresh-token", {
      refreshToken,
    }),

  requestResetPassword: (email: string) =>
    api.post<{ success: boolean; message: string }>("/applicant/auth/request-reset-password", { email }),

  resetPassword: (email: string, otp: string, newPassword: string) =>
    api.post<{ success: boolean; message: string }>("/applicant/auth/reset-password", {
      email,
      otp,
      newPassword,
    }),

  getProfile: (accessToken: string) =>
    api.get<{ success: boolean; data: ApplicantProfile }>("/applicant/profile", {
      Authorization: `Bearer ${accessToken}`,
    }),

  /** The authenticated applicant's job applications, most recent first */
  getMyApplications: (accessToken: string) =>
    api.get<{ success: boolean; data: MyApplication[] }>("/applicant/applications", {
      Authorization: `Bearer ${accessToken}`,
    }),

  updateProfile: (accessToken: string, body: UpdateApplicantProfileBody) =>
    api.patch<{ success: boolean; data: ApplicantProfile }>("/applicant/profile", body, {
      Authorization: `Bearer ${accessToken}`,
    }),

  /** Upload a CV onto the profile — parsed server-side, attached automatically on quick apply. */
  uploadCv: async (accessToken: string, file: File) => {
    const fd = new FormData()
    fd.append("file", file)
    return api.upload<{
      success: boolean
      data: { cvUrl: string; cvName: string; hasCvText: boolean }
    }>("/applicant/profile/cv", fd, { Authorization: `Bearer ${accessToken}` })
  },

  /** Upload a profile photo — stored on B2 and saved as the candidate's avatarUrl. */
  uploadPhoto: async (accessToken: string, file: File) => {
    const fd = new FormData()
    fd.append("image", file)
    return api.upload<{
      success: boolean
      data: { url: string; publicId: string }
    }>("/applicant/profile/photo", fd, { Authorization: `Bearer ${accessToken}` })
  },

  /** Ask the backend to extract a profile suggestion from the saved CV text. */
  autofillFromCv: (accessToken: string) =>
    api.post<{ success: boolean; data: CvAutofillSuggestion }>(
      "/applicant/profile/cv-autofill",
      undefined,
      { Authorization: `Bearer ${accessToken}` },
    ),

  /** One-click apply using the profile on file. 409 = already applied, 400 = not accepting. */
  applyToJob: (
    accessToken: string,
    jobId: string,
    body: { expectedSalary?: number; documents?: { name: string; type: string; url: string }[] } = {},
  ) =>
    api.post<{ success: boolean; data: { id: string; status: string } }>(
      `/applicant/jobs/${jobId}/apply`,
      { documents: [], ...body },
      { Authorization: `Bearer ${accessToken}` },
    ),
}
