import type { InviteLinkRole } from "@/services/onboarding.service"

export const ROLE_OPTIONS: InviteLinkRole[] = ["HR_ADMIN", "HR_MANAGER", "SUPER_ADMIN", "EMPLOYEE"]

export const ROLE_LABELS: Record<InviteLinkRole, string> = {
  HR_ADMIN:    "HR Admin",
  HR_MANAGER:  "HR Manager",
  SUPER_ADMIN: "Super Admin",
  EMPLOYEE:    "Employee",
}

export const ROLE_BADGE: Record<InviteLinkRole, string> = {
  HR_ADMIN:    "bg-[#ede9fe] text-[#7c3aed]",
  HR_MANAGER:  "bg-[#dbeafe] text-[#2563eb]",
  SUPER_ADMIN: "bg-[#fee2e2] text-[#dc2626]",
  EMPLOYEE:    "bg-[#dcfce7] text-[#16a34a]",
}
