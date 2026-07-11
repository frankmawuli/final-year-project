import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, Divider } from "./settings-primitives"
import { inputCls, DAYS } from "./constants"

export function WorkingHoursCard({
  workStart,
  workEnd,
  onWorkStartChange,
  onWorkEndChange,
  workDays,
  onToggleDay,
}: {
  workStart: string
  workEnd: string
  onWorkStartChange: (v: string) => void
  onWorkEndChange: (v: string) => void
  workDays: string[]
  onToggleDay: (d: string) => void
}) {
  return (
    <Card title="Working Hours" subtitle="Standard schedule applied across the organisation" icon={Clock}>
      <div className="flex flex-col gap-4">
        {/* Time pickers */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Work Start</label>
            <input
              type="time"
              value={workStart}
              onChange={e => onWorkStartChange(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">Work End</label>
            <input
              type="time"
              value={workEnd}
              onChange={e => onWorkEndChange(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Duration chip */}
        {workStart && workEnd && (() => {
          const [sh, sm] = workStart.split(":").map(Number)
          const [eh, em] = workEnd.split(":").map(Number)
          const mins = (eh * 60 + em) - (sh * 60 + sm)
          if (mins <= 0) return null
          const h = Math.floor(mins / 60), m = mins % 60
          return (
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {h > 0 ? `${h}h ` : ""}{m > 0 ? `${m}m` : ""} working day
              </span>
            </div>
          )
        })()}

        <Divider />

        {/* Day toggles */}
        <div>
          <p className="mb-2 text-xs font-medium text-foreground">Working Days</p>
          <div className="flex flex-wrap gap-1.5">
            {DAYS.map(d => {
              const active = workDays.includes(d)
              return (
                <button
                  key={d}
                  onClick={() => onToggleDay(d)}
                  className={cn(
                    "flex h-9 w-12 items-center justify-center rounded-xl text-xs font-semibold transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
                  )}
                >
                  {d}
                </button>
              )
            })}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {workDays.length > 0
              ? `${workDays.length} day${workDays.length !== 1 ? "s" : ""} selected`
              : "No working days selected"}
          </p>
        </div>
      </div>
    </Card>
  )
}
