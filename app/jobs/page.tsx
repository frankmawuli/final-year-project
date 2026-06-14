"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { jobsService, type PublicJobListItem } from "@/services/jobs.service";
import { PUBLIC_TYPE_LABEL, PUBLIC_LOCATION_LABEL } from "@/components/jobs/constants";
import {
  Search,
  MapPin,
  Bookmark,
  ChevronRight,
  ChevronDown,
  Code2,
  Megaphone,
  ChartNoAxesCombined,
  Headphones,
  Package,
  Wallet,
  Users,
  LayoutGrid,
  CheckSquare,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Brush,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", active: true ,link: "/jobs"},
  { label: "Jobs", dropdown: true, link: "/jobs/job-listing" },
  { label: "Companies", link: "/companies" },
  { label: "Career Tips", link: "/career-tips" },
  { label: "About Us", link: "/about-us" },
];

const CATEGORIES = [
  { Icon: Code2, name: "Development", count: "12,540 Jobs" },
  { Icon: Brush, name: "Design", count: "8,430 Jobs" },
  { Icon: Megaphone, name: "Marketing", count: "6,210 Jobs" },
  { Icon: ChartNoAxesCombined, name: "Sales", count: "4,890 Jobs" },
  { Icon: Headphones, name: "Customer Support", count: "3,120 Jobs" },
  { Icon: Package, name: "Product", count: "2,980 Jobs" },
  { Icon: Wallet, name: "Finance", count: "2,450 Jobs" },
  { Icon: Users, name: "HR & Admin", count: "1,980 Jobs" },
];

const FEATURES = [
  {
    Icon: Search,
    title: "Easy Job Search",
    desc: "Find jobs that match your skills and preferences.",
  },
  {
    Icon: LayoutGrid,
    title: "Verified Employers",
    desc: "All companies are verified to ensure trust and safety.",
  },
  {
    Icon: CheckSquare,
    title: "Apply Effortlessly",
    desc: "Apply in just a few clicks with your profile.",
  },
  {
    Icon: MapPin,
    title: "Career Resources",
    desc: "Get tips and resources to accelerate your career.",
  },
];


const POPULAR_SEARCHES = ["Designer", "Developer", "Marketing", "Sales", "Remote"];

const LOGO_COLORS = ["#22c55e", "#14b8a6", "#f97316", "#3b82f6", "#8b5cf6", "#ec4899"]
function logoColor(initials: string): string {
  let h = 0
  for (const c of initials) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  return LOGO_COLORS[Math.abs(h) % LOGO_COLORS.length]
}

const FOOTER_LINKS: Record<string, string[]> = {
  "For Job Seekers": ["Browse Jobs", "Create Profile", "Career Tips", "Job Alerts"],
  "For Employers": ["Post a Job", "Browse Candidates", "Pricing", "Employer Resources"],
  Company: ["About Us", "Contact Us", "Careers", "Blog"],
  Support: ["Help Center", "Privacy Policy", "Terms of Service", "Cookies Policy"],
};

const AVATAR_COLORS = ["bg-orange-400", "bg-blue-400", "bg-green-400"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const [keyword,       setKeyword]       = useState("");
  const [location,      setLocation]      = useState("");
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [popularJobs,   setPopularJobs]   = useState<PublicJobListItem[]>([]);
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    jobsService.listPublic({ per_page: 4 })
      .then((res) => setPopularJobs(res.data))
      .catch(() => null);
  }, []);

  const filteredDropdown = keyword
    ? popularJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(keyword.toLowerCase()) ||
          j.company.name.toLowerCase().includes(keyword.toLowerCase()) ||
          j.tags.some((t) => t.toLowerCase().includes(keyword.toLowerCase()))
      )
    : popularJobs;

  return (
    <div className="min-h-screen bg-white font-sans text-foreground antialiased">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Logo */}
          <Link href="/jobs" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm leading-none">C</span>
            </div>
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
              href="#"
              className="hidden md:block text-[13.5px] font-medium text-foreground hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              href="#"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-[13.5px] font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors"
            >
              Post a Job
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
                href="#"
                onClick={() => setShowMobileNav(false)}
                className="block py-2.5 px-2 text-[14px] font-medium text-foreground hover:text-primary transition-colors"
              >
                Login
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-card pt-10 sm:pt-16 pb-12 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-10 lg:gap-16">
          {/* Left */}
          <div className="flex-1 min-w-0 max-w-[580px]">
            {/* Pill badge */}
            <div className="inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              Find the right job. Build your future.
            </div>

            {/* Headline */}
            <h1 className="text-[30px] sm:text-[38px] lg:text-[48px] leading-[1.15] font-bold text-foreground mb-4">
              Find Jobs That
              <br />
              <span className="text-primary">Match Your Future</span>
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-9">
              Discover opportunities, grow your skills, and
              <br className="hidden sm:block" />
              build the career you've always wanted.
            </p>

            {/* Search bar */}
            <div className="relative mb-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-card shadow-[0_4px_24px_0_rgba(0,0,0,0.08)] border border-border rounded-xl p-1.5 gap-1">
              <div className="flex items-center gap-2 flex-1 px-3 py-2 sm:py-1.5">
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
              <div className="sm:hidden h-px bg-border mx-2" />
              <div className="flex items-center gap-2 flex-1 px-3 py-2 sm:py-1.5">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 text-[13.5px] outline-none bg-transparent text-foreground placeholder:text-muted-foreground min-w-0"
                />
              </div>
              <div className="sm:hidden h-px bg-border mx-2" />
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-[13.5px] font-semibold px-5 py-2.5 rounded-lg transition-colors sm:shrink-0 w-full sm:w-auto">
                Search Jobs
              </button>
            </div>

            {/* Keyword dropdown */}
            {showDropdown && filteredDropdown.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                {filteredDropdown.map((job) => (
                  <button
                    key={job.id}
                    onMouseDown={() => { setKeyword(job.title); setShowDropdown(false); }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] text-muted-foreground font-medium">
                Popular Searches:
              </span>
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  className="text-xs text-muted-foreground border border-border hover:border-primary hover:text-primary px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right – illustration */}
          <div className="hidden lg:flex flex-1 relative justify-center items-center min-h-[460px]">
            {/* Dot grid top-right */}
            <div className="absolute top-6 right-14 grid grid-cols-5 gap-2 opacity-40 pointer-events-none">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-[5px] h-[5px] rounded-full bg-primary" />
              ))}
            </div>

            {/* Plus sign */}
            <span className="absolute top-8 right-2 text-2xl font-light text-muted-foreground/50 pointer-events-none">
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
              src="/assets/girl-with-laptop.png"
              alt="Hero Person"
              width={500}
              height={500}
              className="object-cover"
            />

            {/* Floating card */}
            <div className="absolute bottom-10 right-0 z-20 bg-card shadow-2xl rounded-xl p-3.5 flex items-center gap-3 w-[230px]">
              <div className="flex -space-x-2 shrink-0">
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

      {/* ── Top Categories ──────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white lg:my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section title */}
          <div className="text-center mb-10">
            <h2 className="text-[22px] font-bold text-foreground">Top Categories</h2>
            <div className="w-10 h-[3px] bg-primary rounded-full mx-auto mt-2" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(({ Icon, name, count }) => (
              <Link
                key={name}
                href="#"
                className="group flex items-center gap-4 p-5 rounded-xl border border-border bg-card "
              >
                <div className="w-12 h-12 rounded-xl  flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-[22px] h-[22px] text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-foreground leading-tight">
                    {name}
                  </p>
                  <p className="text-[11.5px] text-muted-foreground mt-0.5">{count}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Browse link */}
          <div className="text-center mt-8">
            <Link
              href="#"
              className="inline-flex items-center gap-1 text-[13.5px] font-medium text-primary hover:underline"
            >
              Browse All Categories
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section className="py-6 bg-white my-12 sm:my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-primary/10 rounded-2xl px-4 sm:px-10 py-8 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {FEATURES.map(({ Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-card shadow-sm flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-[13.5px] font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Jobs ─────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white lg:my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-[22px] font-bold text-foreground">Popular Jobs</h2>
              <div className="w-10 h-[3px] bg-primary rounded-full mt-2" />
            </div>
            <Link
              href="jobs/job-listing"
              className="inline-flex items-center gap-1 text-[13.5px] font-medium text-primary hover:underline"
            >
              View All Jobs
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularJobs.map((job) => (
              <Link
                key={job.id}
                href={`/apply/${job.id}`}
                className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all cursor-pointer block"
              >
                {/* Company row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    {job.company.logo_url ? (
                      <img
                        src={job.company.logo_url}
                        alt={job.company.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: logoColor(job.company.initials) }}
                      >
                        <span className="text-white font-bold text-[11px]">{job.company.initials}</span>
                      </div>
                    )}
                    <span className="text-[11.5px] text-muted-foreground font-medium">
                      {job.company.name}
                    </span>
                  </div>
                  <button
                    className="text-muted-foreground/50 hover:text-primary transition-colors mt-0.5"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-[14px] font-semibold text-foreground mb-1">{job.title}</h3>
                <p className="text-[11.5px] text-muted-foreground mb-3">
                  {PUBLIC_TYPE_LABEL[job.employment.type]} · {PUBLIC_LOCATION_LABEL[job.location.arrangement]}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10.5px] text-primary bg-primary/10 px-2.5 py-0.5 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Salary + date */}
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-semibold text-foreground">
                    {job.compensation.display}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {job.meta.posted_at
                      ? new Date(job.meta.posted_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "—"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl bg-primary py-10 sm:py-12 px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Dot pattern overlay */}
            <div
              className="absolute inset-y-0 left-0 w-40 pointer-events-none"
              aria-hidden="true"
            >
              <div className="grid grid-cols-7 gap-2.5 p-5 opacity-[0.18]">
                {Array.from({ length: 56 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-[20px] font-bold text-primary-foreground mb-1.5">
                Ready to take the next step in your career?
              </h2>
              <p className="text-primary-foreground/80 text-[13.5px]">
                Create your profile and get matched with the best opportunities.
              </p>
            </div>
            <button className="relative z-10 shrink-0 bg-primary-foreground text-primary font-semibold text-[13.5px] px-6 py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors flex items-center gap-2">
              Create Profile
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-card border-t border-border pt-10 sm:pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 mb-10">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm leading-none">C</span>
                </div>
                <span className="font-semibold text-[14px] text-foreground">
                  CoreRecruiter Jobs
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-5">
                Connecting talent with opportunities. Building better futures together.
              </p>
              <div className="flex items-center gap-2.5">
                {[Facebook, Linkedin, Twitter, Instagram].map((Icon, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="w-7 h-7 rounded-full bg-secondary hover:bg-primary text-muted-foreground hover:text-primary-foreground flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-[13px] font-semibold text-foreground mb-4">{heading}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-[12px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border pt-6 text-center">
            <p className="text-[11.5px] text-muted-foreground">
              © 2024 CoreRecruiter Jobs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
