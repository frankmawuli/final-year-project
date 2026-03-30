import EssShell from "@/components/ess-shell"

export default function EssLayout({ children }: { children: React.ReactNode }) {
  return <EssShell>{children}</EssShell>
}
