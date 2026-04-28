import { api } from "@/lib/api-client"

export type Role = "HR_ADMIN" | "EMPLOYEE" |"HR_MANAGER"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  numberOfLogins?: number
}

export const authService = {
  register: (fullName: string, email: string, password: string) =>
    api.post<{ success: boolean; data: { id: string; name: string; email: string; status: string } }>(
      "/auth/register",
      { fullName, email, password }
    ),

  login: (email: string, password: string) =>
    api.post<{
      success: boolean
      data: { id: string; email: string; name: string; role: Role; accessToken: string; refreshToken: string; numberOfLogins: number }
    }>("/auth/login", { email, password }),

  verifyOtp: (email: string, code: string, purpose: "EMAIL_VERIFICATION" | "PASSWORD_RESET") =>
    api.post<{ success: boolean; message: string }>("/auth/verify-otp", { email, code, purpose }),

  resendOtp: (email: string) =>
    api.post<{ success: boolean; message: string }>("/auth/resend-otp", { email }),

  logout: (accessToken: string) =>
    api.post<{ success: boolean; message: string }>("/auth/logout", undefined, {
      Authorization: `Bearer ${accessToken}`,
    }),

  refreshToken: (refreshToken: string) =>
    api.post<{ success: boolean; data: { accessToken: string } }>("/auth/refresh-token", { refreshToken }),

  requestResetPassword: (accessToken: string) =>
    api.post<{ success: boolean; message: string }>("/auth/request-reset-password", undefined, {
      Authorization: `Bearer ${accessToken}`,
    }),

  resetPassword: (
    accessToken: string,
    email: string,
    otp: string,
    oldPassword: string,
    newPassword: string
  ) =>
    api.post<{ success: boolean; message: string }>(
      "/auth/reset-password",
      { email, otp, oldPassword, newPassword },
      { Authorization: `Bearer ${accessToken}` }
    ),
}
