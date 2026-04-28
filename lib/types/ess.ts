// ─────────────────────────────────────────────────────────────────────────────
// ESS (Employee Self-Service) Backend API — Data Models
// Covers every resource visible in the ESS portal:
//   Attendance · LeaveRequest · LeaveBalance · Payslip · Allowance
//   Document · DocumentUpload · Report · Goal · Complaint
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared primitives ─────────────────────────────────────────────────────────

export type ISODateString   = string  // "2026-04-22"
export type LocaleDateString = string // "Apr 22, 2026"
export type TimeString       = string // "HH:MM"  e.g. "09:00"

export interface PaginatedResponse<T> {
  data:       T[]
  total:      number
  page:       number
  pageSize:   number
  totalPages: number
}

export interface ApiResponse<T> {
  data:     T
  message?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// CURRENT EMPLOYEE PROFILE  (SSR / session context)
// ─────────────────────────────────────────────────────────────────────────────

export interface EssEmployee {
  id:         number
  empId:      string          // "EMP-2341"
  name:       string
  avatarUrl:  string
  role:       string
  department: string
  email:      string
  phone:      string
  location:   string
  joinDate:   LocaleDateString
  timezone:   string          // "GMT+7"
}

// GET /api/ess/me  → ApiResponse<EssEmployee>

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE
// ─────────────────────────────────────────────────────────────────────────────

export interface AttendanceRecord {
  id:        number
  date:      LocaleDateString
  clockIn:   TimeString | null   // null = absent / not clocked in
  clockOut:  TimeString | null
  projectId: number | null       // FK → Project.id
  hoursWorked: number | null     // computed (clockOut - clockIn in hours)
}

export interface Project {
  id:      number
  name:    string
  address: string
  lat?:    number
  lng?:    number
}

export interface ClockInBody {
  projectId?: number
  timestamp:  ISODateString   // ISO datetime with time
}

export interface ClockOutBody {
  timestamp: ISODateString
}

// GET  /api/ess/attendance                         → PaginatedResponse<AttendanceRecord>
//   ?from=YYYY-MM-DD&to=YYYY-MM-DD for date range
// GET  /api/ess/attendance/today                   → ApiResponse<AttendanceRecord>
// POST /api/ess/attendance/clock-in                → ApiResponse<AttendanceRecord>
// POST /api/ess/attendance/clock-out               → ApiResponse<AttendanceRecord>
// GET  /api/ess/projects                           → ApiResponse<Project[]>

// ─────────────────────────────────────────────────────────────────────────────
// LEAVE
// ─────────────────────────────────────────────────────────────────────────────

export type LeaveType   = "Sick" | "Annual" | "Maternity" | "Paternity" | "Emergency" | "Casual"
export type LeaveStatus = "Approved" | "Pending" | "Rejected"

export interface LeaveBalance {
  leaveType:  LeaveType
  total:      number    // days allocated per year
  used:       number    // days consumed (approved requests)
  pending:    number    // days in pending requests
  remaining:  number    // total - used
}

export interface EssLeaveRequest {
  id:        number
  leaveType: LeaveType
  startDate: LocaleDateString
  endDate:   LocaleDateString
  days:      number           // computed (endDate - startDate inclusive)
  status:    LeaveStatus
  reason:    string
  submittedAt: ISODateString
}

export type CreateEssLeaveRequestBody = {
  leaveType: LeaveType
  startDate: ISODateString
  endDate:   ISODateString
  reason?:   string
}

// GET  /api/ess/leave                   → PaginatedResponse<EssLeaveRequest>
// POST /api/ess/leave                   → ApiResponse<EssLeaveRequest>
// GET  /api/ess/leave/balance           → ApiResponse<LeaveBalance[]>
// DELETE /api/ess/leave/:id             → ApiResponse<{ id: number }>  (cancel pending)

// ─────────────────────────────────────────────────────────────────────────────
// PAYROLL — PAYSLIP
// ─────────────────────────────────────────────────────────────────────────────

export interface EarningLine {
  label:  string
  amount: number
}

export interface DeductionLine {
  label:  string
  amount: number
}

export interface Payslip {
  id:         number
  period:     string          // "March 2026"
  month:      string          // "Mar"
  year:       number
  earnings:   EarningLine[]
  deductions: DeductionLine[]
  grossPay:   number          // sum of earnings (computed)
  totalDeductions: number     // sum of deductions (computed)
  netPay:     number          // grossPay - totalDeductions (computed)
}

export interface YTDSummary {
  year:            number
  payslipCount:    number
  ytdGross:        number
  ytdDeductions:   number
  ytdNet:          number
  latestNetPay:    number
  prevNetPay:      number
  netPayDelta:     number    // latestNetPay - prevNetPay
}

export interface YearEndDocument {
  label:     string          // "P60 – Annual Earnings Statement 2025"
  desc:      string
  year:      number
  available: boolean
  fileUrl?:  string
}

// GET  /api/ess/payroll/payslips         → PaginatedResponse<Payslip>
// GET  /api/ess/payroll/payslips/:id     → ApiResponse<Payslip>
// GET  /api/ess/payroll/payslips/:id/pdf → binary PDF download
// GET  /api/ess/payroll/ytd              → ApiResponse<YTDSummary>
// GET  /api/ess/payroll/year-end-docs    → ApiResponse<YearEndDocument[]>
// GET  /api/ess/payroll/year-end-docs/:year/pdf → binary PDF download

// ─────────────────────────────────────────────────────────────────────────────
// PAYROLL — ALLOWANCE
// ─────────────────────────────────────────────────────────────────────────────

export type AllowanceFrequency = "Monthly" | "Quarterly" | "Annual" | "One-time"
export type AllowanceStatus    = "Active" | "Pending" | "Discontinued"

export interface Allowance {
  id:          number
  name:        string
  category:    string        // "Travel" | "Food" | "Equipment" | "Wellness" | "Incentive" | "Development"
  amount:      number
  frequency:   AllowanceFrequency
  effectiveFrom: LocaleDateString
  status:      AllowanceStatus
  note?:       string
  monthlyEquiv: number       // normalised to monthly for display (computed)
}

export interface CompensationHistoryRow {
  period:     string         // "Mar 2026"
  baseSalary: number
  allowances: number         // total allowance for that period
  gross:      number
  change:     number         // month-over-month gross delta
}

export interface AllowanceSummary {
  baseSalary:       number
  totalMonthly:     number   // sum of active monthly-equivalent allowances
  grossMonthly:     number   // baseSalary + totalMonthly
  activeCount:      number
  allowances:       Allowance[]
  history:          CompensationHistoryRow[]
}

// GET /api/ess/payroll/allowances  → ApiResponse<AllowanceSummary>

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────

export type DocCategory = "Company-issued" | "Certificate" | "Personal" | "Payroll" | "Uploaded"
export type DocStatus   = "Verified" | "Pending" | "Expired"
export type DocFileType = "pdf" | "png" | "jpg" | "docx"

export interface EmployeeDocument {
  id:         number
  name:       string
  category:   DocCategory
  fileType:   DocFileType
  sizeLabel:  string          // "284 KB"
  sizeBytes:  number
  issuedBy:   string
  issuedOn:   LocaleDateString
  expiresOn?: LocaleDateString
  status:     DocStatus
  fileUrl:    string          // signed URL for download/preview
  previewText?: string        // short description shown in preview
}

export interface DocumentStats {
  total:    number
  verified: number
  pending:  number
  expired:  number
}

// GET  /api/ess/documents                          → ApiResponse<{ docs: EmployeeDocument[]; stats: DocumentStats }>
//   ?category=Company-issued&search=contract
// GET  /api/ess/documents/:id                      → ApiResponse<EmployeeDocument>
// GET  /api/ess/documents/:id/download             → binary file (signed URL redirect)

// ── Document upload ───────────────────────────────────────────────

export type UploadCategory = "Medical Certificate" | "Expense Receipt" | "Personal ID" | "Training Certificate" | "Other"

export interface DocumentUploadRequest {
  category:    UploadCategory
  note?:       string
  // file sent as multipart/form-data
}

export interface DocumentUploadResponse {
  id:       number
  name:     string
  status:   "Pending"
  fileUrl:  string
  uploadedAt: ISODateString
}

// POST /api/ess/documents/upload  (multipart/form-data)  → ApiResponse<DocumentUploadResponse>
// DELETE /api/ess/documents/:id                          → ApiResponse<{ id: number }>  (own uploaded docs only)

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS & GOALS
// ─────────────────────────────────────────────────────────────────────────────

export type EssReportType   = "Performance" | "Work Summary" | "Incident" | "Goal Update"
export type EssReportStatus = "Submitted" | "Under Review" | "Resolved" | "Closed"

export interface EssReport {
  id:          number
  title:       string
  type:        EssReportType
  period:      string          // "Q1 2026" | "Mar 2026" | "H1 2026"
  submittedOn: LocaleDateString
  status:      EssReportStatus
  summary:     string
  score?:      number          // 0-100, performance reports only
}

export interface Goal {
  id:      number
  label:   string
  target:  number
  current: number
  unit:    string              // "tasks" | "sessions"
}

export interface ReportPageData {
  reports:   EssReport[]
  goals:     Goal[]
  avgScore:  number
  stats: {
    total:       number
    underReview: number
    resolved:    number
    closed:      number
  }
}

// GET /api/ess/reports          → ApiResponse<ReportPageData>
// GET /api/ess/reports/:id      → ApiResponse<EssReport>

// ─────────────────────────────────────────────────────────────────────────────
// COMPLAINTS
// ─────────────────────────────────────────────────────────────────────────────

export type ComplaintCategory = "Workplace Harassment" | "Discrimination" | "Safety Concern" | "Manager Conduct" | "Policy Violation" | "Other"
export type ComplaintStatus   = "Submitted" | "Under Investigation" | "Resolved" | "Closed"
export type ComplaintPriority = "Low" | "Medium" | "High" | "Critical"

export interface ComplaintUpdate {
  date: LocaleDateString
  text: string
}

export interface Complaint {
  id:          number
  ref:         string            // "CMP-1001"
  title:       string
  category:    ComplaintCategory
  priority:    ComplaintPriority
  submittedOn: LocaleDateString
  status:      ComplaintStatus
  anonymous:   boolean
  description: string
  updates:     ComplaintUpdate[]
  attachmentUrl?: string
}

export type CreateComplaintBody = {
  title:       string
  category:    ComplaintCategory
  priority:    ComplaintPriority
  description: string
  anonymous:   boolean
  // attachment sent as multipart/form-data (optional)
}

// GET  /api/ess/complaints          → PaginatedResponse<Complaint>
// GET  /api/ess/complaints/:id      → ApiResponse<Complaint>
// POST /api/ess/complaints          (multipart/form-data) → ApiResponse<Complaint>
