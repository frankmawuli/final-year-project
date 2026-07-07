"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Briefcase, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  searchTags:      string[]
  allJobTitles:    string[]
  selectedCountry: string
  onCountryChange: (c: string) => void
  selectedJobType: string
  onJobTypeChange: (jt: string) => void
  onAddTag:        (title: string) => void
  onRemoveTag:     (tag: string) => void
  countries?:      string[]
  jobTypes?:       string[]
}

export function SearchBar({
  searchTags,
  allJobTitles,
  selectedCountry,
  onCountryChange,
  selectedJobType,
  onJobTypeChange,
  onAddTag,
  onRemoveTag,
  countries = [],
  jobTypes  = [],
}: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [jobTypeOpen, setJobTypeOpen] = useState(false);

  const searchRef  = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const jobTypeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current  && !searchRef.current.contains(e.target as Node))  setSearchOpen(false);
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false);
      if (jobTypeRef.current && !jobTypeRef.current.contains(e.target as Node)) setJobTypeOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredSuggestions = allJobTitles.filter(
    (title) =>
      !searchTags.includes(title) &&
      title.toLowerCase().includes(searchInput.toLowerCase())
  );

  function handleAddTag(title: string) {
    onAddTag(title);
    setSearchInput("");
    setSearchOpen(false);
  }

  return (
    <div className="bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1340px] mx-auto px-3 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:h-[60px] gap-1.5 sm:gap-2.5 py-2.5 sm:py-0">
        {/* Search input + tags */}
        <div className="relative flex items-center gap-1.5 flex-1 min-w-0" ref={searchRef}>
          <Search className="w-[16px] h-[16px] text-[#9CA3AF] shrink-0" />
          <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
            {searchTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-[#F3F4F6] text-foreground text-[12px] font-medium px-2 py-[5px] rounded-md shrink-0"
              >
                {tag}
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="text-[#9CA3AF] hover:text-foreground transition-colors ml-0.5"
                >
                  <X className="w-[10px] h-[10px]" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search jobs…"
              className="text-[12.5px] text-foreground placeholder:text-[#9CA3AF] outline-none bg-transparent min-w-[120px] flex-1"
            />
          </div>

          {searchOpen && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-1.5 w-full min-w-[240px] bg-white border border-[#E5E7EB] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)] z-50 overflow-hidden">
              <p className="text-[10.5px] font-semibold text-[#9CA3AF] uppercase tracking-[0.07em] px-3 pt-2.5 pb-1">
                Job titles
              </p>
              {filteredSuggestions.map((title) => (
                <button
                  key={title}
                  onMouseDown={(e) => { e.preventDefault(); handleAddTag(title); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-[13px] text-foreground hover:bg-[#F5F6F8] transition-colors"
                >
                  <Search className="w-[13px] h-[13px] text-[#9CA3AF] shrink-0" />
                  {title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:block h-7 w-px bg-[#E5E7EB] shrink-0" />

        {/* Filter dropdowns */}
        <div className="hidden sm:flex items-center gap-0.5 shrink-0">
          {/* Country */}
          {countries.length > 0 && (
            <div className="relative" ref={countryRef}>
              <button
                onClick={() => { setCountryOpen((o) => !o); setJobTypeOpen(false); }}
                className={cn(
                  "flex items-center gap-[6px] text-[12.5px] font-medium px-2.5 py-1.5 rounded-lg transition-colors",
                  selectedCountry ? "text-primary bg-primary/8" : "text-[#374151] hover:bg-[#F3F4F6]"
                )}
              >
                <MapPin className="w-[13px] h-[13px] text-[#9CA3AF]" />
                <span>{selectedCountry || "All Countries"}</span>
                <ChevronDown className="w-[13px] h-[13px] text-[#9CA3AF]" />
              </button>
              {countryOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-[#E5E7EB] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)] z-50 overflow-hidden py-1">
                  <button
                    onMouseDown={() => { onCountryChange(""); setCountryOpen(false); }}
                    className={cn(
                      "flex items-center w-full px-3 py-1.5 text-[12.5px] transition-colors",
                      !selectedCountry ? "font-semibold text-primary bg-primary/5" : "text-foreground hover:bg-[#F5F6F8]"
                    )}
                  >
                    All Countries
                  </button>
                  {countries.map((c) => (
                    <button
                      key={c}
                      onMouseDown={() => { onCountryChange(c); setCountryOpen(false); }}
                      className={cn(
                        "flex items-center w-full px-3 py-1.5 text-[12.5px] transition-colors",
                        selectedCountry === c ? "font-semibold text-primary bg-primary/5" : "text-foreground hover:bg-[#F5F6F8]"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Job Type */}
          {jobTypes.length > 0 && (
            <div className="relative" ref={jobTypeRef}>
              <button
                onClick={() => { setJobTypeOpen((o) => !o); setCountryOpen(false); }}
                className={cn(
                  "flex items-center gap-[6px] text-[12.5px] font-medium px-2.5 py-1.5 rounded-lg transition-colors",
                  selectedJobType ? "text-primary bg-primary/8" : "text-[#374151] hover:bg-[#F3F4F6]"
                )}
              >
                <Briefcase className="w-[13px] h-[13px] text-[#9CA3AF]" />
                <span>{selectedJobType || "Job Type"}</span>
                <ChevronDown className="w-[13px] h-[13px] text-[#9CA3AF]" />
              </button>
              {jobTypeOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)] z-50 overflow-hidden py-1">
                  <button
                    onMouseDown={() => { onJobTypeChange(""); setJobTypeOpen(false); }}
                    className={cn(
                      "flex items-center w-full px-3 py-1.5 text-[12.5px] transition-colors",
                      !selectedJobType ? "font-semibold text-primary bg-primary/5" : "text-foreground hover:bg-[#F5F6F8]"
                    )}
                  >
                    All Types
                  </button>
                  {jobTypes.map((jt) => (
                    <button
                      key={jt}
                      onMouseDown={() => { onJobTypeChange(jt); setJobTypeOpen(false); }}
                      className={cn(
                        "flex items-center w-full px-3 py-1.5 text-[12.5px] transition-colors",
                        selectedJobType === jt ? "font-semibold text-primary bg-primary/5" : "text-foreground hover:bg-[#F5F6F8]"
                      )}
                    >
                      {jt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button className="bg-primary hover:bg-primary/90 text-white text-[12px] font-bold tracking-[0.04em] px-4 py-2 rounded-lg transition-colors shrink-0 uppercase w-full sm:w-auto">
          Start Searching
        </button>
      </div>
    </div>
  );
}
