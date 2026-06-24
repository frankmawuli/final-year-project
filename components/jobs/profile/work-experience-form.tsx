"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput, FormLabel, FormSelect } from "@/components/jobs/profile/form-controls";
import { JOB_FUNCTIONS, LOCATIONS, MONTHS, WORK_TYPES, YEARS } from "@/components/jobs/profile/constants";

const JOB_LEVELS = ["Entry Level", "Mid Level", "Senior Level", "Manager", "Director", "Executive"];
const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Accounting, Auditing & Finance",
];
const SALARY_RANGES = [
  "Less than ₦100,000",
  "₦100,000 - ₦300,000",
  "₦300,000 - ₦500,000",
  "₦500,000 - ₦1,000,000",
  "₦1,000,000+",
];

export interface WorkExperienceEntry {
  employer: string;
  jobTitle: string;
  jobLevel: string;
  country: string;
  city: string;
  industry: string;
  jobFunction: string;
  monthlySalary: string;
  workType: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  currentlyWorkHere: boolean;
  responsibilities: string;
}

const EMPTY_FORM: WorkExperienceEntry = {
  employer: "",
  jobTitle: "",
  jobLevel: "",
  country: "",
  city: "",
  industry: "",
  jobFunction: "",
  monthlySalary: "",
  workType: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  currentlyWorkHere: false,
  responsibilities: "",
};

export function WorkExperienceForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (entry: WorkExperienceEntry) => void;
}) {
  const [form, setForm] = useState<WorkExperienceEntry>(EMPTY_FORM);

  function update<K extends keyof WorkExperienceEntry>(key: K, value: WorkExperienceEntry[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <div className="px-6 py-6">
        <h3 className="text-[15px] font-semibold text-foreground">Add Work Experience</h3>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#F3F4F6] px-6 py-6 sm:grid-cols-2">
        <div>
          <FormLabel required>Employer</FormLabel>
          <FormInput
            placeholder="Employer Name"
            value={form.employer}
            onChange={(e) => update("employer", e.target.value)}
          />
        </div>
        <div>
          <FormLabel required>Job Title</FormLabel>
          <FormInput
            placeholder="Job Title"
            value={form.jobTitle}
            onChange={(e) => update("jobTitle", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#F3F4F6] px-6 py-6 sm:grid-cols-3">
        <div>
          <FormLabel required>Job Level</FormLabel>
          <FormSelect value={form.jobLevel} onChange={(e) => update("jobLevel", e.target.value)}>
            <option value="" disabled>
              Please Select...
            </option>
            {JOB_LEVELS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>
        <div>
          <FormLabel required>Country</FormLabel>
          <FormSelect value={form.country} onChange={(e) => update("country", e.target.value)}>
            <option value="" disabled>
              Please Select...
            </option>
            {LOCATIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>
        <div>
          <FormLabel required>City</FormLabel>
          <FormInput placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#F3F4F6] px-6 py-6 sm:grid-cols-3">
        <div>
          <FormLabel required>Industry</FormLabel>
          <FormSelect value={form.industry} onChange={(e) => update("industry", e.target.value)}>
            <option value="" disabled>
              Please Select...
            </option>
            {INDUSTRIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>
        <div>
          <FormLabel required>Job Function</FormLabel>
          <FormSelect value={form.jobFunction} onChange={(e) => update("jobFunction", e.target.value)}>
            <option value="" disabled>
              Please Select...
            </option>
            {JOB_FUNCTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>
        <div>
          <FormLabel>Monthly Salary</FormLabel>
          <FormSelect
            value={form.monthlySalary}
            onChange={(e) => update("monthlySalary", e.target.value)}
          >
            <option value="" disabled>
              Please Select...
            </option>
            {SALARY_RANGES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#F3F4F6] px-6 py-6 sm:grid-cols-3">
        <div>
          <FormLabel required>Work type</FormLabel>
          <FormSelect value={form.workType} onChange={(e) => update("workType", e.target.value)}>
            <option value="" disabled>
              Please Select...
            </option>
            {WORK_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2.5 text-[13.5px] text-foreground">
            <input
              type="checkbox"
              checked={form.currentlyWorkHere}
              onChange={(e) => update("currentlyWorkHere", e.target.checked)}
              className="size-4 rounded border-[#D1D5DB] accent-primary"
            />
            I currently work here
          </label>
        </div>
        <div>
          <FormLabel required>Start date</FormLabel>
          <div className="flex gap-2">
            <FormSelect value={form.startMonth} onChange={(e) => update("startMonth", e.target.value)}>
              <option value="" disabled>
                Month
              </option>
              {MONTHS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
            <FormSelect value={form.startYear} onChange={(e) => update("startYear", e.target.value)}>
              <option value="" disabled>
                Year
              </option>
              {YEARS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>
        <div>
          <FormLabel>End date</FormLabel>
          <div className="flex gap-2">
            <FormSelect
              value={form.endMonth}
              disabled={form.currentlyWorkHere}
              onChange={(e) => update("endMonth", e.target.value)}
            >
              <option value="" disabled>
                Month
              </option>
              {MONTHS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
            <FormSelect
              value={form.endYear}
              disabled={form.currentlyWorkHere}
              onChange={(e) => update("endYear", e.target.value)}
            >
              <option value="" disabled>
                Year
              </option>
              {YEARS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>
      </div>

      <div className="border-t border-[#F3F4F6] px-6 py-6">
        <FormLabel>Job Responsibilities</FormLabel>
        <textarea
          value={form.responsibilities}
          onChange={(e) => update("responsibilities", e.target.value)}
          placeholder="Add at least 50 words describing your day to day activities and achievements"
          rows={6}
          className="w-full resize-y rounded-xl border border-[#E5E7EB] p-4 text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-[#F3F4F6] px-6 py-4">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/5"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={() => onSave(form)}>Save</Button>
      </div>
    </div>
  );
}
