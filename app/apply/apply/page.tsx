"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { jobsService } from "@/services/jobs.service"
import {
  STEPS,
  type Step1Data,
  type Step2Data,
  type Step3Data,
  type Step4Data,
  type Step5Data,
} from "@/components/jobs/apply/constants"
import { Step1 } from "@/components/jobs/apply/step1-basic-info"
import { Step2 } from "@/components/jobs/apply/step2-professional-details"
import { Step3 } from "@/components/jobs/apply/step3-education"
import { Step4 } from "@/components/jobs/apply/step4-social-links"
import { Step5 } from "@/components/jobs/apply/step5-additional-info"
import { SidebarStepList } from "@/components/jobs/apply/sidebar-step-list"
import { SuccessScreen } from "@/components/jobs/apply/success-screen"

// ── Main page ───────────────────────────────────────────────────
export default function JobApplicationPage() {
  return (
    <Suspense fallback={null}>
      <JobApplicationForm />
    </Suspense>
  )
}

function JobApplicationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get("jobId") ?? ""
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [step1, setStep1] = useState<Step1Data>({
    fullName: "",
    email: "",
    phone: "",
  })
  const [step2, setStep2] = useState<Step2Data>({
    jobTitle: "",
    skills: [],
    experience: "",
    resumeFileName: null,
    resumeUrl: null,
  })
  const [step3, setStep3] = useState<Step3Data>({
    degree: "",
    school: "",
    gradYear: "",
    gpa: "",
  })
  const [step4, setStep4] = useState<Step4Data>({
    linkedin: "",
    github: "",
    website: "",
    twitter: "",
    extraLinks: [],
  })
  const [step5, setStep5] = useState<Step5Data>({
    coverLetter: "",
    references: "",
    consent: false,
  })

  function setS1(field: keyof Step1Data, val: string) {
    setStep1((f) => ({ ...f, [field]: val }))
    setErrors((e) => {
      const n = { ...e }
      delete n[field]
      return n
    })
  }
  function setS3(field: keyof Step3Data, val: string) {
    setStep3((f) => ({ ...f, [field]: val }))
    setErrors((e) => {
      const n = { ...e }
      delete n[field]
      return n
    })
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}

    if (step === 1) {
      if (!step1.fullName.trim()) errs.fullName = "Full name is required."
      if (!step1.email.trim()) errs.email = "Email address is required."
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email))
        errs.email = "Enter a valid email address."
      if (!step1.phone.trim()) errs.phone = "Phone number is required."
    }

    if (step === 2) {
      if (!step2.jobTitle.trim()) errs.jobTitle = "Current role is required."
      if (step2.skills.length === 0) errs.skills = "Add at least one skill."
      if (!step2.experience) errs.experience = "Please select your experience."
      if (!step2.resumeFileName)
        errs.resumeFileName = "Please upload your resume."
    }

    if (step === 3) {
      if (!step3.degree) errs.degree = "Please select your highest degree."
      if (!step3.school.trim())
        errs.school = "School / institution is required."
      if (!step3.gradYear) errs.gradYear = "Please select graduation year."
    }

    if (step === 5) {
      if (!step5.coverLetter.trim())
        errs.coverLetter = "Cover letter is required."
      if (!step5.consent)
        errs.consent = "You must agree to the privacy policy to proceed."
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleNext() {
    if (!validate()) return
    if (step < STEPS.length) {
      setStep((s) => s + 1)
      return
    }

    // Final step — submit to backend
    if (!jobId) {
      setSubmitError(
        "No job selected. Please return to the job listing and click Apply Now."
      )
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const documents: { name: string; type: "Resume"; url: string }[] = []
      if (step2.resumeUrl) {
        documents.push({
          name: step2.resumeFileName ?? "Resume",
          type: "Resume",
          url: step2.resumeUrl,
        })
      }

      await jobsService.apply(jobId, {
        name: step1.fullName,
        email: step1.email,
        phone: step1.phone || undefined,
        about: step5.coverLetter || undefined,
        linkedin: step4.linkedin || undefined,
        twitter: step4.twitter || undefined,
        skills: step2.skills.map((s) => ({ name: s })),
        education: step3.degree
          ? [
              {
                position: 1,
                school: step3.school,
                degree: step3.degree,
                year: step3.gradYear || undefined,
              },
            ]
          : undefined,
        documents,
      })

      setSubmitted(true)
    } catch {
      setSubmitError(
        "Submission failed. Please check your details and try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  const stepLabels: Record<number, string> = {
    1: "Basic Information",
    2: "Professional Details",
    3: "Education",
    4: "Social & Portfolio Links",
    5: "Additional Info & Submission",
  }
  const stepSubtitles: Record<number, string> = {
    1: "Let's start with your personal details.",
    2: "Tell us about your professional background.",
    3: "Share your educational qualifications.",
    4: "Add your online profiles and portfolio — all optional.",
    5: "Final step: cover letter and consent.",
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-2.5 sm:p-5">
      <div className="flex w-full max-w-[940px] overflow-hidden rounded-2xl bg-card shadow-xl">
        {/* Sidebar – hidden on mobile */}
        <SidebarStepList current={step} />

        {/* Form area */}
        {submitted ? (
          <SuccessScreen onBack={() => router.push("/apply")} />
        ) : (
          <div className="flex flex-1 flex-col p-4 sm:p-6">
            {/* Mobile-only progress indicator */}
            <div className="mb-4 sm:hidden">
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="font-semibold tracking-wider text-primary uppercase">
                  Step {step} of {STEPS.length}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(((step - 1) / STEPS.length) * 100)}% complete
                </span>
              </div>
              <div className="flex gap-1">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className={
                      "h-1.5 flex-1 rounded-full transition-colors duration-300 " +
                      (s.id < step
                        ? "bg-primary"
                        : s.id === step
                          ? "bg-primary/40"
                          : "bg-muted")
                    }
                  />
                ))}
              </div>
            </div>

            {/* Header */}
            <p className="mb-1 text-[12px] font-semibold tracking-widest text-primary uppercase">
              STEP {step} OF {STEPS.length}
            </p>
            <h1 className="mb-1 text-[20px] leading-tight font-bold tracking-tight text-foreground sm:text-[24px]">
              {stepLabels[step]}
            </h1>
            <p className="mb-5 text-[13px] text-muted-foreground">
              {stepSubtitles[step]}
            </p>

            {/* Step content */}
            <div className="flex-1 overflow-y-auto pr-1">
              {step === 1 && (
                <Step1
                  data={step1}
                  errors={errors as Partial<Record<keyof Step1Data, string>>}
                  onChange={setS1}
                  avatarPreview={avatarPreview}
                  onAvatarChange={setAvatarPreview}
                />
              )}
              {step === 2 && (
                <Step2
                  data={step2}
                  errors={errors as Partial<Record<keyof Step2Data, string>>}
                  onChange={(next) => {
                    setStep2((f) => ({ ...f, ...next }))
                    const cleared = Object.keys(next).reduce((acc, k) => {
                      const n = { ...acc }
                      delete n[k]
                      return n
                    }, errors)
                    setErrors(cleared)
                  }}
                />
              )}
              {step === 3 && (
                <Step3
                  data={step3}
                  errors={errors as Partial<Record<keyof Step3Data, string>>}
                  onChange={setS3}
                />
              )}
              {step === 4 && (
                <Step4
                  data={step4}
                  onChange={(next) => setStep4((f) => ({ ...f, ...next }))}
                />
              )}
              {step === 5 && (
                <Step5
                  data={step5}
                  errors={errors as Partial<Record<keyof Step5Data, string>>}
                  onChange={(next) => {
                    setStep5((f) => ({ ...f, ...next }))
                    const cleared = Object.keys(next).reduce((acc, k) => {
                      const n = { ...acc }
                      delete n[k]
                      return n
                    }, errors)
                    setErrors(cleared)
                  }}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="mt-5 border-t border-border pt-4">
              {submitError && (
                <p className="mb-2.5 rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1.5 text-[12px] text-rose-600">
                  {submitError}
                </p>
              )}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    step > 1 ? setStep((s) => s - 1) : router.back()
                  }
                  disabled={submitting}
                  className="flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  ← Back
                </button>

                <div className="flex items-center gap-2.5">
                  {step === 4 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s + 1)}
                      className="text-[12px] font-medium text-muted-foreground underline hover:text-foreground"
                    >
                      Skip for now
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={submitting}
                    className="flex items-center gap-1.5 rounded-xl px-6 py-2 text-[13px] font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 disabled:opacity-70"
                    style={{
                      background:
                        "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)",
                    }}
                  >
                    {submitting && (
                      <Loader2 className="size-3.5 animate-spin" />
                    )}
                    {step === STEPS.length
                      ? submitting
                        ? "Submitting…"
                        : "Submit Application →"
                      : "Save and continue →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
