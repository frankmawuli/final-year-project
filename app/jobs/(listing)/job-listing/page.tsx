"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Loader2, SlidersHorizontal } from "lucide-react";
import {
  EMPLOYMENT_TYPES,
  SENIORITY_LEVELS,
  EMPLOYMENT_MAP,
  SENIORITY_MAP,
} from "./data";
import { SearchBar } from "@/components/jobs/search-bar";
import { JobSidebar } from "@/components/jobs/job-sidebar";
import { JobCard } from "@/components/jobs/job-card";
import {
  jobsService,
  type PublicJobListItem,
  type PublicJobType,
  type PublicJobLevel,
} from "@/services/jobs.service";
import { PUBLIC_TYPE_LABEL } from "@/components/jobs/constants";

export default function JobListingPage() {
  const [jobs,       setJobs]       = useState<PublicJobListItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);

  const [showFilters,       setShowFilters]       = useState(false);
  const [searchTags,        setSearchTags]        = useState<string[]>([]);
  const [employmentFilters, setEmploymentFilters] = useState(
    EMPLOYMENT_TYPES.map((f) => ({ ...f, checked: false }))
  );
  const [seniorityFilters, setSeniorityFilters] = useState(
    SENIORITY_LEVELS.map((f) => ({ ...f, checked: false }))
  );
  const [minSalary,       setMinSalary]       = useState(0);
  const [maxSalary,       setMaxSalary]       = useState(500000);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  const keyword = searchTags.length > 0 ? searchTags.join(" ") : undefined;

  const fetchJobs = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await jobsService.listPublic({
          keyword,
          salary_min: minSalary > 0 ? minSalary : undefined,
          page:       pageNum,
          per_page:   12,
        });
        setJobs(res.data);
        setPage(res.pagination.page);
        setTotalPages(res.pagination.total_pages);
        setTotal(res.pagination.total);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    },
    [keyword, minSalary],
  );

  useEffect(() => { fetchJobs(1); }, [fetchJobs]);

  // ── Client-side filtering ──────────────────────────────────────────────────
  const checkedTypes: PublicJobType[] = employmentFilters
    .filter((f) => f.checked)
    .map((f) => EMPLOYMENT_MAP[f.label]);

  const checkedLevels: PublicJobLevel[] = seniorityFilters
    .filter((f) => f.checked)
    .flatMap((f) => SENIORITY_MAP[f.label]);

  const filteredJobs = jobs.filter((job) => {
    if (checkedTypes.length  > 0 && !checkedTypes.includes(job.employment.type))             return false;
    if (checkedLevels.length > 0 && !checkedLevels.includes(job.employment.experience_level)) return false;
    if (job.compensation.min !== null && job.compensation.min > maxSalary)                    return false;
    if (selectedCountry) {
      if ((job.location.country ?? "").toLowerCase() !== selectedCountry.toLowerCase())       return false;
    }
    if (selectedJobType) {
      if (EMPLOYMENT_MAP[selectedJobType] && job.employment.type !== EMPLOYMENT_MAP[selectedJobType]) return false;
    }
    return true;
  });

  // ── Derive SearchBar options from live data ────────────────────────────────
  const uniqueCountries = Array.from(
    new Set(jobs.map((j) => j.location.country).filter(Boolean) as string[])
  ).sort();

  const uniqueJobTypes = Array.from(
    new Set(jobs.map((j) => PUBLIC_TYPE_LABEL[j.employment.type]))
  ).sort();

  const allJobTitles = Array.from(new Set(jobs.map((j) => j.title)));

  function addTag(title: string) {
    if (!searchTags.includes(title)) setSearchTags((p) => [...p, title]);
  }
  function removeTag(tag: string) {
    setSearchTags((p) => p.filter((t) => t !== tag));
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

  return (
    <>
      <SearchBar
        searchTags={searchTags}
        allJobTitles={allJobTitles}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedJobType={selectedJobType}
        onJobTypeChange={setSelectedJobType}
        onAddTag={addTag}
        onRemoveTag={removeTag}
        countries={uniqueCountries}
        jobTypes={uniqueJobTypes}
      />

      <div className="max-w-[1340px] mx-auto px-3 sm:px-5 py-5 flex flex-col md:flex-row gap-5">
        {/* Sidebar – hidden on mobile unless filter toggle is active */}
        <div
          className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-52.5 md:shrink-0 md:sticky md:top-6 md:self-start md:max-h-[calc(100vh-3rem)] md:overflow-y-auto`}
        >
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
        </div>

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[22px] font-bold text-foreground leading-tight">
              {loading ? "Loading…" : `${total} ${total === 1 ? "Job" : "Jobs"} Found`}
            </h1>
            <div className="flex items-center gap-1.5">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters((o) => !o)}
                className="md:hidden flex items-center gap-1 text-[12.5px] font-medium text-foreground border border-border bg-card px-2.5 py-1 rounded-lg"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
              <div className="flex items-center gap-1 text-[12.5px]">
                <span className="text-muted-foreground hidden sm:inline">Sort by:</span>
                <button className="flex items-center gap-1 text-foreground font-semibold hover:text-primary transition-colors">
                  Newest Post
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[15px] font-semibold text-rose-600 mb-1">Failed to load jobs</p>
              <p className="text-[13px] text-muted-foreground">{error}</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-10 h-10 text-muted-foreground mb-2.5" />
              <p className="text-[15px] font-semibold text-foreground mb-1">No jobs match your filters</p>
              <p className="text-[13px] text-muted-foreground">Try adjusting your search or clearing some filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-6">
                  <button
                    onClick={() => fetchJobs(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-card border border-border disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[12.5px] text-muted-foreground px-1.5">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => fetchJobs(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-card border border-border disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
