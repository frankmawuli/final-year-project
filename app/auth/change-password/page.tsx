"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { ApiError } from "@/lib/api-client"
import { Logo } from "@/components/logo"

export default function ChangePasswordPage() {
  const { user, isAuthenticated, loading: authLoading, changePassword } = useAuth()
  const router = useRouter()

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth/login")
    }
  }, [authLoading, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirm) {
      setError("New passwords do not match.")
      return
    }
    if (newPassword === oldPassword) {
      setError("New password must be different from your current password.")
      return
    }

    setLoading(true)
    try {
      await changePassword(oldPassword, newPassword)
      router.replace(user?.role === "HR_ADMIN" ? "/dashboard/hr" : "/dashboard/ess")
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

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex items-center gap-2">
          <Logo width={52} height={52} />
          <span className="text-lg font-semibold">CoreRecruiter</span>
        </div>

        <div className="space-y-2">
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10">
            <LockKeyhole className="size-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Set a new password</h2>
          <p className="text-sm text-muted-foreground">
            {user?.mustChangePassword
              ? "You're using a temporary password. Choose a new one to continue."
              : "Enter your current password, then choose a new one."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <label htmlFor="old-password" className="text-sm font-medium text-foreground">
              Current password
            </label>
            <div className="relative">
              <Input
                id="old-password"
                type={showOld ? "text" : "password"}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Temporary password from your email"
                className="h-11 rounded-xl border-border bg-card px-4 pr-10 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showOld ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="new-password" className="text-sm font-medium text-foreground">
              New password
            </label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-xl border-border bg-card px-4 pr-10 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              At least 6 characters with an uppercase letter, lowercase letter, number, and special character.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
              Confirm new password
            </label>
            <Input
              id="confirm-password"
              type={showNew ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Saving…" : "Change password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
