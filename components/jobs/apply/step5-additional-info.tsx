import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { FieldLabel } from "./form-controls"
import type { Step5Data } from "./constants"

export function Step5({
  data,
  errors,
  onChange,
}: {
  data: Step5Data
  errors: Partial<Record<keyof Step5Data, string>>
  onChange: (next: Partial<Step5Data>) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel required>Cover Letter / Bio</FieldLabel>
        <p className="mb-1.5 text-[12px] text-muted-foreground">
          Tell us why you're a great fit for this role.
        </p>
        <div
          className={cn(
            "rounded-lg border bg-muted p-3",
            errors.coverLetter ? "border-rose-400" : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          )}
        >
          <textarea
            value={data.coverLetter}
            onChange={(e) => onChange({ coverLetter: e.target.value })}
            placeholder="I'm excited to apply for this position because…"
            rows={6}
            className="w-full resize-none bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <p className="mt-1 text-right text-[11px] text-muted-foreground">
            {data.coverLetter.length} / 2000
          </p>
        </div>
        {errors.coverLetter && (
          <p className="mt-1 text-[11px] text-rose-500">{errors.coverLetter}</p>
        )}
      </div>

      <div>
        <FieldLabel optional>References</FieldLabel>
        <p className="mb-1.5 text-[12px] text-muted-foreground">
          Name, title, and contact info for any professional references.
        </p>
        <div className="rounded-lg border border-border bg-muted p-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <textarea
            value={data.references}
            onChange={(e) => onChange({ references: e.target.value })}
            placeholder="e.g. John Doe, Engineering Manager at Acme Corp — john@acme.com"
            rows={3}
            className="w-full resize-none bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Privacy notice */}
      <div className="rounded-xl border border-border bg-primary/5 p-3">
        <p className="mb-1 text-[13px] font-semibold text-foreground">Data & Privacy</p>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Your application data will be stored securely and used solely for recruitment purposes.
          We will not share your information with third parties without your consent.
        </p>
      </div>

      {/* Consent checkbox */}
      <label
        className={cn(
          "flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition-colors",
          data.consent ? "border-primary bg-primary/5" : "border-border bg-muted hover:border-primary/50",
          errors.consent && "border-rose-400"
        )}
      >
        <div
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
            data.consent ? "border-primary bg-primary" : "border-border bg-card"
          )}
        >
          {data.consent && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
        </div>
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => onChange({ consent: e.target.checked })}
          className="sr-only"
        />
        <div>
          <p className="text-[13px] font-medium text-foreground">
            I agree to the Privacy Policy and Terms of Use
          </p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            By submitting, you consent to the processing of your personal data for recruitment.
          </p>
        </div>
      </label>
      {errors.consent && (
        <p className="text-[11px] text-rose-500">{errors.consent}</p>
      )}
    </div>
  )
}
