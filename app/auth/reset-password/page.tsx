"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { ApiError } from "@/lib/api-client"

type Step = "request" | "reset" | "done"

export default function ResetPasswordPage() {
  const { user, requestResetPassword, resetPassword } = useAuth()
  const [step, setStep] = useState<Step>("request")
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
      await requestResetPassword()
      setStep("reset")
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof Error && err.message === "Not authenticated") {
        setError("You must be signed in to reset your password.")
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
    if (!user?.email) {
      setError("Session expired. Please sign in again.")
      return
    }
    setLoading(true)
    try {
      await resetPassword(user.email, otp, oldPassword, newPassword)
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
      <div className="gradient-primary relative hidden flex-col items-start justify-between overflow-hidden p-12 text-white lg:flex">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-32 h-112 w-md rounded-full bg-white/10" />

        <div className="relative flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">CoreRecruiter</span>
        </div>

        <div className="relative space-y-4">
          <h1 className="text-4xl leading-tight font-bold tracking-tight">
            Streamline your<br />hiring process
          </h1>
          <p className="max-w-xs text-base text-white/75">
            Manage candidates, schedule interviews, and collaborate with your team — all in one place.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["AI Screening", "Smart Pipelines", "Team Collaboration"].map((f) => (
              <span key={f} className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-white/50">Trusted by 500+ companies worldwide</p>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-lg font-semibold">CoreRecruiter</span>
          </div>

          {/* Step: request OTP */}
          {step === "request" && (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Change password</h2>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll send a verification code to{" "}
                  <span className="font-medium text-foreground">{user?.email ?? "your email"}</span>
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleRequest}>
                {error && (
                  <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="gradient-primary h-11 w-full rounded-xl border-0 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60"
                >
                  {loading ? "Sending code…" : "Send verification code"}
                </Button>
              </form>
            </>
          )}

          {/* Step: enter OTP + new password */}
          {step === "reset" && (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Set new password</h2>
                <p className="text-sm text-muted-foreground">
                  Enter the code sent to your email and choose a new password.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleReset}>
                {error && (
                  <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="otp" className="text-sm font-medium text-foreground">
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
                    className="h-11 rounded-xl border-border bg-card px-4 text-center text-lg tracking-[0.5em] placeholder:tracking-normal placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="oldPassword" className="text-sm font-medium text-foreground">
                    Current password
                  </label>
                  <Input
                    id="oldPassword"
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                    New password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm new password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="gradient-primary h-11 w-full rounded-xl border-0 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60"
                >
                  {loading ? "Updating…" : "Update password"}
                </Button>
              </form>
            </>
          )}

          {/* Step: success */}
          {step === "done" && (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Password updated</h2>
                <p className="text-sm text-muted-foreground">Your password has been changed successfully.</p>
              </div>
              <Link
                href="/auth/login"
                className="gradient-primary inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
              >
                Back to sign in
              </Link>
            </div>
          )}

          {step !== "done" && (
            <p className="text-center text-sm text-muted-foreground">
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
