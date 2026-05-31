"use client";

import { useState } from "react";
import { MapPin, MoreHorizontal, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Job } from "../data";

export function JobCard({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[11px] text-white shrink-0"
          style={{ backgroundColor: job.logoBg }}
        >
          {job.logoText}
        </div>
        <button className="text-[#9CA3AF] hover:text-foreground transition-colors mt-0.5">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-[13.5px] text-foreground leading-snug">
          {job.title}
        </h3>
        <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-[0.06em] mt-0.5">
          {job.company}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <MapPin className="w-[11px] h-[11px] text-[#9CA3AF] shrink-0" />
        <span className="text-[10.5px] text-[#9CA3AF] uppercase tracking-[0.04em]">
          {job.location}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-[#6B7280]">{job.level}</span>
        <span className="text-[#D1D5DB] text-[11px]">•</span>
        <span className="text-[11px] text-[#6B7280]">{job.jobType}</span>
        <span className="text-[#D1D5DB] text-[11px]">•</span>
        <span className="text-[11.5px] text-foreground font-semibold">{job.salary}</span>
      </div>

      <p className="text-[11.5px] text-[#6B7280] leading-[1.6] line-clamp-3">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10.5px] text-[#6B7280] border border-[#E5E7EB] px-2.5 py-[3px] rounded-md font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
        <span className="text-[11px] text-[#9CA3AF]">{job.date}</span>
        <div className="flex items-center gap-3">
          <button className="text-[#D1D5DB] hover:text-[#9CA3AF] transition-colors">
            <X className="w-[14px] h-[14px]" />
          </button>
          <button
            className={cn(
              "transition-colors",
              saved ? "text-red-500" : "text-[#D1D5DB] hover:text-red-400"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
          >
            <Heart className={cn("w-[14px] h-[14px]", saved && "fill-red-500")} />
          </button>
        </div>
      </div>
    </div>
  );
}
