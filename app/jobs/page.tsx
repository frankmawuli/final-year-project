"use client";

import { useState, useEffect } from "react";
import { jobsService, type PublicJobListItem } from "@/services/jobs.service";
import { Navbar } from "@/components/jobs/landing/navbar";
import { Hero } from "@/components/jobs/landing/hero";
import { TopCategories } from "@/components/jobs/landing/top-categories";
import { Features } from "@/components/jobs/landing/features";
import { PopularJobs } from "@/components/jobs/landing/popular-jobs";
import { CtaBanner } from "@/components/jobs/landing/cta-banner";
import { Footer } from "@/components/jobs/landing/footer";

export default function JobsPage() {
  const [popularJobs, setPopularJobs] = useState<PublicJobListItem[]>([]);

  useEffect(() => {
    jobsService.listPublic({ per_page: 4 })
      .then((res) => setPopularJobs(res.data))
      .catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-foreground antialiased">
      <Navbar />
      <Hero popularJobs={popularJobs} />
      <TopCategories />
      <Features />
      <PopularJobs popularJobs={popularJobs} />
      <CtaBanner />
      <Footer />
    </div>
  );
}
