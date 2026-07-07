"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, Pencil, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormInput, FormLabel, FormSelect } from "@/components/jobs/profile/form-controls";
import { JOB_FUNCTIONS, LOCATIONS, QUALIFICATIONS, WORK_TYPES } from "@/components/jobs/profile/constants";
import { useApplicantAuth } from "@/context/applicant-auth-context";
import { uploadService } from "@/services/upload.service";
import type { ApplicantProfile } from "@/services/applicant-auth.service";

const EXPERIENCE_OPTIONS = ["No experience", "1 year", "2 years", "3-5 years", "5+ years"];
const AVAILABILITY_OPTIONS = ["Immediately", "2 weeks notice", "1 month notice"];
const CURRENCIES = ["NGN", "USD", "GHS", "KES"];
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

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

function fromProfile(profile: ApplicantProfile | null): EmploymentForm {
  return {
    headline: profile?.headline ?? "",
    qualification: profile?.qualification ?? "",
    currentFunction: profile?.currentFunction ?? "",
    preferredFunction: profile?.preferredFunction ?? "",
    location: profile?.location ?? "",
    preferredLocations: profile?.preferredLocations ?? [],
    experience: profile?.experienceYears ?? "",
    workType: profile?.workType ?? "",
    availability: profile?.availability ?? "",
    currency: profile?.salaryCurrency ?? "",
    salary: profile?.salaryExpectation ?? "",
    activelyLooking: profile?.activelyLooking ?? true,
    displayProfile: profile?.displayProfile ?? true,
    willingToRelocate: profile?.willingToRelocate ?? false,
  };
}

function LocationsMultiSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (locations: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function toggle(location: string) {
    onChange(
      value.includes(location) ? value.filter((l) => l !== location) : [...value, location],
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-3 text-[13.5px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className={cn("truncate", value.length ? "text-foreground" : "text-muted-foreground")}>
          {value[0] ?? "Select locations"}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {value.length > 1 && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
              +{value.length - 1}
            </span>
          )}
          <ChevronDown
            className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </span>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg">
          {LOCATIONS.map((location) => (
            <label
              key={location}
              className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-[13.5px] text-foreground hover:bg-[#F5F6F8]"
            >
              <input
                type="checkbox"
                checked={value.includes(location)}
                onChange={() => toggle(location)}
                className="size-4 rounded border-[#D1D5DB] accent-primary"
              />
              {location}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function EmploymentSection() {
  const { profile, accessToken, updateProfile } = useApplicantAuth();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EmploymentForm>(() => fromProfile(profile));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof EmploymentForm>(key: K, value: EmploymentForm[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleEdit() {
    setDraft(fromProfile(profile));
    setError(null);
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      await updateProfile({
        headline: draft.headline.trim(),
        qualification: draft.qualification,
        currentFunction: draft.currentFunction,
        preferredFunction: draft.preferredFunction,
        location: draft.location,
        preferredLocations: draft.preferredLocations,
        experienceYears: draft.experience,
        workType: draft.workType,
        availability: draft.availability,
        salaryCurrency: draft.currency,
        salaryExpectation: draft.salary,
        activelyLooking: draft.activelyLooking,
        displayProfile: draft.displayProfile,
        willingToRelocate: draft.willingToRelocate,
      });
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoChange(file: File | undefined) {
    if (!file || !accessToken) return;
    setError(null);
    if (file.size > MAX_PHOTO_SIZE) {
      setError("Photo must be no larger than 5MB.");
      return;
    }
    setUploadingPhoto(true);
    try {
      const { url } = await uploadService.image(file, accessToken);
      await updateProfile({ avatarUrl: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo.");
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }

  if (!editing) {
    const bits = [
      profile?.workType,
      profile?.experienceYears ? `${profile.experienceYears} experience` : null,
      profile?.availability ? `available ${profile.availability.toLowerCase()}` : null,
      profile?.activelyLooking ? "actively looking" : null,
    ].filter(Boolean);

    return (
      <div className="px-5 py-5">
        <h3 className="text-[15px] font-semibold text-foreground">Employment & Availability</h3>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
          Keeping this section up to date will help employers & recruiters find you. They will know
          the field you are in, what your preferred industries are, and if you are actively looking.
        </p>
        {profile?.headline && (
          <p className="mt-2.5 text-[13.5px] font-medium text-primary">{profile.headline}</p>
        )}
        {bits.length > 0 && (
          <p className="mt-1 text-[13px] text-muted-foreground">
            {bits.join(" · ")}
          </p>
        )}
        <div className="mt-3 flex justify-center">
          <Button variant="outline" size="sm" className="rounded-full px-3" onClick={handleEdit}>
            <Pencil className="size-3.5" />
            {profile?.headline ? "Edit" : "Add"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary">
          {profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-primary-foreground" strokeWidth={1.5} />
          )}
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-3"
            disabled={uploadingPhoto}
            onClick={() => photoInputRef.current?.click()}
          >
            {uploadingPhoto ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Uploading…
              </>
            ) : (
              "Upload Photo"
            )}
          </Button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={(e) => handlePhotoChange(e.target.files?.[0])}
          />
          <p className="mt-1.5 text-[12px] text-muted-foreground">
            Upload an image no larger than 5MB for file types .jpg .png
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-4 border-t border-[#F3F4F6] px-5 py-5 sm:grid-cols-3">
        <div>
          <FormLabel>Professional Headline</FormLabel>
          <FormInput
            value={draft.headline}
            placeholder="e.g. Full Stack Developer"
            onChange={(e) => update("headline", e.target.value)}
          />
        </div>

        <div>
          <FormLabel required>Highest Qualification</FormLabel>
          <FormSelect value={draft.qualification} onChange={(e) => update("qualification", e.target.value)}>
            <option value="" disabled>
              Select…
            </option>
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
            <option value="" disabled>
              Select…
            </option>
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
            <option value="" disabled>
              Select…
            </option>
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
            <option value="" disabled>
              Select…
            </option>
            {LOCATIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>

        <div>
          <FormLabel required>Preferred Job Locations</FormLabel>
          <LocationsMultiSelect
            value={draft.preferredLocations}
            onChange={(locations) => update("preferredLocations", locations)}
          />
        </div>

        <div>
          <FormLabel required>Years of Experience</FormLabel>
          <FormSelect value={draft.experience} onChange={(e) => update("experience", e.target.value)}>
            <option value="" disabled>
              Select…
            </option>
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
            <option value="" disabled>
              Select…
            </option>
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
            <option value="" disabled>
              Select…
            </option>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FormSelect>
        </div>

        <div className="sm:col-span-3">
          <FormLabel>Monthly Salary Expectation (Gross)</FormLabel>
          <div className="grid grid-cols-3 gap-x-5">
            <FormSelect value={draft.currency} onChange={(e) => update("currency", e.target.value)}>
              <option value="" disabled>
                Currency
              </option>
              {CURRENCIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormSelect>
            <FormInput
              className="sm:col-span-2"
              inputMode="numeric"
              placeholder="e.g. 5000"
              value={draft.salary}
              onChange={(e) => update("salary", e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#F3F4F6] px-5 py-5">
        <h3 className="text-[15px] font-semibold text-foreground">Preferences</h3>
        <div className="mt-3 space-y-2.5">
          <label className="flex w-fit cursor-pointer items-center gap-2 text-[13.5px] text-foreground">
            <input
              type="checkbox"
              checked={draft.activelyLooking}
              onChange={(e) => update("activelyLooking", e.target.checked)}
              className="size-4 rounded border-[#D1D5DB] accent-primary"
            />
            I am actively looking for a job
          </label>
          <label className="flex w-fit cursor-pointer items-center gap-2 text-[13.5px] text-foreground">
            <input
              type="checkbox"
              checked={draft.displayProfile}
              onChange={(e) => update("displayProfile", e.target.checked)}
              className="size-4 rounded border-[#D1D5DB] accent-primary"
            />
            Display my profile to potential employers
          </label>
          <label className="flex w-fit cursor-pointer items-center gap-2 text-[13.5px] text-foreground">
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

      {error && <p className="px-5 pb-1.5 text-[13px] text-destructive">{error}</p>}

      <div className="flex justify-end gap-2.5 border-t border-[#F3F4F6] px-5 py-3">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/5"
          onClick={handleCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
