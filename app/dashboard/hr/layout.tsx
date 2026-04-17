import {HRIconSidebar} from "@/components/hr-icon-sidebar";

export default function HrLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <HRIconSidebar />
        {children}

    </div>

  )
}