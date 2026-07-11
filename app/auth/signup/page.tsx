"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { ApiError } from "@/lib/api-client"
import { Logo } from "@/components/logo"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"

export default function SignUpPage() {
  const { register, loginWithGoogle } = useAuth()
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
                placeholder="you@company.com"
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
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
