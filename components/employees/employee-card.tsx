"use client"

import { Phone, MessageSquare, User } from "lucide-react"
import { DotMenu } from "@/components/employees/dot-menu"
import { Avatar } from "@/components/avatar"
import type { Employee } from "@/components/employees/types"

export function EmployeeCard({
  emp,
  onMessage,
  onViewProfile,
  onEdit,
  onDelete,
}: {
  emp:           Employee
  onMessage:     (e: Employee) => void
  onViewProfile: (e: Employee) => void
  onEdit:        (e: Employee) => void
  onDelete:      (id: number) => void
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2.5 flex items-start justify-between">
        <div className="w-5" />
        <Avatar
          src={emp.photo}
          alt={emp.name}
          className="size-[72px] ring-2 ring-border"
        />
        <DotMenu onEdit={() => onEdit(emp)} onDelete={() => onDelete(emp.id)} />
      </div>

      <div className="mb-3 text-center">
        <p className="text-sm font-bold text-foreground">{emp.name}</p>
        <p className="text-xs text-muted-foreground">{emp.role}</p>
      </div>

      <div className="mb-3 space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Employee ID</span>
          <span className="font-semibold text-foreground">{emp.empId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Join Date</span>
          <span className="font-semibold text-foreground">{emp.joinDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <a
          href={`tel:${emp.phone}`}
          title={`Call ${emp.name}`}
          className="flex items-center justify-center rounded-lg bg-emerald-50 py-1.5 text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
        >
          <Phone className="size-4" />
        </a>
        <button
          onClick={() => onMessage(emp)}
          title="Send message via email"
          className="flex items-center justify-center rounded-lg bg-violet-50 py-1.5 text-violet-600 transition-colors hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/30"
        >
          <MessageSquare className="size-4" />
        </button>
        <button
          onClick={() => onViewProfile(emp)}
          title="View profile"
          className="flex items-center justify-center rounded-lg bg-blue-50 py-1.5 text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
        >
          <User className="size-4" />
        </button>
      </div>
    </div>
  )
}
