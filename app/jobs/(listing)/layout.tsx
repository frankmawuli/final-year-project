import type { ReactNode } from "react";
import { JobListingNavbar } from "@/components/jobs/job-listing-navbar";

export default function JobListingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <JobListingNavbar />
      {children}
    </div>
  );
}
