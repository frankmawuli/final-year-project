"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ───────────────────────────────────────────────────────
type Frequency = "Monthly" | "Quarterly" | "Annual" | "One-time"
type AllowanceStatus = "Active" | "Pending" | "Discontinued"

interface AllowanceComponent {
  id:        number
  name:      string
  category:  string
  amount:    number
  frequency: Frequency
  effective: string
  status:    AllowanceStatus
  note?:     string
}

// ── Style maps ──────────────────────────────────────────────────
const statusBadge: Record<AllowanceStatus, string> = {
  Active:       "bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]",
  Pending:      "bg-[#fffbeb] text-[#d97706] border border-[#d97706]",
  Discontinued: "bg-[#fef2f2] text-[#dc2626] border border-[#dc2626]",
}

const freqBadge: Record<Frequency, string> = {
  "Monthly":   "bg-[#dbeafe] text-[#1d4ed8]",
  "Quarterly": "bg-[#f3e8ff] text-[#7c3aed]",
  "Annual":    "bg-[#fef9c3] text-[#854d0e]",
  "One-time":  "bg-[#ffedd5] text-[#ea580c]",
}

// ── Data ────────────────────────────────────────────────────────
const baseSalary = 4_500

const allowances: AllowanceComponent[] = [
  { id: 1, name: "Transport Allowance",    category: "Travel",      amount: 200,   frequency: "Monthly",   effective: "Jan 01, 2026", status: "Active",       note: "Fixed monthly transport subsidy" },
  { id: 2, name: "Meal Allowance",         category: "Food",        amount: 150,   frequency: "Monthly",   effective: "Jan 01, 2026", status: "Active",       note: "Office days only" },
  { id: 3, name: "Remote Work Allowance",  category: "Equipment",   amount: 80,    frequency: "Monthly",   effective: "Mar 01, 2026", status: "Active",       note: "Internet & home office" },
  { id: 4, name: "Health Supplement",      category: "Wellness",    amount: 100,   frequency: "Monthly",   effective: "Jan 01, 2026", status: "Active"                                         },
  { id: 5, name: "Performance Bonus",      category: "Incentive",   amount: 600,   frequency: "Quarterly", effective: "Jan 01, 2026", status: "Active",       note: "Q1 target achieved: 112%" },
  { id: 6, name: "Training Reimbursement", category: "Development", amount: 1_200, frequency: "Annual",    effective: "Jan 01, 2026", status: "Active",       note: "Up to $1,200/yr for approved courses" },
  { id: 7, name: "Referral Bonus",         category: "Incentive",   amount: 500,   frequency: "One-time",  effective: "Feb 14, 2026", status: "Active",       note: "Successful hire: David Rodriguez" },
  { id: 8, name: "Commuter Subsidy",       category: "Travel",      amount: 60,    frequency: "Monthly",   effective: "Sep 01, 2025", status: "Discontinued", note: "Replaced by Remote Work Allowance" },
]

const categoryColors: Record<string, string> = {
  Travel:      "#5e81f4",
  Food:        "#34d399",
  Equipment:   "#fb923c",
  Wellness:    "#f472b6",
  Incentive:   "#a78bfa",
  Development: "#38bdf8",
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

function monthlyEquiv(a: AllowanceComponent): number {
  if (a.status === "Discontinued") return 0
  if (a.frequency === "Monthly")   return a.amount
  if (a.frequency === "Quarterly") return a.amount / 3
  if (a.frequency === "Annual")    return a.amount / 12
  return 0 // one-time
}

// ── History rows ─────────────────────────────────────────────────
const history = [
  { period: "Mar 2026", base: 4_500, allowance: 530, gross: 5_030, change:  30 },
  { period: "Feb 2026", base: 4_500, allowance: 500, gross: 5_000, change:   0 },
  { period: "Jan 2026", base: 4_500, allowance: 500, gross: 5_000, change: 200 },
  { period: "Dec 2025", base: 4_300, allowance: 360, gross: 4_660, change:   0 },
]

// ── Expandable row ───────────────────────────────────────────────
function AllowanceRow({ a }: { a: AllowanceComponent }) {
  const [open, setOpen] = useState(false)
  const dot = categoryColors[a.category] ?? "#8181a5"

  return (
    <>
      <tr
        className={cn(
          "cursor-pointer border-t border-border transition-colors hover:bg-muted/20",
          a.status === "Discontinued" && "opacity-50"
        )}
        onClick={() => setOpen((o) => !o)}
      >
        {/* Name */}
        <td className="px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: dot }}
            />
            <div>
              <p className="text-sm font-medium text-foreground">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.category}</p>
            </div>
          </div>
        </td>

        {/* Amount */}
        <td className="px-4 py-4 text-sm font-semibold text-foreground">{fmt(a.amount)}</td>

        {/* Frequency */}
        <td className="px-4 py-4">
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", freqBadge[a.frequency])}>
            {a.frequency}
          </span>
        </td>

        {/* Effective */}
        <td className="hidden px-4 py-4 text-sm text-muted-foreground md:table-cell">{a.effective}</td>

        {/* Status */}
        <td className="px-4 py-4">
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusBadge[a.status])}>
            {a.status}
          </span>
        </td>

        {/* Expand */}
        <td className="px-4 py-4 text-muted-foreground">
          {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </td>
      </tr>

      {/* Expanded note row */}
      {open && a.note && (
        <tr className="border-t border-border bg-muted/20">
          <td colSpan={6} className="px-5 py-3 md:px-6">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Note: </span>{a.note}
            </p>
          </td>
        </tr>
      )}
    </>
  )
}

// ── Main Page ───────────────────────────────────────────────────
export default function AllowancePage() {
  const activeAllowances = allowances.filter((a) => a.status !== "Discontinued")
  const totalMonthly     = activeAllowances.reduce((s, a) => s + monthlyEquiv(a), 0)
  const grossMonthly     = baseSalary + totalMonthly

  // Breakdown for bar
  const segments = Object.entries(categoryColors).map(([cat, color]) => {
    const total = activeAllowances
      .filter((a) => a.category === cat)
      .reduce((s, a) => s + monthlyEquiv(a), 0)
    return { cat, color, total }
  }).filter((s) => s.total > 0)

  return (
    <div className="flex h-full flex-col">
      {/* Mobile title */}
      <div className="border-b border-border bg-white px-4 py-3 lg:hidden">
        <h1 className="text-base font-semibold text-foreground">Allowances</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Compensation › Allowance</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

        {/* ── Summary cards ── */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Gross monthly */}
          <div
            className="relative overflow-hidden rounded-2xl p-5 text-white sm:col-span-1"
            style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
          >
            <span className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
            <p className="mb-1 text-xs text-white/70">Total Monthly Package</p>
            <p className="text-3xl font-bold">{fmt(grossMonthly)}</p>
            <p className="mt-1 text-xs text-white/70">Base + Allowances</p>

            
          
          </div>

          {/* Base salary */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Base Salary</p>
            <p className="text-2xl font-bold text-foreground">{fmt(baseSalary)}</p>
            <p className="mt-1 text-xs text-muted-foreground">per month · UI/UX Designer</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[#16a34a]">
              <TrendingUp className="size-3.5" />
              +4.7% from last review
            </div>
          </div>

          {/* Total allowances */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Monthly Allowances</p>
            <p className="text-2xl font-bold text-foreground">{fmt(totalMonthly)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{activeAllowances.length} active components</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[#d97706]">
              <TrendingUp className="size-3.5" />
              +{fmt(80)} added Mar 2026
            </div>
          </div>
        </div>

        {/* ── Allowance table ── */}
        <div className="mb-6 rounded-2xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-5 py-4 md:px-6">
            <h2 className="text-base font-semibold text-foreground">Allowance Components</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Click any row to see details</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:px-6">Component</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Effective From</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {allowances.map((a) => <AllowanceRow key={a.id} a={a} />)}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Monthly history ── */}
        <div className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-5 py-4 md:px-6">
            <h2 className="text-base font-semibold text-foreground">Compensation History</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Month-over-month package changes</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:px-6">Period</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Base</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Allowances</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gross</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-foreground md:px-6">{h.period}</td>
                    <td className="px-4 py-3.5 text-right text-sm text-muted-foreground">{fmt(h.base)}</td>
                    <td className="px-4 py-3.5 text-right text-sm text-muted-foreground">{fmt(h.allowance)}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-semibold text-foreground">{fmt(h.gross)}</td>
                    <td className="px-4 py-3.5 text-right">
                      {h.change > 0 ? (
                        <span className="flex items-center justify-end gap-1 text-xs font-medium text-[#16a34a]">
                          <TrendingUp className="size-3.5" />+{fmt(h.change)}
                        </span>
                      ) : h.change < 0 ? (
                        <span className="flex items-center justify-end gap-1 text-xs font-medium text-[#dc2626]">
                          <TrendingDown className="size-3.5" />{fmt(h.change)}
                        </span>
                      ) : (
                        <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          <Minus className="size-3.5" />—
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
