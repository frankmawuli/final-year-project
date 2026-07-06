import { api } from "@/lib/api-client"

export type Role = "HR_ADMIN" | "EMPLOYEE" |"HR_MANAGER"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  numberOfLogins?: number
  mustChangePassword?: boolean
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
      data: { id: string; email: string; name: string; role: Role; accessToken: string; refreshToken: string; numberOfLogins: number; mustChangePassword?: boolean }
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

  requestResetPassword: (email: string) =>
    api.post<{ success: boolean; message: string }>("/auth/request-reset-password", { email }),

  resetPassword: (email: string, otp: string, oldPassword: string, newPassword: string) =>
    api.post<{ success: boolean; message: string }>(
      "/auth/reset-password",
      { email, otp, oldPassword, newPassword },
    ),

  changePassword: (oldPassword: string, newPassword: string, accessToken: string) =>
    api.post<{ success: boolean; message: string }>(
      "/auth/change-password",
      { oldPassword, newPassword },
      { Authorization: `Bearer ${accessToken}` },
    ),
}
