"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { ApiError } from "@/lib/api-client"
import { Logo } from "@/components/logo"

type Step = "request" | "reset" | "done"

export default function ResetPasswordPage() {
  const { requestResetPassword, resetPassword } = useAuth()
  const [step, setStep] = useState<Step>("request")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await requestResetPassword(email)
      setStep("reset")
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    try {
      await resetPassword(email, otp, oldPassword, newPassword)
      setStep("done")
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      {/* ── Left: Branding panel ── */}
      <div className="gradient-primary relative hidden flex-col items-start justify-between overflow-hidden p-10 text-white lg:flex">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-32 h-112 w-md rounded-full bg-white/10" />

        <div className="relative flex items-center gap-1.5">
          <Logo width={52} height={52} />
          <span className="text-base font-semibold tracking-tight">CoreRecruiter</span>
        </div>

        <div className="relative space-y-3">
          <h1 className="text-3xl leading-tight font-bold tracking-tight">
            Streamline your<br />hiring process
          </h1>
          <p className="max-w-xs text-sm text-white/75">
            Manage candidates, schedule interviews, and collaborate with your team — all in one place.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {["AI Screening", "Smart Pipelines", "Team Collaboration"].map((f) => (
              <span key={f} className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/50">Trusted by 500+ companies worldwide</p>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex items-center justify-center bg-background px-5 py-10">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <Logo width={52} height={52} />
            <span className="text-base font-semibold">CoreRecruiter</span>
          </div>

          {/* Step: request OTP */}
          {step === "request" && (
            <>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Reset password</h2>
                <p className="text-xs text-muted-foreground">
                  Enter your registered email and we&apos;ll send a verification code.
                </p>
              </div>

              <form className="space-y-3" onSubmit={handleRequest}>
                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {error}
                  </p>
                )}

                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-medium text-foreground">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 rounded-xl border-border bg-card px-3 text-xs placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="gradient-primary h-11 w-full rounded-xl border-0 text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60"
                >
                  {loading ? "Sending code…" : "Send verification code"}
                </Button>
              </form>
            </>
          )}

          {/* Step: enter OTP + new password */}
          {step === "reset" && (
            <>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Set new password</h2>
                <p className="text-xs text-muted-foreground">
                  Enter the code sent to your email and choose a new password.
                </p>
              </div>

              <form className="space-y-3" onSubmit={handleReset}>
                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {error}
                  </p>
                )}

                <div className="space-y-1">
                  <label htmlFor="otp" className="text-xs font-medium text-foreground">
                    Verification code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="h-11 rounded-xl border-border bg-card px-3 text-center text-base tracking-[0.5em] placeholder:tracking-normal placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="oldPassword" className="text-xs font-medium text-foreground">
                    Current password
                  </label>
                  <Input
                    id="oldPassword"
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-border bg-card px-3 text-xs placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="newPassword" className="text-xs font-medium text-foreground">
                    New password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-border bg-card px-3 text-xs placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                    Confirm new password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-border bg-card px-3 text-xs placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="gradient-primary h-11 w-full rounded-xl border-0 text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60"
                >
                  {loading ? "Updating…" : "Update password"}
                </Button>
              </form>
            </>
          )}

          {/* Step: success */}
          {step === "done" && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Password updated</h2>
                <p className="text-xs text-muted-foreground">Your password has been changed successfully.</p>
              </div>
              <Link
                href="/auth/login"
                className="gradient-primary inline-flex h-11 w-full items-center justify-center rounded-xl text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90"
              >
                Back to sign in
              </Link>
            </div>
          )}

          {step !== "done" && (
            <p className="text-center text-xs text-muted-foreground">
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Back to sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
