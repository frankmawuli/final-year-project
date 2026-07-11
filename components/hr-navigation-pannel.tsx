"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { Avatar } from "@/components/avatar"
import type { Role } from "@/services/auth.service"

const ROLE_LABELS: Record<Role, string> = {
  HR_ADMIN:   "HR Administrator",
  HR_MANAGER: "HR Manager",
  EMPLOYEE:   "Employee",
}

interface NavItem {
  label: string
  href: string
}

interface HrNavigationPannelProps {
  navItems: NavItem[]
}

export default function HrNavigationPannel({ navItems }: HrNavigationPannelProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <aside className="flex w-[220px] shrink-0 flex-col justify-between bg-sidebar py-4 pl-4 pr-2.5 shadow-sm">
      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "block w-full rounded px-2.5 py-2 text-left text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary/5 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5">
        <Avatar
          src={null}
          alt={user?.name ?? "User"}
          className="size-9 shrink-0"
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-foreground">{user?.name ?? "—"}</p>
          <p className="truncate text-xs text-muted-foreground">{user ? ROLE_LABELS[user.role] : ""}</p>
        </div>
      </div>
    </aside>
  )
}
