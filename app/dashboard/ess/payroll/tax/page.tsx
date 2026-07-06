"use client"

import { useEffect, useState } from "react"
import { X, TrendingUp, Wallet, BadgeDollarSign, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { payrollService, type ApiMyPayslip } from "@/services/payroll.service"

// ── Helpers ─────────────────────────────────────────────────────
function fmt(n: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n)
}

// "2026-03" → "March 2026"
function periodLabel(period: string) {
  const [y, m] = period.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long", year: "numeric", timeZone: "UTC",
  })
}

const statusBadge: Record<ApiMyPayslip["status"], string> = {
  PAID:       "bg-emerald-100 text-emerald-700",
  PROCESSING: "bg-amber-100 text-amber-700",
  PENDING:    "bg-muted text-muted-foreground",
}

// ── Detail modal ─────────────────────────────────────────────────
function PayslipModal({ p, onClose }: { p: ApiMyPayslip; onClose: () => void }) {
  const { user } = useAuth()
  const er = p.gross > 0 ? (p.deductions / p.gross) * 100 : 0
  const money = (n: number) => fmt(n, p.currency)

  const earnings = [
    { label: "Base Salary", amount: p.baseSalary },
    ...(p.allowances > 0 ? [{ label: "Allowances", amount: p.allowances }] : []),
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div
          className="relative overflow-hidden px-6 py-5 text-white"
          style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
        >
          <span className="absolute -right-6 -top-6 size-28 rounded-full bg-white/10" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs text-white/70">Payslip for</p>
              <p className="mt-0.5 text-xl font-bold">{periodLabel(p.period)}</p>
              <div className="mt-3">
                <p className="text-sm font-semibold">{user?.name ?? "—"}</p>
                <p className="text-xs text-white/70">{user?.email ?? ""}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-white/70 hover:bg-white/20">
              <X className="size-5" />
            </button>
          </div>

          {/* Net pay callout */}
          <div className="relative mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs text-white/70">Net Pay</p>
              <p className="text-3xl font-bold">{money(p.netPay)}</p>
            </div>
            <div className="text-right text-xs text-white/70">
              <p>Effective deduction rate</p>
              <p className="text-base font-semibold text-white">{er.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Earnings */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Earnings</p>
              <div className="flex flex-col gap-2">
                {earnings.map((e, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{e.label}</span>
                    <span className="text-sm font-medium text-foreground">{money(e.amount)}</span>
                  </div>
                ))}
                <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
                  <span className="text-sm font-semibold text-foreground">Gross</span>
                  <span className="text-sm font-bold text-foreground">{money(p.gross)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deductions</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Tax &amp; Statutory</span>
                  <span className="text-sm font-medium text-[#dc2626]">-{money(p.deductions)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-sm font-bold text-[#dc2626]">-{money(p.deductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net pay row */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
            <span className="text-sm font-semibold text-foreground">Net Pay</span>
            <span className="text-xl font-bold text-primary">{money(p.netPay)}</span>
          </div>

          {/* Breakdown bar */}
          {p.gross > 0 && (
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Earnings breakdown</span>
                <span>{money(p.gross)} gross</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="float-left h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(p.netPay / p.gross) * 100}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-xs">
                <span className="text-primary font-medium">
                  {money(p.netPay)} net ({((p.netPay / p.gross) * 100).toFixed(0)}%)
                </span>
                <span className="text-[#dc2626]">
                  {money(p.deductions)} deducted ({((p.deductions / p.gross) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          )}

          {/* Payment status */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Pay date:{" "}
              {new Date(p.payDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className={cn("rounded-full px-2.5 py-1 font-semibold", statusBadge[p.status])}>
              {p.status === "PAID" ? "Paid" : p.status === "PROCESSING" ? "Processing" : "Pending"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────
export default function PayslipsPage() {
  const { accessToken } = useAuth()
  const [payslips, setPayslips] = useState<ApiMyPayslip[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [selected, setSelected] = useState<ApiMyPayslip | null>(null)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    setLoading(true)
    setError(null)
    payrollService
      .getMyPayslips(accessToken)
      .then((res) => { if (!cancelled) setPayslips(res.data) })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load payslips")
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [accessToken])

  const currency = payslips[0]?.currency ?? "GHS"

  // YTD = current-year payslips
  const thisYear  = String(new Date().getFullYear())
  const ytd       = payslips.filter((p) => p.period.startsWith(thisYear))
  const ytdGross  = ytd.reduce((s, p) => s + p.gross, 0)
  const ytdDeduct = ytd.reduce((s, p) => s + p.deductions, 0)
  const ytdNet    = ytd.reduce((s, p) => s + p.netPay, 0)

  const delta = payslips.length >= 2 ? payslips[0].netPay - payslips[1].netPay : null

  return (
    <div className="flex h-full flex-col">
      {/* Mobile title */}
      <div className="border-b border-border bg-white px-4 py-3 lg:hidden">
        <h1 className="text-base font-semibold text-foreground">Payslips</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Compensation › Payslips</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading payslips…</p>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-medium text-[#dc2626]">{error}</p>
            <p className="mt-1 text-xs text-muted-foreground">Try refreshing the page, or contact HR if this persists.</p>
          </div>
        ) : payslips.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-foreground">No payslips yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your payslips will appear here once payroll has been processed.
            </p>
          </div>
        ) : (
          <>
            {/* ── YTD summary ── */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div
                className="relative col-span-2 overflow-hidden rounded-2xl p-5 text-white sm:col-span-1"
                style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
              >
                <span className="absolute -right-4 -top-4 size-20 rounded-full bg-white/10" />
                <p className="text-xs text-white/70">YTD Net Pay</p>
                <p className="mt-0.5 text-2xl font-bold">{fmt(ytdNet, currency)}</p>
                <p className="mt-1 text-[11px] text-white/70">{ytd.length} payslips in {thisYear}</p>
              </div>

              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <BadgeDollarSign className="size-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">YTD Gross</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{fmt(ytdGross, currency)}</p>
              </div>

              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-rose-100">
                  <Receipt className="size-4 text-rose-500" />
                </div>
                <p className="text-xs text-muted-foreground">YTD Deductions</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{fmt(ytdDeduct, currency)}</p>
              </div>

              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-emerald-100">
                  <Wallet className="size-4 text-emerald-600" />
                </div>
                <p className="text-xs text-muted-foreground">vs Last Month</p>
                {delta === null ? (
                  <p className="mt-0.5 text-lg font-bold text-foreground">—</p>
                ) : (
                  <>
                    <p className={cn(
                      "mt-0.5 text-lg font-bold",
                      delta > 0 ? "text-[#16a34a]" : delta < 0 ? "text-[#dc2626]" : "text-foreground"
                    )}>
                      {delta > 0 ? "+" : ""}{fmt(delta, currency)}
                    </p>
                    <div className={cn(
                      "mt-1 flex items-center gap-1 text-xs",
                      delta > 0 ? "text-[#16a34a]" : delta < 0 ? "text-[#dc2626]" : "text-muted-foreground"
                    )}>
                      <TrendingUp className="size-3" />
                      net pay change
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── Payslip cards ── */}
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">All Payslips</h2>
              <p className="text-xs text-muted-foreground">{payslips.length} records</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {payslips.map((p, i) => {
                const isLatest = i === 0
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "group relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5",
                      isLatest ? "border-primary/30" : "border-border"
                    )}
                    onClick={() => setSelected(p)}
                  >
                    {isLatest && (
                      <span className="absolute right-4 top-4 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        Latest
                      </span>
                    )}

                    {/* Period */}
                    <p className="text-sm font-semibold text-foreground">{periodLabel(p.period)}</p>

                    {/* Net pay */}
                    <p className="mt-2 text-2xl font-bold text-foreground">{fmt(p.netPay, p.currency)}</p>
                    <p className="text-xs text-muted-foreground">net pay</p>

                    {/* Breakdown bar */}
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${p.gross > 0 ? (p.netPay / p.gross) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                      <span>{fmt(p.gross, p.currency)} gross</span>
                      <span className="text-[#dc2626]">-{fmt(p.deductions, p.currency)} deducted</span>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(p) }}
                        className="flex-1 rounded-lg border border-border py-2 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        View Details
                      </button>
                      <span className={cn("rounded-full px-2.5 py-1.5 text-[10px] font-semibold", statusBadge[p.status])}>
                        {p.status === "PAID" ? "Paid" : p.status === "PROCESSING" ? "Processing" : "Pending"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

      </div>

      {selected && <PayslipModal p={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
