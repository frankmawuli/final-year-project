"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const PROFILE_TABS = [
  "Overview",
  "About Me",
  "Employment & Availability",
  "Experience & Education",
  "Certificates & Awards",
  "Languages & Skills",
] as const;

// Reachable via the sidebar's "Upload CV & Cover Letter" button rather than the tab nav.
const HIDDEN_PROFILE_TABS = ["CV / Portfolio / Cover Letter"] as const;

export type ProfileTab = (typeof PROFILE_TABS)[number] | (typeof HIDDEN_PROFILE_TABS)[number];

export function ProfileTabs({
  active,
  onChange,
}: {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}) {
  return (
    <div className="bg-card rounded-t-xl border border-b-0 border-border flex items-center">
      <nav className="scrollbar-hide flex flex-1 items-center gap-5 overflow-x-auto px-5">
        {PROFILE_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              "shrink-0 whitespace-nowrap border-b-2 py-3 text-[13.5px] font-medium transition-colors",
              active === tab
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </nav>
      <button
        type="button"
        aria-label="Scroll tabs"
        className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
