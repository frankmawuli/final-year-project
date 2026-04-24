"use client"

import { useState } from "react"
import { ShieldCheck, ChevronDown, UserCog } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Data ──────────────────────────────────────────────────────
type Role = { role: string; canEdit: boolean; canExport: boolean; canDelete: boolean }

const defaultRoles: Role[] = [
  { role: "HR Admin",   canEdit: true,  canExport: true,  canDelete: true  },
  { role: "HR Manager", canEdit: true,  canExport: true,  canDelete: false },
  { role: "Recruiter",  canEdit: true,  canExport: false, canDelete: false },
  { role: "Employee",   canEdit: false, canExport: false, canDelete: false },
]

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
export default function SecurityPage() {
  const [twoFA,          setTwoFA]          = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [minLen,         setMinLen]         = useState("8")
  const [expiry,         setExpiry]         = useState("90")
  const [upper,          setUpper]          = useState(true)
  const [number,         setNumber]         = useState(true)
  const [special,        setSpecial]        = useState(false)
  const [gdpr,           setGdpr]           = useState(true)
  const [retention,      setRetention]      = useState("24")
  const [auditLog,       setAuditLog]       = useState(true)
  const [restrictExport, setRestrictExport] = useState(true)
  const [roles,          setRoles]          = useState<Role[]>(defaultRoles)

  function onSave() {
    // TODO: persist settings
  }

  return (
    <div className="flex flex-col gap-6">
      <Card title="Authentication" subtitle="Login security for all platform users" icon={ShieldCheck}>
        <div className="flex flex-col gap-4">
          <Row label="Require Two-Factor Authentication" hint="All HR admin accounts must use 2FA">
            <Toggle checked={twoFA} onChange={setTwoFA} />
          </Row>
          <Divider />
          <Row label="Session Timeout" hint="Auto-logout after period of inactivity">
            <div className="relative w-36">
              <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} className={selectCls}>
                {["15","30","60","120","240"].map(m => (
                  <option key={m} value={m}>{m} minutes</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </Row>
        </div>
      </Card>

      <Card title="Password Policy" subtitle="Minimum requirements enforced on all accounts" icon={ShieldCheck}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Minimum Length</label>
              <div className="flex items-center gap-2">
                <input type="number" min="6" max="32" value={minLen} onChange={e => setMinLen(e.target.value)} className={cn(inputCls, "w-24")} />
                <span className="text-xs text-[#9ca3af]">chars</span>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#374151]">Expiry (days)</label>
              <div className="flex items-center gap-2">
                <input type="number" min="0" value={expiry} onChange={e => setExpiry(e.target.value)} className={cn(inputCls, "w-24")} />
                <span className="text-xs text-[#9ca3af]">0 = never</span>
              </div>
            </div>
          </div>
          <Divider />
          <Row label="Require uppercase letter">
            <Toggle checked={upper} onChange={setUpper} />
          </Row>
          <Divider />
          <Row label="Require number">
            <Toggle checked={number} onChange={setNumber} />
          </Row>
          <Divider />
          <Row label="Require special character">
            <Toggle checked={special} onChange={setSpecial} />
          </Row>
        </div>
      </Card>

      <Card title="Data & Privacy" subtitle="GDPR compliance and data lifecycle settings" icon={ShieldCheck}>
        <div className="flex flex-col gap-4">
          <Row label="GDPR Compliance Mode" hint="Enforce right-to-erasure and data minimisation">
            <Toggle checked={gdpr} onChange={setGdpr} />
          </Row>
          <Divider />
          <Row label="Data Retention Period" hint="Auto-purge inactive employee data after">
            <div className="flex items-center gap-2">
              <input type="number" min="1" value={retention} onChange={e => setRetention(e.target.value)} className={cn(inputCls, "w-24")} />
              <span className="text-xs text-[#9ca3af]">months</span>
            </div>
          </Row>
          <Divider />
          <Row label="Enable Audit Logging" hint="Record all admin actions for compliance review">
            <Toggle checked={auditLog} onChange={setAuditLog} />
          </Row>
          <Divider />
          <Row label="Restrict Data Export" hint="Only HR Admins can export employee data">
            <Toggle checked={restrictExport} onChange={setRestrictExport} />
          </Row>
        </div>
      </Card>

      <Card title="Role-Based Access Control" subtitle="Permissions per role across the platform" icon={ShieldCheck}>
        <div className="overflow-hidden rounded-xl border border-[#f3f4f6]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">Role</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">Edit Data</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">Export</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {roles.map((r, i) => (
                <tr key={r.role} className="hover:bg-[#f9fafb]">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-[#f0f0ff]">
                        <UserCog className="size-3.5 text-[#8a8cd9]" />
                      </div>
                      <span className="font-medium text-[#111827]">{r.role}</span>
                    </div>
                  </td>
                  {(["canEdit", "canExport", "canDelete"] as const).map(perm => (
                    <td key={perm} className="px-4 py-3.5 text-center">
                      <Toggle
                        checked={r[perm]}
                        onChange={v => setRoles(p => p.map((x, j) => j === i ? { ...x, [perm]: v } : x))}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <SaveRow onSave={onSave} />
    </div>
  )
}
