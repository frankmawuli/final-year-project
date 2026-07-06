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

import { ApiError } from "@/lib/api-client"
import {
  applicantAuthService,
  type Applicant,
  type ApplicantProfile,
  type UpdateApplicantProfileBody,
} from "@/services/applicant-auth.service"

const ACCESS_TOKEN_KEY = "applicant_access_token"
const REFRESH_TOKEN_KEY = "applicant_refresh_token"
const APPLICANT_KEY = "applicant_user"

interface ApplicantAuthContextValue {
  applicant: Applicant | null
  profile: ApplicantProfile | null
  accessToken: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  requestResetPassword: (email: string) => Promise<void>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (body: UpdateApplicantProfileBody) => Promise<void>
}

const ApplicantAuthContext = createContext<ApplicantAuthContextValue | null>(null)

function clearStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(APPLICANT_KEY)
}

export function ApplicantAuthProvider({ children }: { children: ReactNode }) {
  const [applicant, setApplicant] = useState<Applicant | null>(null)
  const [profile, setProfile] = useState<ApplicantProfile | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function hydrate() {
      const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY)
      if (!storedToken) {
        setLoading(false)
        return
      }

      // Validate the stored token against the backend and hydrate the profile.
      let token = storedToken
      try {
        let res
        try {
          res = await applicantAuthService.getProfile(token)
        } catch (err) {
          const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
          if (!(err instanceof ApiError) || err.status !== 401 || !refreshToken) throw err
          const refreshed = await applicantAuthService.refreshToken(refreshToken)
          token = refreshed.data.accessToken
          localStorage.setItem(ACCESS_TOKEN_KEY, token)
          res = await applicantAuthService.getProfile(token)
        }

        const p = res.data
        const a: Applicant = { id: p.id, name: p.name, email: p.email }
        localStorage.setItem(APPLICANT_KEY, JSON.stringify(a))
        setAccessToken(token)
        setApplicant(a)
        setProfile(p)
      } catch (err) {
        // Only a definitive auth failure invalidates the session; keep the
        // cached identity if the API is simply unreachable.
        if (err instanceof ApiError && err.status === 401) {
          clearStorage()
        } else {
          const storedApplicant = localStorage.getItem(APPLICANT_KEY)
          if (storedApplicant) {
            try {
              setApplicant(JSON.parse(storedApplicant))
              setAccessToken(token)
            } catch {
              clearStorage()
            }
          }
        }
      } finally {
        setLoading(false)
      }
    }

    hydrate()
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
      applicantAuthService
        .getProfile(at)
        .then((p) => setProfile(p.data))
        .catch(() => null)
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
    clearStorage()
    setApplicant(null)
    setProfile(null)
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

  const refreshProfile = useCallback(async () => {
    if (!accessToken) return
    const res = await applicantAuthService.getProfile(accessToken)
    setProfile(res.data)
  }, [accessToken])

  const updateProfile = useCallback(
    async (body: UpdateApplicantProfileBody) => {
      if (!accessToken) throw new Error("Not authenticated")
      const res = await applicantAuthService.updateProfile(accessToken, body)
      const updated = res.data
      setProfile(updated)
      const a: Applicant = { id: updated.id, name: updated.name, email: updated.email }
      localStorage.setItem(APPLICANT_KEY, JSON.stringify(a))
      setApplicant(a)
    },
    [accessToken],
  )

  return (
    <ApplicantAuthContext.Provider
      value={{
        applicant,
        profile,
        accessToken,
        loading,
        isAuthenticated: !!applicant,
        login,
        register,
        logout,
        requestResetPassword,
        resetPassword,
        refreshProfile,
        updateProfile,
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
