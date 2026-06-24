"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type ApplicationStatus = "Under Review" | "Shortlisted" | "Interview" | "Hired" | "Rejected";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  companyInitials: string;
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
  location: string;
  dateApplied: string;
  status: ApplicationStatus;
}

const LOGO_COLORS = [
  "#1B5E20", "#E65100", "#1565C0", "#0D47A1",
  "#1A237E", "#212121", "#0277BD", "#2E7D32", "#0057FF", "#880E4F",
];

function logoColor(initials: string): string {
  let hash = 0;
  for (const c of initials) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  "Under Review": "bg-amber-100 text-amber-700",
  Shortlisted: "bg-blue-100 text-blue-700",
  Interview: "bg-violet-100 text-violet-700",
  Hired: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-600",
};

const APPLICATIONS: Application[] = [
  {
    id: "1",
    jobTitle: "Frontend Developer",
    company: "Flutterwave",
    companyInitials: "FW",
    jobType: "Full-time",
    location: "Lagos, Nigeria",
    dateApplied: "18 Jun 2026",
    status: "Interview",
  },
  {
    id: "2",
    jobTitle: "UI/UX Designer",
    company: "Paystack",
    companyInitials: "PS",
    jobType: "Full-time",
    location: "Remote",
    dateApplied: "15 Jun 2026",
    status: "Shortlisted",
  },
  {
    id: "3",
    jobTitle: "Backend Engineer (Node.js)",
    company: "Andela",
    companyInitials: "AN",
    jobType: "Contract",
    location: "Accra, Ghana",
    dateApplied: "10 Jun 2026",
    status: "Under Review",
  },
  {
    id: "4",
    jobTitle: "Product Designer",
    company: "Piggyvest",
    companyInitials: "PV",
    jobType: "Full-time",
    location: "Lagos, Nigeria",
    dateApplied: "05 Jun 2026",
    status: "Rejected",
  },
  {
    id: "5",
    jobTitle: "Full Stack Developer",
    company: "Moniepoint",
    companyInitials: "MP",
    jobType: "Full-time",
    location: "Remote",
    dateApplied: "29 May 2026",
    status: "Hired",
  },
  {
    id: "6",
    jobTitle: "Mobile Developer (Flutter)",
    company: "Bolt",
    companyInitials: "BT",
    jobType: "Internship",
    location: "Nairobi, Kenya",
    dateApplied: "22 May 2026",
    status: "Under Review",
  },
];

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
  const [search, setSearch] = useState("");

  const filtered = APPLICATIONS.filter((app) =>
    `${app.jobTitle} ${app.company}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-[22px] font-bold text-foreground leading-tight">My Applications</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {filtered.length} {filtered.length === 1 ? "application" : "applications"}
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
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <CompanyLogo initials={app.companyInitials} />
                        <span className="text-[13.5px] font-medium text-foreground">{app.jobTitle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-muted-foreground">{app.company}</td>
                    <td className="px-6 py-4 text-[13px] text-muted-foreground">{app.jobType}</td>
                    <td className="px-6 py-4 text-[13px] text-muted-foreground">{app.location}</td>
                    <td className="px-6 py-4 text-[13px] text-muted-foreground">{app.dateApplied}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-semibold",
                          STATUS_STYLES[app.status]
                        )}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-8 h-8 text-[#D1D5DB] mb-3" />
              <p className="text-[14px] font-semibold text-foreground mb-1">No applications found</p>
              <p className="text-[13px] text-muted-foreground">Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
