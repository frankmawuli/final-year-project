"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export function FilterDropdown<T extends string>({
  label, value, options, onChange,
}: {
  label: string; value: T | "All"; options: T[]; onChange: (v: T | "All") => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = value !== "All"

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors",
          active
            ? "border-primary bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:bg-muted"
        )}
      >
        <SlidersHorizontal className="size-3.5" />
        {active ? value : label}
        <ChevronDown className="size-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <button
            onClick={() => { onChange("All"); setOpen(false) }}
            className={cn("flex w-full px-3 py-2 text-left text-xs hover:bg-muted", value === "All" && "bg-muted/60 font-medium")}
          >
            All {label}s
          </button>
          {options.map((o) => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false) }}
              className={cn("flex w-full px-3 py-2 text-left text-xs hover:bg-muted", value === o && "bg-muted/60 font-medium")}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
