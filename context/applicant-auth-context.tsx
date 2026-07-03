"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"

import { applicantAuthService, type Applicant } from "@/services/applicant-auth.service"

const ACCESS_TOKEN_KEY = "applicant_access_token"
const REFRESH_TOKEN_KEY = "applicant_refresh_token"
const APPLICANT_KEY = "applicant_user"

interface ApplicantAuthContextValue {
  applicant: Applicant | null
  accessToken: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  requestResetPassword: (email: string) => Promise<void>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>
}

const ApplicantAuthContext = createContext<ApplicantAuthContextValue | null>(null)

export function ApplicantAuthProvider({ children }: { children: ReactNode }) {
  const [applicant, setApplicant] = useState<Applicant | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const storedApplicant = localStorage.getItem(APPLICANT_KEY)
    if (storedToken && storedApplicant) {
      try {
        setAccessToken(storedToken)
        setApplicant(JSON.parse(storedApplicant))
      } catch {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(APPLICANT_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await applicantAuthService.login(email, password)
      const { id, name, email: applicantEmail, accessToken: at, refreshToken: rt } = res.data
      const a: Applicant = { id, name, email: applicantEmail }
      localStorage.setItem(ACCESS_TOKEN_KEY, at)
      localStorage.setItem(REFRESH_TOKEN_KEY, rt)
      localStorage.setItem(APPLICANT_KEY, JSON.stringify(a))
      setAccessToken(at)
      setApplicant(a)
      router.push("/jobs/job-listing")
    },
    [router],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await applicantAuthService.register(name, email, password)
      router.push(`/jobs/verify-email?email=${encodeURIComponent(email)}`)
    },
    [router],
  )

  const logout = useCallback(() => {
    if (accessToken) {
      applicantAuthService.logout(accessToken).catch(() => null)
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(APPLICANT_KEY)
    setApplicant(null)
    setAccessToken(null)
    router.push("/jobs/login")
  }, [accessToken, router])

  const requestResetPassword = useCallback(async (email: string) => {
    await applicantAuthService.requestResetPassword(email)
  }, [])

  const resetPassword = useCallback(
    async (email: string, otp: string, newPassword: string) => {
      await applicantAuthService.resetPassword(email, otp, newPassword)
    },
    [],
  )

  return (
    <ApplicantAuthContext.Provider
      value={{
        applicant,
        accessToken,
        loading,
        isAuthenticated: !!applicant,
        login,
        register,
        logout,
        requestResetPassword,
        resetPassword,
      }}
    >
      {children}
    </ApplicantAuthContext.Provider>
  )
}

export function useApplicantAuth() {
  const ctx = useContext(ApplicantAuthContext)
  if (!ctx) throw new Error("useApplicantAuth must be used within <ApplicantAuthProvider>")
  return ctx
}
