"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Monitor,
  ClipboardList,
  Moon,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const logoSvg = "/assets/db803ca622d556de5dc88a89ce27f842fcbf3c8b.svg"
const chatbotSvg = "/assets/chatbot.svg"

const navItems = [
  { icon: LayoutDashboard, href: "/dashboard/hr",            label: "Overview"  },
  { icon: Briefcase,       href: "/dashboard/hr/jobs",       label: "Jobs"      },
  { icon: Users,           href: "/dashboard/hr/employees",  label: "Employees",
    matchGroup: ["/dashboard/hr/employees", "/dashboard/hr/departments", "/dashboard/hr/payroll", "/dashboard/hr/leave", "/dashboard/hr/history"] },
  { icon: Monitor,         href: "/dashboard/hr/reports",    label: "Reports"   },
  { icon: ClipboardList,   href: "/dashboard/hr/tasks",      label: "Tasks"     },
  { imgSrc: chatbotSvg,    href: "/dashboard/hr/assistant",  label: "Assistant" },
]

export function HRIconSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-[84px] shrink-0 flex-col items-center border-r border-border bg-sidebar py-6">
      {/* Logo */}
      <Link href="/dashboard/hr" className="mb-6 flex size-[30px] items-center justify-center overflow-hidden">
        <img src={logoSvg} alt="CoreRecruiter" className="size-full" />
      </Link>

      {/* Nav icons */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {navItems.map(({ icon: Icon, imgSrc, href, label, matchGroup }) => {
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
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {imgSrc ? (
                <img src={imgSrc} alt={label} className="size-5.5" />
              ) : Icon ? (
                <Icon className="size-5.5" />
              ) : null}
              {badge && (
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500" />
              )}
              {isActive && (
                <span className="absolute right-0 top-[12%] h-[76%] w-0.5 rounded-sm bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1">
        <button className="flex size-12 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" title="Toggle theme">
          <Moon className="size-5.5" />
        </button>
        <Link
          href="/dashboard/hr/settings"
          title="Settings"
          className={cn(
            "relative flex size-12 items-center justify-center rounded-lg transition-colors",
            pathname === "/dashboard/hr/settings" || pathname.startsWith("/dashboard/hr/settings/")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="size-5.5" />
          {(pathname === "/dashboard/hr/settings" || pathname.startsWith("/dashboard/hr/settings/")) && (
            <span className="absolute right-0 top-[12%] h-[76%] w-0.5 rounded-sm bg-primary" />
          )}
        </Link>
      </div>
    </aside>
  )
}
