"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkExperienceForm, type WorkExperienceEntry } from "@/components/jobs/profile/work-experience-form";
import { EducationForm, type EducationEntry } from "@/components/jobs/profile/education-form";

export function ExperienceEducationTab() {
  const [addingExperience, setAddingExperience] = useState(false);
  const [addingEducation, setAddingEducation] = useState(false);
  const [noExperience, setNoExperience] = useState(false);

  function handleSaveExperience(entry: WorkExperienceEntry) {
    console.log("work experience saved", entry);
    setAddingExperience(false);
  }

  function handleSaveEducation(entry: EducationEntry) {
    console.log("education saved", entry);
    setAddingEducation(false);
  }

  if (addingExperience) {
    return (
      <div className="bg-white rounded-b-xl border border-[#E5E7EB]">
        <WorkExperienceForm onCancel={() => setAddingExperience(false)} onSave={handleSaveExperience} />
      </div>
    );
  }

  if (addingEducation) {
    return (
      <div className="bg-white rounded-b-xl border border-[#E5E7EB]">
        <EducationForm onCancel={() => setAddingEducation(false)} onSave={handleSaveEducation} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-xl border border-[#E5E7EB] divide-y divide-[#F3F4F6]">
      <div className="px-6 py-6">
        <h3 className="text-[15px] font-semibold text-foreground">Experience & Education</h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
          Manage your work history and education
        </p>
      </div>

      <div className="px-6 py-6">
        <h3 className="text-[15px] font-semibold text-foreground">Work Experience</h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
          Add your Work Experience. Such as an internship, part-time work or long term specialised
          experience.
        </p>
        <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-[13px] text-foreground">
          <input
            type="checkbox"
            checked={noExperience}
            onChange={(e) => setNoExperience(e.target.checked)}
            className="w-4 h-4 rounded border-[#D1D5DB] accent-primary"
          />
          I have no experience
        </label>
        <div className="mt-6 flex justify-center">
          <Button size="sm" className="rounded-full px-4" onClick={() => setAddingExperience(true)}>
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
      </div>

      <div className="px-6 py-6">
        <h3 className="text-[15px] font-semibold text-foreground">Education</h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
          List your qualifications here.
        </p>
        <div className="mt-6 flex justify-center">
          <Button size="sm" className="rounded-full px-4" onClick={() => setAddingEducation(true)}>
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
