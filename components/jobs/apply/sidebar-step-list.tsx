import { Check, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { STEPS } from "./constants"

export function SidebarStepList({ current }: { current: number }) {
  return (
    <aside className="hidden sm:flex w-[260px] shrink-0 flex-col bg-primary/5 p-5">
      <div className="mb-6">
        <div
          className="flex size-9 items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
        >
          <FileText className="size-5 text-white" />
        </div>
        <h2 className="mt-2.5 text-[15px] font-bold text-foreground">Job Application</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">Complete all steps to apply</p>
      </div>

      <div className="flex flex-col gap-1">
        {STEPS.map(({ id, title, description, icon: Icon }) => {
          const isCompleted = id < current
          const isActive = id === current
          return (
            <div
              key={id}
              className={cn(
                "flex items-start gap-2.5 rounded-xl p-2.5 transition-colors",
                isActive ? "bg-card shadow-sm" : isCompleted ? "opacity-80" : "opacity-50"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
                  isCompleted || isActive ? "bg-primary" : "bg-muted"
                )}
              >
                {isCompleted ? (
                  <Check className="size-3.5 text-primary-foreground" />
                ) : (
                  <Icon
                    className={cn(
                      "size-3.5",
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    )}
                  />
                )}
              </div>
              <div>
                <p
                  className={cn(
                    "text-[13px] font-semibold",
                    isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {title}
                </p>
                <p className="text-[11px] text-muted-foreground">{description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress */}
      <div className="mt-auto pt-6">
        <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(((current - 1) / STEPS.length) * 100)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${((current - 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  )
}
