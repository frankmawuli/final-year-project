"use client"

import { useState, useEffect } from "react"
import { Search, X, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { useAuth } from "@/context/auth-context"
import { employeeService, type EmploymentType } from "@/services/employee.service"
import { departmentService } from "@/services/departments.service"
import { EmployeeCard } from "@/components/employees/employee-card"
import { EmailModal } from "@/components/employees/email-modal"
import { EmployeeFormModal } from "@/components/employees/employee-form-modal"
import { ProfilePanel } from "@/components/employees/profile-panel"
import { FilterDropdown } from "@/components/filter-dropdown"
import {
  CARDS_PER_PAGE, sidebarNav,
  EMPLOYMENT_TYPE_LABELS, EMPLOYMENT_TYPE_OPTIONS, STATUS_OPTIONS,
} from "@/components/employees/constants"
import { mapEmployee } from "@/components/employees/utils"
import type { Employee, FormPayload } from "@/components/employees/types"

type StatusOption = (typeof STATUS_OPTIONS)[number]

export default function EmployeesPage() {
  const { accessToken } = useAuth()

  const [employees,  setEmployees]  = useState<Employee[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [search,       setSearch]       = useState("")
  const [deptFilter,   setDeptFilter]   = useState<string | "All">("All")
  const [typeFilter,   setTypeFilter]   = useState<string | "All">("All")
  const [statusFilter, setStatusFilter] = useState<StatusOption | "All">("All")
  const [page,       setPage]       = useState(1)
  const [messaging,  setMessaging]  = useState<Employee | null>(null)
  const [viewing,    setViewing]    = useState<Employee | null>(null)
  // undefined = closed, null = add new, Employee = edit
  const [editing,    setEditing]    = useState<Employee | null | undefined>(undefined)

  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([])
  useEffect(() => {
    if (!accessToken) return
    departmentService.list(accessToken)
      .then((res) => setDepartments(res.data))
      .catch(() => { /* filter degrades to unavailable — not fatal */ })
  }, [accessToken])

  const hasFilters = search !== "" || deptFilter !== "All" || typeFilter !== "All" || statusFilter !== "All"
  const clearFilters = () => {
    setSearch(""); setDeptFilter("All"); setTypeFilter("All"); setStatusFilter("All"); setPage(1)
  }

  // Debounce search and reset page when it changes
  const [debouncedSearch, setDebouncedSearch] = useState("")
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  const departmentId    = deptFilter !== "All" ? departments.find((d) => d.name === deptFilter)?.id : undefined
  const employmentType  = typeFilter !== "All"
    ? (Object.keys(EMPLOYMENT_TYPE_LABELS) as EmploymentType[]).find((k) => EMPLOYMENT_TYPE_LABELS[k] === typeFilter)
    : undefined
  const isActive = statusFilter === "Active" ? true : statusFilter === "Inactive" ? false : undefined

  // Fetch from API
  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    setLoading(true)
    setError(null)
    employeeService
      .list(
        { search: debouncedSearch || undefined, departmentId, employmentType, isActive, page, limit: CARDS_PER_PAGE },
        accessToken,
      )
      .then((res) => {
        if (cancelled) return
        setEmployees(res.data.map(mapEmployee))
        setTotalPages(res.meta.totalPages)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load employees")
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [accessToken, debouncedSearch, departmentId, employmentType, isActive, page])

  const saveEmployee = async (payload: FormPayload, existing: Employee | null) => {
    if (!accessToken) throw new Error("Not authenticated")

    if (existing) {
      const res = await employeeService.update(
        existing.id,
        {
          ...(payload.empId !== existing.empId && { employeeId: payload.empId }),
          ...(payload.role       && { jobTitle:       payload.role }),
          ...(payload.employmentType && { employmentType: payload.employmentType as EmploymentType }),
          ...(payload.phone      && { phone:          payload.phone }),
          ...(payload.bio        && { bio:            payload.bio }),
          ...(payload.joinDate   && { joinDate:       payload.joinDate }),
        },
        accessToken,
      )
      setEmployees((prev) => prev.map((e) => (e.id === existing.id ? mapEmployee(res.data) : e)))
      if (viewing?.id === existing.id) setViewing(mapEmployee(res.data))
    } else {
      const res = await employeeService.create(
        {
          name:           payload.name,
          email:          payload.email,
          employeeId:     payload.empId,
          ...(payload.role           && { jobTitle:       payload.role }),
          ...(payload.employmentType && { employmentType: payload.employmentType as EmploymentType }),
          ...(payload.phone          && { phone:          payload.phone }),
          ...(payload.bio            && { bio:            payload.bio }),
          ...(payload.joinDate       && { joinDate:       payload.joinDate }),
        },
        accessToken,
      )
      setEmployees((prev) => [mapEmployee(res.data), ...prev])
    }
  }

  // Optimistic remove — API is soft-delete so employee won't reappear on next fetch
  const deleteEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
    if (viewing?.id === id) setViewing(null)
    if (accessToken) {
      employeeService.remove(id, accessToken).catch(console.error)
    }
  }

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Search + filters */}
        <div className="flex shrink-0 items-center gap-2.5 border-b border-border bg-card px-5 py-2.5">
          <div className="flex flex-1 items-center gap-1.5">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ⌘K"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <FilterDropdown
            label="Department"
            value={deptFilter}
            options={departments.map((d) => d.name)}
            onChange={(v) => { setDeptFilter(v); setPage(1) }}
          />
          <FilterDropdown
            label="Employment Type"
            value={typeFilter}
            options={EMPLOYMENT_TYPE_OPTIONS}
            onChange={(v) => { setTypeFilter(v); setPage(1) }}
          />
          <FilterDropdown
            label="Status"
            value={statusFilter}
            options={[...STATUS_OPTIONS]}
            onChange={(v) => { setStatusFilter(v); setPage(1) }}
          />

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="whitespace-nowrap rounded-lg border border-border px-2.5 py-2 text-xs text-muted-foreground hover:bg-muted"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-auto p-5">
          {/* Header row */}
          <div className="mb-4 flex items-center justify-between">
            <div />
            <button
              onClick={() => setEditing(null)}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Plus className="size-4" /> Add Employee
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
              Loading employees…
            </div>
          ) : error ? (
            <div className="flex flex-1 items-center justify-center text-xs text-rose-500">
              {error}
            </div>
          ) : employees.length > 0 ? (
            <div className="grid flex-1 auto-rows-min grid-cols-3 gap-3">
              {employees.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  emp={emp}
                  onMessage={(e) => { setViewing(null); setMessaging(e) }}
                  onViewProfile={(e) => setViewing(e)}
                  onEdit={(e) => setEditing(e)}
                  onDelete={deleteEmployee}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
              No employees found.
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                    p === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      {messaging && (
        <EmailModal emp={messaging} onClose={() => setMessaging(null)} />
      )}
      {viewing && (
        <ProfilePanel
          emp={viewing}
          onClose={() => setViewing(null)}
          onMessage={() => { setViewing(null); setMessaging(viewing) }}
        />
      )}
      {editing !== undefined && (
        <EmployeeFormModal
          initial={editing}
          onClose={() => setEditing(undefined)}
          onSave={(payload) => saveEmployee(payload, editing ?? null)}
        />
      )}
    </>
  )
}
