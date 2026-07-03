import { api } from "@/lib/api-client"

export interface Applicant {
  id: string
  name: string
  email: string
}

export const applicantAuthService = {
  register: (name: string, email: string, password: string) =>
    api.post<{ success: boolean; data: { id: string; name: string; email: string; status: string } }>(
      "/applicant/auth/register",
      { name, email, password }
    ),

  login: (email: string, password: string) =>
    api.post<{
      success: boolean
      data: { id: string; email: string; name: string; accessToken: string; refreshToken: string }
    }>("/applicant/auth/login", { email, password }),

  verifyEmail: (email: string, code: string) =>
    api.post<{ success: boolean; message: string }>("/applicant/auth/verify-email", {
      email,
      code,
      purpose: "EMAIL_VERIFICATION",
    }),

  resendOtp: (email: string) =>
    api.post<{ success: boolean; message: string }>("/applicant/auth/resend-otp", { email }),

  logout: (accessToken: string) =>
    api.post<{ success: boolean; message: string }>("/applicant/auth/logout", undefined, {
      Authorization: `Bearer ${accessToken}`,
    }),

  refreshToken: (refreshToken: string) =>
    api.post<{ success: boolean; data: { accessToken: string } }>("/applicant/auth/refresh-token", {
      refreshToken,
    }),

  requestResetPassword: (email: string) =>
    api.post<{ success: boolean; message: string }>("/applicant/auth/request-reset-password", { email }),

  resetPassword: (email: string, otp: string, newPassword: string) =>
    api.post<{ success: boolean; message: string }>("/applicant/auth/reset-password", {
      email,
      otp,
      newPassword,
    }),
}
