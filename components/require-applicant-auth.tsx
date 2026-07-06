"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApplicantAuth } from "@/context/applicant-auth-context"

export default function RequireApplicantAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useApplicantAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/jobs/login")
    }
  }, [loading, isAuthenticated, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    )
  }

  return <>{children}</>
}
