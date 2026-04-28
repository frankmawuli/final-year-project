"use client"

import { useParams } from "next/navigation"
import { useMemo } from "react"
import Link from "next/link"
import { jobsStore } from "@/lib/jobs-store"
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  CalendarDays,
  CheckCircle2,
  Star,
  Building2,
  Globe,
  ChevronRight,
  Pencil,
  XCircle,
  Eye,
} from "lucide-react"
import HrNavigationPannel from "@/components/hr-navigation-pannel"
import { cn } from "@/lib/utils"

// ── Nav ───────────────────────────────────────────────────────
const sidebarNav = [
  { label: "Job Listings",         href: "/dashboard/hr/jobs"       },
  { label: "Applicants",           href: "/dashboard/hr/applicants" },
  { label: "Candidate Evaluation", href: "/dashboard/hr/evaluation" },
  { label: "Interview Scheduling", href: "/dashboard/hr/interviews" },
]

// ── Types ─────────────────────────────────────────────────────
interface JobDetail {
  id: number
  title: string
  department: string
  company: string
  companyIndustry: string
  companySize: string
  companyFounded: string
  companyWebsite: string
  location: string
  type: string
  experience: string
  salaryMin: string
  salaryMax: string
  status: "Open" | "Closed" | "Draft"
  postedDate: string
  deadline: string
  openings: number
  applicants: number
  level: string
  description: string
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
  skills: string[]
  recentApplicants: { name: string; avatar: string }[]
}

// ── Applicant avatars ──────────────────────────────────────────
const AVATARS = [
  "/assets/635a3bf857069957b4442100197a1e910ea3121d.png",
  "/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png",
  "/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png",
  "/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png",
  "/assets/ba50d841bff1eb820c0b59f56f778fbbf8b8a8c3.png",
]

// ── Job detail data ────────────────────────────────────────────
const JOBS: Record<number, JobDetail> = {
  1: {
    id: 1,
    title: "UX/UI Designer",
    department: "Design",
    company: "Core Recruiter Inc.",
    companyIndustry: "Technology / HR Software",
    companySize: "250–500 employees",
    companyFounded: "2019",
    companyWebsite: "corerecruiter.io",
    location: "Remote",
    type: "Contract",
    experience: "3+ years",
    salaryMin: "$70k",
    salaryMax: "$90k",
    status: "Open",
    postedDate: "Mar 20, 2026",
    deadline: "Apr 20, 2026",
    openings: 2,
    applicants: 12,
    level: "Mid-level",
    description:
      "We are seeking a talented and highly motivated UI/UX Designer to join our growing product team. The ideal candidate will have a strong portfolio of design work and a passion for creating intuitive, visually appealing user experiences. You will work closely with product managers, engineers, and stakeholders to shape the design of our HR platform.",
    responsibilities: [
      "Collaborate with product management and engineering to define and implement innovative design solutions for product direction, visuals, and experience.",
      "Conduct user research and testing to gather insights and validate design decisions.",
      "Create wireframes, prototypes, and high-fidelity mockups for web and mobile interfaces.",
      "Continuously iterate and improve upon the design of our products based on user feedback and analytics.",
      "Maintain and evolve the company's design system and component library.",
      "Stay up-to-date with the latest design trends, tools, and techniques.",
    ],
    requirements: [
      "3+ years of professional UI/UX design experience.",
      "Expert proficiency in Figma and/or Adobe XD.",
      "Strong portfolio demonstrating end-to-end design process.",
      "Experience conducting user research, usability testing, and A/B testing.",
      "Solid understanding of responsive and accessible design principles.",
      "Excellent communication and collaboration skills.",
    ],
    niceToHave: [
      "Experience designing for SaaS or HR tech products.",
      "Familiarity with design tokens and component-based design systems.",
      "Basic knowledge of HTML/CSS to facilitate developer handoff.",
    ],
    skills: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research", "Design Systems", "Accessibility"],
    recentApplicants: [
      { name: "Ana Jadric",   avatar: AVATARS[0] },
      { name: "James Okafor", avatar: AVATARS[1] },
      { name: "Priya Patel",  avatar: AVATARS[2] },
      { name: "Lena Schmidt", avatar: AVATARS[3] },
    ],
  },
  2: {
    id: 2,
    title: "Frontend Engineer",
    department: "Engineering",
    company: "Core Recruiter Inc.",
    companyIndustry: "Technology / HR Software",
    companySize: "250–500 employees",
    companyFounded: "2019",
    companyWebsite: "corerecruiter.io",
    location: "Remote",
    type: "Full-time",
    experience: "4+ years",
    salaryMin: "$90k",
    salaryMax: "$120k",
    status: "Open",
    postedDate: "Mar 18, 2026",
    deadline: "Apr 18, 2026",
    openings: 3,
    applicants: 32,
    level: "Senior",
    description:
      "We are looking for a skilled Frontend Engineer to build and maintain high-quality web applications for our HR platform. You will be responsible for translating designs into performant, accessible React components and collaborating closely with backend engineers and designers.",
    responsibilities: [
      "Build responsive, performant, and accessible React/Next.js web applications.",
      "Collaborate with designers to translate Figma designs into pixel-perfect UI components.",
      "Write clean, maintainable TypeScript code following best practices.",
      "Participate in code reviews and contribute to improving team standards.",
      "Optimize frontend performance through profiling, lazy loading, and caching strategies.",
      "Integrate RESTful APIs and real-time data streams into the UI.",
    ],
    requirements: [
      "4+ years of professional frontend development experience.",
      "Strong proficiency in React, Next.js, and TypeScript.",
      "Deep understanding of HTML5, CSS3, and modern browser APIs.",
      "Experience with state management (Zustand, Redux, or similar).",
      "Familiarity with testing frameworks (Jest, React Testing Library).",
      "Strong attention to detail and a passion for code quality.",
    ],
    niceToHave: [
      "Experience with Tailwind CSS or CSS-in-JS solutions.",
      "Prior work on SaaS products with multi-tenant architecture.",
      "Contributions to open-source projects.",
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "REST APIs", "Git", "Testing"],
    recentApplicants: [
      { name: "David Kim",     avatar: AVATARS[0] },
      { name: "Samuel Torres", avatar: AVATARS[1] },
      { name: "Omar Hassan",   avatar: AVATARS[2] },
      { name: "Clara Mensah",  avatar: AVATARS[3] },
      { name: "Rhona D.",      avatar: AVATARS[4] },
    ],
  },
  3: {
    id: 3,
    title: "Product Manager",
    department: "Product",
    company: "Core Recruiter Inc.",
    companyIndustry: "Technology / HR Software",
    companySize: "250–500 employees",
    companyFounded: "2019",
    companyWebsite: "corerecruiter.io",
    location: "On-site",
    type: "Full-time",
    experience: "5+ years",
    salaryMin: "$100k",
    salaryMax: "$130k",
    status: "Open",
    postedDate: "Mar 15, 2026",
    deadline: "Apr 15, 2026",
    openings: 1,
    applicants: 8,
    level: "Senior",
    description:
      "We are hiring an experienced Product Manager to own the roadmap and strategy for our core HR modules. You will work with engineering, design, and business stakeholders to deliver products that delight our users.",
    responsibilities: [
      "Define and own the product roadmap for assigned modules.",
      "Work with stakeholders to gather and prioritize requirements.",
      "Write clear, detailed product specifications and user stories.",
      "Coordinate cross-functional teams to deliver features on time.",
      "Analyze product metrics to drive data-informed decisions.",
      "Champion the voice of the customer throughout the development cycle.",
    ],
    requirements: [
      "5+ years of product management experience in a B2B SaaS environment.",
      "Strong analytical skills and comfort with data tools.",
      "Excellent written and verbal communication skills.",
      "Proven track record of launching successful products.",
      "Ability to manage competing priorities in a fast-paced environment.",
    ],
    niceToHave: [
      "Experience with HR tech or workforce management products.",
      "Familiarity with SQL for self-serve data analysis.",
    ],
    skills: ["Product Strategy", "Roadmapping", "User Stories", "Agile", "Data Analysis", "Stakeholder Management"],
    recentApplicants: [
      { name: "Sarah J.",  avatar: AVATARS[2] },
      { name: "Kevin O.",  avatar: AVATARS[3] },
    ],
  },
  4: {
    id: 4,
    title: "Data Analyst",
    department: "Analytics",
    company: "Core Recruiter Inc.",
    companyIndustry: "Technology / HR Software",
    companySize: "250–500 employees",
    companyFounded: "2019",
    companyWebsite: "corerecruiter.io",
    location: "Hybrid",
    type: "Full-time",
    experience: "2+ years",
    salaryMin: "$75k",
    salaryMax: "$95k",
    status: "Open",
    postedDate: "Mar 22, 2026",
    deadline: "Apr 22, 2026",
    openings: 2,
    applicants: 21,
    level: "Mid-level",
    description:
      "Join our analytics team to help turn HR data into actionable insights. You will build dashboards, create reports, and partner with HR business partners to understand workforce trends.",
    responsibilities: [
      "Build and maintain dashboards in BI tools (Tableau, Looker, or similar).",
      "Write complex SQL queries to extract and transform data.",
      "Collaborate with HR and engineering to define key metrics.",
      "Deliver regular workforce analytics reports to leadership.",
      "Identify trends and anomalies in HR data and surface recommendations.",
    ],
    requirements: [
      "2+ years of experience in a data analyst role.",
      "Strong SQL skills and experience with large datasets.",
      "Proficiency in at least one BI tool (Tableau, Power BI, Looker).",
      "Experience with Python or R for data analysis is a plus.",
      "Excellent storytelling and data visualization skills.",
    ],
    niceToHave: [
      "Experience with people analytics or HR data.",
      "Familiarity with dbt or data warehouse tooling.",
    ],
    skills: ["SQL", "Tableau", "Python", "Data Visualization", "Excel", "Statistics"],
    recentApplicants: [
      { name: "Priya P.",  avatar: AVATARS[2] },
      { name: "James O.",  avatar: AVATARS[1] },
      { name: "Ana J.",    avatar: AVATARS[0] },
    ],
  },
  5: {
    id: 5,
    title: "Backend Engineer",
    department: "Engineering",
    company: "Core Recruiter Inc.",
    companyIndustry: "Technology / HR Software",
    companySize: "250–500 employees",
    companyFounded: "2019",
    companyWebsite: "corerecruiter.io",
    location: "Remote",
    type: "Full-time",
    experience: "4+ years",
    salaryMin: "$95k",
    salaryMax: "$125k",
    status: "Closed",
    postedDate: "Feb 10, 2026",
    deadline: "Mar 10, 2026",
    openings: 2,
    applicants: 45,
    level: "Senior",
    description:
      "We were looking for a Senior Backend Engineer to build scalable APIs and services for our HR platform. This position is now closed.",
    responsibilities: [
      "Design and build RESTful and GraphQL APIs.",
      "Optimize database schemas and queries for performance.",
      "Own microservices end-to-end from design to production.",
      "Participate in architecture discussions and technical planning.",
      "Mentor junior engineers and lead code reviews.",
    ],
    requirements: [
      "4+ years of backend engineering experience.",
      "Strong proficiency in Node.js, Go, or Python.",
      "Experience with PostgreSQL and NoSQL databases.",
      "Familiarity with Docker, Kubernetes, and cloud platforms (AWS/GCP).",
    ],
    niceToHave: [
      "Experience with event-driven architecture (Kafka, RabbitMQ).",
      "Prior work on multi-tenant SaaS platforms.",
    ],
    skills: ["Node.js", "PostgreSQL", "Docker", "REST APIs", "GraphQL", "AWS", "Redis"],
    recentApplicants: [
      { name: "Omar H.",   avatar: AVATARS[4] },
      { name: "David K.",  avatar: AVATARS[0] },
      { name: "Clara M.",  avatar: AVATARS[3] },
      { name: "Samuel T.", avatar: AVATARS[1] },
    ],
  },
  6: {
    id: 6,
    title: "Marketing Specialist",
    department: "Marketing",
    company: "Core Recruiter Inc.",
    companyIndustry: "Technology / HR Software",
    companySize: "250–500 employees",
    companyFounded: "2019",
    companyWebsite: "corerecruiter.io",
    location: "On-site",
    type: "Part-time",
    experience: "2+ years",
    salaryMin: "$55k",
    salaryMax: "$70k",
    status: "Draft",
    postedDate: "Mar 28, 2026",
    deadline: "Apr 28, 2026",
    openings: 1,
    applicants: 14,
    level: "Mid-level",
    description:
      "We are looking for a creative Marketing Specialist to drive brand awareness and lead generation campaigns. This role is currently in draft and not yet published.",
    responsibilities: [
      "Plan and execute digital marketing campaigns across multiple channels.",
      "Manage social media accounts and content calendar.",
      "Collaborate with design and content teams to produce marketing assets.",
      "Analyze campaign performance and report on key KPIs.",
      "Support event planning and attendance at industry conferences.",
    ],
    requirements: [
      "2+ years of digital marketing experience.",
      "Proficiency with marketing automation tools (HubSpot, Mailchimp).",
      "Strong writing and copyediting skills.",
      "Experience with SEO/SEM and paid advertising.",
      "Data-driven mindset with experience in Google Analytics.",
    ],
    niceToHave: [
      "Experience marketing B2B SaaS products.",
      "Graphic design skills (Canva, Adobe).",
    ],
    skills: ["HubSpot", "SEO", "Content Marketing", "Google Analytics", "Copywriting", "Social Media"],
    recentApplicants: [
      { name: "Lena S.",   avatar: AVATARS[3] },
      { name: "Jenna E.",  avatar: AVATARS[4] },
    ],
  },
}

// Department color map
const deptColors: Record<string, string> = {
  Design:      "bg-violet-100 text-violet-700",
  Engineering: "bg-blue-100 text-blue-700",
  Product:     "bg-amber-100 text-amber-700",
  Analytics:   "bg-emerald-100 text-emerald-700",
  Marketing:   "bg-pink-100 text-pink-700",
  HR:          "bg-primary/10 text-primary",
  Finance:     "bg-orange-100 text-orange-700",
}

const statusStyles: Record<string, string> = {
  Open:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Closed: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
  Draft:  "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
}

// ── Skill chip ─────────────────────────────────────────────────
function SkillChip({ label }: { label: string }) {
  return (
    <span className="rounded-lg border border-border bg-muted px-3 py-1.5 text-[13px] font-medium text-foreground">
      {label}
    </span>
  )
}

// ── Section heading ────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-[15px] font-bold text-foreground">{children}</h3>
  )
}

// ── Sidebar info row ───────────────────────────────────────────
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-[13px] font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function JobDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  // Prefer hardcoded seed data; fall back to jobs created at runtime via the store
  const job = useMemo(
    () => JOBS[id] ?? jobsStore.get(id) ?? JOBS[1],
    [id]
  )

  const applicantPct = Math.min(100, Math.round((job.applicants / (job.openings * 15)) * 100))

  return (
    <>
      <HrNavigationPannel navItems={sidebarNav} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1280px] p-6">

    
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">

            {/* ── Left: main content ───────────────────────── */}
            <div className="flex flex-col gap-5">

              {/* Cover banner */}
              <div
                className="relative h-[160px] overflow-hidden rounded-2xl"
                style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
              >
                {/* Decorative shapes */}
                <span className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10" />
                <span className="absolute -bottom-12 right-32 size-32 rounded-full bg-white/10" />
                <span className="absolute -left-6 bottom-0 size-24 rounded-full bg-white/8" />
                <span className="absolute right-16 top-6 size-16 rounded-full bg-white/15" />
                <div className="absolute bottom-5 right-8 flex gap-1.5 opacity-30">
                  {[20, 36, 24, 40, 28].map((h, i) => (
                    <div key={i} className="w-2 rounded-sm bg-white" style={{ height: h }} />
                  ))}
                </div>

                {/* Status badge on banner */}
                <div className="absolute left-5 top-5">
                  <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusStyles[job.status])}>
                    {job.status}
                  </span>
                </div>
              </div>

              {/* Job header */}
              <div className="flex items-start gap-4">
                {/* Company logo placeholder */}
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border bg-white shadow-sm">
                  <Building2 className="size-7 text-primary" strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl font-bold text-foreground">{job.title}</h1>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", deptColors[job.department] ?? "bg-muted text-muted-foreground")}>
                      {job.department}
                    </span>
                    <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {job.type}
                    </span>
                    <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {job.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{job.company}</span>
                    <CheckCircle2 className="size-4 text-primary" />
                    <span>·</span>
                    <MapPin className="size-3.5" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <SectionTitle>Job Description</SectionTitle>
                <p className="text-[14px] leading-relaxed text-muted-foreground">{job.description}</p>
                 {/* Responsibilities */}
              <div className="pt-6">
                <SectionTitle>Key Responsibilities</SectionTitle>
                <ul className="flex flex-col gap-2.5">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="text-[14px] leading-relaxed text-muted-foreground">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              </div>

             
              {/* Requirements */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <SectionTitle>Requirements</SectionTitle>
                <ul className="flex flex-col gap-2.5">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-[14px] leading-relaxed text-muted-foreground">{r}</span>
                    </li>
                  ))}
                </ul>

                  <div className=" pt-6 ">
                <SectionTitle>Required Skills</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <SkillChip key={s} label={s} />
                  ))}
                </div>
              </div>
              </div>

             

            
            </div>

            {/* ── Right: sidebar ───────────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* Action buttons */}
              <div className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-4 shadow-sm">
                <Link
                  href="/dashboard/hr/applicants"
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #5A7CFF 0%, #3B5BDB 100%)" }}
                >
                  <Eye className="size-4" />
                  View Applications
                  <span className="ml-1 rounded-full bg-white/20 px-2 py-0 text-xs font-bold">
                    {job.applicants}
                  </span>
                </Link>
                <Link
                  href="/dashboard/hr/jobs"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                  Edit Listing
                </Link>
                {job.status === "Open" && (
                  <button className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50">
                    <XCircle className="size-3.5" />
                    Close Listing
                  </button>
                )}
              </div>

              {/* Job overview */}
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <p className="mb-4 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                  Job Overview
                </p>
                <div className="flex flex-col gap-4">
                  <InfoRow icon={DollarSign}   label="Salary Range"  value={`${job.salaryMin} – ${job.salaryMax}`} />
                  <InfoRow icon={Briefcase}     label="Job Type"      value={job.type} />
                  <InfoRow icon={MapPin}        label="Location"      value={job.location} />
                  <InfoRow icon={Clock}         label="Experience"    value={job.experience} />
                  <InfoRow icon={CalendarDays}  label="Posted"        value={job.postedDate} />
                  <InfoRow icon={CalendarDays}  label="Deadline"      value={job.deadline} />
                  <InfoRow icon={Users}         label="Openings"      value={`${job.openings} position${job.openings > 1 ? "s" : ""}`} />
                </div>

                {/* Applicant fill bar */}
                <div className="mt-5 rounded-xl border border-border bg-background p-3">
                  <div className="mb-1.5 flex items-center justify-between text-[12px]">
                    <span className="font-medium text-foreground">{job.applicants} applicants</span>
                    <span className="text-muted-foreground">{applicantPct}% filled</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${applicantPct}%` }}
                    />
                  </div>
                </div>
              </div>

             

              {/* Recent applicants */}
              {job.recentApplicants.length > 0 && (
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <p className="mb-3 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                    Recent Applicants
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {job.recentApplicants.map((a, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <img
                          src={a.avatar}
                          alt={a.name}
                          className="size-8 rounded-full object-cover ring-2 ring-background"
                        />
                        <span className="text-[13px] font-medium text-foreground">{a.name}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/dashboard/hr/applicants"
                    className="mt-3 block text-center text-[13px] font-medium text-primary hover:underline"
                  >
                    View all {job.applicants} applicants →
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </>
  )
}
