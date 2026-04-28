"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Data ──────────────────────────────────────────────────────
const rows = [
  { key: "newApplication",   label: "New Application",        hint: "When a candidate submits a job application" },
  { key: "interviewScheduled",label:"Interview Scheduled",    hint: "When an interview is booked for a candidate" },
  { key: "offerAccepted",    label: "Offer Accepted",         hint: "When a candidate accepts an offer letter" },
  { key: "leaveRequest",     label: "Leave Request",          hint: "When an employee submits a leave request" },
  { key: "leaveApproved",    label: "Leave Approved/Rejected",hint: "When a leave request is actioned" },
  { key: "payrollProcessed", label: "Payroll Processed",      hint: "When a payroll run is completed" },
  { key: "newEmployee",      label: "New Employee Onboarded", hint: "When a new hire completes onboarding" },
]

type RowKey = typeof rows[number]["key"]
type ToggleMap = Record<RowKey, boolean>

function defaultMap(): ToggleMap {
  return Object.fromEntries(rows.map(r => [r.key, true])) as ToggleMap
}

const reminderRows = [
  { key: "pendingLeave",     label: "Pending Leave Requests",      hint: "Remind HR of unreviewed requests" },
  { key: "upcomingPayroll",  label: "Upcoming Payroll Run",        hint: "Alert before the processing date" },
  { key: "pendingReviews",   label: "Pending Performance Reviews", hint: "Remind managers to complete reviews" },
  { key: "birthdayReminder", label: "Employee Birthdays",          hint: "Notify of upcoming staff birthdays" },
  { key: "contractExpiry",   label: "Contract Expiry",             hint: "Alert before contracts expire" },
] as const

type ReminderKey = typeof reminderRows[number]["key"]
type ReminderMap = Record<ReminderKey, boolean>

function defaultReminders(): ReminderMap {
  return Object.fromEntries(reminderRows.map(r => [r.key, true])) as ReminderMap
}

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
  hint: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#111827]">{label}</p>
        <p className="text-xs text-[#9ca3af]">{hint}</p>
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

// ── Page ──────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [email,     setEmail]     = useState<ToggleMap>(defaultMap)
  const [inApp,     setInApp]     = useState<ToggleMap>(defaultMap)
  const [reminders, setReminders] = useState<ReminderMap>(defaultReminders)

  function onSave() {
    // TODO: persist settings
  }

  return (
    <div className="flex flex-col gap-6">
      <Card title="Notification Channels" subtitle="Configure email and in-app alerts for each event" icon={Bell}>
        <div className="overflow-hidden rounded-xl border border-[#f3f4f6]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">Event</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">Email</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">In-App</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {rows.map(({ key, label, hint }) => (
                <tr key={key} className="hover:bg-[#f9fafb]">
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-[#111827]">{label}</p>
                    <p className="text-xs text-[#9ca3af]">{hint}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Toggle checked={email[key]} onChange={v => setEmail(p => ({ ...p, [key]: v }))} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Toggle checked={inApp[key]} onChange={v => setInApp(p => ({ ...p, [key]: v }))} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Automated Reminders" subtitle="Periodic nudges for pending actions" icon={Bell}>
        <div className="flex flex-col gap-4">
          {reminderRows.map(({ key, label, hint }, i, arr) => (
            <div key={key}>
              <Row label={label} hint={hint}>
                <Toggle checked={reminders[key]} onChange={v => setReminders(p => ({ ...p, [key]: v }))} />
              </Row>
              {i < arr.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </Card>

      <SaveRow onSave={onSave} />
    </div>
  )
}
