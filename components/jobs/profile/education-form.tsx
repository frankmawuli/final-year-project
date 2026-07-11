"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput, FormLabel, FormSelect } from "@/components/jobs/profile/form-controls";
import { LOCATIONS, MONTHS, QUALIFICATIONS, YEARS } from "@/components/jobs/profile/constants";

export interface EducationEntry {
  institution: string;
  qualification: string;
  fieldOfStudy: string;
  country: string;
  city: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  currentlyStudying: boolean;
  description: string;
}

const EMPTY_FORM: EducationEntry = {
  institution: "",
  qualification: "",
  fieldOfStudy: "",
  country: "",
  city: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  currentlyStudying: false,
  description: "",
};

export function EducationForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (entry: EducationEntry) => void;
}) {
  const [form, setForm] = useState<EducationEntry>(EMPTY_FORM);

  function update<K extends keyof EducationEntry>(key: K, value: EducationEntry[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <div className="px-5 py-5">
        <h3 className="text-[15px] font-semibold text-foreground">Add Education</h3>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-4 border-t border-border px-5 py-5 sm:grid-cols-2">
        <div>
          <FormLabel required>Institution</FormLabel>
          <FormInput
            placeholder="Institution Name"
            value={form.institution}
            onChange={(e) => update("institution", e.target.value)}
          />
        </div>
        <div>
          <FormLabel required>Field of Study</FormLabel>
          <FormInput
            placeholder="Field of Study"
            value={form.fieldOfStudy}
            onChange={(e) => update("fieldOfStudy", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-4 border-t border-border px-5 py-5 sm:grid-cols-3">
        <div>
          <FormLabel required>Qualification</FormLabel>
          <FormSelect value={form.qualification} onChange={(e) => update("qualification", e.target.value)}>
            <option value="" disabled>
              Please Select...
            </option>
            {QUALIFICATIONS.map((option) => (
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

      <div className="grid grid-cols-1 gap-x-5 gap-y-4 border-t border-border px-5 py-5 sm:grid-cols-2">
        <div>
          <FormLabel required>Start date</FormLabel>
          <div className="flex gap-1.5">
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
          <div className="flex gap-1.5">
            <FormSelect
              value={form.endMonth}
              disabled={form.currentlyStudying}
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
              disabled={form.currentlyStudying}
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
          <label className="mt-2.5 flex w-fit cursor-pointer items-center gap-2 text-[13.5px] text-foreground">
            <input
              type="checkbox"
              checked={form.currentlyStudying}
              onChange={(e) => update("currentlyStudying", e.target.checked)}
              className="size-4 rounded border-input accent-primary"
            />
            I am currently studying here
          </label>
        </div>
      </div>

      <div className="border-t border-border px-5 py-5">
        <FormLabel>Description</FormLabel>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Add details about your achievements, activities, or coursework"
          rows={6}
          className="w-full resize-y rounded-xl border border-border p-3 text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex justify-end gap-2.5 border-t border-border px-5 py-3">
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
