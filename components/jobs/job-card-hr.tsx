"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Check, Share2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ApiJobListItem } from "@/services/jobs.service"
import { LOCATION_LABEL, TYPE_LABEL, formatSalary } from "./constants"
import { StatusBadge } from "./status-badge"

export function JobCard({
  job,
  onDelete,
  onPublish,
}: {
  job: ApiJobListItem
  onDelete: (id: string) => void
  onPublish: (id: string) => void
}) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const url = `${window.location.origin}/apply/${job.id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-3">
      <div className="flex items-start justify-between">
        <StatusBadge status={job.status} />
        <Building2 className="size-6 text-muted-foreground" strokeWidth={1.5} />
      </div>

      <div>
        <p className="text-xs font-semibold text-foreground">{job.title}</p>
        <p className="text-xs font-medium text-primary">{job.department?.name ?? "—"}</p>
      </div>

      <p className="text-[10px] text-muted-foreground">
        {LOCATION_LABEL[job.workLocation]} · {TYPE_LABEL[job.type]} · {job._count.applications} applicants
      </p>

      <div>
        <p className="text-xs font-semibold text-foreground">
          {formatSalary(job.salaryMin, job.salaryMax)}
        </p>
        <p className="text-[10px] text-muted-foreground">{job.experience ?? "—"} experience</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Link
          href={`/dashboard/hr/jobs/${job.id}`}
          className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          View Details
        </Link>
        <Link
          href="/dashboard/hr/applicants"
          className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Applications ({job._count.applications})
        </Link>
        {job.status === "DRAFT" && (
          <button
            onClick={() => onPublish(job.id)}
            className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Publish
          </button>
        )}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={handleShare}
            title={copied ? "Copied!" : "Copy application link"}
            className={cn(
              "rounded-lg p-1 transition-colors",
              copied ? "text-emerald-500" : "text-muted-foreground hover:text-primary",
            )}
          >
            {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-rose-500"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
