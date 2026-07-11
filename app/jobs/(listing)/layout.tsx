import type { ReactNode } from "react";
import { JobListingNavbar } from "@/components/jobs/job-listing-navbar";

export default function JobListingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <JobListingNavbar />
      {children}
    </div>
  );
}
