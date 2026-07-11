"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Minus, Landmark, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import {
  payrollService,
  type ApiMyPaymentDetails,
  type ApiMyAllowances,
  type ApiMyPayslip,
} from "@/services/payroll.service"

// ── Helpers ─────────────────────────────────────────────────────
function fmt(n: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n)
}

// "2026-03" → "Mar 2026"
function periodLabel(period: string) {
  const [y, m] = period.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "short", year: "numeric", timeZone: "UTC",
  })
}

const dotPalette = ["#5e81f4", "#34d399", "#fb923c", "#f472b6", "#a78bfa", "#38bdf8"]

// ── Payment details + compensation snapshot (read-only, masked by the server) ──
function PaymentDetailsCard({ comp, loading }: { comp: ApiMyPaymentDetails | null; loading: boolean }) {
  return (
    <div className="mb-5 rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-4 py-3 md:px-5">
        <h2 className="text-sm font-semibold text-foreground">Payment Details</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Where your salary is paid. Contact HR if anything here is incorrect.
        </p>
      </div>

      <div className="px-4 py-3 md:px-5">
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : !comp ? (
          <p className="text-xs text-muted-foreground">
            No payment details on file yet — HR will set these up with your salary account.
          </p>
        ) : (
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#3b5bdb]">
              {comp.paymentMethod === "BANK" ? <Landmark className="size-5" /> : <Smartphone className="size-5" />}
            </span>
            {comp.paymentMethod === "BANK" && comp.bank ? (
              <div>
                <p className="text-xs font-medium text-foreground">
                  {comp.bank.bankName} · {comp.bank.accountNumberMasked}
                </p>
                <p className="text-xs text-muted-foreground">
                  Bank Transfer · {comp.bank.accountName}
                </p>
              </div>
            ) : comp.paymentMethod === "MOMO" && comp.momo ? (
              <div>
                <p className="text-xs font-medium text-foreground">
                  {comp.momo.provider} · {comp.momo.numberMasked}
                </p>
                <p className="text-xs text-muted-foreground">Mobile Money</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Payment method set to {comp.paymentMethod === "BANK" ? "Bank Transfer" : "Mobile Money"}, but no
                account is on file — contact HR.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────
export default function AllowancePage() {
  const { accessToken } = useAuth()

  const [comp,        setComp]        = useState<ApiMyPaymentDetails | null>(null)
  const [compLoading, setCompLoading] = useState(true)

  const [allowanceData,  setAllowanceData]  = useState<ApiMyAllowances | null>(null)
  const [allowLoading,   setAllowLoading]   = useState(true)

  const [payslips,      setPayslips]      = useState<ApiMyPayslip[]>([])
  const [slipsLoading,  setSlipsLoading]  = useState(true)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false

    payrollService.getMyPaymentDetails(accessToken)
      .then((res) => { if (!cancelled) setComp(res.data) })
      .catch(() => { if (!cancelled) setComp(null) })
      .finally(() => { if (!cancelled) setCompLoading(false) })

    payrollService.getMyAllowances(accessToken)
      .then((res) => { if (!cancelled) setAllowanceData(res.data) })
      .catch(() => { if (!cancelled) setAllowanceData(null) })
      .finally(() => { if (!cancelled) setAllowLoading(false) })

    payrollService.getMyPayslips(accessToken)
      .then((res) => { if (!cancelled) setPayslips(res.data) })
      .catch(() => { if (!cancelled) setPayslips([]) })
      .finally(() => { if (!cancelled) setSlipsLoading(false) })

    return () => { cancelled = true }
  }, [accessToken])

  const currency = comp?.currency ?? allowanceData?.currency ?? "GHS"
  const allowances = allowanceData?.allowances ?? []
  const totalAllowances = allowances.reduce((s, a) => s + a.amount, 0)
  const baseSalary = comp?.baseSalary ?? 0
  const grossMonthly = baseSalary + totalAllowances

  return (
    <div className="flex h-full flex-col">
      {/* Mobile title */}
      <div className="border-b border-border bg-white px-3 py-2.5 lg:hidden">
        <h1 className="text-sm font-semibold text-foreground">Allowances</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Compensation › Allowance</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-5 lg:p-6">

        {/* ── Summary cards ── */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Gross monthly */}
          <div
            className="relative overflow-hidden rounded-2xl p-4 text-white sm:col-span-1"
            style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
          >
            <span className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
            <p className="mb-1 text-xs text-white/70">Total Monthly Package</p>
            <p className="text-2xl font-bold">{compLoading || allowLoading ? "—" : fmt(grossMonthly, currency)}</p>
            <p className="mt-1 text-xs text-white/70">Base + Allowances</p>
          </div>

          {/* Base salary */}
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Base Salary</p>
            <p className="text-xl font-bold text-foreground">{compLoading ? "—" : fmt(baseSalary, currency)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              per month{comp?.jobTitle ? ` · ${comp.jobTitle}` : ""}
            </p>
            {comp?.effectiveFrom && (
              <div className="mt-2.5 flex items-center gap-1 text-xs text-muted-foreground">
                Effective {new Date(comp.effectiveFrom).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            )}
          </div>

          {/* Total allowances */}
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Monthly Allowances</p>
            <p className="text-xl font-bold text-foreground">{allowLoading ? "—" : fmt(totalAllowances, currency)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{allowances.length} active components</p>
          </div>
        </div>

        {/* ── Payment details ── */}
        <PaymentDetailsCard comp={comp} loading={compLoading} />

        {/* ── Allowance table ── */}
        <div className="mb-5 rounded-2xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-4 py-3 md:px-5">
            <h2 className="text-sm font-semibold text-foreground">Allowance Components</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Company-wide allowances configured by HR — applied to every payroll run
            </p>
          </div>

          <div className="overflow-x-auto">
            {allowLoading ? (
              <p className="px-4 py-5 text-xs text-muted-foreground md:px-5">Loading…</p>
            ) : allowances.length === 0 ? (
              <p className="px-4 py-5 text-xs text-muted-foreground md:px-5">
                No allowances have been configured yet.
              </p>
            ) : (
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:px-5">Component</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {allowances.map((a, i) => (
                    <tr key={a.name} className="border-t border-border">
                      <td className="px-4 py-3 md:px-5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: dotPalette[i % dotPalette.length] }}
                          />
                          <p className="text-xs font-medium text-foreground">{a.name}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right text-xs font-semibold text-foreground">{fmt(a.amount, currency)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-border bg-muted/20">
                    <td className="px-4 py-3 text-xs font-semibold text-foreground md:px-5">Total</td>
                    <td className="px-3 py-3 text-right text-xs font-bold text-foreground">{fmt(totalAllowances, currency)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Compensation history ── */}
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-4 py-3 md:px-5">
            <h2 className="text-sm font-semibold text-foreground">Compensation History</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Month-over-month package changes, from approved payroll runs</p>
          </div>

          <div className="overflow-x-auto">
            {slipsLoading ? (
              <p className="px-4 py-5 text-xs text-muted-foreground md:px-5">Loading…</p>
            ) : payslips.length === 0 ? (
              <p className="px-4 py-5 text-xs text-muted-foreground md:px-5">
                No payroll history yet.
              </p>
            ) : (
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:px-5">Period</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Base</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Allowances</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gross</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payslips.map((p, i) => {
                    const prior = payslips[i + 1]
                    const change = prior ? p.gross - prior.gross : null
                    return (
                      <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-xs font-medium text-foreground md:px-5">{periodLabel(p.period)}</td>
                        <td className="px-3 py-3 text-right text-xs text-muted-foreground">{fmt(p.baseSalary, p.currency)}</td>
                        <td className="px-3 py-3 text-right text-xs text-muted-foreground">{fmt(p.allowances, p.currency)}</td>
                        <td className="px-3 py-3 text-right text-xs font-semibold text-foreground">{fmt(p.gross, p.currency)}</td>
                        <td className="px-3 py-3 text-right">
                          {change === null ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : change > 0 ? (
                            <span className="flex items-center justify-end gap-1 text-xs font-medium text-[#16a34a]">
                              <TrendingUp className="size-3.5" />+{fmt(change, p.currency)}
                            </span>
                          ) : change < 0 ? (
                            <span className="flex items-center justify-end gap-1 text-xs font-medium text-[#dc2626]">
                              <TrendingDown className="size-3.5" />{fmt(change, p.currency)}
                            </span>
                          ) : (
                            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                              <Minus className="size-3.5" />—
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
