import { cn } from "@/lib/utils"
import { STATUS_LABEL } from "./constants"

const statusStyles = {
  OPEN:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CLOSED: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  DRAFT:  "bg-muted text-muted-foreground",
} as const

export type StatusKey = keyof typeof statusStyles

export function StatusBadge({ status }: { status: StatusKey }) {
  return (
    <span className={cn("rounded-full px-1.5 py-0.5 text-xs font-bold", statusStyles[status])}>
      {STATUS_LABEL[status]}
    </span>
  )
}
