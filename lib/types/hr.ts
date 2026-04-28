// ─────────────────────────────────────────────────────────────────────────────
// HR Backend API — Data Models
// Covers every resource visible in the HR dashboard:
//   Employee · Department · Job · Applicant · CandidateEvaluation
//   LeaveRequest · PayrollRecord · PayrollRun · Interview · Announcement · Report
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared primitives ─────────────────────────────────────────────────────────

export type ISODateString = string    // "2026-04-22"
export type LocaleDateString = string // "Apr 22, 2026"

export interface PaginatedResponse<T> {
  data:       T[]
  total:      number
  page:       number
  pageSize:   number
  totalPages: number
}

export interface ApiResponse<T> {
  data:    T
  message?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYEE
// ─────────────────────────────────────────────────────────────────────────────

export interface Employee {
  id:         number
  empId:      string          // "EMP-2341"
  name:       string
  avatarUrl:  string
  role:       string          // job title
  department: string
  email:      string
  phone:      string
  location:   string
  joinDate:   LocaleDateString
  bio:        string
  skills:     string[]
}

export type CreateEmployeeBody = Omit<Employee, "id" | "empId" | "avatarUrl"> & {
  avatarUrl?: string
}

export type UpdateEmployeeBody = Partial<CreateEmployeeBody>

// GET  /api/hr/employees             → PaginatedResponse<Employee>
// GET  /api/hr/employees/:id         → ApiResponse<Employee>
// POST /api/hr/employees             → ApiResponse<Employee>
// PUT  /api/hr/employees/:id         → ApiResponse<Employee>
// DELETE /api/hr/employees/:id       → ApiResponse<{ id: number }>

// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT
// ─────────────────────────────────────────────────────────────────────────────

export interface DepartmentMember {
  id:       number
  name:     string
  role:     string
  email:    string
  avatarUrl: string
}

export interface Department {
  id:          number
  name:        string
  description: string
  colorKey:    string        // "purple" | "blue" | "orange" | "green" | "indigo" | "pink" | "amber" | "teal"
  headName:    string        // denormalized display name
  headId:      number        // FK → Employee.id
  members:     DepartmentMember[]
}

export type CreateDepartmentBody = Omit<Department, "id" | "members"> & {
  memberIds?: number[]
}

export type UpdateDepartmentBody = Partial<CreateDepartmentBody>

export interface DepartmentMemberAction {
  employeeId: number
}

// GET  /api/hr/departments                           → PaginatedResponse<Department>
// GET  /api/hr/departments/:id                       → ApiResponse<Department>
// POST /api/hr/departments                           → ApiResponse<Department>
// PUT  /api/hr/departments/:id                       → ApiResponse<Department>
// DELETE /api/hr/departments/:id                     → ApiResponse<{ id: number }>
// POST /api/hr/departments/:id/members               → ApiResponse<Department>   (add member)
// DELETE /api/hr/departments/:id/members/:employeeId → ApiResponse<Department>   (remove member)

// ─────────────────────────────────────────────────────────────────────────────
// JOB LISTING
// ─────────────────────────────────────────────────────────────────────────────

export type JobStatus   = "Open" | "Closed" | "Draft"
export type JobType     = "Full-time" | "Part-time" | "Contract" | "Internship"
export type JobLevel    = "Junior" | "Mid-level" | "Senior" | "Lead" | "Executive"
export type JobLocation = "Remote" | "On-site" | "Hybrid"

export interface Job {
  id:               number
  title:            string
  department:       string
  location:         JobLocation
  type:             JobType
  level:            JobLevel
  salaryMin:        string        // "$70k"
  salaryMax:        string        // "$90k"
  experience:       string        // "3+ years"
  openings:         number
  deadline:         LocaleDateString
  status:           JobStatus
  applicantCount:   number
  description:      string
  responsibilities: string[]
  requirements:     string[]
  niceToHave:       string[]
  skills:           string[]
  postedDate:       LocaleDateString
  // company meta (shown on public job detail page)
  company:          string
  companyIndustry:  string
  companySize:      string
  companyFounded:   string
  companyWebsite:   string
}

export type CreateJobBody = Omit<Job, "id" | "applicantCount" | "postedDate">

export type UpdateJobBody = Partial<CreateJobBody> & {
  status?: JobStatus
}

// GET  /api/hr/jobs           → PaginatedResponse<Job>
// GET  /api/hr/jobs/:id       → ApiResponse<Job>
// POST /api/hr/jobs           → ApiResponse<Job>
// PUT  /api/hr/jobs/:id       → ApiResponse<Job>
// DELETE /api/hr/jobs/:id     → ApiResponse<{ id: number }>

// ─────────────────────────────────────────────────────────────────────────────
// APPLICANT  (lightweight view — applicants list page)
// ─────────────────────────────────────────────────────────────────────────────

export interface ApplicantSocial {
  facebook: string
  linkedin: string
  twitter:  string
}

export interface Applicant {
  id:        number
  name:      string
  avatarUrl: string
  email:     string
  position:  string      // role applied for
  jobId:     number      // FK → Job.id
  city:      string
  salary:    string      // expected salary
  social:    ApplicantSocial
  appliedAt: ISODateString
}

// GET  /api/hr/applicants             → PaginatedResponse<Applicant>
// GET  /api/hr/applicants/:id         → ApiResponse<Applicant>
// DELETE /api/hr/applicants/:id       → ApiResponse<{ id: number }>

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATE EVALUATION  (rich view — evaluation page)
// ─────────────────────────────────────────────────────────────────────────────

export type EvaluationStatus = "Pending Review" | "Interview" | "Accepted" | "Approved" | "Rejected"

export interface CandidateExperience {
  role:     string
  company:  string
  duration: string   // "2021 – Present"
}

export interface CandidateEducation {
  degree: string
  school: string
  year:   string
}

export interface CandidateDocument {
  name: string
  type: string   // "Resume" | "Cover Letter" | "Portfolio"
  url?: string
}

export interface CandidateEvaluation {
  id:          number
  applicantId: number          // FK → Applicant.id
  name:        string
  email:       string
  phone:       string
  avatarUrl:   string
  position:    string
  department:  string
  appliedAt:   LocaleDateString
  location:    string
  aiScore:     number          // 0-100
  status:      EvaluationStatus
  about:       string
  skills:      string[]
  experience:  CandidateExperience[]
  education:   CandidateEducation[]
  documents:   CandidateDocument[]
}

export interface UpdateEvaluationStatusBody {
  status: EvaluationStatus
}

// GET  /api/hr/evaluations            → PaginatedResponse<CandidateEvaluation>
// GET  /api/hr/evaluations/:id        → ApiResponse<CandidateEvaluation>
// PATCH /api/hr/evaluations/:id/status → ApiResponse<CandidateEvaluation>

// ─────────────────────────────────────────────────────────────────────────────
// LEAVE REQUEST
// ─────────────────────────────────────────────────────────────────────────────

export type LeaveType   = "Sick" | "Annual" | "Maternity" | "Paternity" | "Emergency" | "Casual"
export type LeaveStatus = "Approved" | "Pending" | "Rejected"

export interface LeaveRequest {
  id:          number
  employeeId:  number          // FK → Employee.id
  name:        string          // denormalized
  email:       string          // denormalized
  department:  string          // denormalized
  leaveType:   LeaveType
  startDate:   LocaleDateString
  endDate:     LocaleDateString
  status:      LeaveStatus
  reason:      string
  submittedAt: ISODateString
}

export type CreateLeaveRequestBody = {
  employeeId: number
  leaveType:  LeaveType
  startDate:  ISODateString
  endDate:    ISODateString
  reason?:    string
}

export interface UpdateLeaveStatusBody {
  status: LeaveStatus
}

// GET  /api/hr/leave                       → PaginatedResponse<LeaveRequest>
// GET  /api/hr/leave/:id                   → ApiResponse<LeaveRequest>
// POST /api/hr/leave                       → ApiResponse<LeaveRequest>
// PATCH /api/hr/leave/:id/status           → ApiResponse<LeaveRequest>
// DELETE /api/hr/leave/:id                 → ApiResponse<{ id: number }>

// ─────────────────────────────────────────────────────────────────────────────
// PAYROLL
// ─────────────────────────────────────────────────────────────────────────────

export type PayrollRecordStatus = "Paid" | "Pending" | "Processing"
export type PayrollRunStatus    = "Scheduled" | "Processing" | "Completed"

export interface PayrollRecord {
  id:          number
  employeeId:  number
  name:        string          // denormalized
  email:       string          // denormalized
  avatarUrl:   string          // denormalized
  department:  string          // denormalized
  payrollRunId: number         // FK → PayrollRun.id
  baseSalary:  number
  bonus:       number
  deductions:  number
  netPay:      number          // baseSalary + bonus - deductions (computed)
  status:      PayrollRecordStatus
}

export interface PayrollRun {
  id:          number
  period:      string          // "March 2026"
  startDate:   ISODateString
  endDate:     ISODateString
  employeeCount: number
  totalGross:  number
  totalDeductions: number
  totalNet:    number
  status:      PayrollRunStatus
  processDate: ISODateString
  records:     PayrollRecord[]
}

export interface PayDistributionItem {
  department: string
  amount:     number
}

export interface PayrollSummary {
  totalPayroll:    number
  totalGross:      number
  totalDeductions: number
  payDistribution: PayDistributionItem[]
  recentRuns:      Omit<PayrollRun, "records">[]
}

// GET  /api/hr/payroll/summary              → ApiResponse<PayrollSummary>
// GET  /api/hr/payroll/runs                 → PaginatedResponse<Omit<PayrollRun, "records">>
// GET  /api/hr/payroll/runs/:id             → ApiResponse<PayrollRun>
// GET  /api/hr/payroll/runs/:id/records     → PaginatedResponse<PayrollRecord>
// PATCH /api/hr/payroll/records/:id/status  → ApiResponse<PayrollRecord>

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW SCHEDULE
// ─────────────────────────────────────────────────────────────────────────────

export interface Interview {
  id:        number
  title:     string
  date:      ISODateString      // "2026-04-22"
  startTime: string             // "HH:MM"  e.g. "09:00"
  endTime:   string             // "HH:MM"  e.g. "10:00"
  colorTag:  string             // hex or named color token
  guests:    string[]           // candidate email addresses
  meetLink?: string
  notes?:    string
  jobId?:    number             // FK → Job.id (optional)
}

export type CreateInterviewBody = Omit<Interview, "id">

export type UpdateInterviewBody = Partial<CreateInterviewBody>

// GET  /api/hr/interviews                   → PaginatedResponse<Interview>
// GET  /api/hr/interviews?week=2026-W17     → PaginatedResponse<Interview>
// GET  /api/hr/interviews/:id               → ApiResponse<Interview>
// POST /api/hr/interviews                   → ApiResponse<Interview>
// PUT  /api/hr/interviews/:id               → ApiResponse<Interview>
// DELETE /api/hr/interviews/:id             → ApiResponse<{ id: number }>

// ─────────────────────────────────────────────────────────────────────────────
// ANNOUNCEMENT
// ─────────────────────────────────────────────────────────────────────────────

export type AnnouncementRecipient = "all" | "individual"

export interface Announcement {
  id:             number
  subject:        string
  body:           string           // HTML rich-text
  recipient:      AnnouncementRecipient
  recipientId?:   string           // FK → Employee.id when recipient = "individual"
  recipientName?: string           // denormalized display name
  sentAt:         LocaleDateString
  sentById:       number           // FK → Employee.id (sender)
}

export type CreateAnnouncementBody = {
  subject:      string
  body:         string
  recipient:    AnnouncementRecipient
  recipientId?: string
}

// GET  /api/hr/announcements          → PaginatedResponse<Announcement>
// GET  /api/hr/announcements/:id      → ApiResponse<Announcement>
// POST /api/hr/announcements          → ApiResponse<Announcement>
// DELETE /api/hr/announcements/:id    → ApiResponse<{ id: number }>

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYEE REPORT
// ─────────────────────────────────────────────────────────────────────────────

export type ReportType   = "Performance" | "Work Summary" | "Incident" | "Goal Update" | "Complaint"
export type ReportStatus = "Submitted" | "Under Review" | "Resolved" | "Closed"

export interface EmployeeReport {
  id:          number
  employeeId:  number
  name:        string          // denormalized
  avatarUrl:   string          // denormalized
  email:       string          // denormalized
  department:  string          // denormalized
  reportType:  ReportType
  title:       string
  period:      string          // "Q1 2026"
  submittedOn: LocaleDateString
  status:      ReportStatus
  summary:     string
  score?:      number          // used for Performance reports (0–100)
}

export interface UpdateReportStatusBody {
  status: ReportStatus
}

// GET  /api/hr/reports                       → PaginatedResponse<EmployeeReport>
// GET  /api/hr/reports/:id                   → ApiResponse<EmployeeReport>
// PATCH /api/hr/reports/:id/status           → ApiResponse<EmployeeReport>

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD (overview stats — HR home page)
// ─────────────────────────────────────────────────────────────────────────────

export interface AttendanceDataPoint {
  month:      string   // "Jan"
  attendance: number   // percentage 0-100
}

export interface DeptHeadcount {
  name:  string
  value: number
}

export interface RoleHeadcount {
  name:  string
  value: number
  color: string
}

export interface RecruitmentActivity {
  candidateName: string
  avatarUrl:     string
  action:        string
  occurredAt:    string
}

export interface HRActivity {
  type:       string   // "leave_request" | "new_employee" | "payroll" | "application" | "contract"
  message:    string
  occurredAt: string
}

export interface NewEmployee {
  name:      string
  role:      string
  avatarUrl: string
}

export interface HRDashboardStats {
  totalEmployees:       number
  employeeChangeThisMonth: number
  openJobPositions:     number
  jobChangeThisWeek:    number
  attendanceToday:      number      // percentage
  attendanceChangePct:  number
  attendanceData:       AttendanceDataPoint[]
  employeesByDept:      DeptHeadcount[]
  employeesByRole:      RoleHeadcount[]
  recentActivities:     HRActivity[]
  recruitmentActivity:  RecruitmentActivity[]
  newEmployees:         NewEmployee[]
}

// GET /api/hr/dashboard  → ApiResponse<HRDashboardStats>
