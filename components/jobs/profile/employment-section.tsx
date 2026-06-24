"use client";

import { useState } from "react";
import { ChevronDown, Pencil, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput, FormLabel, FormSelect } from "@/components/jobs/profile/form-controls";
import { JOB_FUNCTIONS, LOCATIONS, QUALIFICATIONS, WORK_TYPES } from "@/components/jobs/profile/constants";

const EXPERIENCE_OPTIONS = ["No experience", "1 year", "2 years", "3-5 years", "5+ years"];
const AVAILABILITY_OPTIONS = ["Immediately", "2 weeks notice", "1 month notice"];
const CURRENCIES = ["NGN", "USD", "GHS", "KES"];

interface EmploymentForm {
  headline: string;
  qualification: string;
  currentFunction: string;
  preferredFunction: string;
  location: string;
  preferredLocations: string[];
  experience: string;
  workType: string;
  availability: string;
  currency: string;
  salary: string;
  activelyLooking: boolean;
  displayProfile: boolean;
  willingToRelocate: boolean;
}

const INITIAL: EmploymentForm = {
  headline: "Full Stack Developer",
  qualification: "Degree",
  currentFunction: "Accounting, Auditing & Finance",
  preferredFunction: "Accounting, Auditing & Finance",
  location: "Nigeria",
  preferredLocations: ["Nigeria", "Ghana"],
  experience: "1 year",
  workType: "Full Time",
  availability: "Immediately",
  currency: "NGN",
  salary: "400000000",
  activelyLooking: true,
  displayProfile: true,
  willingToRelocate: false,
};

export function EmploymentSection() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(INITIAL);
  const [draft, setDraft] = useState(INITIAL);

  function update<K extends keyof EmploymentForm>(key: K, value: EmploymentForm[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleEdit() {
    setDraft(saved);
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
  }

  function handleSave() {
    setSaved(draft);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="px-6 py-6">
        <h3 className="text-[15px] font-semibold text-foreground">Employment & Availability</h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
          Keeping this section up to date will help employers & recruiters find you. They will know
          the field you are in, what your preferred industries are, and if you are actively looking.
        </p>
        <p className="mt-3 text-[13.5px] font-medium text-primary">{saved.headline}</p>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm" className="rounded-full px-4" onClick={handleEdit}>
            <Pencil className="size-3.5" />
            Edit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 px-6 py-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary">
          <User className="h-8 w-8 text-primary-foreground" strokeWidth={1.5} />
        </div>
        <div>
          <Button variant="outline" size="sm" className="rounded-full px-4">
            Upload Photo
          </Button>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Upload an image no larger than 5MB for file types .jpg .gif .png .bmp
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#F3F4F6] px-6 py-6 sm:grid-cols-3">
        <div>
          <FormLabel>Professional Headline</FormLabel>
          <FormInput value={draft.headline} onChange={(e) => update("headline", e.target.value)} />
        </div>

        <div>
          <FormLabel required>Highest Qualification</FormLabel>
          <FormSelect value={draft.qualification} onChange={(e) => update("qualification", e.target.value)}>
            {QUALIFICATIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>

        <div>
          <FormLabel required>Current Job Function</FormLabel>
          <FormSelect
            value={draft.currentFunction}
            onChange={(e) => update("currentFunction", e.target.value)}
          >
            {JOB_FUNCTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>

        <div>
          <FormLabel required>Preferred Job Function</FormLabel>
          <FormSelect
            value={draft.preferredFunction}
            onChange={(e) => update("preferredFunction", e.target.value)}
          >
            {JOB_FUNCTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>

        <div>
          <FormLabel required>Location</FormLabel>
          <FormSelect value={draft.location} onChange={(e) => update("location", e.target.value)}>
            {LOCATIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>

        <div>
          <FormLabel required>Preferred Job Locations</FormLabel>
          <button
            type="button"
            className="flex h-10 w-full items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-3.5 text-[13.5px] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <span className="truncate">{draft.preferredLocations[0]}</span>
            <span className="flex shrink-0 items-center gap-2">
              {draft.preferredLocations.length > 1 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                  +{draft.preferredLocations.length - 1}
                </span>
              )}
              <ChevronDown className="size-4 text-muted-foreground" />
            </span>
          </button>
        </div>

        <div>
          <FormLabel required>Years of Experience</FormLabel>
          <FormSelect value={draft.experience} onChange={(e) => update("experience", e.target.value)}>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>

        <div>
          <FormLabel required>Work Type</FormLabel>
          <FormSelect value={draft.workType} onChange={(e) => update("workType", e.target.value)}>
            {WORK_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>

        <div>
          <FormLabel required>Availability</FormLabel>
          <FormSelect value={draft.availability} onChange={(e) => update("availability", e.target.value)}>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>

        <div className="sm:col-span-3">
          <FormLabel>Monthly Salary Expectation (Gross)</FormLabel>
          <div className="grid grid-cols-3 gap-x-6">
            <FormSelect value={draft.currency} onChange={(e) => update("currency", e.target.value)}>
              {CURRENCIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
            <FormInput
              className="sm:col-span-2"
              inputMode="numeric"
              value={draft.salary}
              onChange={(e) => update("salary", e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#F3F4F6] px-6 py-6">
        <h3 className="text-[15px] font-semibold text-foreground">Preferences</h3>
        <div className="mt-4 space-y-3">
          <label className="flex w-fit cursor-pointer items-center gap-2.5 text-[13.5px] text-foreground">
            <input
              type="checkbox"
              checked={draft.activelyLooking}
              onChange={(e) => update("activelyLooking", e.target.checked)}
              className="size-4 rounded border-[#D1D5DB] accent-primary"
            />
            I am actively looking for a job
          </label>
          <label className="flex w-fit cursor-pointer items-center gap-2.5 text-[13.5px] text-foreground">
            <input
              type="checkbox"
              checked={draft.displayProfile}
              onChange={(e) => update("displayProfile", e.target.checked)}
              className="size-4 rounded border-[#D1D5DB] accent-primary"
            />
            Display my profile to potential employers
          </label>
          <label className="flex w-fit cursor-pointer items-center gap-2.5 text-[13.5px] text-foreground">
            <input
              type="checkbox"
              checked={draft.willingToRelocate}
              onChange={(e) => update("willingToRelocate", e.target.checked)}
              className="size-4 rounded border-[#D1D5DB] accent-primary"
            />
            Willing to relocate
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-[#F3F4F6] px-6 py-4">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/5"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
