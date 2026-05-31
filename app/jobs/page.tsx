"use client";

import { useState } from "react";
import Link from "next/link";
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

const JOBS = [
  {
    company: "Uiverse",
    initials: "UI",
    bg: "bg-[#22c55e]",
    title: "Product Designer",
    type: "Full-time • Remote",
    tags: ["Figma", "UI/UX", "Design"],
    salary: "$60k – $80k",
    posted: "5d ago",
  },
  {
    company: "TechNova",
    initials: "TN",
    bg: "bg-[#14b8a6]",
    title: "Frontend Developer",
    type: "Full-time • Hybrid",
    tags: ["React", "TypeScript", "Tailwind"],
    salary: "$70k – $95k",
    posted: "1d ago",
  },
  {
    company: "BrightLine",
    initials: "BL",
    bg: "bg-[#f97316]",
    title: "Digital Marketing Specialist",
    type: "Full-time • Remote",
    tags: ["SEO", "Google Ads", "Analytics"],
    salary: "$50k – $70k",
    posted: "3d ago",
  },
  {
    company: "DataSphere",
    initials: "DS",
    bg: "bg-[#3b82f6]",
    title: "Data Analyst",
    type: "Full-time • On-site",
    tags: ["SQL", "Python", "Tableau"],
    salary: "$50k – $75k",
    posted: "2d ago",
  },
];

const POPULAR_SEARCHES = ["Designer", "Developer", "Marketing", "Sales", "Remote"];

const FOOTER_LINKS: Record<string, string[]> = {
  "For Job Seekers": ["Browse Jobs", "Create Profile", "Career Tips", "Job Alerts"],
  "For Employers": ["Post a Job", "Browse Candidates", "Pricing", "Employer Resources"],
  Company: ["About Us", "Contact Us", "Careers", "Blog"],
  Support: ["Help Center", "Privacy Policy", "Terms of Service", "Cookies Policy"],
};

const AVATAR_COLORS = ["bg-orange-400", "bg-blue-400", "bg-green-400"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredJobs = keyword
    ? JOBS.filter(
        (j) =>
          j.title.toLowerCase().includes(keyword.toLowerCase()) ||
          j.company.toLowerCase().includes(keyword.toLowerCase()) ||
          j.tags.some((t) => t.toLowerCase().includes(keyword.toLowerCase()))
      )
    : JOBS;

  return (
    <div className="min-h-screen bg-white font-sans text-foreground antialiased">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/jobs" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm leading-none">C</span>
            </div>
            <span className="font-semibold text-[15px] text-foreground">
              CoreRecruiter Jobs
            </span>
          </Link>

          {/* Nav links */}
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
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="#"
              className="text-[13.5px] font-medium text-foreground hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              href="#"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-[13.5px] font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-card pt-16 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-10 lg:gap-16">
          {/* Left */}
          <div className="flex-1 min-w-0 max-w-[580px]">
            {/* Pill badge */}
            <div className="inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              Find the right job. Build your future.
            </div>

            {/* Headline */}
            <h1 className="text-[42px] lg:text-[48px] leading-[1.15] font-bold text-foreground mb-4">
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
            <div className="flex items-center bg-card shadow-[0_4px_24px_0_rgba(0,0,0,0.08)] border border-border rounded-xl p-1.5 gap-1">
              <div className="flex items-center gap-2 flex-1 px-3 py-1.5">
                <Search className="w-4 h-4 text-muted-foreground shrink-0 " />
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
              <div className="w-px h-8 bg-border shrink-0" />
              <div className="flex items-center gap-2 flex-1 px-3 py-1.5">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 text-[13.5px] outline-none bg-transparent text-foreground placeholder:text-muted-foreground min-w-0"
                />
              </div>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-[13.5px] font-semibold px-5 py-2.5 rounded-lg transition-colors shrink-0">
                Search Jobs
              </button>
            </div>

            {/* Keyword dropdown */}
            {showDropdown && filteredJobs.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                {filteredJobs.map((job) => (
                  <button
                    key={job.title + job.company}
                    onMouseDown={() => { setKeyword(job.title); setShowDropdown(false); }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${job.bg}`}>
                      <span className="text-[10px] font-bold text-white">{job.initials}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-medium text-foreground">{job.title}</p>
                      <p className="text-[11.5px] text-muted-foreground">{job.company} · {job.type}</p>
                    </div>
                    <span className="shrink-0 text-[12px] font-semibold text-foreground">{job.salary}</span>
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
      <section className="py-16 bg-white  lg:my-20">
        <div className="max-w-7xl mx-auto px-6">
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
      <section className="py-6 bg-white my-20 ">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-primary/10 rounded-2xl px-10 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
      <section className="py-16 bg-white  lg:my-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-[22px] font-bold text-foreground">Popular Jobs</h2>
              <div className="w-10 h-[3px] bg-primary rounded-full mt-2" />
            </div>
            <Link
              href="#"
              className="inline-flex items-center gap-1 text-[13.5px] font-medium text-primary hover:underline"
            >
              View All Jobs
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {JOBS.map((job) => (
              <div
                key={job.title + job.company}
                className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all cursor-pointer"
              >
                {/* Company row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl ${job.bg} flex items-center justify-center shrink-0`}
                    >
                      <span className="text-white font-bold text-[11px]">
                        {job.initials}
                      </span>
                    </div>
                    <span className="text-[11.5px] text-muted-foreground font-medium">
                      {job.company}
                    </span>
                  </div>
                  <button className="text-muted-foreground/50 hover:text-primary transition-colors mt-0.5">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-[14px] font-semibold text-foreground mb-1">{job.title}</h3>
                <p className="text-[11.5px] text-muted-foreground mb-3">{job.type}</p>

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
                    {job.salary}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{job.posted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl bg-primary py-12 px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
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
      <footer className="bg-card border-t border-border pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-10">
            {/* Brand column */}
            <div className="md:col-span-1">
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
