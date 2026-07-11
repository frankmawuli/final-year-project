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
import { useApplicantAuth } from "@/context/applicant-auth-context";
import type { ApplicantProfile } from "@/services/applicant-auth.service";

function completionPercent(profile: ApplicantProfile): number {
  const checks = [
    !!profile.name,
    !!profile.about,
    !!profile.phone,
    !!profile.location,
    !!profile.avatarUrl,
    !!profile.headline,
    !!profile.availability,
    profile.skills.length > 0,
    profile.experience.length > 0,
    profile.education.length > 0,
    !!profile.cvUrl,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function JobProfile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Overview");
  const { profile, applicant, updateProfile } = useApplicantAuth();

  const sidebarData: ProfileSidebarData = {
    name: profile?.name ?? applicant?.name ?? "—",
    title: profile?.headline ?? profile?.experience[0]?.role ?? "Job Seeker",
    experience:
      profile?.experienceYears ??
      (profile?.experience.length
        ? `${profile.experience.length} role${profile.experience.length > 1 ? "s" : ""}`
        : "—"),
    availability: profile?.availability ?? "—",
    location: profile?.location ?? "—",
    completionPercent: profile ? completionPercent(profile) : 0,
    avatarUrl: profile?.avatarUrl ?? undefined,
  };

  const tabContent: Partial<Record<ProfileTab, ReactNode>> = {
    Overview: <OverviewTab />,
    "About Me": (
      <div className="bg-card rounded-b-xl border border-border">
        <AboutMeSection
          value={profile?.about ?? ""}
          onSave={(about) => updateProfile({ about })}
        />
      </div>
    ),
    "Employment & Availability": (
      <div className="bg-card rounded-b-xl border border-border">
        <EmploymentSection />
      </div>
    ),
    "Experience & Education": <ExperienceEducationTab />,
    "Certificates & Awards": <CertificatesAwardsTab />,
    "Languages & Skills": <LanguagesSkillsTab />,
    "CV / Portfolio / Cover Letter": <CvPortfolioCoverTab />,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1340px] mx-auto px-3 sm:px-5 py-5 flex flex-col md:flex-row gap-5">
        <ProfileSidebar
          data={sidebarData}
          onUploadCv={() => setActiveTab("CV / Portfolio / Cover Letter")}
        />

        <main className="w-full md:w-[calc(100%-21.25rem)]">
          <ProfileTabs active={activeTab} onChange={setActiveTab} />
          {tabContent[activeTab] ?? (
            <div className="bg-card rounded-b-xl border border-border px-5 py-12 text-center text-[13.5px] text-muted-foreground">
              {activeTab} content coming soon.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
