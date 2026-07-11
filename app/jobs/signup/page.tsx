"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApplicantAuth } from "@/context/applicant-auth-context"
import { ApiError } from "@/lib/api-client"
import { AuthShell, jobsBranding } from "@/components/auth/auth-shell"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"

export default function SignUpPage() {
  const { register, loginWithGoogle } = useApplicantAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      await register(fullName, email, password)
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

  const handleGoogleCredential = async (idToken: string) => {
    setError(null)
    setLoading(true)
    try {
      await loginWithGoogle(idToken)
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
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Create an account</h2>
        <p className="text-xs text-muted-foreground">Fill in details to get started</p>
      </div>

      {/* Form */}
      <form className="space-y-3" onSubmit={handleSubmit}>
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="fullName" className="text-xs font-medium text-foreground">
            Full Name
          </label>
          <Input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="h-11 rounded-xl border-border bg-card px-3 text-xs placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
          />
        </div>

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
            placeholder="you@email.com"
            className="h-11 rounded-xl border-border bg-card px-3 text-xs placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-xl border-border bg-card px-3 pr-8 text-xs placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-xl border-border bg-card px-3 pr-8 text-xs placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="gradient-primary h-11 w-full rounded-xl border-0 text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Sign up"}
        </Button>
      </form>

      <div className="relative flex items-center gap-2.5">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <GoogleAuthButton onCredential={handleGoogleCredential} disabled={loading} />

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/jobs/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
