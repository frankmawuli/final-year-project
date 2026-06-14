import { api } from "@/lib/api-client"

// ── Public API types ───────────────────────────────────────────────────────────
export type PublicJobStatus      = "active" | "closed" | "draft"
export type PublicJobType        = "full_time" | "part_time" | "contract" | "internship"
export type PublicJobArrangement = "remote" | "on_site" | "hybrid"
export type PublicJobLevel       = "junior" | "mid" | "senior" | "lead" | "executive"

export interface PublicJobListItem {
  id:               string
  title:            string
  slug:             string
  description:      string
  requirements:     string[]
  responsibilities: string[]
  company: {
    id:       string
    name:     string
    logo_url: string | null
    initials: string
    website:  string | null
    size:     string | null
  }
  location: {
    city:        string | null
    country:     string | null
    remote:      boolean
    arrangement: PublicJobArrangement
  }
  employment: {
    type:             PublicJobType
    experience_level: PublicJobLevel
    department:       string | null
  }
  compensation: {
    min:      number | null
    max:      number | null
    currency: string
    period:   string
    display:  string
  }
  tags: string[]
  meta: {
    status:     PublicJobStatus
    deadline:   string | null
    posted_at:  string | null
    updated_at: string | null
  }
}

export type PublicJobDetail = PublicJobListItem

interface PublicPagination {
  page:        number
  per_page:    number
  total:       number
  total_pages: number
  next_cursor: string | null
}

// ── Private API types ──────────────────────────────────────────────────────────
export type ApiJobStatus       = "OPEN" | "CLOSED" | "DRAFT"
export type ApiJobType         = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"
export type ApiJobLevel        = "JUNIOR" | "MID_LEVEL" | "SENIOR" | "LEAD" | "EXECUTIVE"
export type ApiJobWorkLocation = "REMOTE" | "ON_SITE" | "HYBRID"

export interface ApiJobListItem {
  id:           string
  title:        string
  status:       ApiJobStatus
  type:         ApiJobType
  level:        ApiJobLevel
  workLocation: ApiJobWorkLocation
  experience:   string | null
  salaryMin:    number | null
  salaryMax:    number | null
  openings:     number
  deadline:     string | null
  postedAt:     string | null
  createdAt:    string
  department:   { id: number; name: string } | null
  _count:       { applications: number }
}

export interface ApiJobDetail extends Omit<ApiJobListItem, "_count"> {
  _count?:          { applications: number }
  description:      string | null
  responsibilities: { text: string; position: number }[]
  requirements:     { text: string; position: number }[]
  niceToHave:       { text: string; position: number }[]
  skills:           { name: string }[]
}

interface PaginationMeta {
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

export interface ApiCandidate {
  id:        string
  name:      string
  email:     string
  phone:     string | null
  location:  string | null
  avatarUrl: string | null
  about:     string | null
  linkedin:  string | null
  twitter:   string | null
  facebook:  string | null
  skills:    { name: string }[]
  experience: { id: string; position: number; title?: string; company?: string; startDate?: string; endDate?: string | null }[]
  education:  { id: string; position: number; school?: string; degree?: string; field?: string; startDate?: string; endDate?: string | null }[]
}

export type ApiApplicationStatus = "PENDING" | "REVIEWED" | "SHORTLISTED" | "INTERVIEWED" | "OFFERED" | "HIRED" | "REJECTED"

export interface ApiApplication {
  id:        string
  jobId:     string
  status:    ApiApplicationStatus
  appliedAt: string
  candidate: ApiCandidate
  documents: { id: string; url: string; type: string }[]
}

export type ApiApplicantStatus = "PENDING_REVIEW" | "INTERVIEW" | "ACCEPTED" | "APPROVED" | "REJECTED"

export interface ApiApplicant {
  id:             string
  status:         ApiApplicantStatus
  aiScore:        number | null
  expectedSalary: number | null
  appliedAt:      string
  updatedAt:      string
  candidateId:    string
  jobId:          string
  job: {
    id:     string
    title:  string
    status: string
    type:   string
    level:  string
  }
  candidate: {
    id:        string
    name:      string
    email:     string
    phone:     string | null
    location:  string | null
    avatarUrl: string | null
    about:     string | null
    linkedin:  string | null
    twitter:   string | null
    facebook:  string | null
  }
  documents: { id: string; name: string; type: string; url: string; uploadedAt: string; applicationId: string }[]
}

export type JobCreateBody = {
  title:        string
  type:         ApiJobType
  level:        ApiJobLevel
  workLocation: ApiJobWorkLocation
  departmentId: number
  status?:       ApiJobStatus
  experience?:   string
  salaryMin?:    number
  salaryMax?:    number
  openings?:     number
  deadline?:     string
  description?:  string
  responsibilities?: { text: string; position: number }[]
  requirements?:     { text: string; position: number }[]
  niceToHave?:       { text: string; position: number }[]
  skills?:           { name: string }[]
}

export type JobUpdateBody = Partial<Omit<JobCreateBody, "title"> & { title?: string }>

export type SkillLevel  = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"
export type DocumentType = "Resume" | "Cover Letter" | "Portfolio"

export type ApplyBody = {
  name:      string
  email:     string
  documents: { name: string; type: DocumentType; url: string }[]
  phone?:          string
  location?:       string
  about?:          string
  linkedin?:       string
  twitter?:        string
  facebook?:       string
  expectedSalary?: number
  skills?: { name: string; level?: SkillLevel }[]
  experience?: {
    position:    number
    role:        string
    company:     string
    startDate:   string
    endDate?:    string | null
    description?: string
  }[]
  education?: {
    position: number
    school:   string
    degree:   string
    field?:   string
    year?:    string
  }[]
}

export const jobsService = {
  list: (
    params: {
      search?:       string
      status?:       ApiJobStatus
      type?:         ApiJobType
      level?:        ApiJobLevel
      workLocation?: ApiJobWorkLocation
      departmentId?: number
      page?:         number
      limit?:        number
    } = {},
    token: string,
  ) => {
    const qs = new URLSearchParams()
    if (params.search)       qs.set("search",       params.search)
    if (params.status)       qs.set("status",       params.status)
    if (params.type)         qs.set("type",         params.type)
    if (params.level)        qs.set("level",        params.level)
    if (params.workLocation) qs.set("workLocation", params.workLocation)
    if (params.departmentId) qs.set("departmentId", String(params.departmentId))
    if (params.page)         qs.set("page",         String(params.page))
    if (params.limit)        qs.set("limit",        String(params.limit))
    const q = qs.toString()
    return api.get<{ success: boolean; data: ApiJobListItem[]; meta: PaginationMeta }>(
      `/jobs${q ? `?${q}` : ""}`,
      { Authorization: `Bearer ${token}` },
    )
  },

  getById: (id: string, token: string) =>
    api.get<{ success: boolean; data: ApiJobDetail }>(
      `/jobs/${id}`,
      { Authorization: `Bearer ${token}` },
    ),

  listPublic: (
    params: {
      keyword?:    string
      location?:   PublicJobArrangement
      type?:       PublicJobType
      salary_min?: number
      page?:       number
      per_page?:   number
    } = {},
  ) => {
    const qs = new URLSearchParams()
    if (params.keyword)    qs.set("keyword",    params.keyword)
    if (params.location)   qs.set("location",   params.location)
    if (params.type)       qs.set("type",       params.type)
    if (params.salary_min) qs.set("salary_min", String(params.salary_min))
    if (params.page)       qs.set("page",       String(params.page))
    if (params.per_page)   qs.set("per_page",   String(params.per_page))
    const q = qs.toString()
    return api.get<{
      data:             PublicJobListItem[]
      pagination:       PublicPagination
      filters_applied:  Record<string, string | null>
    }>(`/public/jobs${q ? `?${q}` : ""}`)
  },

  getPublicById: (id: string) =>
    api.get<{ data: PublicJobDetail }>(`/public/jobs/${id}`),

  create: (body: JobCreateBody, token: string) =>
    api.post<{ success: boolean; data: ApiJobDetail }>(
      "/jobs",
      body,
      { Authorization: `Bearer ${token}` },
    ),

  update: (id: string, body: JobUpdateBody, token: string) =>
    api.patch<{ success: boolean; data: ApiJobDetail }>(
      `/jobs/${id}`,
      body,
      { Authorization: `Bearer ${token}` },
    ),

  updateStatus: (id: string, status: ApiJobStatus, token: string) =>
    api.patch<{ success: boolean; data: ApiJobDetail }>(
      `/jobs/${id}/status`,
      { status },
      { Authorization: `Bearer ${token}` },
    ),

  delete: (id: string, token: string) =>
    api.delete<{ success: boolean }>(
      `/jobs/${id}`,
      { Authorization: `Bearer ${token}` },
    ),

  apply: (jobId: string, body: ApplyBody) =>
    api.post<{ success: boolean; data: unknown }>(
      `/jobs/${jobId}/apply`,
      body,
    ),

  getApplicants: (
    jobId: string,
    params: { status?: string; search?: string; page?: number; limit?: number } = {},
    token: string,
  ) => {
    const qs = new URLSearchParams()
    if (params.status) qs.set("status",  params.status)
    if (params.search) qs.set("search",  params.search)
    if (params.page)   qs.set("page",    String(params.page))
    if (params.limit)  qs.set("limit",   String(params.limit))
    const q = qs.toString()
    return api.get<{ success: boolean; data: ApiApplication[]; meta: PaginationMeta }>(
      `/jobs/${jobId}/applicants${q ? `?${q}` : ""}`,
      { Authorization: `Bearer ${token}` },
    )
  },

  getAllApplicants: (
    params: { search?: string; status?: ApiApplicantStatus; jobId?: string; page?: number; limit?: number } = {},
    token: string,
  ) => {
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
}
