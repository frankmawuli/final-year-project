"use client"

import { useState, useEffect } from "react"
import { Banknote, Landmark, ChevronDown, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { payrollService, type ApiPayrollSettings } from "@/services/payroll.service"

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
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
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
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-4 rounded-full bg-background shadow-sm ring-0 transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}

function Divider() {
  return <hr className="border-border" />
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
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function SaveRow({
  onSave,
  saving,
  message,
}: {
  onSave:   () => void
  saving:   boolean
  message:  { text: string; error: boolean } | null
}) {
  return (
    <div className="flex items-center justify-end gap-4 pt-2">
      {message && (
        <p className={cn("text-sm", message.error ? "text-rose-500" : "text-emerald-600")}>
          {message.text}
        </p>
      )}
      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  )
}

// ── Shared style strings ──────────────────────────────────────
const inputCls =
  "w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 bg-transparent"

const selectCls =
  "w-full appearance-none rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 pr-9 text-sm text-foreground outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 bg-transparent"

// ── Page ──────────────────────────────────────────────────────
export default function Payroll() {
  const { accessToken } = useAuth()

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

  // Company funding account — printed on the bank advice file as the debit account
  const [bankName,       setBankName]       = useState("")
  const [bankBranch,     setBankBranch]     = useState("")
  const [acctName,       setAcctName]       = useState("")
  const [acctNumber,     setAcctNumber]     = useState("")

  const [saving,  setSaving]  = useState(false)
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null)

  useEffect(() => {
    if (!accessToken) return
    payrollService.getSettings(accessToken)
      .then(({ data }) => {
        setPayCycle(data.payCycle)
        setPayDay(String(data.payDay))
        setPayMethod(data.payMethod)
        setTaxScheme(data.taxScheme)
        setPensionPct(String(data.pensionPct))
        setAutoProcess(data.autoProcess)
        setRequireApproval(data.requireApproval)
        setAllowances(data.allowances.map((a, i) => ({
          id:     a.id ?? i + 1,
          name:   a.name,
          amount: String(a.amount),
        })))
        if (data.fundingAccount) {
          setBankName(data.fundingAccount.bankName)
          setBankBranch(data.fundingAccount.branch)
          setAcctName(data.fundingAccount.accountName)
          setAcctNumber(data.fundingAccount.accountNumber)
        }
      })
      .catch(() => { /* endpoint not live yet — keep defaults */ })
  }, [accessToken])

  async function onSave() {
    if (!accessToken) return
    setSaving(true)
    setMessage(null)

    const body: Partial<ApiPayrollSettings> = {
      payCycle:        payCycle as ApiPayrollSettings["payCycle"],
      payDay:          Number(payDay),
      payMethod:       payMethod as ApiPayrollSettings["payMethod"],
      taxScheme,
      pensionPct:      Number(pensionPct),
      autoProcess,
      requireApproval,
      allowances:      allowances
        .filter((a) => a.name.trim())
        .map((a) => ({ name: a.name.trim(), amount: Number(a.amount) || 0 })),
      fundingAccount:  bankName.trim() || acctNumber.trim()
        ? { bankName: bankName.trim(), branch: bankBranch.trim(), accountName: acctName.trim(), accountNumber: acctNumber.trim() }
        : null,
    }

    try {
      await payrollService.updateSettings(body, accessToken)
      setMessage({ text: "Settings saved", error: false })
    } catch (e: unknown) {
      setMessage({ text: e instanceof Error ? e.message : "Failed to save settings", error: true })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card title="Company Funding Account" subtitle="Account salaries are paid from — shown on the bank advice file" icon={Landmark}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Bank Name</label>
              <input
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className={inputCls}
                placeholder="e.g. GCB Bank"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Branch</label>
              <input
                value={bankBranch}
                onChange={e => setBankBranch(e.target.value)}
                className={inputCls}
                placeholder="e.g. Ring Road Central"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Account Name</label>
              <input
                value={acctName}
                onChange={e => setAcctName(e.target.value)}
                className={inputCls}
                placeholder="Company legal name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Account Number</label>
              <input
                value={acctNumber}
                onChange={e => setAcctNumber(e.target.value)}
                className={inputCls}
                placeholder="0123456789012"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Funds are never moved by this app — payroll runs generate a bank advice file that you upload to your corporate internet banking to execute payments.
          </p>
        </div>
      </Card>

      <Card title="Pay Cycle" subtitle="Define how and when salaries are disbursed" icon={Banknote}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Pay Frequency</label>
              <div className="relative">
                <select value={payCycle} onChange={e => setPayCycle(e.target.value)} className={selectCls}>
                  {["Weekly", "Bi-weekly", "Monthly"].map(v => <option key={v}>{v}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Pay Day (day of month)</label>
              <div className="relative">
                <select value={payDay} onChange={e => setPayDay(e.target.value)} className={selectCls}>
                  {Array.from({ length: 28 }, (_, i) => String(i + 1)).map(d => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Payment Method</label>
            <div className="relative max-w-xs">
              <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className={selectCls}>
                {["Bank Transfer", "Mobile Money", "Cheque", "Cash"].map(v => <option key={v}>{v}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Tax & Deductions" subtitle="Default tax configuration and pension settings" icon={Banknote}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Tax Scheme</label>
              <div className="relative">
                <select value={taxScheme} onChange={e => setTaxScheme(e.target.value)} className={selectCls}>
                  {["PAYE", "Flat Rate", "Graduated", "Exempt"].map(v => <option key={v}>{v}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Employee Pension (%)</label>
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
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Allowance</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Amount ($)</span>
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
                className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setAllowances(p => [...p, { id: Date.now(), name: "", amount: "" }])}
            className="flex w-fit items-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
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

      <SaveRow onSave={onSave} saving={saving} message={message} />
    </div>
  )
}
