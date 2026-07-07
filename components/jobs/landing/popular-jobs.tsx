import Link from "next/link";
import { Bookmark, ChevronRight } from "lucide-react";
import { PUBLIC_TYPE_LABEL, PUBLIC_LOCATION_LABEL } from "@/components/jobs/constants";
import type { PublicJobListItem } from "@/services/jobs.service";
import { logoColor } from "./utils";

interface PopularJobsProps {
  popularJobs: PublicJobListItem[];
}

export function PopularJobs({ popularJobs }: PopularJobsProps) {
  return (
    <section className="py-10 sm:py-12 bg-white lg:my-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-foreground">Popular Jobs</h2>
            <div className="w-10 h-[3px] bg-primary rounded-full mt-1.5" />
          </div>
          <Link
            href="jobs/job-listing"
            className="inline-flex items-center gap-1 text-[13.5px] font-medium text-primary hover:underline"
          >
            View All Jobs
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {popularJobs.map((job) => (
            <Link
              key={job.id}
              href={`/apply/${job.id}`}
              className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all cursor-pointer block"
            >
              {/* Company row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {job.company.logo_url ? (
                    <img
                      src={job.company.logo_url}
                      alt={job.company.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: logoColor(job.company.initials) }}
                    >
                      <span className="text-white font-bold text-[11px]">{job.company.initials}</span>
                    </div>
                  )}
                  <span className="text-[11.5px] text-muted-foreground font-medium">
                    {job.company.name}
                  </span>
                </div>
                <button
                  className="text-muted-foreground/50 hover:text-primary transition-colors mt-0.5"
                  onClick={(e) => e.preventDefault()}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <h3 className="text-[14px] font-semibold text-foreground mb-1">{job.title}</h3>
              <p className="text-[11.5px] text-muted-foreground mb-2.5">
                {PUBLIC_TYPE_LABEL[job.employment.type]} · {PUBLIC_LOCATION_LABEL[job.location.arrangement]}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10.5px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Salary + date */}
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-semibold text-foreground">
                  {job.compensation.display}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {job.meta.posted_at
                    ? new Date(job.meta.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : "—"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
