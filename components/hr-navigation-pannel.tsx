"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const adminPhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

interface NavItem {
  label: string
  href: string
}

interface HrNavigationPannelProps {
  navItems: NavItem[]
}

export default function HrNavigationPannel({ navItems }: HrNavigationPannelProps) {
  const pathname = usePathname()

  return (
    <aside className="flex w-[220px] shrink-0 flex-col justify-between bg-white py-5 pl-5 pr-3 shadow-sm">
      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "block w-full rounded px-3 py-2.5 text-left text-sm font-medium transition-colors",
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

      <div className="flex items-center gap-2 rounded-lg px-3 py-2">
        <img
          src={adminPhoto}
          alt="Michael Smith"
          className="size-9 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">Michael Smith</p>
          <p className="truncate text-xs text-muted-foreground">HR Administrator</p>
        </div>
      </div>
    </aside>
  )
}
