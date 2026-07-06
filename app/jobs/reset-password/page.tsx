"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApplicantAuth } from "@/context/applicant-auth-context"
import { ApiError } from "@/lib/api-client"
import { AuthShell, jobsBranding } from "@/components/auth/auth-shell"

type Step = "request" | "reset" | "done"

export default function ResetPasswordPage() {
  const { requestResetPassword, resetPassword } = useApplicantAuth()
  const [step, setStep] = useState<Step>("request")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
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
      await resetPassword(email, otp, newPassword)
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
    <AuthShell branding={jobsBranding}>
      {/* Step: request OTP */}
      {step === "request" && (
        <>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset password</h2>
            <p className="text-sm text-muted-foreground">
              Enter your registered email and we&apos;ll send a verification code.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleRequest}>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-xl border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
              />
            </div>

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
            href="/jobs/login"
            className="gradient-primary inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
          >
            Back to sign in
          </Link>
        </div>
      )}

      {step !== "done" && (
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/jobs/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      )}
    </AuthShell>
  )
}
