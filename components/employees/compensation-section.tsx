"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Banknote } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { payrollService } from "@/services/payroll.service"

// Saves independently of the employee form — compensation lives on its own
// effective-dated record, so a salary change never rewrites employee data.
export function CompensationSection({ employeeId, onBack }: { employeeId: number; onBack?: () => void }) {
  const { accessToken } = useAuth()

  const [baseSalary,    setBaseSalary]    = useState("")
  const [currency,      setCurrency]      = useState("GHS")
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().slice(0, 10))
  const [method,        setMethod]        = useState<"BANK" | "MOMO">("BANK")
  const [bankName,      setBankName]      = useState("")
  const [acctNumber,    setAcctNumber]    = useState("")
  const [acctName,      setAcctName]      = useState("")
  const [momoProvider,  setMomoProvider]  = useState("MTN")
  const [momoNumber,    setMomoNumber]    = useState("")
  const [saving,        setSaving]        = useState(false)
  const [msg,           setMsg]           = useState<{ text: string; error: boolean } | null>(null)

  useEffect(() => {
    if (!accessToken) return
    payrollService.getCompensation(String(employeeId), accessToken)
      .then(({ data }) => {
        setBaseSalary(String(data.baseSalary))
        setCurrency(data.currency)
        if (data.effectiveFrom) setEffectiveFrom(data.effectiveFrom.slice(0, 10))
        setMethod(data.paymentMethod)
        if (data.bank) {
          setBankName(data.bank.bankName)
          setAcctNumber(data.bank.accountNumber)
          setAcctName(data.bank.accountName)
        }
        if (data.momo) {
          setMomoProvider(data.momo.provider)
          setMomoNumber(data.momo.number)
        }
      })
      .catch(() => { /* no compensation record yet — start empty */ })
  }, [accessToken, employeeId])

  async function save() {
    if (!accessToken) return
    setSaving(true)
    setMsg(null)
    try {
      await payrollService.updateCompensation(
        String(employeeId),
        {
          baseSalary:    Number(baseSalary) || 0,
          currency,
          effectiveFrom,
          paymentMethod: method,
          ...(method === "BANK"
            ? { bank: { bankName, accountNumber: acctNumber, accountName: acctName } }
            : { momo: { provider: momoProvider, number: momoNumber } }),
        },
        accessToken,
      )
      setMsg({ text: "Compensation saved", error: false })
    } catch (e: unknown) {
      setMsg({ text: e instanceof Error ? e.message : "Failed to save compensation", error: true })
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
  const labelCls = "mb-1 block text-xs font-medium text-foreground"

  return (
    <div>
      <div className="mb-3 flex items-center gap-1.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
          <Banknote className="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-foreground">Compensation</h3>
          <p className="text-xs text-muted-foreground">Salary and payout details — visible to HR admins only</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className={labelCls}>Base Salary (monthly)</label>
          <input className={inputCls} type="number" min="0" placeholder="0.00" value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Currency</label>
          <select className={inputCls} value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {["GHS", "USD", "EUR", "GBP", "NGN"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Effective From</label>
          <input className={inputCls} type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Payment Method</label>
          <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value as "BANK" | "MOMO")}>
            <option value="BANK">Bank Transfer</option>
            <option value="MOMO">Mobile Money</option>
          </select>
        </div>

        {method === "BANK" ? (
          <>
            <div>
              <label className={labelCls}>Bank</label>
              <input className={inputCls} placeholder="e.g. GCB Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Account Number</label>
              <input className={inputCls} placeholder="0000000000000" value={acctNumber} onChange={(e) => setAcctNumber(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Account Name</label>
              <input className={inputCls} placeholder="As it appears at the bank" value={acctName} onChange={(e) => setAcctName(e.target.value)} />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className={labelCls}>Provider</label>
              <select className={inputCls} value={momoProvider} onChange={(e) => setMomoProvider(e.target.value)}>
                {["MTN", "Telecel Cash", "AT Money"].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>MoMo Number</label>
              <input className={inputCls} placeholder="024 000 0000" value={momoNumber} onChange={(e) => setMomoNumber(e.target.value)} />
            </div>
          </>
        )}
      </div>

      <div className={cn("mt-4 flex items-center gap-2.5", onBack ? "justify-between" : "justify-end")}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <ChevronLeft className="size-4" /> Back
          </button>
        )}
        <div className="flex items-center gap-2.5">
          {msg && (
            <p className={cn("text-xs font-medium", msg.error ? "text-rose-500" : "text-emerald-600")}>{msg.text}</p>
          )}
          <button
            type="button"
            onClick={save}
            disabled={saving || !baseSalary}
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Compensation"}
          </button>
        </div>
      </div>
    </div>
  )
}
