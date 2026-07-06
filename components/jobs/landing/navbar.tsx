"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { LogoJobs } from "@/components/logo";

const NAV_LINKS = [
  { label: "Home", active: true, link: "/jobs" },
  { label: "Jobs", dropdown: true, link: "/jobs/job-listing" },
  { label: "Companies", link: "/companies" },
  { label: "Career Tips", link: "/career-tips" },
  { label: "About Us", link: "/about-us" },
];

export function Navbar() {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Logo */}
        <Link href="/jobs" className="flex items-center gap-2 shrink-0">
          <LogoJobs width={46} height={46} />
          <span className="font-semibold text-[15px] text-foreground hidden sm:block">
            CoreRecruiter Jobs
          </span>
        </Link>

        {/* Nav links – desktop */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, active, dropdown, link }) => (
            <Link
              key={label}
              href={link}
              className={`flex items-center gap-1 text-[13.5px] font-medium pb-0.5 transition-colors ${
                active
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {label}
              {dropdown && <ChevronDown className="w-3.5 h-3.5" />}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/jobs/login"
            className="hidden md:block text-[13.5px] font-medium text-foreground hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link
            href="/jobs/signup"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-[13.5px] font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors"
          >
            Sign Up
          </Link>
          {/* Hamburger – mobile only */}
          <button
            className="md:hidden p-1.5 text-foreground"
            onClick={() => setShowMobileNav((o) => !o)}
            aria-label="Toggle menu"
          >
            {showMobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {showMobileNav && (
        <nav className="md:hidden bg-card border-t border-border px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, active, dropdown, link }) => (
            <Link
              key={label}
              href={link}
              onClick={() => setShowMobileNav(false)}
              className={`flex items-center justify-between py-2.5 px-2 text-[14px] font-medium rounded-lg transition-colors ${
                active ? "text-primary bg-primary/5" : "text-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <span>{label}</span>
              {dropdown && <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </Link>
          ))}
          <div className="border-t border-border mt-2 pt-2">
            <Link
              href="/jobs/login"
              onClick={() => setShowMobileNav(false)}
              className="block py-2.5 px-2 text-[14px] font-medium text-foreground hover:text-primary transition-colors"
            >
              Login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
