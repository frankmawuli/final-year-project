// Client-side in-memory store for jobs created at runtime.
// Module-level variables persist for the lifetime of the browser session,
// so both the jobs list page and the detail page can read/write to the same map.

export interface RichJob {
  id: number
  title: string
  department: string
  company: string
  companyIndustry: string
  companySize: string
  companyFounded: string
  companyWebsite: string
  location: string
  type: string
  level: string
  experience: string
  salaryMin: string
  salaryMax: string
  status: "Open" | "Closed" | "Draft"
  postedDate: string
  deadline: string
  openings: number
  applicants: number
  description: string
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
  skills: string[]
  recentApplicants: { name: string; avatar: string }[]
}

const store = new Map<number, RichJob>()

export const jobsStore = {
  set(job: RichJob) {
    store.set(job.id, job)
  },
  get(id: number): RichJob | undefined {
    return store.get(id)
  },
}
