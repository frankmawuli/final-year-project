"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { Loader2, Plus, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  jobsService,
  type ApiJobDetail,
} from "@/services/jobs.service"
import type { ApiDepartment } from "@/services/departments.service"
import {
  TYPE_LABEL, LEVEL_LABEL, LOCATION_LABEL,
  TYPE_API, LEVEL_API, LOCATION_API,
  JOB_TYPES, LEVELS, LOCATIONS,
  fieldCls, areaCls,
} from "./constants"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </label>
  )
}

function ListEditor({
  label, placeholder, items, onChange,
}: {
  label: string; placeholder: string; items: string[]; onChange: (items: string[]) => void
}) {
  const update = (i: number, val: string) => { const next = [...items]; next[i] = val; onChange(next) }
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const add    = () => onChange([...items, ""])
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className={cn(fieldCls, "flex-1")}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 text-muted-foreground hover:text-rose-500"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="size-3" /> Add item
        </button>
      </div>
    </div>
  )
}

function SkillsInput({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [draft, setDraft] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const commit = () => {
    const val = draft.trim()
    if (val && !skills.includes(val)) onChange([...skills, val])
    setDraft("")
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit() }
    if (e.key === "Backspace" && draft === "" && skills.length > 0) onChange(skills.slice(0, -1))
  }
  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-[44px] cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-border bg-muted/50 px-3 py-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
    >
      {skills.map((s) => (
        <span key={s} className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-0.5 text-[12px] font-medium text-foreground">
          {s}
          <button type="button" onClick={() => onChange(skills.filter((x) => x !== s))}>
            <X className="size-3 text-muted-foreground hover:text-rose-500" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={commit}
        placeholder={skills.length === 0 ? "Type a skill and press Enter…" : ""}
        className="min-w-[140px] flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}

export function AddListingModal({
  onClose,
  onCreated,
  departments,
  token,
  editJob,
}: {
  onClose:     () => void
  onCreated:   () => void
  departments: ApiDepartment[]
  token:       string
  editJob?:    ApiJobDetail
}) {
  const sorted = <T extends { position: number }>(arr: T[]) =>
    [...arr].sort((a, b) => a.position - b.position)

  const [step,       setStep]       = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const [title,      setTitle]      = useState(editJob?.title ?? "")
  const [deptId,     setDeptId]     = useState<number>(editJob?.department?.id ?? departments[0]?.id ?? 0)
  const [jobType,    setJobType]    = useState(editJob ? TYPE_LABEL[editJob.type] : JOB_TYPES[0])
  const [level,      setLevel]      = useState(editJob ? LEVEL_LABEL[editJob.level] : LEVELS[1])
  const [location,   setLocation]   = useState(editJob ? LOCATION_LABEL[editJob.workLocation] : LOCATIONS[0])
  const [salaryMin,  setSalaryMin]  = useState(editJob?.salaryMin != null ? String(editJob.salaryMin) : "")
  const [salaryMax,  setSalaryMax]  = useState(editJob?.salaryMax != null ? String(editJob.salaryMax) : "")
  const [experience, setExperience] = useState(editJob?.experience ?? "")
  const [openings,   setOpenings]   = useState(editJob ? String(editJob.openings) : "1")
  const [deadline,   setDeadline]   = useState(editJob?.deadline ? editJob.deadline.split("T")[0] : "")

  const [description,      setDescription]      = useState(editJob?.description ?? "")
  const [responsibilities, setResponsibilities] = useState<string[]>(
    editJob?.responsibilities.length ? sorted(editJob.responsibilities).map((r) => r.text) : [""],
  )
  const [requirements, setRequirements] = useState<string[]>(
    editJob?.requirements.length ? sorted(editJob.requirements).map((r) => r.text) : [""],
  )
  const [niceToHave, setNiceToHave] = useState<string[]>(
    editJob?.niceToHave.length ? sorted(editJob.niceToHave).map((r) => r.text) : [],
  )
  const [skills, setSkills] = useState<string[]>(editJob?.skills.map((s) => s.name) ?? [])

  const canNext1 = title.trim().length > 0

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    const payload = {
      title,
      type:         TYPE_API[jobType],
      level:        LEVEL_API[level],
      workLocation: LOCATION_API[location],
      departmentId: deptId,
      experience:   experience || undefined,
      salaryMin:    salaryMin ? Number(salaryMin) : undefined,
      salaryMax:    salaryMax ? Number(salaryMax) : undefined,
      openings:     parseInt(openings, 10) || 1,
      deadline:     deadline || undefined,
      description:  description || undefined,
      responsibilities: responsibilities.filter(Boolean).map((text, i) => ({ text, position: i + 1 })),
      requirements:     requirements.filter(Boolean).map((text, i) => ({ text, position: i + 1 })),
      niceToHave:       niceToHave.filter(Boolean).map((text, i) => ({ text, position: i + 1 })),
      skills:           skills.map((name) => ({ name })),
    }
    try {
      if (editJob) {
        await jobsService.update(editJob.id, payload, token)
      } else {
        await jobsService.create({ ...payload, status: "OPEN" }, token)
      }
      onCreated()
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : editJob ? "Failed to update job listing" : "Failed to create job listing")
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl">

        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-foreground">{editJob ? "Edit Listing" : "Add New Listing"}</h2>
            <p className="text-xs text-muted-foreground">{editJob ? "Update the job details below" : "Fill in all details to publish the job"}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-primary">{step}/3</span>
            <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>Job Title *</FieldLabel>
                <input
                  className={fieldCls}
                  placeholder="e.g. Senior Product Designer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Department</FieldLabel>
                  <select
                    className={fieldCls}
                    value={deptId}
                    onChange={(e) => setDeptId(Number(e.target.value))}
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Job Type</FieldLabel>
                  <select className={fieldCls} value={jobType} onChange={(e) => setJobType(e.target.value)}>
                    {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Level</FieldLabel>
                  <select className={fieldCls} value={level} onChange={(e) => setLevel(e.target.value)}>
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel>Location</FieldLabel>
                  <select className={fieldCls} value={location} onChange={(e) => setLocation(e.target.value)}>
                    {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Salary Min</FieldLabel>
                  <input
                    className={fieldCls}
                    type="number"
                    min="0"
                    placeholder="e.g. 70000"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>Salary Max</FieldLabel>
                  <input
                    className={fieldCls}
                    type="number"
                    min="0"
                    placeholder="e.g. 90000"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Experience Required</FieldLabel>
                  <input
                    className={fieldCls}
                    placeholder="e.g. 3+ years"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>No. of Openings</FieldLabel>
                  <input
                    className={fieldCls}
                    type="number"
                    min="1"
                    placeholder="1"
                    value={openings}
                    onChange={(e) => setOpenings(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Application Deadline</FieldLabel>
                <input className={fieldCls} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <FieldLabel>Job Description</FieldLabel>
                <textarea
                  className={cn(areaCls, "h-28")}
                  placeholder="Describe the role and what makes it exciting…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <ListEditor
                label="Key Responsibilities"
                placeholder="e.g. Lead design sprints and prototyping sessions"
                items={responsibilities}
                onChange={setResponsibilities}
              />
              <ListEditor
                label="Requirements"
                placeholder="e.g. 3+ years of professional UI/UX design experience"
                items={requirements}
                onChange={setRequirements}
              />
              <ListEditor
                label="Nice to Have"
                placeholder="e.g. Experience with design systems"
                items={niceToHave}
                onChange={setNiceToHave}
              />
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>Required Skills</FieldLabel>
                <p className="mb-2 text-xs text-muted-foreground">
                  Type a skill and press{" "}
                  <kbd className="rounded bg-muted px-1 font-mono text-[11px]">Enter</kbd> or{" "}
                  <kbd className="rounded bg-muted px-1 font-mono text-[11px]">,</kbd> to add it.
                </p>
                <SkillsInput skills={skills} onChange={setSkills} />
              </div>
              {skills.length > 0 && (
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s} className="rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="rounded-xl border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={cn("size-1.5 rounded-full transition-colors", s === step ? "bg-primary" : "bg-border")} />
            ))}
          </div>

          {step < 3 ? (
            <button
              type="button"
              disabled={step === 1 && !canNext1}
              onClick={() => setStep(step + 1)}
              className={cn(
                "rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors",
                step === 1 && !canNext1
                  ? "cursor-not-allowed bg-primary/40"
                  : "bg-primary hover:bg-primary/90",
              )}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {editJob ? "Save Changes" : "Post Listing"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
