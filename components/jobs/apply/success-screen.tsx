import { Check } from "lucide-react"

export function SuccessScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 text-center">
      <div
        className="mb-4 flex size-16 items-center justify-center rounded-full"
        style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
      >
        <Check className="size-8 text-white" strokeWidth={2.5} />
      </div>
      <h2 className="mb-1.5 text-[22px] font-bold text-foreground">Application Submitted!</h2>
      <p className="mb-1 text-[14px] text-muted-foreground">
        Thank you for applying. We've received your application.
      </p>
      <p className="mb-6 text-[13px] text-muted-foreground">
        Our team will review your profile and reach out within 5–7 business days.
      </p>
      <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-border px-5 py-2 text-[13px] font-medium text-foreground hover:bg-muted"
        >
          ← Back to Jobs
        </button>
        <button
          type="button"
          className="rounded-xl px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
        >
          Check Application Status
        </button>
      </div>
    </div>
  )
}
