"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authService } from "@/services/auth.service"
import { ApiError } from "@/lib/api-client"

function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") ?? ""

  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.")
      return
    }
    setLoading(true)
    try {
      await authService.verifyOtp(email, code, "EMAIL_VERIFICATION")
      router.push("/auth/login")
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Verification failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setSuccess(null)
    setResendLoading(true)
    try {
      await authService.resendOtp(email)
      setSuccess("A new code has been sent to your email.")
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Too many attempts. Please wait 1 minute before resending.")
      } else if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to resend. Please try again.")
      }
    } finally {
      setResendLoading(false)
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

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Verify your email</h2>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">{email || "your email"}</span>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleVerify}>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg bg-green-500/10 px-4 py-2.5 text-sm text-green-600 dark:text-green-400">
                {success}
              </p>
            )}

            <div className="space-y-1.5">
              <label htmlFor="code" className="text-sm font-medium text-foreground">
                Verification code
              </label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="h-11 rounded-xl border-border bg-card px-4 text-center text-lg tracking-[0.5em] placeholder:tracking-normal placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="gradient-primary h-11 w-full rounded-xl border-0 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify email"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="font-medium text-primary hover:underline disabled:opacity-60"
            >
              {resendLoading ? "Sending…" : "Resend code"}
            </button>
          </p>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  )
}
