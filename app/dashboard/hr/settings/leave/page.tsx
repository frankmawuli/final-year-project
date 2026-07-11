"use client"

import { useState } from "react"
import { CalendarDays, ChevronDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────
type LeaveType = { id: number; name: string; days: string; paid: boolean }

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
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">{title}</p>
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
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function SaveRow({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end pt-1.5">
      <button
        onClick={onSave}
        className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
      >
        Save changes
      </button>
    </div>
  )
}

// ── Shared style strings ──────────────────────────────────────
const inputCls =
  "w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 bg-transparent"

const selectCls =
  "w-full appearance-none rounded-xl border border-border bg-muted/50 px-3 py-2 pr-7 text-xs text-foreground outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 bg-transparent"

// ── Page ──────────────────────────────────────────────────────
export default function LeavePage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([
    { id: 1, name: "Annual Leave",    days: "21", paid: true  },
    { id: 2, name: "Sick Leave",      days: "10", paid: true  },
    { id: 3, name: "Maternity Leave", days: "90", paid: true  },
    { id: 4, name: "Unpaid Leave",    days: "30", paid: false },
  ])
  const [carryForward,   setCarryForward]   = useState(true)
  const [maxCarry,       setMaxCarry]       = useState("5")
  const [halfDay,        setHalfDay]        = useState(true)
  const [approvalChain,  setApprovalChain]  = useState("Manager then HR")
  const [trackingMethod, setTrackingMethod] = useState("App Check-in")
  const [overtimeRate,   setOvertimeRate]   = useState("1.5")
  const [maxOvertimeHrs, setMaxOvertimeHrs] = useState("20")

  function onSave() {
    // TODO: persist settings
  }

  return (
    <div className="flex flex-col gap-5">
      <Card title="Leave Types & Entitlements" subtitle="Categories of leave and annual day allocations" icon={CalendarDays}>
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-[1fr_80px_64px] gap-2.5 px-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Leave Type</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Days / yr</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Paid</span>
          </div>
          {leaveTypes.map((lt, i) => (
            <div key={lt.id} className="grid grid-cols-[1fr_80px_64px] items-center gap-2.5">
              <input
                value={lt.name}
                onChange={e => setLeaveTypes(p => p.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                className={inputCls}
              />
              <input
                type="number"
                min="0"
                value={lt.days}
                onChange={e => setLeaveTypes(p => p.map((x, j) => j === i ? { ...x, days: e.target.value } : x))}
                className={cn(inputCls, "text-center")}
              />
              <div className="flex justify-center">
                <Toggle
                  checked={lt.paid}
                  onChange={v => setLeaveTypes(p => p.map((x, j) => j === i ? { ...x, paid: v } : x))}
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => setLeaveTypes(p => [...p, { id: Date.now(), name: "", days: "0", paid: true }])}
            className="flex w-fit items-center gap-1 rounded-xl border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Plus className="size-3.5" /> Add Leave Type
          </button>
        </div>
      </Card>

      <Card title="Leave Policies" subtitle="Rules around carry-forward and half-day requests" icon={CalendarDays}>
        <div className="flex flex-col gap-3">
          <Row label="Allow carry-forward" hint="Employees can roll unused days to the next year">
            <Toggle checked={carryForward} onChange={setCarryForward} />
          </Row>
          {carryForward && (
            <>
              <Divider />
              <Row label="Max carry-forward days">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={maxCarry}
                    onChange={e => setMaxCarry(e.target.value)}
                    className={cn(inputCls, "w-20 text-center")}
                  />
                  <span className="text-xs text-muted-foreground">days</span>
                </div>
              </Row>
            </>
          )}
          <Divider />
          <Row label="Allow half-day requests">
            <Toggle checked={halfDay} onChange={setHalfDay} />
          </Row>
        </div>
      </Card>

      <Card title="Approval & Tracking" subtitle="Who approves leave and how attendance is recorded" icon={CalendarDays}>
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Approval Chain</label>
            <div className="relative max-w-xs">
              <select value={approvalChain} onChange={e => setApprovalChain(e.target.value)} className={selectCls}>
                {["Direct Manager Only", "HR Only", "Manager then HR", "Auto-approve"].map(v => (
                  <option key={v}>{v}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Attendance Tracking Method</label>
            <div className="relative max-w-xs">
              <select value={trackingMethod} onChange={e => setTrackingMethod(e.target.value)} className={selectCls}>
                {["App Check-in", "Biometric Scanner", "Manual Entry", "IP-based", "QR Code"].map(v => (
                  <option key={v}>{v}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Overtime Policy" subtitle="Rules for hours worked beyond the standard schedule" icon={CalendarDays}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Overtime Multiplier</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="3"
                step="0.25"
                value={overtimeRate}
                onChange={e => setOvertimeRate(e.target.value)}
                className={cn(inputCls, "w-24")}
              />
              <span className="text-xs text-muted-foreground">× base rate</span>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Max Overtime / Month</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                value={maxOvertimeHrs}
                onChange={e => setMaxOvertimeHrs(e.target.value)}
                className={cn(inputCls, "w-24")}
              />
              <span className="text-xs text-muted-foreground">hours</span>
            </div>
          </div>
        </div>
      </Card>

      <SaveRow onSave={onSave} />
    </div>
  )
}
