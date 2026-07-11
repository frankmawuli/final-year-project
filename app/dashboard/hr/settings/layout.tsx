import HrNavigationPannel from "@/components/hr-navigation-pannel"
import React from "react"


const navItems = [
  { label: "Company ", href: "/dashboard/hr/settings/company"      },
  { label: "Payroll & Compensation",                href: "/dashboard/hr/settings/payroll"       },
  { label: "Leave & Attendance",     href: "/dashboard/hr/settings/leave"         },
  {label : "Invite & Permissions", href: "/dashboard/hr/settings/invite-permissions" },
  { label: "Notifications", href: "/dashboard/hr/settings/notifications" },
  { label: "Security",  href: "/dashboard/hr/settings/security"    },
  { label: "Integrations", href: "/dashboard/hr/settings/integrations" },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HrNavigationPannel navItems={navItems} />
      <main className="flex flex-1 flex-col overflow-y-auto p-5">
        {children}
      </main>
    </>
  )
}
