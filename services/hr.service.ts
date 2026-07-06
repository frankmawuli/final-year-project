import { api, BASE_URL } from "@/lib/api-client"

export interface HrOverviewStats {
  totalEmployees:      number
  newEmployeesThisMonth: number
  openJobPositions:    number
  newJobsThisWeek:     number
}

export interface HrOverviewDeptCount {
  department: string
  count:      number
}

export interface HrOverviewRoleCount {
  role:  string | null
  count: number
}

export interface HrOverviewData {
  stats:                HrOverviewStats
  employeesByDepartment: HrOverviewDeptCount[]
  employeesByRole:       HrOverviewRoleCount[]
}

export type ActivityCategory = "HR" | "RECRUITMENT"

export interface ActivityItem {
  id:        number
  category:  ActivityCategory
  icon:      string
  text:      string
  avatarUrl: string | null
  createdAt: string
}

export const hrService = {
  overview: (token: string) =>
    api.get<{ success: boolean; data: HrOverviewData }>("/hr/overview", {
      Authorization: `Bearer ${token}`,
    }),

  activity: (token: string, limit = 20) =>
    api.get<{ success: boolean; data: ActivityItem[] }>(`/hr/activity?limit=${limit}`, {
      Authorization: `Bearer ${token}`,
    }),

  // EventSource can't set an Authorization header, so the token travels as a query param.
  activityStreamUrl: (token: string) =>
    `${BASE_URL}/hr/activity/stream?token=${encodeURIComponent(token)}`,
}
