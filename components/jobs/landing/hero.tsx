"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { PUBLIC_TYPE_LABEL } from "@/components/jobs/constants";
import type { PublicJobListItem } from "@/services/jobs.service";
import { logoColor } from "./utils";

const POPULAR_SEARCHES = ["Designer", "Developer", "Marketing", "Sales", "Remote"];

const AVATAR_COLORS = ["bg-orange-400", "bg-blue-400", "bg-green-400"];

interface HeroProps {
  popularJobs: PublicJobListItem[];
}

export function Hero({ popularJobs }: HeroProps) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredDropdown = keyword
    ? popularJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(keyword.toLowerCase()) ||
          j.company.name.toLowerCase().includes(keyword.toLowerCase()) ||
          j.tags.some((t) => t.toLowerCase().includes(keyword.toLowerCase()))
      )
    : popularJobs;

  return (
    <section className="bg-card pt-8 sm:pt-12 pb-10 sm:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 flex items-center gap-8 lg:gap-12">
        {/* Left */}
        <div className="flex-1 min-w-0 max-w-[580px]">
          {/* Pill badge */}
          <div className="inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full mb-5">
            Find the right job. Build your future.
          </div>

          {/* Headline */}
          <h1 className="text-[30px] sm:text-[38px] lg:text-[48px] leading-[1.15] font-bold text-foreground mb-3">
            Find Jobs That
            <br />
            <span className="text-primary">Match Your Future</span>
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-7">
            Discover opportunities, grow your skills, and
            <br className="hidden sm:block" />
            build the career you've always wanted.
          </p>

          {/* Search bar */}
          <div className="relative mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-card shadow-[0_4px_24px_0_rgba(0,0,0,0.08)] border border-border rounded-xl p-1 gap-1">
            <div className="flex items-center gap-1.5 flex-1 px-2.5 py-1.5 sm:py-1">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                className="flex-1 text-[13.5px] outline-none bg-transparent text-foreground placeholder:text-muted-foreground min-w-0"
              />
            </div>
            <div className="hidden sm:block w-px h-8 bg-border shrink-0" />
            <div className="sm:hidden h-px bg-border mx-1.5" />
            <div className="flex items-center gap-1.5 flex-1 px-2.5 py-1.5 sm:py-1">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 text-[13.5px] outline-none bg-transparent text-foreground placeholder:text-muted-foreground min-w-0"
              />
            </div>
            <div className="sm:hidden h-px bg-border mx-1.5" />
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-[13.5px] font-semibold px-4 py-2 rounded-lg transition-colors sm:shrink-0 w-full sm:w-auto">
              Search Jobs
            </button>
          </div>

          {/* Keyword dropdown */}
          {showDropdown && filteredDropdown.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              {filteredDropdown.map((job) => (
                <button
                  key={job.id}
                  onMouseDown={() => { setKeyword(job.title); setShowDropdown(false); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-muted"
                >
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: logoColor(job.company.initials) }}
                  >
                    <span className="text-[10px] font-bold text-white">{job.company.initials}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-foreground">{job.title}</p>
                    <p className="text-[11.5px] text-muted-foreground">
                      {job.company.name} · {PUBLIC_TYPE_LABEL[job.employment.type]}
                    </p>
                  </div>
                  <span className="shrink-0 text-[12px] font-semibold text-foreground">
                    {job.compensation.display}
                  </span>
                </button>
              ))}
            </div>
          )}
          </div>

          {/* Popular searches */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[13px] text-muted-foreground font-medium">
              Popular Searches:
            </span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                className="text-xs text-muted-foreground border border-border hover:border-primary hover:text-primary px-2.5 py-1 rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right – illustration */}
        <div className="hidden lg:flex flex-1 relative justify-center items-center min-h-[460px]">
          {/* Dot grid top-right */}
          <div className="absolute top-6 right-14 grid grid-cols-5 gap-1.5 opacity-40 pointer-events-none">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-[5px] h-[5px] rounded-full bg-primary" />
            ))}
          </div>

          {/* Plus sign */}
          <span className="absolute top-8 right-2 text-xl font-light text-muted-foreground/50 pointer-events-none">
            +
          </span>

          {/* Wavy decoration */}
          <svg
            className="absolute bottom-28 right-6 opacity-25 pointer-events-none text-primary"
            width="64"
            height="36"
            viewBox="0 0 64 36"
            fill="none"
          >
            <path d="M0 12 Q16 0 32 12 Q48 24 64 12" stroke="currentColor" strokeWidth="2.5" />
            <path d="M0 22 Q16 10 32 22 Q48 34 64 22" stroke="currentColor" strokeWidth="2.5" />
          </svg>

          {/* Outline circle left */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-2 border-border pointer-events-none" />

          <Image
            src="/assets/girl.png"
            alt="Hero Person"
            width={500}
            height={500}
            className="object-cover"
          />

          {/* Floating card */}
          <div className="absolute bottom-10 right-0 z-20 bg-card shadow-2xl rounded-xl p-3 flex items-center gap-2.5 w-[230px]">
            <div className="flex -space-x-1.5 shrink-0">
              {AVATAR_COLORS.map((c, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-card ${c}`}
                />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-card bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-[9px] font-bold leading-none">10K+</span>
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-foreground leading-tight">
                Happy Job Seekers
              </p>
              <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
                Join thousands of people who found their dream job.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
