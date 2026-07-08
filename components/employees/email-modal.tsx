"use client"

import { useState } from "react"
import { X, Mail } from "lucide-react"
import { Avatar } from "@/components/avatar"
import type { Employee } from "@/components/employees/types"

export function EmailModal({ emp, onClose }: { emp: Employee; onClose: () => void }) {
  const [subject, setSubject] = useState("")
  const [body,    setBody]    = useState("")
  const [sent,    setSent]    = useState(false)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    window.open(`mailto:${emp.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    setSent(true)
    setTimeout(onClose, 1800)
  }

  const fieldCls = "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
              <Mail className="size-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Send Message</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-2.5 py-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20">
              <Mail className="size-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xs font-medium text-foreground">Message sent to {emp.name}!</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">To</label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-2.5 py-2">
                <Avatar src={emp.photo} alt={emp.name} className="size-6" />
                <div>
                  <p className="text-xs font-medium text-foreground">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.email}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Subject</label>
              <input
                className={fieldCls}
                placeholder="e.g. Team Update — Q2 Goals"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Message</label>
              <textarea
                className={`${fieldCls} h-32 resize-none`}
                placeholder="Write your message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-1.5 pt-1">
              <button type="button" onClick={onClose} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                Cancel
              </button>
              <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                <Mail className="size-4" /> Send Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
