"use client"

import { useState } from "react"
import { Download, X, TrendingUp, Wallet, BadgeDollarSign, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ───────────────────────────────────────────────────────
interface EarningLine  { label: string; amount: number }
interface DeductLine   { label: string; amount: number }
interface Payslip {
  id:         number
  period:     string
  month:      string
  year:       number
  earnings:   EarningLine[]
  deductions: DeductLine[]
}

// ── Helpers ─────────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}
function gross(p: Payslip)   { return p.earnings.reduce((s, e) => s + e.amount, 0) }
function totalDeduct(p: Payslip) { return p.deductions.reduce((s, d) => s + d.amount, 0) }
function net(p: Payslip)     { return gross(p) - totalDeduct(p) }

// ── Seed data ────────────────────────────────────────────────────
const payslips: Payslip[] = [
  {
    id: 1, period: "March 2026", month: "Mar", year: 2026,
    earnings: [
      { label: "Base Salary",           amount: 4_500 },
      { label: "Transport Allowance",   amount:   200 },
      { label: "Meal Allowance",        amount:   150 },
      { label: "Remote Work Allowance", amount:    80 },
      { label: "Health Supplement",     amount:   100 },
    ],
    deductions: [
      { label: "Income Tax (22%)",      amount:   990 },
      { label: "Social Security",       amount:   310 },
      { label: "Health Insurance",      amount:   120 },
      { label: "Pension Contribution",  amount:   225 },
    ],
  },
  {
    id: 2, period: "February 2026", month: "Feb", year: 2026,
    earnings: [
      { label: "Base Salary",           amount: 4_500 },
      { label: "Transport Allowance",   amount:   200 },
      { label: "Meal Allowance",        amount:   150 },
      { label: "Health Supplement",     amount:   100 },
    ],
    deductions: [
      { label: "Income Tax (22%)",      amount:   990 },
      { label: "Social Security",       amount:   310 },
      { label: "Health Insurance",      amount:   120 },
      { label: "Pension Contribution",  amount:   225 },
    ],
  },
  {
    id: 3, period: "January 2026", month: "Jan", year: 2026,
    earnings: [
      { label: "Base Salary",           amount: 4_500 },
      { label: "Transport Allowance",   amount:   200 },
      { label: "Meal Allowance",        amount:   150 },
      { label: "Health Supplement",     amount:   100 },
    ],
    deductions: [
      { label: "Income Tax (22%)",      amount:   990 },
      { label: "Social Security",       amount:   310 },
      { label: "Health Insurance",      amount:   120 },
      { label: "Pension Contribution",  amount:   225 },
    ],
  },
  {
    id: 4, period: "December 2025", month: "Dec", year: 2025,
    earnings: [
      { label: "Base Salary",           amount: 4_300 },
      { label: "Transport Allowance",   amount:   200 },
      { label: "Meal Allowance",        amount:   150 },
      { label: "Year-end Bonus",        amount:   800 },
    ],
    deductions: [
      { label: "Income Tax (22%)",      amount: 1_166 },
      { label: "Social Security",       amount:   296 },
      { label: "Health Insurance",      amount:   120 },
      { label: "Pension Contribution",  amount:   215 },
    ],
  },
  {
    id: 5, period: "November 2025", month: "Nov", year: 2025,
    earnings: [
      { label: "Base Salary",           amount: 4_300 },
      { label: "Transport Allowance",   amount:   200 },
      { label: "Meal Allowance",        amount:   150 },
    ],
    deductions: [
      { label: "Income Tax (22%)",      amount:   946 },
      { label: "Social Security",       amount:   296 },
      { label: "Health Insurance",      amount:   120 },
      { label: "Pension Contribution",  amount:   215 },
    ],
  },
  {
    id: 6, period: "October 2025", month: "Oct", year: 2025,
    earnings: [
      { label: "Base Salary",           amount: 4_300 },
      { label: "Transport Allowance",   amount:   200 },
      { label: "Meal Allowance",        amount:   150 },
    ],
    deductions: [
      { label: "Income Tax (22%)",      amount:   946 },
      { label: "Social Security",       amount:   296 },
      { label: "Health Insurance",      amount:   120 },
      { label: "Pension Contribution",  amount:   215 },
    ],
  },
]

const employeePhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

// ── Detail modal ─────────────────────────────────────────────────
function PayslipModal({ p, onClose }: { p: Payslip; onClose: () => void }) {
  const g  = gross(p)
  const d  = totalDeduct(p)
  const n  = net(p)
  const er = (d / g) * 100

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
              <p className="mt-0.5 text-xl font-bold">{p.period}</p>
              <div className="mt-3 flex items-center gap-3">
                <img src={employeePhoto} alt="" className="size-9 rounded-full object-cover ring-2 ring-white/40" />
                <div>
                  <p className="text-sm font-semibold">Muhammad Rifky Andrianto</p>
                  <p className="text-xs text-white/70">UI/UX Designer · Engineering</p>
                </div>
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
              <p className="text-3xl font-bold">{fmt(n)}</p>
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
                {p.earnings.map((e, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{e.label}</span>
                    <span className="text-sm font-medium text-foreground">{fmt(e.amount)}</span>
                  </div>
                ))}
                <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
                  <span className="text-sm font-semibold text-foreground">Gross</span>
                  <span className="text-sm font-bold text-foreground">{fmt(g)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deductions</p>
              <div className="flex flex-col gap-2">
                {p.deductions.map((d, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{d.label}</span>
                    <span className="text-sm font-medium text-[#dc2626]">-{fmt(d.amount)}</span>
                  </div>
                ))}
                <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-sm font-bold text-[#dc2626]">-{fmt(d)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net pay row */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
            <span className="text-sm font-semibold text-foreground">Net Pay</span>
            <span className="text-xl font-bold text-primary">{fmt(n)}</span>
          </div>

          {/* Breakdown bar */}
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span>Earnings breakdown</span>
              <span>{fmt(g)} gross</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="float-left h-full rounded-full bg-primary transition-all"
                style={{ width: `${(n / g) * 100}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-xs">
              <span className="text-primary font-medium">{fmt(n)} net ({((n / g) * 100).toFixed(0)}%)</span>
              <span className="text-[#dc2626]">{fmt(d)} deducted ({((d / g) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Close
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:opacity-90">
            <Download className="size-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────
export default function PayslipsPage() {
  const [selected, setSelected] = useState<Payslip | null>(null)

  // YTD = 2026 payslips only
  const ytd2026    = payslips.filter((p) => p.year === 2026)
  const ytdGross   = ytd2026.reduce((s, p) => s + gross(p), 0)
  const ytdDeduct  = ytd2026.reduce((s, p) => s + totalDeduct(p), 0)
  const ytdNet     = ytd2026.reduce((s, p) => s + net(p), 0)

  const latestNet  = net(payslips[0])
  const prevNet    = net(payslips[1])
  const delta      = latestNet - prevNet

  return (
    <div className="flex h-full flex-col">
      {/* Mobile title */}
      <div className="border-b border-border bg-white px-4 py-3 lg:hidden">
        <h1 className="text-base font-semibold text-foreground">Payslips</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Compensation › Payslips</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

        {/* ── YTD summary ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            className="relative col-span-2 overflow-hidden rounded-2xl p-5 text-white sm:col-span-1"
            style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
          >
            <span className="absolute -right-4 -top-4 size-20 rounded-full bg-white/10" />
            <p className="text-xs text-white/70">YTD Net Pay</p>
            <p className="mt-0.5 text-2xl font-bold">{fmt(ytdNet)}</p>
            <p className="mt-1 text-[11px] text-white/70">{ytd2026.length} payslips in 2026</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <BadgeDollarSign className="size-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">YTD Gross</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">{fmt(ytdGross)}</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-rose-100">
              <Receipt className="size-4 text-rose-500" />
            </div>
            <p className="text-xs text-muted-foreground">YTD Deductions</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">{fmt(ytdDeduct)}</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-emerald-100">
              <Wallet className="size-4 text-emerald-600" />
            </div>
            <p className="text-xs text-muted-foreground">vs Last Month</p>
            <p className={cn(
              "mt-0.5 text-lg font-bold",
              delta > 0 ? "text-[#16a34a]" : delta < 0 ? "text-[#dc2626]" : "text-foreground"
            )}>
              {delta > 0 ? "+" : ""}{fmt(delta)}
            </p>
            <div className={cn(
              "mt-1 flex items-center gap-1 text-xs",
              delta > 0 ? "text-[#16a34a]" : delta < 0 ? "text-[#dc2626]" : "text-muted-foreground"
            )}>
              <TrendingUp className="size-3" />
              net pay change
            </div>
          </div>
        </div>

        {/* ── Payslip cards ── */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">All Payslips</h2>
          <p className="text-xs text-muted-foreground">{payslips.length} records</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {payslips.map((p, i) => {
            const g = gross(p)
            const n = net(p)
            const d = totalDeduct(p)
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
                <p className="text-sm font-semibold text-foreground">{p.period}</p>

                {/* Net pay */}
                <p className="mt-2 text-2xl font-bold text-foreground">{fmt(n)}</p>
                <p className="text-xs text-muted-foreground">net pay</p>

                {/* Breakdown bar */}
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(n / g) * 100}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                  <span>{fmt(g)} gross</span>
                  <span className="text-[#dc2626]">-{fmt(d)} deducted</span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(p) }}
                    className="flex-1 rounded-lg border border-border py-2 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                  >
                    <Download className="size-3.5" />
                    PDF
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Year-end documents ── */}
        <div className="mt-6 rounded-2xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-5 py-4 md:px-6">
            <h2 className="text-base font-semibold text-foreground">Year-end Documents</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Annual tax forms and statements</p>
          </div>
          <div className="divide-y divide-border">
            {[
              { label: "P60 – Annual Earnings Statement 2025", desc: "Full year tax summary", available: true  },
              { label: "P60 – Annual Earnings Statement 2024", desc: "Full year tax summary", available: true  },
              { label: "P60 – Annual Earnings Statement 2026", desc: "Available after Dec 2026", available: false },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 md:px-6">
                <div>
                  <p className={cn("text-sm font-medium", doc.available ? "text-foreground" : "text-muted-foreground")}>
                    {doc.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{doc.desc}</p>
                </div>
                {doc.available ? (
                  <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90">
                    <Download className="size-3.5" />
                    Download
                  </button>
                ) : (
                  <span className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                    Not yet available
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {selected && <PayslipModal p={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
