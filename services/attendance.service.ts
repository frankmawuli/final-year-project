import { api } from "@/lib/api-client"

export interface ApiAttendanceRecord {
  id: number
  date: string
  clockIn: string | null
  clockOut: string | null
  hoursWorked: number | null
}

interface AttendanceResponse {
  success: boolean
  data: ApiAttendanceRecord
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

export const attendanceService = {
  list: (token: string, params: { from?: string; to?: string } = {}) => {
    const qs = new URLSearchParams()
    if (params.from) qs.set("from", params.from)
    if (params.to) qs.set("to", params.to)
    const query = qs.toString()
    return api.get<{ success: boolean; data: ApiAttendanceRecord[]; meta: { total: number } }>(
      `/attendance${query ? `?${query}` : ""}`,
      auth(token),
    )
  },

  today: (token: string) =>
    api.get<{ success: boolean; data: ApiAttendanceRecord | null }>("/attendance/today", auth(token)),

  clockIn: (timestamp: string, token: string) =>
    api.post<AttendanceResponse>("/attendance/clock-in", { timestamp }, auth(token)),

  clockOut: (timestamp: string, token: string) =>
    api.post<AttendanceResponse>("/attendance/clock-out", { timestamp }, auth(token)),
}