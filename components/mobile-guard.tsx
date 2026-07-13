"use client"

import { Monitor } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export default function MobileGuard({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Monitor className="size-7" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-lg font-semibold">Best viewed on a larger screen</h1>
          <p className="max-w-xs text-sm text-muted-foreground">
            The HR dashboard isn&apos;t optimized for mobile yet. Please switch to a tablet, laptop, or desktop to continue.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
