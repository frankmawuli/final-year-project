"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Bell, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Find Jobs", href: "/jobs/job-listing", active: true },
  { label: "My profile", href: "/jobs/profile" },
  { label: "Applications", href: "/jobs/application" },
];


export function JobListingNavbar() {
  const [language, setLanguage] = useState("English");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo + nav links */}
        <div className="flex items-center gap-8">
          <Link href="/jobs" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm leading-none">C</span>
            </div>
            <span className="font-bold text-[16px] text-foreground hidden sm:block">
              CoreRecruiter
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "text-[13.5px] font-medium transition-colors",
                  active ? "text-foreground font-semibold" : "text-[#6B7280] hover:text-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
       
          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative flex items-center justify-center w-9 h-9 rounded-full text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-2 w-[7px] h-[7px] rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Messages */}
          <button
            aria-label="Messages"
            className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
          >
            <Settings className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-2 w-[7px] h-[7px] rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
              <Image
                src="/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png"
                alt="User avatar"
                fill
                className="object-cover"
              />
            </div>
            <span className="hidden md:block text-[13.5px] font-semibold text-foreground">
              Peter Ivanovic
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
