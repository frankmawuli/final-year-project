"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Brain,
  Briefcase,
  Users,
  CalendarCheck,
  BarChart3,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Zap,
  Star,
  Menu,
  X,
  TrendingUp,
  Clock,
  Shield,
  DollarSign,
  FileText,
  Calendar,
  UserCheck,
  Sparkles,
  Building2,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
// ── Navbar ────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-[#4F6EF7]">
            <span className="text-sm font-bold text-white">C</span>
          </div>
          <span className="text-base font-bold text-[#1f2937]">Core Recruiter</span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {["Features", "How it Works", "Pricing", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-[#6b7280] transition-colors hover:text-[#1f2937]"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-[#4b5563] transition-colors hover:bg-[#f3f4f6] hover:text-[#1f2937]"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-[#4F6EF7] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3d5ce0]"
          >
            Get Started Free
          </Link>
        </div>

        <button className="rounded-lg p-1.5 text-[#6b7280] hover:bg-muted md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#e5e7eb] bg-white px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {["Features", "How it Works", "Pricing", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setOpen(false)}
                className="text-sm text-[#6b7280]"
              >
                {item}
              </a>
            ))}
            <hr className="border-[#e5e7eb]" />
            <Link href="/auth/login" className="text-sm font-medium text-[#4b5563]">
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-xl bg-[#4F6EF7] px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

// ── Hero Dashboard Mock ───────────────────────────────────────

// ── Hero ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 size-[600px] rounded-full bg-[#4F6EF7]/8 blur-3xl" />
      <div className="pointer-events-none absolute top-0 -left-32 size-[400px] rounded-full bg-[#a78bfa]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-[#e0e7ff] bg-[#eff6ff] px-4 py-1.5 text-xs font-semibold text-[#4F6EF7]">
            <Sparkles className="size-3.5" />
            AI-Powered HR Management — Built for Modern Teams
          </div>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-center text-5xl font-extrabold leading-[1.1] tracking-tight text-[#1f2937] md:text-6xl">
          Hire Smarter with{" "}
          <span className="bg-gradient-to-r from-[#4F6EF7] to-[#7c3aed] bg-clip-text text-transparent">
            AI-Driven
          </span>{" "}
          Recruitment
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-[#6b7280]">
          Core Recruiter automates candidate screening, ranks applicants with AI scores, schedules interviews, and manages your entire workforce — all in one platform.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/auth/signup"
            className="flex items-center gap-2 rounded-xl bg-[#4F6EF7] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4F6EF7]/30 transition-all hover:bg-[#3d5ce0] hover:shadow-[#4F6EF7]/40"
          >
            Start for Free <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/dashboard/hr"
            className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-8 py-3.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#f9fafb]"
          >
            View Demo Dashboard
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-5 text-center text-xs text-[#9ca3af]">
          No credit card required · Free plan available · Setup in under 5 minutes
        </p>

        {/* Dashboard mock */}
        <div className="mx-auto mt-16 max-w-4xl">
          <Image
            src="/assets/core-recruiter.png"
            alt="Dashboard mockup"
            width={1500}
            height={800}
          />
        </div>
      </div>
    </section>
  )
}

// ── Trusted By ────────────────────────────────────────────────
function TrustedBy() {
  const companies = ["Accenture", "Stripe", "Cloudflare", "Shopify", "Atlassian", "Rakuten"]
  return (
    <section className="border-y border-[#f3f4f6] bg-[#fafafa] py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">
          Trusted by fast-growing teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {companies.map((c) => (
            <span key={c} className="text-base font-bold tracking-tight text-[#d1d5db]">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    color: "#4F6EF7",
    bg: "#eff6ff",
    title: "AI Candidate Screening",
    desc: "Our AI engine reads every application and assigns a match score (0–100%) so you instantly know who fits the role — no manual triage needed.",
  },
  {
    icon: Briefcase,
    color: "#7c3aed",
    bg: "#f5f3ff",
    title: "Smart Job Listings",
    desc: "Create multi-step job listings with skills, salary bands, deadlines, and requirements. Publish in seconds and start collecting qualified applicants.",
  },
  {
    icon: UserCheck,
    color: "#0891b2",
    bg: "#ecfeff",
    title: "Candidate Evaluation",
    desc: "Full applicant profiles with AI scoring, skills match, experience timelines, and document management — all in a clean side-by-side review interface.",
  },
  {
    icon: Calendar,
    color: "#059669",
    bg: "#ecfdf5",
    title: "Interview Scheduling",
    desc: "Schedule, reschedule, and track interviews without email back-and-forth. Calendar sync keeps HR and candidates aligned automatically.",
  },
  {
    icon: BarChart3,
    color: "#d97706",
    bg: "#fffbeb",
    title: "Workforce Analytics",
    desc: "Real-time dashboards showing attendance rates, department headcount, role distribution, and hiring funnel metrics — visualised in interactive charts.",
  },
  {
    icon: DollarSign,
    color: "#e11d48",
    bg: "#fff1f2",
    title: "Payroll & Leave Management",
    desc: "Manage payroll runs, approve leave requests, and track balances from the same platform where you recruit — zero context-switching.",
  },
  {
    icon: Users,
    color: "#7c3aed",
    bg: "#f5f3ff",
    title: "Employee Self-Service Portal",
    desc: "Employees view their own attendance, payslips, leave balances, and announcements through a dedicated ESS portal — reducing HR inbox load.",
  },
  {
    icon: Shield,
    color: "#0ea5e9",
    bg: "#f0f9ff",
    title: "Secure Onboarding",
    desc: "Structured onboarding flows guide new hires and HR through every step — from company setup to role assignment — with a clear audit trail.",
  },
]

function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#4F6EF7]">Features</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#1f2937]">
            Everything your HR team needs
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#6b7280]">
            From first application to first day on the job — Core Recruiter handles the full lifecycle so your team can focus on people, not paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-[#f3f4f6] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className="mb-4 flex size-11 items-center justify-center rounded-xl"
                style={{ background: bg }}
              >
                <Icon className="size-5" style={{ color }} />
              </div>
              <p className="mb-2 text-sm font-semibold text-[#1f2937]">{title}</p>
              <p className="text-sm leading-relaxed text-[#6b7280]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── AI Spotlight ───────────────────────────────────────────────
function AISpotlight() {
  const candidates = [
    { name: "Tiger Nixon",   score: 94, status: "Approved",  skills: ["Node.js", "AWS", "Docker"],       photo: "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png" },
    { name: "Bradley Greer", score: 91, status: "Approved",  skills: ["Java", "Kafka", "Prometheus"],     photo: "/assets/cf9965b714128bf9b66e7daf6ad58bf5300b9eea.png" },
    { name: "Colleen Hurst", score: 87, status: "Interview", skills: ["Go", "Kubernetes", "Terraform"],   photo: "/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png" },
    { name: "Ashton Cox",    score: 82, status: "Interview", skills: ["TypeScript", "GraphQL", "MongoDB"], photo: "/assets/5f121b335ad17b18af3c3c797e7a5f1afc3ec39f.png" },
    { name: "Cedric Kelly",  score: 65, status: "Rejected",  skills: ["PHP", "Laravel", "MySQL"],         photo: "/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png" },
  ]

  const scoreColor = (s: number) =>
    s >= 85
      ? { bg: "#def8ee", text: "#4aa785" }
      : s >= 70
      ? { bg: "#fffbd4", text: "#ca8a04" }
      : { bg: "#fef2f2", text: "#ef4444" }

  const statusColor: Record<string, { bg: string; text: string }> = {
    Approved:  { bg: "#def8ee", text: "#4aa785" },
    Interview: { bg: "#eff6ff", text: "#3b82f6" },
    Rejected:  { bg: "#fef2f2", text: "#ef4444" },
  }

  return (
    <section className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left copy */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4F6EF7]/30 bg-[#4F6EF7]/20 px-4 py-1.5 text-xs font-semibold text-[#93c5fd]">
              <Brain className="size-3.5" /> Powered by AI
            </div>
            <h2 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-white">
              Stop reading CVs.<br />Let AI find your next hire.
            </h2>
            <p className="mb-8 text-base leading-relaxed text-[#a5b4fc]">
              Core Recruiter's AI engine analyses every applicant against your job requirements and generates a match score from 0–100%. High scorers rise to the top automatically — so you interview the right people, not just the first to apply.
            </p>

            <ul className="space-y-4">
              {[
                { icon: Zap,         text: "10× faster candidate shortlisting than manual review" },
                { icon: CheckCircle2,text: "AI scores calibrated on skills, experience & role fit" },
                { icon: Star,        text: "Reduce mis-hires with data-backed evaluation insights" },
                { icon: Clock,       text: "Automated status updates keep candidates informed" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#4F6EF7]/25">
                    <Icon className="size-3.5 text-[#93c5fd]" />
                  </div>
                  <span className="text-sm text-[#c7d2fe]">{text}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-[#312e81] transition-colors hover:bg-[#f5f3ff]"
            >
              Try AI Screening Free <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Right: evaluation panel mock */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-white">Candidate Evaluation</p>
                <p className="text-xs text-[#a5b4fc]">Backend Developer · 9 applicants</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#4F6EF7]/30 px-3 py-1 text-[11px] font-bold text-[#93c5fd]">
                <Sparkles className="size-3" /> AI Scored
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {candidates.map((c) => {
                const sc = scoreColor(c.score)
                const st = statusColor[c.status]
                return (
                  <div key={c.name} className="flex items-center gap-3 px-5 py-3.5">
                    <img src={c.photo} alt={c.name} className="size-9 shrink-0 rounded-full object-cover ring-2 ring-white/20" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{c.name}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {c.skills.slice(0, 2).map((s) => (
                          <span key={s} className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-[#c7d2fe]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ background: sc.bg, color: sc.text }}
                      >
                        {c.score}%
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ background: st.bg, color: st.text }}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-white/10 px-5 py-3">
              <div className="flex items-center justify-between text-xs text-[#a5b4fc]">
                <span>AI analysis complete · 9 applicants ranked</span>
                <span className="font-semibold text-[#93c5fd]">2 top matches found</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── How it Works ──────────────────────────────────────────────
const steps = [
  {
    num: "01",
    icon: Building2,
    title: "Post a Job",
    desc: "Create a detailed listing in our 3-step wizard. Add skills, salary, requirements, and deadlines. Publish in seconds.",
    color: "#4F6EF7",
    bg: "#eff6ff",
  },
  {
    num: "02",
    icon: Brain,
    title: "AI Screens Candidates",
    desc: "Every applicant is automatically evaluated and scored by our AI. High-fit candidates surface to the top of your queue instantly.",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    num: "03",
    icon: Calendar,
    title: "Schedule Interviews",
    desc: "Pick from your top-scored candidates, schedule interviews directly from the platform, and track progress through each stage.",
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    num: "04",
    icon: UserCheck,
    title: "Hire & Onboard",
    desc: "Extend offers, collect signatures, and onboard new hires — all without leaving Core Recruiter. Welcome to one-platform hiring.",
    color: "#d97706",
    bg: "#fffbeb",
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#fafafa] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#4F6EF7]">How it Works</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#1f2937]">
            From job post to first day — in 4 steps
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#6b7280]">
            Core Recruiter's end-to-end workflow eliminates the chaos of scattered tools and endless spreadsheets.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line (desktop only) */}
          <div className="absolute top-10 left-0 hidden h-px w-full bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent lg:block" style={{ top: "44px" }} />

          {steps.map(({ num, icon: Icon, title, desc, color, bg }) => (
            <div key={num} className="relative flex flex-col items-center text-center">
              <div
                className="relative mb-5 flex size-[72px] items-center justify-center rounded-2xl shadow-sm"
                style={{ background: bg }}
              >
                <Icon className="size-7" style={{ color }} />
                <span
                  className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full text-[9px] font-black text-white"
                  style={{ background: color }}
                >
                  {num.slice(1)}
                </span>
              </div>
              <p className="mb-2 text-sm font-bold text-[#1f2937]">{title}</p>
              <p className="text-sm leading-relaxed text-[#6b7280]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────
const stats = [
  { value: "10×",  label: "Faster candidate shortlisting vs manual review" },
  { value: "94%",  label: "Average AI screening accuracy reported by teams" },
  { value: "3 min", label: "Average time to publish a new job listing" },
  { value: "500+", label: "Companies actively hiring on Core Recruiter" },
]

function Stats() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="mb-2 text-5xl font-extrabold text-[#4F6EF7]">{value}</p>
              <p className="text-sm leading-snug text-[#6b7280]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────
const testimonials = [
  {
    quote: "We cut our time-to-hire from 6 weeks to under 2. The AI screening alone saved our recruiter 15 hours a week. I can't imagine going back.",
    name: "Sarah Johnson",
    role: "Head of People · Streamline Technologies",
    photo: "/assets/ba50d841bff1eb820c0b59f56f778fbbf8b8a8c3.png",
    stars: 5,
  },
  {
    quote: "Core Recruiter gives our small HR team the power of a much bigger department. The candidate evaluation panel is genuinely brilliant — clear, fast, and fair.",
    name: "David Mensah",
    role: "VP Engineering · Nexus Fintech",
    photo: "/assets/b576687fbeec177fd13f21dd8dbc7c15d0e204cb.png",
    stars: 5,
  },
  {
    quote: "From job post to offer letter in one platform. Our candidates even love the application experience — and we've seen a 40% increase in quality applicants.",
    name: "Anita Clarke",
    role: "HR Director · Orbis Global",
    photo: "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png",
    stars: 5,
  },
]

function Testimonials() {
  return (
    <section className="bg-[#fafafa] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#4F6EF7]">Testimonials</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#1f2937]">
            Real results, real impact
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#6b7280]">
            Hear from the HR leaders who transformed their hiring with Core Recruiter.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map(({ quote, name, role, photo, stars }) => (
            <div key={name} className="flex flex-col gap-5 rounded-2xl border border-[#f3f4f6] bg-white p-6 shadow-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="size-4 fill-[#fbbf24] text-[#fbbf24]" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-[#374151]">"{quote}"</p>
              <div className="flex items-center gap-3">
                <img src={photo} alt={name} className="size-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-[#1f2937]">{name}</p>
                  <p className="text-xs text-[#6b7280]">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────
const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For small teams just getting started with structured hiring.",
    cta: "Get Started Free",
    href: "/auth/signup",
    highlighted: false,
    features: [
      "Up to 3 active job listings",
      "Applicant tracking",
      "Basic candidate profiles",
      "Email notifications",
      "ESS portal for up to 10 employees",
    ],
  },
  {
    name: "Growth",
    price: "$49",
    period: "/mo",
    description: "Everything you need to hire at scale with AI in your corner.",
    cta: "Start Free Trial",
    href: "/auth/signup",
    highlighted: true,
    features: [
      "Unlimited job listings",
      "AI candidate screening & scoring",
      "Candidate evaluation panel",
      "Interview scheduling",
      "Workforce analytics dashboard",
      "Leave & attendance management",
      "Payroll management",
      "Priority email support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored for large organisations with complex HR workflows.",
    cta: "Contact Sales",
    href: "/auth/login",
    highlighted: false,
    features: [
      "Everything in Growth",
      "Custom AI model tuning",
      "SSO & SCIM provisioning",
      "Dedicated account manager",
      "SLA guarantees",
      "On-premise deployment option",
      "Custom integrations & API",
    ],
  },
]

function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#4F6EF7]">Pricing</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#1f2937]">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-[#6b7280]">
            Start free and scale as you grow. No hidden fees, no per-seat surprises on the Growth plan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map(({ name, price, period, description, cta, href, highlighted, features }) => (
            <div
              key={name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8",
                highlighted
                  ? "border-[#4F6EF7] bg-[#4F6EF7] text-white shadow-2xl shadow-[#4F6EF7]/30"
                  : "border-[#f3f4f6] bg-white shadow-sm"
              )}
            >
              {highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] px-4 py-1 text-xs font-bold text-white shadow">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <p className={cn("mb-1 text-sm font-bold uppercase tracking-widest", highlighted ? "text-[#c7d2fe]" : "text-[#6b7280]")}>
                  {name}
                </p>
                <div className="flex items-end gap-1">
                  <span className={cn("text-5xl font-extrabold", highlighted ? "text-white" : "text-[#1f2937]")}>
                    {price}
                  </span>
                  {period && (
                    <span className={cn("mb-1.5 text-base", highlighted ? "text-[#a5b4fc]" : "text-[#6b7280]")}>
                      {period}
                    </span>
                  )}
                </div>
                <p className={cn("mt-2 text-sm", highlighted ? "text-[#c7d2fe]" : "text-[#6b7280]")}>
                  {description}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={cn("mt-0.5 size-4 shrink-0", highlighted ? "text-[#93c5fd]" : "text-[#4aa785]")}
                    />
                    <span className={highlighted ? "text-[#e0e7ff]" : "text-[#374151]"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={href}
                className={cn(
                  "rounded-xl py-3 text-center text-sm font-bold transition-colors",
                  highlighted
                    ? "bg-white text-[#4F6EF7] hover:bg-[#f5f3ff]"
                    : "border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"
                )}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────
const faqs = [
  {
    q: "How does the AI candidate screening work?",
    a: "Core Recruiter's AI reads each applicant's resume and profile, then compares it against your job's required skills, experience level, and description. It generates a match score (0–100%) and surfaces the best fits to the top of your evaluation queue automatically.",
  },
  {
    q: "Can I use Core Recruiter for employee management beyond recruitment?",
    a: "Yes. Core Recruiter includes a full HR suite: attendance tracking, leave management, payroll, department management, announcements, and an Employee Self-Service (ESS) portal — all in one platform.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes! The Starter plan is completely free and includes up to 3 active job listings, applicant tracking, and the ESS portal for up to 10 employees. No credit card required.",
  },
  {
    q: "How long does it take to set up?",
    a: "Most teams are fully set up in under 5 minutes. Our onboarding wizard walks you through company configuration, your first job listing, and inviting team members step by step.",
  },
  {
    q: "Can candidates apply externally through a public page?",
    a: "Yes. Each job listing generates a public application page that candidates can access without logging in. Applications flow directly into your HR dashboard for review.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. Core Recruiter uses enterprise-grade encryption at rest and in transit. We are SOC 2 Type II compliant and offer SSO, SCIM provisioning, and audit logs on the Enterprise plan.",
  },
]

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-[#fafafa] py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#4F6EF7]">FAQ</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#1f2937]">Frequently asked questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-semibold text-[#1f2937]">{q}</span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-[#9ca3af] transition-transform",
                    openIdx === i && "rotate-180"
                  )}
                />
              </button>
              {openIdx === i && (
                <div className="border-t border-[#f3f4f6] px-6 py-4">
                  <p className="text-sm leading-relaxed text-[#6b7280]">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Banner ─────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4F6EF7] to-[#3730a3] px-12 py-16 text-center shadow-2xl">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-white/10" />

          <div className="relative">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#a5b4fc]">
              Get Started Today
            </p>
            <h2 className="mb-4 text-4xl font-extrabold text-white">
              Let's transform your hiring process
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-base text-[#c7d2fe]">
              Join 500+ companies using Core Recruiter to hire smarter, faster, and more fairly with AI. Your first 3 listings are free — forever.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#312e81] shadow-lg transition-colors hover:bg-[#f5f3ff]"
              >
                Start for Free <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/dashboard/hr"
                className="rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore the Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-[#f3f4f6] bg-[#1f2937] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#4F6EF7]">
                <span className="text-sm font-bold text-white">C</span>
              </div>
              <span className="font-bold text-white">Core Recruiter</span>
            </div>
            <p className="mb-4 max-w-xs text-sm leading-relaxed text-[#9ca3af]">
              AI-powered HR management platform for modern recruitment and workforce management.
            </p>
            <p className="text-xs text-[#6b7280]">© {new Date().getFullYear()} Core Recruiter Inc. All rights reserved.</p>
          </div>

          {/* Product */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#6b7280]">Product</p>
            <ul className="space-y-3">
              {["Features", "Pricing", "Changelog", "Roadmap"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-[#9ca3af] transition-colors hover:text-white">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#6b7280]">Platform</p>
            <ul className="space-y-3">
              {[
                { label: "HR Dashboard",  href: "/dashboard/hr" },
                { label: "Job Listings",  href: "/dashboard/hr/jobs" },
                { label: "Evaluation",    href: "/dashboard/hr/evaluation" },
                { label: "ESS Portal",    href: "/dashboard/ess" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-[#9ca3af] transition-colors hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#6b7280]">Company</p>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Privacy", "Terms"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-[#9ca3af] transition-colors hover:text-white">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <AISpotlight />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  )
}
