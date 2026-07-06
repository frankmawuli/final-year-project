"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApplicantAuth } from "@/context/applicant-auth-context";
import { applicantAuthService, type MyApplication, type MyApplicationStatus } from "@/services/applicant-auth.service";

const LOGO_COLORS = [
  "#1B5E20", "#E65100", "#1565C0", "#0D47A1",
  "#1A237E", "#212121", "#0277BD", "#2E7D32", "#0057FF", "#880E4F",
];

function logoColor(initials: string): string {
  let hash = 0;
  for (const c of initials) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

function companyInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
}

const STATUS_LABELS: Record<MyApplicationStatus, string> = {
  PENDING_REVIEW: "Under Review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  ACCEPTED: "Hired",
  APPROVED: "Hired",
  REJECTED: "Rejected",
};

const STATUS_STYLES: Record<MyApplicationStatus, string> = {
  PENDING_REVIEW: "bg-amber-100 text-amber-700",
  SHORTLISTED: "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-violet-100 text-violet-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-600",
};

const JOB_TYPE_LABELS: Record<MyApplication["job"]["type"], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const WORK_LOCATION_LABELS: Record<MyApplication["job"]["workLocation"], string> = {
  REMOTE: "Remote",
  ON_SITE: "On-site",
  HYBRID: "Hybrid",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CompanyLogo({ initials }: { initials: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
      style={{ backgroundColor: logoColor(initials) }}
    >
      {initials}
    </div>
  );
}

export default function ApplicationPage() {
  const { accessToken } = useApplicantAuth();
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    applicantAuthService
      .getMyApplications(accessToken)
      .then((res) => {
        if (!cancelled) setApplications(res.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load applications.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const filtered = applications.filter((app) =>
    `${app.job.title} ${app.job.company.name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-[22px] font-bold text-foreground leading-tight">My Applications</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {loading
                ? "Loading…"
                : `${filtered.length} ${filtered.length === 1 ? "application" : "applications"}`}
            </p>
          </div>
          <div className="relative w-full max-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job or company"
              className="h-10 w-full rounded-lg border border-[#E5E7EB] bg-white pl-9 pr-3 text-[13px] text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading your applications…
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[14px] font-semibold text-foreground mb-1">
                Could not load applications
              </p>
              <p className="text-[13px] text-muted-foreground">{error}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Job
                      </th>
                      <th className="px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Company
                      </th>
                      <th className="px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Job Type
                      </th>
                      <th className="px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Location
                      </th>
                      <th className="px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Date Applied
                      </th>
                      <th className="px-6 py-3.5 text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {filtered.map((app) => {
                      const initials = companyInitials(app.job.company.name);
                      return (
                        <tr key={app.id} className="hover:bg-[#F9FAFB] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <CompanyLogo initials={initials} />
                              <span className="text-[13.5px] font-medium text-foreground">
                                {app.job.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[13px] text-muted-foreground">
                            {app.job.company.name}
                          </td>
                          <td className="px-6 py-4 text-[13px] text-muted-foreground">
                            {JOB_TYPE_LABELS[app.job.type]}
                          </td>
                          <td className="px-6 py-4 text-[13px] text-muted-foreground">
                            {WORK_LOCATION_LABELS[app.job.workLocation]}
                          </td>
                          <td className="px-6 py-4 text-[13px] text-muted-foreground">
                            {formatDate(app.appliedAt)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-semibold",
                                STATUS_STYLES[app.status]
                              )}
                            >
                              {STATUS_LABELS[app.status]}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="w-8 h-8 text-[#D1D5DB] mb-3" />
                  <p className="text-[14px] font-semibold text-foreground mb-1">
                    {applications.length === 0 ? "No applications yet" : "No applications found"}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {applications.length === 0 ? (
                      <>
                        Browse the{" "}
                        <Link href="/jobs/job-listing" className="font-medium text-primary underline">
                          job listing
                        </Link>{" "}
                        and apply to get started.
                      </>
                    ) : (
                      "Try a different search term."
                    )}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
