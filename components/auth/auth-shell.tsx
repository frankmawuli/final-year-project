import type { ReactNode } from "react"
import { Logo } from "@/components/logo"

export interface AuthBranding {
  brandName: string
  headline: ReactNode
  subcopy: string
  features?: string[]
}

export const hrBranding: AuthBranding = {
  brandName: "CoreRecruiter",
  headline: (
    <>
      Streamline your
      <br />
      hiring process
    </>
  ),
  subcopy:
    "Manage candidates, schedule interviews, and collaborate with your team — all in one place.",
  features: ["AI Screening", "Smart Pipelines", "Team Collaboration"],
}

export const jobsBranding: AuthBranding = {
  brandName: "CoreRecruiter Jobs",
  headline: "Get hired faster",
  subcopy: "Apply and track your job applications with ease",
}

export function AuthShell({
  branding,
  children,
}: {
  branding: AuthBranding
  children: ReactNode
}) {
  const { brandName, headline, subcopy, features } = branding

  return (
    <div className="auth-layout">
      {/* ── Left: Branding panel ── */}
      <div className="gradient-primary relative hidden flex-col items-start justify-between overflow-hidden p-12 text-white lg:flex">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-32 h-112 w-md rounded-full bg-white/10" />

        <div className="relative flex items-center gap-2">
          <Logo width={52} height={52} />
          <span className="text-lg font-semibold tracking-tight">{brandName}</span>
        </div>

        <div className="relative space-y-4">
          <h1 className="text-4xl leading-tight font-bold tracking-tight">{headline}</h1>
          <p className="max-w-xs text-base text-white/75">{subcopy}</p>
          {features && features.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {features.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="relative text-sm text-white/50">Trusted by 500+ companies worldwide</p>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <Logo width={52} height={52} />
            <span className="text-lg font-semibold">{brandName}</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
