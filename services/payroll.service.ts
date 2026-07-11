import { api } from "@/lib/api-client"

// ── Settings ──────────────────────────────────────────────────
export interface ApiFundingAccount {
  bankName:      string
  branch:        string
  accountName:   string
  accountNumber: string
}

export interface ApiPayrollAllowance {
  id?:    number
  name:   string
  amount: number
}

export interface ApiPayrollSettings {
  payCycle:        "Weekly" | "Bi-weekly" | "Monthly"
  payDay:          number                 // day of month, 1–28
  payMethod:       "Bank Transfer" | "Mobile Money" | "Cheque" | "Cash"
  currency:        string                 // ISO code e.g. "GHS"
  taxScheme:       string                 // e.g. "PAYE"
  pensionPct:      number                 // employee pension contribution %
  autoProcess:     boolean
  requireApproval: boolean
  fundingAccount:  ApiFundingAccount | null   // company account debited on the bank advice
  allowances:      ApiPayrollAllowance[]
}

// ── Runs & payslips ───────────────────────────────────────────
export type PayrollRunStatus =
  | "DRAFT"
  | "CALCULATED"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "PAID"
  // Legacy backend values (pre-approval-flow rows)
  | "SCHEDULED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"

export type PayslipStatus = "PAID" | "PROCESSING" | "PENDING" | "FAILED"

export interface ApiPayslipItem {
  name:       string   // e.g. "Base Salary", "Transport", "PAYE", "SSNIT (5.5%)"
  amount:     number
  statutory?: boolean
}

export interface ApiPayslip {
  id:              string
  gross:           number
  totalDeductions: number
  netPay:          number
  baseSalary:      number
  bonus:           number
  earnings?:       ApiPayslipItem[]   // not itemized yet server-side
  deductions?:     ApiPayslipItem[]
  paymentStatus:   PayslipStatus
  employee: {
    id:         string
    department: string | null
    user: {
      name:      string
      email:     string
      avatarUrl: string | null
    } | null
  }
}

export interface ApiPayrollRun {
  id:            string            // cuid
  period:        string            // "YYYY-MM"
  status:        PayrollRunStatus
  employeeCount: number
  payDate:       string            // ISO date
  totals:        { gross: number; deductions: number; net: number }
  createdAt?:    string
  paidAt?:       string | null
  payslips?:     ApiPayslip[]      // only present on GET /:id
}

// ── Dashboard summary ─────────────────────────────────────────
export interface ApiPayrollSummary {
  currentPeriod:   string
  totalNet:        number
  totalGross:      number
  totalDeductions: number
  netChangePct:    number
  grossChangePct:  number
  deductionsChangePct: number
  distribution:    { department: string; amount: number }[]
  upcoming:        { period: string; payDate: string } | null
}

// ── Employee compensation ─────────────────────────────────────
export interface ApiCompensation {
  baseSalary:    number
  currency:      string
  effectiveFrom: string
  paymentMethod: "BANK" | "MOMO"
  bank?:         { bankName: string; accountNumber: string; accountName: string }
  momo?:         { provider: string; number: string }
}

// ── ESS: own payslips (approved/paid runs only) ───────────────
export interface ApiMyPayslip {
  id:         string
  period:     string          // "YYYY-MM"
  payDate:    string
  baseSalary: number
  allowances: number
  gross:      number
  deductions: number
  netPay:     number
  status:     "PENDING" | "PROCESSING" | "PAID"
  paidAt:     string | null
  currency:   string
}

// ── ESS: own compensation + payment details (read-only, masked server-side) ──
export interface ApiMyPaymentDetails {
  jobTitle:      string | null
  baseSalary:    number
  currency:      string
  effectiveFrom: string
  paymentMethod: "BANK" | "MOMO"
  bank?:         { bankName: string; accountName: string; accountNumberMasked: string }
  momo?:         { provider: string; numberMasked: string }
}

// ── ESS: company-wide allowance components (applied to every payroll run) ──
export interface ApiMyAllowances {
  currency:   string
  allowances: { name: string; amount: number }[]
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

export const payrollService = {
  // Settings
  getSettings: (token: string) =>
    api.get<{ success: boolean; data: ApiPayrollSettings }>("/payroll/settings", auth(token)),

  updateSettings: (body: Partial<ApiPayrollSettings>, token: string) =>
    api.patch<{ success: boolean; data: ApiPayrollSettings }>("/payroll/settings", body, auth(token)),

  // Dashboard summary (stats cards + pay distribution + upcoming)
  summary: (token: string) =>
    api.get<{ success: boolean; data: ApiPayrollSummary }>("/payroll/summary", auth(token)),

  // Runs
  listRuns: (token: string, params: { page?: number; limit?: number } = {}) => {
    const qs = new URLSearchParams()
    if (params.page)  qs.set("page",  String(params.page))
    if (params.limit) qs.set("limit", String(params.limit))
    const q = qs.toString()
    return api.get<{ success: boolean; data: ApiPayrollRun[] }>(
      `/payroll/runs${q ? `?${q}` : ""}`, auth(token),
    )
  },

  getRun: (id: string, token: string) =>
    api.get<{ success: boolean; data: ApiPayrollRun }>(`/payroll/runs/${id}`, auth(token)),

  /** Calculate a run for a period ("YYYY-MM"); omit period for the current month.
   *  meta.skipped lists employees excluded because they have no compensation record. */
  createRun: (body: { period?: string }, token: string) =>
    api.post<{
      success: boolean
      data:    ApiPayrollRun
      meta:    { skipped: string[]; skippedCount: number }
    }>("/payroll/runs", body, auth(token)),

  approveRun: (id: string, token: string) =>
    api.post<{ success: boolean; data: ApiPayrollRun }>(`/payroll/runs/${id}/approve`, undefined, auth(token)),

  markRunPaid: (id: string, token: string) =>
    api.post<{ success: boolean; data: ApiPayrollRun }>(`/payroll/runs/${id}/mark-paid`, undefined, auth(token)),

  // Employee compensation
  getCompensation: (employeeId: string, token: string) =>
    api.get<{ success: boolean; data: ApiCompensation }>(
      `/employees/${employeeId}/compensation`, auth(token),
    ),

  updateCompensation: (employeeId: string, body: Partial<ApiCompensation>, token: string) =>
    api.patch<{ success: boolean; data: ApiCompensation }>(
      `/employees/${employeeId}/compensation`, body, auth(token),
    ),

  // ESS: the logged-in employee's own payout details (null if HR hasn't set them)
  getMyPaymentDetails: (token: string) =>
    api.get<{ success: boolean; data: ApiMyPaymentDetails | null }>(
      "/payroll/me/payment-details", auth(token),
    ),

  // ESS: the logged-in employee's own payslips, newest first
  getMyPayslips: (token: string) =>
    api.get<{ success: boolean; data: ApiMyPayslip[] }>(
      "/payroll/me/payslips", auth(token),
    ),

  // ESS: the company-wide allowance components HR has configured
  getMyAllowances: (token: string) =>
    api.get<{ success: boolean; data: ApiMyAllowances }>(
      "/payroll/me/allowances", auth(token),
    ),
}
