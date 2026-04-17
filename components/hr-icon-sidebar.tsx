"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  MessageSquare,
  Users,
  Monitor,
  Package,
  ClipboardList,
  Moon,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const logoSvg = "/assets/db803ca622d556de5dc88a89ce27f842fcbf3c8b.svg"

const navItems = [
  { icon: LayoutDashboard, href: "/dashboard/hr",            label: "Overview"  },
  { icon: Briefcase,       href: "/dashboard/hr/jobs",       label: "Jobs"      },
  { icon: Users,           href: "/dashboard/hr/employees",  label: "Employees",
    matchGroup: ["/dashboard/hr/employees", "/dashboard/hr/departments", "/dashboard/hr/payroll", "/dashboard/hr/leave", "/dashboard/hr/history"] },
  { icon: Monitor,         href: "/dashboard/hr/reports",    label: "Reports"   },
  { icon: ClipboardList,   href: "/dashboard/hr/tasks",      label: "Tasks"     },
]

export function HRIconSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-[84px] shrink-0 flex-col items-center border-r border-border bg-white py-6">
      {/* Logo */}
      <Link href="/dashboard/hr" className="mb-6 flex size-[30px] items-center justify-center overflow-hidden">
        <img src={logoSvg} alt="CoreRecruiter" className="size-full" />
      </Link>

      {/* Nav icons */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map(({ icon: Icon, href, label, matchGroup }) => {
          const badge = undefined
          const isActive = matchGroup
            ? matchGroup.some((p) => pathname === p || pathname.startsWith(p + "/"))
            : pathname === href || (href !== "/dashboard/hr" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "relative flex size-12 items-center justify-center rounded-lg transition-colors",
                isActive
                  ? "bg-[#5e81f4]/10 text-[#5e81f4]"
                  : "text-[#8181a5] hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-[22px]" />
              {badge && (
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500" />
              )}
              {isActive && (
                <span className="absolute right-0 top-[12%] h-[76%] w-0.5 rounded-sm bg-[#5e81f4]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1">
        <button className="flex size-12 items-center justify-center rounded-lg text-[#8181a5] hover:bg-muted hover:text-foreground" title="Toggle theme">
          <Moon className="size-[22px]" />
        </button>
        <Link
          href="/dashboard/hr/settings"
          title="Settings"
          className={cn(
            "relative flex size-12 items-center justify-center rounded-lg transition-colors",
            pathname === "/dashboard/hr/settings" || pathname.startsWith("/dashboard/hr/settings/")
              ? "bg-[#5e81f4]/10 text-[#5e81f4]"
              : "text-[#8181a5] hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="size-[22px]" />
          {(pathname === "/dashboard/hr/settings" || pathname.startsWith("/dashboard/hr/settings/")) && (
            <span className="absolute right-0 top-[12%] h-[76%] w-0.5 rounded-sm bg-[#5e81f4]" />
          )}
        </Link>
      </div>
    </aside>
  )
}
