"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkExperienceForm, type WorkExperienceEntry } from "@/components/jobs/profile/work-experience-form";
import { EducationForm, type EducationEntry } from "@/components/jobs/profile/education-form";
import { useApplicantAuth } from "@/context/applicant-auth-context";
import type { ApplicantEducation, ApplicantExperience } from "@/services/applicant-auth.service";

function formatRange(startMonth: string, startYear: string, endMonth: string, endYear: string, current: boolean) {
  const start = [startMonth, startYear].filter(Boolean).join(" ");
  const end = current ? "Present" : [endMonth, endYear].filter(Boolean).join(" ");
  return [start, end].filter(Boolean).join(" – ");
}

function toExperienceBody({ role, company, duration, responsibilities }: ApplicantExperience) {
  return { role, company, duration, responsibilities: responsibilities ?? undefined };
}

function toEducationBody({ degree, school, year, description }: ApplicantEducation) {
  return { degree, school, year, description: description ?? undefined };
}

export function ExperienceEducationTab() {
  const { profile, updateProfile } = useApplicantAuth();
  const [addingExperience, setAddingExperience] = useState(false);
  const [addingEducation, setAddingEducation] = useState(false);
  const [noExperience, setNoExperience] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const experience = profile?.experience ?? [];
  const education = profile?.education ?? [];

  async function save(body: Parameters<typeof updateProfile>[0]) {
    setError(null);
    setSaving(true);
    try {
      await updateProfile(body);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveExperience(entry: WorkExperienceEntry) {
    const ok = await save({
      experience: [
        ...experience.map(toExperienceBody),
        {
          role: entry.jobTitle,
          company: entry.employer,
          duration: formatRange(
            entry.startMonth,
            entry.startYear,
            entry.endMonth,
            entry.endYear,
            entry.currentlyWorkHere,
          ),
          responsibilities: entry.responsibilities.trim() || undefined,
        },
      ],
    });
    if (ok) setAddingExperience(false);
  }

  async function handleRemoveExperience(id: string) {
    await save({
      experience: experience.filter((e) => e.id !== id).map(toExperienceBody),
    });
  }

  async function handleSaveEducation(entry: EducationEntry) {
    const ok = await save({
      education: [
        ...education.map(toEducationBody),
        {
          degree: [entry.qualification, entry.fieldOfStudy].filter(Boolean).join(", "),
          school: entry.institution,
          year: formatRange(
            entry.startMonth,
            entry.startYear,
            entry.endMonth,
            entry.endYear,
            entry.currentlyStudying,
          ),
          description: entry.description.trim() || undefined,
        },
      ],
    });
    if (ok) setAddingEducation(false);
  }

  async function handleRemoveEducation(id: string) {
    await save({
      education: education.filter((e) => e.id !== id).map(toEducationBody),
    });
  }

  if (addingExperience) {
    return (
      <div className="bg-card rounded-b-xl border border-border">
        <WorkExperienceForm onCancel={() => setAddingExperience(false)} onSave={handleSaveExperience} />
        {error && <p className="px-5 pb-3 text-[13px] text-destructive">{error}</p>}
      </div>
    );
  }

  if (addingEducation) {
    return (
      <div className="bg-card rounded-b-xl border border-border">
        <EducationForm onCancel={() => setAddingEducation(false)} onSave={handleSaveEducation} />
        {error && <p className="px-5 pb-3 text-[13px] text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-b-xl border border-border divide-y divide-border">
      <div className="px-5 py-5">
        <h3 className="text-[15px] font-semibold text-foreground">Experience & Education</h3>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
          Manage your work history and education
        </p>
        {error && <p className="mt-1.5 text-[13px] text-destructive">{error}</p>}
      </div>

      <div className="px-5 py-5">
        <h3 className="text-[15px] font-semibold text-foreground">Work Experience</h3>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
          Add your Work Experience. Such as an internship, part-time work or long term specialised
          experience.
        </p>

        {experience.length > 0 && (
          <ul className="mt-3 space-y-2.5">
            {experience.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-2.5 rounded-xl border border-border px-3 py-2.5"
              >
                <div>
                  <p className="text-[13.5px] font-semibold text-foreground">{item.role}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {item.company}
                    {item.duration ? ` · ${item.duration}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${item.role} at ${item.company}`}
                  onClick={() => handleRemoveExperience(item.id)}
                  disabled={saving}
                  className="mt-0.5 text-muted-foreground hover:text-destructive disabled:opacity-50"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {experience.length === 0 && (
          <label className="mt-3 flex w-fit cursor-pointer items-center gap-1.5 text-[13px] text-foreground">
            <input
              type="checkbox"
              checked={noExperience}
              onChange={(e) => setNoExperience(e.target.checked)}
              className="w-4 h-4 rounded border-input accent-primary"
            />
            I have no experience
          </label>
        )}
        <div className="mt-5 flex justify-center">
          <Button
            size="sm"
            className="rounded-full px-3"
            onClick={() => setAddingExperience(true)}
            disabled={saving}
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
      </div>

      <div className="px-5 py-5">
        <h3 className="text-[15px] font-semibold text-foreground">Education</h3>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
          List your qualifications here.
        </p>

        {education.length > 0 && (
          <ul className="mt-3 space-y-2.5">
            {education.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-2.5 rounded-xl border border-border px-3 py-2.5"
              >
                <div>
                  <p className="text-[13.5px] font-semibold text-foreground">{item.degree}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {item.school}
                    {item.year ? ` · ${item.year}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${item.degree} at ${item.school}`}
                  onClick={() => handleRemoveEducation(item.id)}
                  disabled={saving}
                  className="mt-0.5 text-muted-foreground hover:text-destructive disabled:opacity-50"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex justify-center">
          <Button
            size="sm"
            className="rounded-full px-3"
            onClick={() => setAddingEducation(true)}
            disabled={saving}
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
