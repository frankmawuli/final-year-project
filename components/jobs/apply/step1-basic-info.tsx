import { User, Mail, Phone } from "lucide-react"
import { FieldLabel, TextInput } from "./form-controls"
import { AvatarUpload } from "./avatar-upload"
import type { Step1Data } from "./constants"

export function Step1({
  data,
  errors,
  onChange,
  avatarPreview,
  onAvatarChange,
}: {
  data: Step1Data
  errors: Partial<Record<keyof Step1Data, string>>
  onChange: (f: keyof Step1Data, v: string) => void
  avatarPreview: string | null
  onAvatarChange: (url: string | null) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Profile Photo</FieldLabel>
        <AvatarUpload preview={avatarPreview} onChange={onAvatarChange} />
      </div>

      <div>
        <FieldLabel required>Full Name</FieldLabel>
        <TextInput
          value={data.fullName}
          onChange={(v) => onChange("fullName", v)}
          placeholder="e.g. Jane Smith"
          prefix={<User className="size-4" />}
          error={errors.fullName}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel required>Email Address</FieldLabel>
          <TextInput
            value={data.email}
            onChange={(v) => onChange("email", v)}
            placeholder="jane@example.com"
            type="email"
            prefix={<Mail className="size-4" />}
            error={errors.email}
          />
        </div>
        <div>
          <FieldLabel required>Phone Number</FieldLabel>
          <TextInput
            value={data.phone}
            onChange={(v) => onChange("phone", v)}
            placeholder="+1 (555) 000-0000"
            type="tel"
            prefix={<Phone className="size-4" />}
            error={errors.phone}
          />
        </div>
      </div>
    </div>
  )
}
