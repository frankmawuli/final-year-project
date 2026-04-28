import EssShell from "@/components/ess-shell"
import RequireAuth from "@/components/require-auth"

export default function EssLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <EssShell>{children}</EssShell>
    </RequireAuth>
  )
}
