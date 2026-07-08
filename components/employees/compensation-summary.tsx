"use client"

import { useState, useEffect } from "react"
import { Banknote } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { payrollService, type ApiCompensation } from "@/services/payroll.service"
import { formatJoinDate } from "@/components/employees/utils"

export function CompensationSummary({ employeeId }: { employeeId: number }) {
  const { accessToken } = useAuth()
  const [comp, setComp] = useState<ApiCompensation | null>(null)

  useEffect(() => {
    if (!accessToken) return
    payrollService.getCompensation(String(employeeId), accessToken)
      .then(({ data }) => setComp(data))
      .catch(() => setComp(null))
  }, [accessToken, employeeId])

  if (!comp) return null

  const payout =
    comp.paymentMethod === "MOMO" && comp.momo
      ? `${comp.momo.provider} MoMo ••${comp.momo.number.slice(-4)}`
      : comp.bank
        ? `${comp.bank.bankName} ••${comp.bank.accountNumber.slice(-4)}`
        : "Bank transfer"

  return (
    <div className="rounded-xl border border-border bg-muted/50 p-3">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Banknote className="size-4 text-emerald-600 dark:text-emerald-400" />
        <p className="text-xs font-semibold text-foreground">Compensation</p>
      </div>
      <p className="text-base font-bold text-foreground">
        {comp.currency} {comp.baseSalary.toLocaleString()}
        <span className="text-xs font-normal text-muted-foreground"> /month</span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Paid via {payout} · effective {formatJoinDate(comp.effectiveFrom)}
      </p>
    </div>
  )
}
