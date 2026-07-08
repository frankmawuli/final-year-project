"use client"

import { X, Mail, Phone, MapPin, Building2, Calendar, IdCard } from "lucide-react"
import { CompensationSummary } from "@/components/employees/compensation-summary"
import { Avatar } from "@/components/avatar"
import type { Employee } from "@/components/employees/types"

export function ProfilePanel({ emp, onClose, onMessage }: { emp: Employee; onClose: () => void; onMessage: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-40 flex h-full w-[400px] flex-col bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">Employee Profile</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <div className="flex flex-col items-center gap-2.5 rounded-xl border border-border bg-muted/50 py-5">
            <Avatar src={emp.photo} alt={emp.name} className="size-20 ring-2 ring-background shadow" />
            <div className="text-center">
              <p className="text-base font-bold text-foreground">{emp.name}</p>
              <p className="text-xs font-medium text-primary">{emp.role}</p>
              {emp.department && (
                <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {emp.department}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { icon: IdCard,    label: "Employee ID", value: emp.empId      },
              { icon: Calendar,  label: "Joined",      value: emp.joinDate   },
              { icon: Mail,      label: "Email",       value: emp.email      },
              { icon: Phone,     label: "Phone",       value: emp.phone      },
              { icon: MapPin,    label: "Location",    value: emp.location   },
              { icon: Building2, label: "Department",  value: emp.department },
            ]
              .filter(({ value }) => value)
              .map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-3.5 text-primary" />
                  </div>
                  <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
                  <span className="truncate font-medium text-foreground">{value}</span>
                </div>
              ))}
          </div>

          <CompensationSummary employeeId={emp.id} />

          {emp.bio && (
            <div>
              <p className="mb-1.5 text-xs font-semibold text-foreground">About</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{emp.bio}</p>
            </div>
          )}

          {emp.skills.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold text-foreground">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {emp.skills.map((s) => (
                  <span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onMessage}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Mail className="size-4" /> Send Message
            </button>
            <a
              href={`tel:${emp.phone}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
            >
              <Phone className="size-4" /> Call
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
