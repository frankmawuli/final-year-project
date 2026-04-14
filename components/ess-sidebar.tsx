"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Clock,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Banknote,
  MessageSquare,
  FileBarChart2,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LeafItem {
  label: string
  href: string
}

interface SubSection {
  label: string
  href?: string
  children?: LeafItem[]
  hasChevron?: boolean
}

interface Section {
  label: string
  icon: React.ElementType
  children: SubSection[]
}

const sections: Section[] = [
  {
    label: "Attendance",
    icon: Clock,
    children: [
      { label: "Clock In / Clock Out", href: "/dashboard/ess/attendance" },
      { label: "Overtime", href: "/dashboard/ess/overtime",  },
      { label: "Worksheet", href: "/dashboard/ess/worksheet" },
    ],
  },
  {
    label: "Leave & Time Off",
    icon: CreditCard,
    children: [
      { label: "My Requests", href: "/dashboard/ess/leave" },
      { label: "History", href: "/dashboard/ess/leave/history" },
    ],
  },
  {
    label: "Compensation",
    icon: Banknote,
    children: [
      { label: "Allowance", href: "/dashboard/ess/payroll" },
      { label: "Payslips", href: "/dashboard/ess/payroll/tax" },
    ],
  },
  
  {
    label: "Documents",
    icon: MessageSquare,
    children: [
      { label: "Certification", href: "/dashboard/ess/chat" },
      { label: "Upload files", href: "/dashboard/ess/chat" },

    ],
  },
  {
    label: "Report",
    icon: FileBarChart2,
    children: [
      { label: "My Reports", href: "/dashboard/ess/report" },
    ],
  },
]

export default function EssSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  // Close mobile drawer whenever the route changes
  useEffect(() => {
    onClose?.()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Which top-level sections are expanded; default: "Time" open
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["Time"]))
  // Which sub-sections (like "Attendance") are expanded; default: open
  const [expandedSub, setExpandedSub] = useState<Set<string>>(new Set(["Attendance"]))

  const toggleSection = (label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  const toggleSub = (label: string) => {
    setExpandedSub((prev) => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col bg-white py-5 pl-4 pr-3 shadow-sm">
      <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Menu
      </p>

      <nav className="flex flex-col gap-0.5 overflow-y-auto">
        {sections.map((section) => {
          const isOpen = expanded.has(section.label)
          const Icon = section.icon

          // Is any child active?
          const sectionActive = section.children.some((sub) =>
            sub.children
              ? sub.children.some((leaf) => pathname === leaf.href)
              : pathname === sub.href
          )

          return (
            <div key={section.label}>
              {/* Top-level row */}
              <button
                onClick={() => toggleSection(section.label)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-sm font-medium transition-colors",
                  sectionActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md",
                    sectionActive ? "bg-primary/10" : "bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      sectionActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </span>
                <span className="flex-1">{section.label}</span>
                {isOpen ? (
                  <ChevronUp className="size-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                )}
              </button>

              {/* Sub-items */}
              {isOpen && (
                <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
                  {section.children.map((sub) => {
                    if (sub.children) {
                      // Sub-section with its own children (e.g., "Attendance")
                      const subOpen = expandedSub.has(sub.label)
                      const subActive = sub.children.some((leaf) => pathname === leaf.href)
                      return (
                        <div key={sub.label}>
                          <button
                            onClick={() => toggleSub(sub.label)}
                            className={cn(
                              "flex w-full items-center justify-between rounded px-2 py-2 text-left text-sm transition-colors",
                              subActive
                                ? "font-medium text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {sub.label}
                            {subOpen ? (
                              <ChevronUp className="size-3 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="size-3 text-muted-foreground" />
                            )}
                          </button>
                          {subOpen && (
                            <div className="ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
                              {sub.children.map((leaf) => {
                                const isActive = pathname === leaf.href
                                return (
                                  <Link
                                    key={leaf.href}
                                    href={leaf.href}
                                    className={cn(
                                      "block rounded px-2 py-1.5 text-[13px] transition-colors",
                                      isActive
                                        ? "font-medium text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    {leaf.label}
                                  </Link>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    }

                    // Flat sub-item (direct link)
                    const isActive = pathname === sub.href
                    return (
                      <div key={sub.label} className="flex items-center justify-between">
                        <Link
                          href={sub.href ?? "#"}
                          className={cn(
                            "flex-1 rounded px-2 py-2 text-sm transition-colors",
                            isActive
                              ? "font-medium text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {sub.label}
                        </Link>
                        {sub.hasChevron && (
                          <ChevronDown className="mr-1 size-3 text-muted-foreground" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User profile at bottom */}
      <div className="mt-auto pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted">
              <div className="size-8 shrink-0 overflow-hidden rounded-full bg-muted">
                <img
                  src="https://i.pravatar.cc/32?img=11"
                  alt="Michael Smith"
                  className="size-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">Michael Smith</p>
                <p className="truncate text-[11px] text-muted-foreground">HR Administrator</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-48">
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
