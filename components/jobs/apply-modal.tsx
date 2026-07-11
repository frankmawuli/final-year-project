"use client"

import { useState } from "react"
import Link from "next/link"
import { BadgeCheck, CheckCircle2, ClipboardList, Loader2, Sparkles, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ApiError } from "@/lib/api-client"
import { useApplicantAuth } from "@/context/applicant-auth-context"
import { applicantAuthService } from "@/services/applicant-auth.service"

type ApplyState = "choose" | "success" | "already-applied"

export function ApplyModal({
  jobId,
  jobTitle,
  open,
  onOpenChange,
}: {
  jobId: string
  jobTitle?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { profile, accessToken } = useApplicantAuth()
  const [state, setState] = useState<ApplyState>("choose")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasCv = !!profile?.cvUrl
  const profileIsThin =
    (profile?.skills.length ?? 0) === 0 && (profile?.experience.length ?? 0) === 0 && !hasCv

  async function handleQuickApply() {
    if (!accessToken) return
    setError(null)
    setSubmitting(true)
    try {
      // Salary comes from the profile's Employment & Availability section.
      const expectedSalary = profile?.salaryExpectation ? Number(profile.salaryExpectation) : undefined
      await applicantAuthService.applyToJob(accessToken, jobId, {
        ...(expectedSalary !== undefined && !Number.isNaN(expectedSalary) ? { expectedSalary } : {}),
      })
      setState("success")
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setState("already-applied")
      } else {
        setError(err instanceof Error ? err.message : "Failed to submit application")
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) {
      // Reset for the next open, after the close animation.
      setTimeout(() => {
        setState("choose")
        setError(null)
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {state === "success" ? (
          <div className="flex flex-col items-center py-5 text-center">
            <CheckCircle2 className="size-12 text-emerald-500" />
            <h2 className="mt-3 text-base font-semibold text-foreground">Application submitted</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              You applied{jobTitle ? ` for ${jobTitle}` : ""} using your profile. You can track it
              on your applications page.
            </p>
            <div className="mt-5 flex gap-2.5">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
              <Button asChild>
                <Link href="/jobs/application">View my applications</Link>
              </Button>
            </div>
          </div>
        ) : state === "already-applied" ? (
          <div className="flex flex-col items-center py-5 text-center">
            <BadgeCheck className="size-12 text-primary" />
            <h2 className="mt-3 text-base font-semibold text-foreground">You already applied</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              You have an application on file{jobTitle ? ` for ${jobTitle}` : " for this job"}.
            </p>
            <div className="mt-5 flex gap-2.5">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
              <Button asChild>
                <Link href="/jobs/application">View my applications</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>How do you want to apply?</DialogTitle>
              <DialogDescription>
                {jobTitle ? `Apply for ${jobTitle}` : "Choose how to submit your application"}
              </DialogDescription>
            </DialogHeader>

            {/* Option 1: quick apply with profile */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-primary" />
                <h3 className="text-xs font-semibold text-foreground">Apply with your profile</h3>
              </div>
              <p className="mt-1 text-[13px] text-muted-foreground">
                One click — uses the profile saved on your account
                {hasCv ? ", including your saved CV." : "."}
              </p>

              {profileIsThin && (
                <div className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[12.5px] text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400">
                  <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    Your profile is nearly empty, which hurts how you&apos;re screened.{" "}
                    <Link href="/jobs/profile" className="font-semibold underline">
                      Complete it first
                    </Link>{" "}
                    or use the full application form to attach a CV.
                  </span>
                </div>
              )}

              {error && <p className="mt-1.5 text-[13px] text-destructive">{error}</p>}

              <Button className="mt-2.5 w-full" onClick={handleQuickApply} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  "Submit application"
                )}
              </Button>
            </div>

            {/* Option 2: full form */}
            <Link
              href={`/apply/apply?jobId=${jobId}`}
              className="flex items-start gap-2.5 rounded-xl border border-border p-3 transition-colors hover:bg-muted"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <ClipboardList className="size-4 text-foreground" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-foreground">Fill out an application</h3>
                <p className="mt-0.5 text-[13px] text-muted-foreground">
                  Upload a CV tailored to this job and complete the standard form.
                </p>
              </div>
            </Link>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
