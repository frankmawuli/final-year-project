"use client"

import { useState } from "react"
import { Banknote, ChevronDown, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────
type Allowance = { id: number; name: string; amount: string }

// ── Primitives ────────────────────────────────────────────────
function Card({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string
  subtitle: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6]">
          <Icon className="size-4 text-[#6b7280]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#111827]">{title}</p>
          <p className="text-xs text-[#9ca3af]">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        checked ? "bg-[#5e81f4]" : "bg-[#e5e7eb]"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}

function Divider() {
  return <hr className="border-[#f3f4f6]" />
}

function Row({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#111827]">{label}</p>
        {hint && <p className="text-xs text-[#9ca3af]">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function SaveRow({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end pt-2">
      <button
        onClick={onSave}
        className="rounded-xl bg-[#5e81f4] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4c6ef5]"
      >
        Save changes
      </button>
    </div>
  )
}

// ── Shared style strings ──────────────────────────────────────
const inputCls =
  "w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5 text-sm text-[#111827] outline-none placeholder:text-[#d1d5db] focus:border-[#5e81f4] focus:bg-white focus:ring-2 focus:ring-[#5e81f4]/10"

const selectCls =
  "w-full appearance-none rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5 pr-9 text-sm text-[#111827] outline-none focus:border-[#5e81f4] focus:bg-white focus:ring-2 focus:ring-[#5e81f4]/10"

// ── Page ──────────────────────────────────────────────────────
export default function Payroll() {
  const [payCycle,       setPayCycle]       = useState("Monthly")
  const [payDay,         setPayDay]         = useState("25")
  const [payMethod,      setPayMethod]      = useState("Bank Transfer")
  const [taxScheme,      setTaxScheme]      = useState("PAYE")
  const [pensionPct,     setPensionPct]     = useState("5")
  const [allowances,     setAllowances]     = useState<Allowance[]>([
    { id: 1, name: "Transport",  amount: "100" },
    { id: 2, name: "Housing",    amount: "200" },
  ])
  const [autoProcess,    setAutoProcess]    = useState(false)
  const [requireApproval,setRequireApproval]= useState(true)

  function onSave() {
    // TODO: persist settings
  }

  return (
    <div className="flex flex-col gap-6">
      <Card title="Pay Cycle" subtitle="Define how and when salaries are disbursed" icon={Banknote}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Pay Frequency</label>
              <div className="relative">
                <select value={payCycle} onChange={e => setPayCycle(e.target.value)} className={selectCls}>
                  {["Weekly", "Bi-weekly", "Monthly"].map(v => <option key={v}>{v}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Pay Day (day of month)</label>
              <div className="relative">
                <select value={payDay} onChange={e => setPayDay(e.target.value)} className={selectCls}>
                  {Array.from({ length: 28 }, (_, i) => String(i + 1)).map(d => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#374151]">Payment Method</label>
            <div className="relative max-w-xs">
              <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className={selectCls}>
                {["Bank Transfer", "Mobile Money", "Cheque", "Cash"].map(v => <option key={v}>{v}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Tax & Deductions" subtitle="Default tax configuration and pension settings" icon={Banknote}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Tax Scheme</label>
              <div className="relative">
                <select value={taxScheme} onChange={e => setTaxScheme(e.target.value)} className={selectCls}>
                  {["PAYE", "Flat Rate", "Graduated", "Exempt"].map(v => <option key={v}>{v}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Employee Pension (%)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={pensionPct}
                onChange={e => setPensionPct(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Standard Allowances" subtitle="Included in every payslip by default" icon={Banknote}>
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-[1fr_120px_40px] gap-2 px-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">Allowance</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">Amount ($)</span>
            <span />
          </div>
          {allowances.map((a, i) => (
            <div key={a.id} className="grid grid-cols-[1fr_120px_40px] items-center gap-2">
              <input
                value={a.name}
                onChange={e => setAllowances(p => p.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                className={inputCls}
                placeholder="Name"
              />
              <input
                type="number"
                min="0"
                value={a.amount}
                onChange={e => setAllowances(p => p.map((x, j) => j === i ? { ...x, amount: e.target.value } : x))}
                className={inputCls}
                placeholder="0"
              />
              <button
                onClick={() => setAllowances(p => p.filter((_, j) => j !== i))}
                className="flex size-9 items-center justify-center rounded-xl border border-[#e5e7eb] text-[#9ca3af] hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setAllowances(p => [...p, { id: Date.now(), name: "", amount: "" }])}
            className="flex w-fit items-center gap-1.5 rounded-xl border border-dashed border-[#e5e7eb] px-3 py-2 text-xs font-medium text-[#6b7280] hover:border-[#5e81f4] hover:text-[#5e81f4]"
          >
            <Plus className="size-3.5" /> Add Allowance
          </button>
        </div>
      </Card>

      <Card title="Payroll Workflow" subtitle="Automation and approval settings for pay runs" icon={Banknote}>
        <div className="flex flex-col gap-4">
          <Row label="Auto-process on pay day" hint="Payroll runs automatically without a manual trigger">
            <Toggle checked={autoProcess} onChange={setAutoProcess} />
          </Row>
          <Divider />
          <Row label="Require manager approval before disbursement" hint="HR must approve before salaries are released">
            <Toggle checked={requireApproval} onChange={setRequireApproval} />
          </Row>
        </div>
      </Card>

      <SaveRow onSave={onSave} />
    </div>
  )
}
