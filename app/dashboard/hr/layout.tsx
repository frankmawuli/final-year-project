import { HRIconSidebar } from "@/components/hr-icon-sidebar"
import RequireAuth from "@/components/require-auth"

export default function HrLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <HRIconSidebar />
        {children}
      </div>
    </RequireAuth>
  )
}