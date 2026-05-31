"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ArrowRight,
  Play,
  CheckCircle2,
  Users,
  UserPlus,
  DollarSign,
  BarChart3,
  TrendingUp,
  Zap,
  Briefcase,
  Send,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Star,
  Building2,
  Globe,
  Cloud,
  ChevronRight,
  Award,
} from "lucide-react";

const navLinks = [
  { label: "Product", hasDropdown: true },
  { label: "Solutions", hasDropdown: true },
  { label: "Resources", hasDropdown: true },
  { label: "Pricing", hasDropdown: false },
  { label: "Company", hasDropdown: true },
];

const features = [
  {
    icon: Briefcase,
    title: "Recruitment & ATS",
    desc: "Post jobs, track candidates, and hire the best talent faster with AI.",
  },
  {
    icon: Users,
    title: "Employee Management",
    desc: "Centralize employee data, documents, and lifecycle management.",
  },
  {
    icon: UserPlus,
    title: "Onboarding",
    desc: "Create a great first impression with smooth onboarding workflows.",
  },
  {
    icon: DollarSign,
    title: "Payroll & Benefits",
    desc: "Automate payroll, taxes, benefits, and compliance with accuracy.",
  },
  {
    icon: TrendingUp,
    title: "Performance",
    desc: "Set goals, track progress, and build high-performing teams.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    desc: "Make data-driven decisions with powerful insights and visual reports.",
  },
];

const companies = [
  { name: "TechNova", icon: Zap },
  { name: "BrightFuture", icon: Globe },
  { name: "InnovateLab", icon: Award },
  { name: "DataBridge", icon: BarChart3 },
  { name: "CloudScale", icon: Cloud },
  { name: "VoltEdge", icon: Zap },
];

const platformStats = [
  { value: "1,000+", label: "Companies Trust Us", icon: Building2 },
  { value: "50,000+", label: "Active Users", icon: Users },
  { value: "200K+", label: "Hires Made", icon: Briefcase },
  { value: "98%", label: "Customer Satisfaction", icon: Star },
];

const metrics = [
  { title: "AI Candidate Match", value: "92%", label: "Match Accuracy", pct: 92 },
  { title: "Time to Hire", value: "28%", label: "Faster", pct: 28 },
  { title: "Offer Acceptance", value: "85%", label: "Acceptance Rate", pct: 85 },
  { title: "Employee Retention", value: "90%", label: "Retention Rate", pct: 90 },
];

const kpis = [
  { label: "Open Positions", val: "24", change: "+12% from last month" },
  { label: "New Candidates", val: "156", change: "+38% from last month" },
  { label: "Interviews Today", val: "8", change: "+6% from yesterday" },
  { label: "Employees", val: "342", change: "+6% from last month" },
];

const recentActivity = [
  "Frontend Developer position has 12 new applications",
  "Interview scheduled with John Smith",
  "New hire Michael Brown joined the team",
  "Offer accepted by Emily Davis",
];

const sidebarItems = [
  "Dashboard",
  "Jobs",
  "Candidates",
  "Interviews",
  "Employees",
  "Payroll",
  "Performance",
  "Reports",
  "Settings",
];

function DashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-white">
            C
          </div>
          <span className="text-xs font-bold text-gray-800">CoreRecruiter</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-4 w-4 rounded-full bg-gray-100" />
            <div className="h-4 w-4 rounded-full bg-gray-100" />
          </div>
          <div className="flex items-center gap-1.5 border-l border-gray-100 pl-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary">
              SJ
            </div>
            <div>
              <div className="text-[9px] font-semibold text-gray-700">Sarah Johnson</div>
              <div className="text-[8px] text-gray-400">HR Manager</div>
            </div>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex h-[300px] md:h-[340px]">
        {/* Sidebar */}
        <div className="w-[92px] flex-shrink-0 border-r border-gray-100 bg-white py-2">
          {sidebarItems.map((item, i) => (
            <div
              key={item}
              className={cn(
                "cursor-pointer px-3 py-1.5 text-[9px]",
                i === 0
                  ? "border-r-2 border-primary bg-primary/10 font-semibold text-primary"
                  : "text-gray-400"
              )}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden bg-gray-50/60 p-3">
          <div className="mb-2.5">
            <div className="text-[11px] font-bold text-gray-800">Welcome back, Sarah! 👋</div>
            <div className="text-[8px] text-gray-400">
              Here&apos;s what&apos;s happening with your organization today.
            </div>
          </div>

          {/* KPI cards */}
          <div className="mb-2.5 grid grid-cols-4 gap-1.5">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-gray-100 bg-white p-2">
                <div className="text-[7.5px] text-gray-400">{kpi.label}</div>
                <div className="text-[14px] font-bold text-gray-800">{kpi.val}</div>
                <div className="text-[7px] font-medium text-green-500">{kpi.change}</div>
              </div>
            ))}
          </div>

          {/* Chart + Activity row */}
          <div className="grid grid-cols-5 gap-1.5">
            {/* Line chart */}
            <div className="col-span-3 rounded-lg border border-gray-100 bg-white p-2">
              <div className="mb-1 flex items-center justify-between">
                <div className="text-[9px] font-semibold text-gray-700">Hiring Overview</div>
                <div className="text-[7.5px] text-gray-400">This Month ▾</div>
              </div>
              <svg viewBox="0 0 180 55" className="h-14 w-full">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F6EF7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4F6EF7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 42 L 30 32 L 60 36 L 90 16 L 120 24 L 150 8 L 180 14 L 180 55 L 0 55 Z"
                  fill="url(#chartGrad)"
                />
                <polyline
                  fill="none"
                  stroke="#4F6EF7"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points="0,42 30,32 60,36 90,16 120,24 150,8 180,14"
                />
                {([
                  [0, 42],
                  [30, 32],
                  [60, 36],
                  [90, 16],
                  [120, 24],
                  [150, 8],
                  [180, 14],
                ] as [number, number][]).map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill="white"
                    stroke="#4F6EF7"
                    strokeWidth="1"
                  />
                ))}
              </svg>
              <div className="flex justify-between text-[7px] text-gray-300">
                {["May 1", "May 8", "May 15", "May 22", "May 29"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="col-span-2 rounded-lg border border-gray-100 bg-white p-2">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="text-[9px] font-semibold text-gray-700">Recent Activity</div>
                <div className="cursor-pointer text-[7.5px] font-medium text-primary">View all</div>
              </div>
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-1.5 border-b border-gray-50 py-1 last:border-0">
                  <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <div className="text-[7.5px] leading-tight text-gray-500">{activity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  label,
  pct,
}: {
  title: string;
  value: string;
  label: string;
  pct: number;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-1 text-xs text-gray-400">{title}</div>
      <div className="text-[28px] font-bold leading-none text-gray-900">{value}</div>
      <div className="mb-3 mt-0.5 text-xs text-gray-400">{label}</div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function FooterCol({ heading, links }: { heading: string; links: string[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-gray-900">{heading}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              C
            </div>
            <span className="text-sm font-bold text-gray-900">CoreRecruiter</span>
          </Link>

          <nav className="hidden items-center md:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-sm text-gray-600" asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
              Request Demo
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-white pb-20 pt-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left */}
            <div>
              <div className="mb-5 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                AI-Powered HR &amp; Recruitment Platform
              </div>
              <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight lg:text-[3.5rem]">
                <span className="block text-gray-900">Hire Better.</span>
                <span className="block text-primary">Manage Smarter.</span>
                <span className="block text-gray-900">Grow Together.</span>
              </h1>
              <p className="mb-8 max-w-md text-base leading-relaxed text-gray-500">
                CoreRecruiter helps HR teams attract top talent, streamline hiring, onboard
                employees, and manage your entire workforce in one intelligent platform.
              </p>
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <Button className="h-11 gap-2 bg-primary px-6 text-white hover:bg-primary/90">
                  Request Demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-11 gap-2.5 border-gray-200 px-5 text-gray-700 hover:bg-gray-50"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Play className="h-3 w-3 fill-primary text-primary" />
                  </span>
                  Explore Features
                </Button>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-gray-500">
                {["AI-Powered Hiring", "End-to-End HR", "Secure & Scalable"].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — dashboard preview */}
            <div className="relative">
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-primary/5 via-blue-50/40 to-indigo-50/60" />
              <div className="relative">
                <DashboardMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ──────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-8 text-center text-sm text-gray-400">
            Trusted by 1,000+ companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {companies.map(({ name, icon: Icon }) => (
              <div
                key={name}
                className="flex items-center gap-2 text-gray-400 transition-colors hover:text-gray-600"
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-semibold tracking-wide">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              A Complete Platform for Modern HR Teams
            </h2>
            <p className="text-base text-gray-500">
              Everything you need to hire, manage, and grow your workforce.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-500">{desc}</p>
                <button className="flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ──────────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left */}
            <div>
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
                Why Choose CoreRecruiter
              </div>
              <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-900">
                Smarter Tools.
                <br />
                Stronger Teams.
                <br />
                Better Results.
              </h2>
              <p className="mb-8 max-w-md text-base leading-relaxed text-gray-500">
                CoreRecruiter combines AI, automation, and human-centric design to help
                organizations achieve more.
              </p>
              <Button className="h-10 gap-2 bg-primary text-white hover:bg-primary/90">
                See How It Works
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Right — metric cards */}
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m) => (
                <MetricCard key={m.title} {...m} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ────────────────────────────────────── */}
      <section className="bg-primary py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 text-center text-white lg:grid-cols-4">
            {platformStats.map(({ value, label, icon: Icon }) => (
              <div key={label}>
                <Icon className="mx-auto mb-3 h-7 w-7 opacity-80" />
                <div className="text-4xl font-bold">{value}</div>
                <div className="mt-1 text-sm text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 px-10 py-14">
            {/* Decorative dot grid — left */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-44 opacity-[0.07]">
              <div className="grid h-full grid-cols-5 gap-3 p-8">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary" />
                ))}
              </div>
            </div>
            {/* Decorative dot grid — right */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-44 opacity-[0.07]">
              <div className="grid h-full grid-cols-5 gap-3 p-8">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary" />
                ))}
              </div>
            </div>

            <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="text-center md:text-left">
                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                  Ready to transform your HR operations?
                </h2>
                <p className="text-base text-gray-500">
                  Join thousands of HR teams already using CoreRecruiter.
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-wrap gap-3">
                <Button className="h-11 bg-primary px-6 text-white hover:bg-primary/90">
                  Request Demo
                </Button>
                <Button
                  variant="outline"
                  className="h-11 border-gray-200 px-6 text-gray-700 hover:bg-gray-50"
                >
                  Talk to Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-7">
            {/* Brand — spans 2 cols on lg */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <Link href="/" className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                  C
                </div>
                <span className="text-sm font-bold text-gray-900">CoreRecruiter</span>
              </Link>
              <p className="mb-6 max-w-[200px] text-sm leading-relaxed text-gray-500">
                The all-in-one recruitment platform that helps you hire better, manage smarter, and
                grow together.
              </p>
              <div className="flex gap-2.5">
                {[Linkedin, Facebook, Twitter, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            <FooterCol
              heading="Product"
              links={["Features", "Pricing", "Integrations", "What's New"]}
            />
            <FooterCol
              heading="Solutions"
              links={["Recruitment", "HR Management", "Payroll", "Small Business"]}
            />
            <FooterCol
              heading="Resources"
              links={["Blog", "Help Center", "Guides", "Webinars"]}
            />
            <FooterCol
              heading="Company"
              links={["About Us", "Careers", "Contact Us", "Partners"]}
            />

            {/* Newsletter */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">Newsletter</h4>
              <p className="mb-4 text-sm leading-relaxed text-gray-500">
                Get the latest updates and HR insights straight to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-9 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  size="icon"
                  className="h-9 w-9 flex-shrink-0 bg-primary text-white hover:bg-primary/90"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 md:flex-row">
            <p className="text-xs text-gray-400">© 2024 CoreRecruiter. All rights reserved.</p>
            <div className="flex flex-wrap gap-5">
              {["Privacy Policy", "Terms of Service", "Security", "Cookies Settings"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-xs text-gray-400 transition-colors hover:text-gray-700"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
