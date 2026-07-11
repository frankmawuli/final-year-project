"use client"

import { useState, useRef, useEffect } from "react"
import { MoreHorizontal } from "lucide-react"

export function DotMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <button onClick={() => { onEdit(); setOpen(false) }} className="block w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-muted">
            Edit
          </button>
          <button onClick={() => { onDelete(); setOpen(false) }} className="block w-full px-3 py-1.5 text-left text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30">
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
