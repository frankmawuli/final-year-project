"use client";

import { useState, type ReactNode } from "react";
import { ProfileSidebar, type ProfileSidebarData } from "@/components/jobs/profile/profile-sidebar";
import { ProfileTabs, type ProfileTab } from "@/components/jobs/profile/profile-tabs";
import { OverviewTab } from "@/components/jobs/profile/overview-tab";
import { AboutMeSection } from "@/components/jobs/profile/about-me-section";
import { EmploymentSection } from "@/components/jobs/profile/employment-section";
import { ExperienceEducationTab } from "@/components/jobs/profile/experience-education-tab";
import { CertificatesAwardsTab } from "@/components/jobs/profile/certificates-awards-tab";
import { LanguagesSkillsTab } from "@/components/jobs/profile/languages-skills-tab";
import { CvPortfolioCoverTab } from "@/components/jobs/profile/cv-portfolio-cover-tab";

const PROFILE_DATA: ProfileSidebarData = {
  name: "Mawuli Frank",
  title: "Full Stack Developer",
  experience: "1 year",
  availability: "Immediately",
  location: "Nigeria",
  completionPercent: 25,
};

const TAB_CONTENT: Partial<Record<ProfileTab, ReactNode>> = {
  Overview: <OverviewTab />,
  "About Me": (
    <div className="bg-white rounded-b-xl border border-[#E5E7EB]">
      <AboutMeSection />
    </div>
  ),
  "Employment & Availability": (
    <div className="bg-white rounded-b-xl border border-[#E5E7EB]">
      <EmploymentSection />
    </div>
  ),
  "Experience & Education": <ExperienceEducationTab />,
  "Certificates & Awards": <CertificatesAwardsTab />,
  "Languages & Skills": <LanguagesSkillsTab />,
  "CV / Portfolio / Cover Letter": <CvPortfolioCoverTab />,
};

export default function JobProfile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Overview");

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        <ProfileSidebar
          data={PROFILE_DATA}
          onUploadCv={() => setActiveTab("CV / Portfolio / Cover Letter")}
        />

        <main className="w-full md:w-[calc(100%-21.25rem)]">
          <ProfileTabs active={activeTab} onChange={setActiveTab} />
          {TAB_CONTENT[activeTab] ?? (
            <div className="bg-white rounded-b-xl border border-[#E5E7EB] px-6 py-16 text-center text-[13.5px] text-muted-foreground">
              {activeTab} content coming soon.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
