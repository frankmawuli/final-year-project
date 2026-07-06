"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      router.replace("/auth/login")
    } else if (user?.mustChangePassword) {
      // Temporary (invite) password — force a change before any dashboard
      router.replace("/auth/change-password")
    }
  }, [loading, isAuthenticated, user?.mustChangePassword, router])

  if (loading || !isAuthenticated || user?.mustChangePassword) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    )
  }

  return <>{children}</>
}
