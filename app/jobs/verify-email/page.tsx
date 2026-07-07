"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { applicantAuthService } from "@/services/applicant-auth.service"
import { ApiError } from "@/lib/api-client"
import { AuthShell, jobsBranding } from "@/components/auth/auth-shell"

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
      await applicantAuthService.verifyEmail(email, code)
      router.push("/jobs/login")
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
      await applicantAuthService.resendOtp(email)
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
    <AuthShell branding={jobsBranding}>
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Verify your email</h2>
        <p className="text-xs text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email || "your email"}</span>
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleVerify}>
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-600 dark:text-green-400">
            {success}
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="code" className="text-xs font-medium text-foreground">
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
            className="h-11 rounded-xl border-border bg-card px-3 text-center text-base tracking-[0.5em] placeholder:tracking-normal placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="gradient-primary h-11 w-full rounded-xl border-0 text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Verify email"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
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

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/jobs/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  )
}
