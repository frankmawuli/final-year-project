import { GraduationCap } from "lucide-react"
import { FieldLabel, TextInput, SelectInput } from "./form-controls"
import { DEGREE_OPTIONS, GRAD_YEARS, type Step3Data } from "./constants"

export function Step3({
  data,
  errors,
  onChange,
}: {
  data: Step3Data
  errors: Partial<Record<keyof Step3Data, string>>
  onChange: (f: keyof Step3Data, v: string) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel required>Highest Degree / Certification</FieldLabel>
        <SelectInput
          value={data.degree}
          onChange={(v) => onChange("degree", v)}
          placeholder="Select your highest qualification"
          options={DEGREE_OPTIONS}
          error={errors.degree}
        />
      </div>

      <div>
        <FieldLabel required>School / Institution</FieldLabel>
        <TextInput
          value={data.school}
          onChange={(v) => onChange("school", v)}
          placeholder="e.g. Massachusetts Institute of Technology"
          prefix={<GraduationCap className="size-4" />}
          error={errors.school}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel required>Year of Graduation</FieldLabel>
          <SelectInput
            value={data.gradYear}
            onChange={(v) => onChange("gradYear", v)}
            placeholder="Select year"
            options={GRAD_YEARS}
            error={errors.gradYear}
          />
        </div>
        <div>
          <FieldLabel optional>GPA / CGPA</FieldLabel>
          <TextInput
            value={data.gpa}
            onChange={(v) => onChange("gpa", v)}
            placeholder="e.g. 3.8 / 4.0"
          />
        </div>
      </div>
    </div>
  )
}
