import { HRIconSidebar } from "@/components/hr-icon-sidebar"
import RequireAuth from "@/components/require-auth"
import MobileGuard from "@/components/mobile-guard"

export default function HrLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <MobileGuard>
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
          <HRIconSidebar />
          {children}
        </div>
      </MobileGuard>
    </RequireAuth>
  )
}