"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

const TOTAL_STEPS = 7

const heroImage = "http://localhost:3845/assets/b576687fbeec177fd13f21dd8dbc7c15d0e204cb.png"
const rocketIcon = "http://localhost:3845/assets/8f6f543c46450ef718dbf42187ca471c92a99cbf.svg"
const clockIcon = "http://localhost:3845/assets/ead6b51bacf1ba5639ebedd3818eabae4109fb3d.svg"

export default function OnboardingPage() {
  const currentStep = 1

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-[1152px] px-6 py-12">
        {/* ── Step indicator ── */}
        <div className="mb-16 flex items-center justify-center">
          <div className="flex items-center">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => {
              const step = i + 1
              const isActive = step === currentStep
              const isLast = step === TOTAL_STEPS

              return (
                <div key={step} className="flex items-center">
                  {/* Circle */}
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold tracking-tight ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-[#d1d5db] text-[#4b5563]"
                    }`}
                  >
                    {step}
                  </div>
                  {/* Connector line */}
                  {!isLast && (
                    <div className="mx-1 h-0.5 w-[87px] bg-[#d1d5db]" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left: illustration */}
          <div className="flex items-center justify-center rounded-2xl bg-[#dbeafe]/40 p-8">
            <img
              src={heroImage}
              alt="Team collaborating at a workspace"
              className="h-full w-full rounded-xl object-cover"
            />
          </div>

          {/* Right: info card */}
          <div className="flex items-center">
            <div className="w-full rounded-2xl bg-card p-12 shadow-lg">
              {/* Rocket icon */}
              <div className="mb-8 flex size-16 items-center justify-center rounded-xl bg-primary/10">
                <img src={rocketIcon} alt="" className="size-6" />
              </div>

              {/* Heading */}
              <h1 className="mb-4 text-[2.25rem] font-bold leading-tight tracking-tight text-foreground">
                Set up your company
                <br />
                workspace
              </h1>

              {/* Description */}
              <p className="mb-5 text-lg leading-relaxed text-muted-foreground">
                Let&apos;s configure your organization so you can start managing employees, payroll,
                and HR operations.
              </p>

              {/* Estimated time */}
              <div className="mb-10 flex items-center gap-2 text-sm text-muted-foreground">
                <img src={clockIcon} alt="" className="size-3.5" />
                <span>Estimated time: 2 minutes</span>
              </div>

              {/* CTA */}
              <Button
                asChild
                className="h-14 w-full rounded-xl border-0 bg-primary text-base font-semibold text-white shadow-[0px_4px_6px_0px_rgba(37,99,235,0.3),0px_10px_15px_0px_rgba(37,99,235,0.3)] hover:bg-primary/90"
              >
                <Link href="/onboarding/company-info">Start Setup</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
