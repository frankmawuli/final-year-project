import { Briefcase } from "lucide-react"
import { FieldLabel, TextInput, SelectInput, TagInput } from "./form-controls"
import { ResumeUpload } from "./resume-upload"
import { EXPERIENCE_OPTIONS, type Step2Data } from "./constants"

export function Step2({
  data,
  errors,
  onChange,
}: {
  data: Step2Data
  errors: Partial<Record<keyof Step2Data, string>>
  onChange: (next: Partial<Step2Data>) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel required>Current Job Title / Role</FieldLabel>
        <TextInput
          value={data.jobTitle}
          onChange={(v) => onChange({ jobTitle: v })}
          placeholder="e.g. Senior Product Designer"
          prefix={<Briefcase className="size-4" />}
          error={errors.jobTitle}
        />
      </div>

      <div>
        <FieldLabel required>Skills & Expertise</FieldLabel>
        <p className="mb-1.5 text-[12px] text-muted-foreground">
          Type a skill and press Enter or click +
        </p>
        <TagInput
          items={data.skills}
          onRemove={(i) =>
            onChange({ skills: data.skills.filter((_, idx) => idx !== i) })
          }
          onAdd={(v) => onChange({ skills: [...data.skills, v] })}
          placeholder="e.g. Figma, React, Python…"
        />
        {errors.skills && (
          <p className="mt-1 text-[11px] text-rose-500">{errors.skills}</p>
        )}
      </div>

      <div>
        <FieldLabel required>Years of Experience</FieldLabel>
        <SelectInput
          value={data.experience}
          onChange={(v) => onChange({ experience: v })}
          placeholder="Select experience range"
          options={EXPERIENCE_OPTIONS}
          error={errors.experience}
        />
      </div>

      <div>
        <FieldLabel required>Resume / CV</FieldLabel>
        <ResumeUpload
          fileName={data.resumeFileName}
          onChange={(name, url) => onChange({ resumeFileName: name, resumeUrl: url })}
          error={errors.resumeFileName}
        />
      </div>
    </div>
  )
}
