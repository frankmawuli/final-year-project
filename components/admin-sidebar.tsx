"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  BarChart3,
  Bell,
  Building2,
  ClipboardList,
  LayoutDashboard,
  Moon,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  UserCircle,
} from "lucide-react"
import { Avatar } from "@/components/avatar"
import { Logo } from "@/components/logo"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Companies", href: "/dashboard/admin/companies", icon: Building2 },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Roles & Permissions", href: "/dashboard/admin/roles", icon: ShieldCheck },
  { label: "Audit Logs", href: "/dashboard/admin/audit-logs", icon: ClipboardList },
  { label: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
  { label: "System Settings", href: "/dashboard/admin/settings", icon: SlidersHorizontal },
  { label: "Notifications", href: "/dashboard/admin/notifications", icon: Bell },
]

function isItemActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard/admin" && pathname.startsWith(`${href}/`))
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const { user } = useAuth()

  return (
    <aside className="flex min-h-screen w-62 shrink-0 flex-col border-r border-border bg-sidebar px-3 py-5">
      <Link href="/dashboard/admin" className="mb-8 flex items-center gap-2 px-2">
        <Logo width={34} height={34} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-foreground">CoreRecruiter</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Platform admin</p>
        </div>
      </Link>

      <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-1">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
          Workspace
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isItemActive(pathname, href)

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span>{label}</span>
              {active && <span className="absolute right-0 top-[18%] h-[64%] w-0.5 rounded-sm bg-primary" />}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2 border-t border-border pt-3">
        <Link
          href="/dashboard/admin/profile"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-muted",
            isItemActive(pathname, "/dashboard/admin/profile") && "bg-primary/10",
          )}
        >
          <Avatar src={null} alt={user?.name ?? "Admin"} className="size-8 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">{user?.name ?? "Administrator"}</p>
            <p className="truncate text-[11px] text-muted-foreground">Admin Profile</p>
          </div>
          <UserCircle className="size-3.5 text-muted-foreground" />
        </Link>

        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        >
          <Moon className="size-4" />
          <span>Toggle theme</span>
        </button>

      </div>
    </aside>
  )
}