import HrNavigationPannel from "@/components/hr-navigation-pannel"
import React from "react"


const navItems = [
  { label: "Company ", href: "/dashboard/hr/settings/company"      },
  { label: "Payroll",                href: "/dashboard/hr/settings/payroll"       },
  { label: "Leave & Attendance",     href: "/dashboard/hr/settings/leave"         },
  { label: "Notifications", href: "/dashboard/hr/settings/notifications" },
  { label: "Security",  href: "/dashboard/hr/settings/security"    },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HrNavigationPannel navItems={navItems} />
      <main className="flex flex-1 flex-col overflow-y-auto p-6">
        {children}
      </main>
    </>
  )
}
