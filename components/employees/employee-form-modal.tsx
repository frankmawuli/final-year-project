"use client"

import { useState, useRef } from "react"
import { X } from "lucide-react"
import { CompensationSection } from "@/components/employees/compensation-section"
import { generateEmpId } from "@/components/employees/utils"
import type { Employee, FormPayload } from "@/components/employees/types"

export function EmployeeFormModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Employee | null
  onClose:  () => void
  onSave:   (payload: FormPayload) => Promise<void>
}) {
  const isEdit = Boolean(initial)
  // Edit is a 2-step flow: 1/2 employee details, 2/2 compensation
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<FormPayload>({
    name:           initial?.name           ?? "",
    email:          initial?.email          ?? "",
    empId:          initial?.empId          ?? generateEmpId(),
    role:           initial?.role           ?? "",
    employmentType: initial?.employmentType ?? "",
    phone:          initial?.phone          ?? "",
    joinDate:       initial?.joinDateIso    ?? "",
    bio:            initial?.bio            ?? "",
  })
  const [saving,  setSaving]  = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)

  const initialForm = useRef(form).current
  const dirty = JSON.stringify(form) !== JSON.stringify(initialForm)

  const set = (k: keyof FormPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Untouched edit form — just advance, nothing to save
    if (isEdit && !dirty) {
      setStep(2)
      return
    }
    setSaving(true)
    setSaveErr(null)
    try {
      await onSave(form)
      if (isEdit) setStep(2)
      else onClose()
    } catch (err: unknown) {
      setSaveErr(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const inputCls    = "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
  const readonlyCls = "w-full rounded-lg border border-border bg-muted/50 px-2.5 py-2 text-xs text-muted-foreground cursor-not-allowed"
  const labelCls    = "mb-1 block text-xs font-medium text-foreground"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              {step === 1 ? (isEdit ? "Edit Employee" : "Add New Employee") : "Compensation"}
            </h2>
            {isEdit && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                {step}/2
              </span>
            )}
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Full Name — read-only on edit (name is on user record, not patchable) */}
            <div className="col-span-2">
              <label className={labelCls}>Full Name {!isEdit && "*"}</label>
              {isEdit ? (
                <input className={readonlyCls} value={form.name} readOnly />
              ) : (
                <input className={inputCls} placeholder="e.g. Jane Doe" value={form.name} onChange={set("name")} required />
              )}
            </div>

            {/* Email — read-only on edit (email is on user record, not patchable) */}
            <div>
              <label className={labelCls}>Email {!isEdit && "*"}</label>
              {isEdit ? (
                <input className={readonlyCls} value={form.email} readOnly />
              ) : (
                <input className={inputCls} type="email" placeholder="jane@company.com" value={form.email} onChange={set("email")} required />
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className={labelCls}>Employee ID *</label>
              <input className={inputCls} placeholder="EMP-1234" value={form.empId} onChange={set("empId")} required />
            </div>

            {/* Job Title */}
            <div>
              <label className={labelCls}>Job Title</label>
              <input className={inputCls} placeholder="e.g. Product Designer" value={form.role} onChange={set("role")} />
            </div>

            {/* Employment Type */}
            <div>
              <label className={labelCls}>Employment Type</label>
              <select className={inputCls} value={form.employmentType} onChange={set("employmentType")}>
                <option value="">— Select —</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERN">Intern</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} placeholder="+1 (555) 000-0000" value={form.phone} onChange={set("phone")} />
            </div>

            {/* Join Date */}
            <div>
              <label className={labelCls}>Join Date</label>
              <input className={inputCls} type="date" value={form.joinDate} onChange={set("joinDate")} />
            </div>

            {/* Bio */}
            <div className="col-span-2">
              <label className={labelCls}>Bio</label>
              <textarea className={`${inputCls} h-20 resize-none`} placeholder="Brief description..." value={form.bio} onChange={set("bio")} />
            </div>
          </div>

          {saveErr && (
            <p className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
              {saveErr}
            </p>
          )}

          <div className="flex justify-end gap-1.5 pt-1">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? (dirty ? "Save & Continue" : "Next") : "Add Employee"}
            </button>
          </div>
        </form>
        )}

        {step === 2 && initial && (
          <CompensationSection employeeId={initial.id} onBack={() => setStep(1)} />
        )}
      </div>
    </div>
  )
}
