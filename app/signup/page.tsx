"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  return (
    <div className="auth-layout">
      {/* ── Left: Branding panel ── */}
      <div className="gradient-primary relative hidden flex-col items-start justify-between overflow-hidden p-12 text-white lg:flex">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="absolute -right-16 bottom-32 h-56 w-56 rounded-full bg-white/10" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
            <span className="text-xl font-bold text-primary">C</span>
          </div>
          <span className="text-base font-semibold tracking-tight">Corecruiter</span>
        </div>

        {/* Headline */}
        <div className="relative space-y-4">
          <h1 className="text-[2.375rem] font-bold leading-tight tracking-tight">
            Streamline
            <br />
            your hiring
            <br />
            process
          </h1>
          <p className="max-w-xs text-sm text-white/75">
            Manage candidates, track applications,
            <br />
            and hire the best talent — all in one place.
          </p>
        </div>

        {/* Spacer */}
        <div />
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-[477px] rounded-2xl bg-card px-8 py-8 shadow-xl">
          {/* Header */}
          <div className="mb-6 space-y-1 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Create an Account
            </h2>
            <p className="text-base text-muted-foreground">Fill in details to get started</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); router.push("/onboarding") }}>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="h-[50px] rounded-xl border-border bg-card px-4 text-base placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="jane.doe@corecruiter.com"
                className="h-[50px] rounded-xl border-border bg-card px-4 text-base placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="h-[50px] rounded-xl border-border bg-card px-4 pr-12 text-base placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  className="h-[50px] rounded-xl border-border bg-card px-4 pr-12 text-base placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="gradient-primary mt-2 h-12 w-full rounded-xl border-0 text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-1 text-center">
            <p className="text-base text-muted-foreground">Have an account?</p>
            <Link href="/login" className="text-base font-medium text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
