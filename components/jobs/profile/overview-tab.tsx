"use client";

import { useApplicantAuth } from "@/context/applicant-auth-context";
import type { ApplicantProfile } from "@/services/applicant-auth.service";

const NOT_ADDED = "Not added yet.";

function buildSummaries(profile: ApplicantProfile | null): { title: string; summary: string }[] {
  const experience = profile?.experience ?? [];
  const education = profile?.education ?? [];
  const skills = profile?.skills ?? [];

  const experienceText = experience
    .map((e) => `${e.role} at ${e.company}${e.duration ? ` (${e.duration})` : ""}`)
    .join(". ");
  const educationText = education
    .map((e) => `${e.degree}, ${e.school}${e.year ? ` (${e.year})` : ""}`)
    .join(". ");

  const employmentBits = [
    profile?.headline ?? null,
    profile?.workType ?? null,
    profile?.experienceYears ? `${profile.experienceYears} of experience` : null,
    profile?.location ? `based in ${profile.location}` : null,
    profile?.preferredLocations?.length
      ? `open to ${profile.preferredLocations.join(", ")}`
      : null,
    profile?.availability ? `available ${profile.availability.toLowerCase()}` : null,
    profile?.activelyLooking ? "actively looking" : null,
  ].filter(Boolean);

  return [
    {
      title: "About Me",
      summary: profile?.about || NOT_ADDED,
    },
    {
      title: "Employment & Availability",
      summary: employmentBits.length ? `${employmentBits.join(", ")}.` : NOT_ADDED,
    },
    {
      title: "Experience & Education",
      summary:
        [experienceText, educationText].filter(Boolean).join(" ") || NOT_ADDED,
    },
    {
      title: "Certificates & Awards",
      summary: NOT_ADDED,
    },
    {
      title: "Languages & Skills",
      summary: skills.length
        ? `Core skills include ${skills.map((s) => s.name).join(", ")}.`
        : NOT_ADDED,
    },
    {
      title: "CV / Portfolio / Cover Letter",
      summary: profile?.cvUrl ? `CV on file (${profile.cvName ?? "uploaded"}).` : NOT_ADDED,
    },
  ];
}

export function OverviewTab() {
  const { profile } = useApplicantAuth();
  const sections = buildSummaries(profile);

  return (
    <div className="bg-white rounded-b-xl border border-[#E5E7EB] divide-y divide-[#F3F4F6]">
      {sections.map((section) => (
        <div key={section.title} className="px-6 py-6">
          <h3 className="text-[15px] font-semibold text-foreground">{section.title}</h3>
          <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">{section.summary}</p>
        </div>
      ))}
    </div>
  );
}
