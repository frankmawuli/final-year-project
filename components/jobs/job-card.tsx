"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, MoreHorizontal, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicJobListItem } from "@/services/jobs.service";
import { PUBLIC_TYPE_LABEL, PUBLIC_LEVEL_LABEL } from "@/components/jobs/constants";

const LOGO_COLORS = [
  "#1B5E20", "#E65100", "#1565C0", "#0D47A1",
  "#1A237E", "#212121", "#0277BD", "#2E7D32", "#0057FF", "#880E4F",
]

function logoColor(initials: string): string {
  let hash = 0
  for (const c of initials) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length]
}

function postedLabel(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
}

export function JobCard({ job }: { job: PublicJobListItem }) {
  const [saved, setSaved] = useState(false)
  const { city, country, arrangement } = job.location
  const loc = [city, country].filter(Boolean).join(", ").toUpperCase() || arrangement.replace("_", "-").toUpperCase()

  return (
    <Link
      href={`/apply/${job.id}`}
      className="bg-white rounded-xl border border-[#E5E7EB] p-3 flex flex-col gap-2.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        {job.company.logo_url ? (
          <img
            src={job.company.logo_url}
            alt={job.company.name}
            className="w-10 h-10 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[11px] text-white shrink-0"
            style={{ backgroundColor: logoColor(job.company.initials) }}
          >
            {job.company.initials}
          </div>
        )}
        <button
          className="text-[#9CA3AF] hover:text-foreground transition-colors mt-0.5"
          onClick={(e) => e.preventDefault()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-[13.5px] text-foreground leading-snug">{job.title}</h3>
        <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-[0.06em] mt-0.5">
          {job.company.name}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <MapPin className="w-[11px] h-[11px] text-[#9CA3AF] shrink-0" />
        <span className="text-[10.5px] text-[#9CA3AF] uppercase tracking-[0.04em]">{loc}</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-[#6B7280]">
          {PUBLIC_LEVEL_LABEL[job.employment.experience_level]}
        </span>
        <span className="text-[#D1D5DB] text-[11px]">•</span>
        <span className="text-[11px] text-[#6B7280]">
          {PUBLIC_TYPE_LABEL[job.employment.type]}
        </span>
        <span className="text-[#D1D5DB] text-[11px]">•</span>
        <span className="text-[11.5px] text-foreground font-semibold">
          {job.compensation.display}
        </span>
      </div>

      <p className="text-[11.5px] text-[#6B7280] leading-[1.6] line-clamp-3">{job.description}</p>

      <div className="flex flex-wrap gap-1">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10.5px] text-[#6B7280] border border-[#E5E7EB] px-2 py-[3px] rounded-md font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1.5 border-t border-[#F3F4F6]">
        <span className="text-[11px] text-[#9CA3AF]">{postedLabel(job.meta.posted_at)}</span>
        <button
          className={cn("transition-colors", saved ? "text-red-500" : "text-[#D1D5DB] hover:text-red-400")}
          onClick={(e) => { e.preventDefault(); setSaved((s) => !s) }}
        >
          <Heart className={cn("w-[14px] h-[14px]", saved && "fill-red-500")} />
        </button>
      </div>
    </Link>
  )
}
