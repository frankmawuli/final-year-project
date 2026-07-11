"use client";

import Link from "next/link";
import { Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoJobs } from "@/components/logo";
import { useApplicantAuth } from "@/context/applicant-auth-context";

const PUBLIC_LINKS = [
  { label: "Find Jobs", href: "/jobs/job-listing", active: true },
];

const AUTH_LINKS = [
  { label: "Find Jobs", href: "/jobs/job-listing", active: true },
  { label: "My profile", href: "/jobs/profile" },
  { label: "Applications", href: "/jobs/application" },
];

export function JobListingNavbar() {
  const { applicant, isAuthenticated, loading } = useApplicantAuth();

  const navLinks = isAuthenticated ? AUTH_LINKS : PUBLIC_LINKS;

  const initials = applicant?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-[1340px] mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-3">
        {/* Logo + nav links */}
        <div className="flex items-center gap-6">
          <Link href="/jobs" className="flex items-center gap-1.5 shrink-0">
            <LogoJobs width={46} height={46} />
            <span className="font-bold text-[16px] text-foreground hidden sm:block">
              CoreRecruiter
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "text-[13.5px] font-medium transition-colors",
                  active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        {!loading && (
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button
                  aria-label="Notifications"
                  className="relative flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Bell className="w-[18px] h-[18px]" />
                  <span className="absolute top-1.5 right-2 w-[7px] h-[7px] rounded-full bg-rose-500 ring-2 ring-card" />
                </button>

                {/* Settings */}
                <button
                  aria-label="Settings"
                  className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="w-[18px] h-[18px]" />
                  <span className="absolute top-1.5 right-2 w-[7px] h-[7px] rounded-full bg-rose-500 ring-2 ring-card" />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-[13px] font-semibold shrink-0">
                    {initials}
                  </div>
                  <span className="hidden md:block text-[13.5px] font-semibold text-foreground">
                    {applicant?.name}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/jobs/login"
                  className="text-[13.5px] font-medium text-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
                
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
