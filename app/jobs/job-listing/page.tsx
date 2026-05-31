"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import {
  JOBS,
  EMPLOYMENT_TYPES,
  SENIORITY_LEVELS,
  EMPLOYMENT_MAP,
  SENIORITY_MAP,
  parseSalary,
} from "./data";
import { SearchBar } from "./components/SearchBar";
import { JobSidebar } from "./components/JobSidebar";
import { JobCard } from "./components/JobCard";

export default function JobListingPage() {
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [employmentFilters, setEmploymentFilters] = useState(
    EMPLOYMENT_TYPES.map((f) => ({ ...f, checked: false }))
  );
  const [seniorityFilters, setSeniorityFilters] = useState(
    SENIORITY_LEVELS.map((f) => ({ ...f, checked: false }))
  );
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(500000);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  const allJobTitles = Array.from(new Set(JOBS.map((j) => j.title)));

  function addTag(title: string) {
    if (!searchTags.includes(title)) setSearchTags((prev) => [...prev, title]);
  }

  function removeTag(tag: string) {
    setSearchTags((prev) => prev.filter((t) => t !== tag));
  }

  function resetFilters() {
    setSearchTags([]);
    setEmploymentFilters(EMPLOYMENT_TYPES.map((f) => ({ ...f, checked: false })));
    setSeniorityFilters(SENIORITY_LEVELS.map((f) => ({ ...f, checked: false })));
    setMinSalary(0);
    setMaxSalary(500000);
    setSelectedCountry("");
    setSelectedJobType("");
  }

  const checkedEmployment = employmentFilters
    .filter((f) => f.checked)
    .map((f) => EMPLOYMENT_MAP[f.label]);

  const checkedSeniority = seniorityFilters
    .filter((f) => f.checked)
    .flatMap((f) => SENIORITY_MAP[f.label]);

  const filteredJobs = JOBS.filter((job) => {
    if (searchTags.length > 0) {
      const t = job.title.toLowerCase();
      if (!searchTags.some((tag) => t.includes(tag.toLowerCase()))) return false;
    }
    if (checkedEmployment.length > 0) {
      if (!checkedEmployment.some((kw) => job.jobType.toLowerCase().includes(kw))) return false;
    }
    if (checkedSeniority.length > 0) {
      if (!checkedSeniority.some((kw) => job.level.toLowerCase().includes(kw))) return false;
    }
    const sal = parseSalary(job.salary);
    if (sal < minSalary || sal > maxSalary) return false;
    if (selectedCountry) {
      const country = job.location.split(",")[0].trim().toUpperCase();
      if (country !== selectedCountry.toUpperCase()) return false;
    }
    if (selectedJobType) {
      if (!job.jobType.toLowerCase().includes(selectedJobType.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <SearchBar
        searchTags={searchTags}
        allJobTitles={allJobTitles}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedJobType={selectedJobType}
        onJobTypeChange={setSelectedJobType}
        onAddTag={addTag}
        onRemoveTag={removeTag}
      />

      <div className="max-w-[1340px] mx-auto px-6 py-6 flex gap-6">
        <JobSidebar
          employmentFilters={employmentFilters}
          onEmploymentChange={(idx, v) =>
            setEmploymentFilters((prev) =>
              prev.map((item, i) => (i === idx ? { ...item, checked: v } : item))
            )
          }
          seniorityFilters={seniorityFilters}
          onSeniorityChange={(idx, v) =>
            setSeniorityFilters((prev) =>
              prev.map((item, i) => (i === idx ? { ...item, checked: v } : item))
            )
          }
          minSalary={minSalary}
          maxSalary={maxSalary}
          onMinSalaryChange={setMinSalary}
          onMaxSalaryChange={setMaxSalary}
          onReset={resetFilters}
        />

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-[22px] font-bold text-foreground leading-tight">
              {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
            </h1>
            <div className="flex items-center gap-1.5 text-[12.5px]">
              <span className="text-[#9CA3AF]">Sort by:</span>
              <button className="flex items-center gap-1 text-foreground font-semibold hover:text-primary transition-colors">
                Newest Post
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-10 h-10 text-[#D1D5DB] mb-3" />
                <p className="text-[15px] font-semibold text-foreground mb-1">
                  No jobs match your filters
                </p>
                <p className="text-[13px] text-[#9CA3AF]">
                  Try adjusting your search or clearing some filters.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
