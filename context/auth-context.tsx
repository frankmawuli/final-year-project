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

import { authService, type Role, type User } from "@/services/auth.service"

const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"
const USER_KEY = "auth_user"

interface AuthContextValue {
  user: User | null
  accessToken: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  requestResetPassword: (email: string) => Promise<void>
  resetPassword: (email: string, otp: string, oldPassword: string, newPassword: string) => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    if (storedToken && storedUser) {
      try {
        setAccessToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setLoading(false)
  }, [])

  const applySession = useCallback(
    (data: {
      id: string
      name: string
      email: string
      role: Role
      accessToken: string
      refreshToken: string
      numberOfLogins: number
      mustChangePassword?: boolean
    }) => {
      const { id, name, email, role, accessToken: at, refreshToken: rt, numberOfLogins, mustChangePassword } = data
      const u: User = { id, name, email, role, numberOfLogins, mustChangePassword }
      localStorage.setItem(ACCESS_TOKEN_KEY, at)
      localStorage.setItem(REFRESH_TOKEN_KEY, rt)
      localStorage.setItem(USER_KEY, JSON.stringify(u))
      setAccessToken(at)
      setUser(u)
      if (mustChangePassword) {
        router.push("/auth/change-password")
      } else if (role === "HR_ADMIN" && numberOfLogins === 0) {
        router.push("/onboarding")
      } else if (role === "HR_ADMIN") {
        router.push("/dashboard/hr")
      } else {
        router.push("/dashboard/ess")
      }
    },
    [router],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authService.login(email, password)
      applySession(res.data)
    },
    [applySession],
  )

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      const res = await authService.googleLogin(idToken)
      applySession(res.data)
    },
    [applySession],
  )

  const register = useCallback(
    async (fullName: string, email: string, password: string) => {
      await authService.register(fullName, email, password)
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
    },
    [router],
  )

  const logout = useCallback(() => {
    if (accessToken) {
      authService.logout(accessToken).catch(() => null)
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    setAccessToken(null)
    router.push("/auth/login")
  }, [accessToken, router])

  const requestResetPassword = useCallback(async (email: string) => {
    await authService.requestResetPassword(email)
  }, [])

  const resetPassword = useCallback(
    async (email: string, otp: string, oldPassword: string, newPassword: string) => {
      await authService.resetPassword(email, otp, oldPassword, newPassword)
    },
    [],
  )

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      if (!accessToken) throw new Error("Not authenticated")
      await authService.changePassword(oldPassword, newPassword, accessToken)
      setUser((prev) => {
        if (!prev) return prev
        const updated = { ...prev, mustChangePassword: false }
        localStorage.setItem(USER_KEY, JSON.stringify(updated))
        return updated
      })
    },
    [accessToken],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        requestResetPassword,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}
