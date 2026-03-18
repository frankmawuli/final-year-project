"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  ChevronDown, X, Download, MapPin, Mail, Phone,
  Briefcase, GraduationCap, FileText, Star,
} from "lucide-react"
import { HRIconSidebar } from "@/components/hr-icon-sidebar"
import { cn } from "@/lib/utils"

// ── Asset URLs ────────────────────────────────────────────────
const profilePhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

const photos = {
  a: "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png",
  b: "/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png",
  c: "/assets/cf9965b714128bf9b66e7daf6ad58bf5300b9eea.png",
  d: "/assets/2dba1db7966039308370470fce52b3b220f9a3fb.png",
  e: "/assets/5f121b335ad17b18af3c3c797e7a5f1afc3ec39f.png",
  f: "/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png",
  g: "/assets/635a3bf857069957b4442100197a1e910ea3121d.png",
  h: "/assets/3b57a33d98b5a1b80a335988932aa248a0875725.png",
  i: "/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png",
}

// ── Types ─────────────────────────────────────────────────────
type EvalStatus = "Pending Review" | "Interview" | "Accepted" | "Approved" | "Rejected"

interface Candidate {
  id:         number
  name:       string
  email:      string
  phone:      string
  photo:      string
  position:   string
  department: string
  appliedAt:  string
  location:   string
  aiScore:    number
  status:     EvalStatus
  about:      string
  skills:     string[]
  experience: { role: string; company: string; duration: string }[]
  education:  { degree: string; school: string; year: string }[]
  documents:  { name: string; type: string }[]
}

// ── Status config ─────────────────────────────────────────────
const statusConfig: Record<EvalStatus, { bg: string; text: string }> = {
  "Pending Review": { bg: "#f0f0ff", text: "#8a8cd9" },
  Interview:        { bg: "#eff6ff", text: "#3b82f6" },
  Accepted:         { bg: "#def8ee", text: "#4aa785" },
  Approved:         { bg: "#fffbd4", text: "#ffc555" },
  Rejected:         { bg: "#fef2f2", text: "#ef4444" },
}

const STATUS_OPTIONS: EvalStatus[] = ["Pending Review", "Interview", "Accepted", "Approved", "Rejected"]

// ── Candidate data ────────────────────────────────────────────
const initial: Candidate[] = [
  {
    id: 1, photo: photos.a, name: "Tiger Nixon",     email: "error50@gmail.com",       phone: "+1 (555) 234-5678",
    position: "Backend Developer", department: "Engineering", appliedAt: "January 1, 2025",
    location: "Tokyo, Japan", aiScore: 94, status: "Approved",
    about: "Seasoned backend engineer with 7+ years building scalable APIs and distributed systems. Passionate about clean architecture and developer tooling.",
    skills: ["Node.js", "Python", "PostgreSQL", "Docker", "AWS", "Redis"],
    experience: [
      { role: "Senior Backend Engineer", company: "Stripe",  duration: "2021 – Present" },
      { role: "Backend Engineer",        company: "Shopify", duration: "2018 – 2021"    },
    ],
    education: [{ degree: "B.Sc. Computer Science", school: "MIT", year: "2018" }],
    documents: [
      { name: "Tiger_Nixon_CV.pdf",           type: "Resume"       },
      { name: "Tiger_Nixon_CoverLetter.pdf",  type: "Cover Letter" },
      { name: "Tiger_Portfolio.zip",          type: "Portfolio"    },
    ],
  },
  {
    id: 2, photo: photos.b, name: "Colleen Hurst",   email: "colleen.h@gmail.com",      phone: "+1 (555) 876-1234",
    position: "Backend Developer", department: "Engineering", appliedAt: "January 1, 2025",
    location: "New York, USA", aiScore: 87, status: "Interview",
    about: "Full-stack developer specialising in microservices. 5 years at high-growth startups, loves mentoring junior engineers.",
    skills: ["Go", "Kubernetes", "gRPC", "PostgreSQL", "Terraform"],
    experience: [
      { role: "Software Engineer II", company: "Uber",    duration: "2020 – Present" },
      { role: "Junior Developer",     company: "Twilio",  duration: "2018 – 2020"    },
    ],
    education: [{ degree: "M.Sc. Software Engineering", school: "Stanford", year: "2018" }],
    documents: [
      { name: "Colleen_CV.pdf",           type: "Resume"       },
      { name: "Colleen_CoverLetter.pdf",  type: "Cover Letter" },
    ],
  },
  {
    id: 3, photo: photos.c, name: "Bradley Greer",   email: "bradley.g@gmail.com",     phone: "+44 7700 900123",
    position: "Backend Developer", department: "Engineering", appliedAt: "January 1, 2025",
    location: "Edinburgh, UK", aiScore: 91, status: "Approved",
    about: "Platform engineer with deep expertise in observability, CI/CD pipelines, and cloud infrastructure across AWS and GCP.",
    skills: ["Java", "Spring Boot", "Kafka", "AWS", "Prometheus"],
    experience: [
      { role: "Platform Engineer", company: "Cloudflare", duration: "2022 – Present" },
      { role: "DevOps Engineer",   company: "Sky",        duration: "2019 – 2022"    },
    ],
    education: [{ degree: "B.Eng. Computer Engineering", school: "University of Edinburgh", year: "2019" }],
    documents: [
      { name: "Bradley_CV.pdf",   type: "Resume"       },
      { name: "Bradley_Portfolio.pdf", type: "Portfolio" },
    ],
  },
  {
    id: 4, photo: photos.d, name: "Garrett Winters", email: "garrett.w@gmail.com",     phone: "+1 (555) 321-9876",
    position: "Backend Developer", department: "Engineering", appliedAt: "January 1, 2025",
    location: "San Francisco, USA", aiScore: 78, status: "Pending Review",
    about: "Accountant turned software engineer. Strong analytical background combined with 3 years of backend development experience.",
    skills: ["Python", "Django", "MySQL", "REST APIs", "Docker"],
    experience: [
      { role: "Backend Developer", company: "Intuit", duration: "2022 – Present" },
    ],
    education: [{ degree: "B.Sc. Accounting & Computer Science", school: "UC Berkeley", year: "2022" }],
    documents: [{ name: "Garrett_CV.pdf", type: "Resume" }],
  },
  {
    id: 5, photo: photos.e, name: "Ashton Cox",      email: "ashton.cox@gmail.com",    phone: "+44 7911 654321",
    position: "Backend Developer", department: "Engineering", appliedAt: "January 1, 2025",
    location: "Edinburgh, UK", aiScore: 82, status: "Interview",
    about: "Technical author and developer hybrid. Exceptional at documenting complex systems while actively contributing to backend codebases.",
    skills: ["TypeScript", "Node.js", "GraphQL", "MongoDB"],
    experience: [
      { role: "Technical Author & Developer", company: "Atlassian", duration: "2020 – Present" },
    ],
    education: [{ degree: "B.A. Computer Science & English", school: "University of Glasgow", year: "2020" }],
    documents: [
      { name: "Ashton_CV.pdf",          type: "Resume"       },
      { name: "Ashton_CoverLetter.pdf", type: "Cover Letter" },
    ],
  },
  {
    id: 6, photo: photos.f, name: "Cedric Kelly",    email: "cedric.kelly@gmail.com",  phone: "+1 (555) 445-0099",
    position: "Backend Developer", department: "Engineering", appliedAt: "January 1, 2025",
    location: "New York, USA", aiScore: 65, status: "Rejected",
    about: "Integration specialist with experience connecting third-party APIs and building ETL pipelines for enterprise clients.",
    skills: ["PHP", "Laravel", "MySQL", "REST APIs"],
    experience: [
      { role: "Integration Engineer", company: "Salesforce", duration: "2019 – Present" },
    ],
    education: [{ degree: "B.Sc. Information Systems", school: "NYU", year: "2019" }],
    documents: [{ name: "Cedric_CV.pdf", type: "Resume" }],
  },
  {
    id: 7, photo: photos.g, name: "Airi Satou",      email: "airi.satou@gmail.com",    phone: "+81 90-1234-5678",
    position: "Backend Developer", department: "Engineering", appliedAt: "January 1, 2025",
    location: "Tokyo, Japan", aiScore: 89, status: "Approved",
    about: "Experienced in building high-performance e-commerce backends serving millions of daily transactions across Asia-Pacific.",
    skills: ["Ruby on Rails", "Redis", "Elasticsearch", "AWS Lambda"],
    experience: [
      { role: "Senior Engineer", company: "Rakuten",  duration: "2021 – Present" },
      { role: "Rails Developer", company: "DeNA",     duration: "2018 – 2021"    },
    ],
    education: [{ degree: "B.Sc. Computer Science", school: "Keio University", year: "2018" }],
    documents: [
      { name: "Airi_CV.pdf",           type: "Resume"       },
      { name: "Airi_CoverLetter.pdf",  type: "Cover Letter" },
      { name: "Airi_Portfolio.pdf",    type: "Portfolio"    },
    ],
  },
  {
    id: 8, photo: photos.h, name: "Brielle Williamson", email: "brielle.w@gmail.com", phone: "+49 30 12345678",
    position: "Backend Developer", department: "Engineering", appliedAt: "January 1, 2025",
    location: "Berlin, Germany", aiScore: 73, status: "Pending Review",
    about: "Berlin-based backend developer specialising in fintech solutions. Experience with regulated financial systems and GDPR compliance.",
    skills: ["Scala", "Akka", "PostgreSQL", "Apache Spark"],
    experience: [
      { role: "Backend Engineer", company: "N26", duration: "2020 – Present" },
    ],
    education: [{ degree: "M.Sc. Financial Technology", school: "TU Berlin", year: "2020" }],
    documents: [{ name: "Brielle_CV.pdf", type: "Resume" }],
  },
  {
    id: 9, photo: photos.i, name: "Herrod Chandler",  email: "herrod.c@gmail.com",    phone: "+92 321 1234567",
    position: "Backend Developer", department: "Engineering", appliedAt: "January 1, 2025",
    location: "Islamabad, Pakistan", aiScore: 88, status: "Interview",
    about: "Full-stack leaning backend developer with a knack for building real-time applications using WebSockets and event-driven architecture.",
    skills: ["JavaScript", "Node.js", "Socket.io", "MongoDB", "Redis"],
    experience: [
      { role: "Software Engineer",  company: "Systems Limited", duration: "2021 – Present" },
      { role: "Junior Developer",   company: "Netsol",          duration: "2019 – 2021"    },
    ],
    education: [{ degree: "B.Sc. Software Engineering", school: "FAST-NUCES", year: "2019" }],
    documents: [
      { name: "Herrod_CV.pdf",          type: "Resume"       },
      { name: "Herrod_CoverLetter.pdf", type: "Cover Letter" },
    ],
  },
  {
    id: 10, photo: photos.a, name: "Rhona Davidson",  email: "rhona.d@gmail.com",     phone: "+91 98765 43210",
    position: "Backend Developer", department: "Engineering", appliedAt: "January 1, 2025",
    location: "Delhi, India", aiScore: 76, status: "Pending Review",
    about: "Software engineer with strong foundations in algorithms and data structures. Contributed to open-source Rust projects.",
    skills: ["Rust", "C++", "PostgreSQL", "gRPC", "Linux"],
    experience: [
      { role: "Systems Engineer", company: "Flipkart", duration: "2022 – Present" },
    ],
    education: [{ degree: "B.Tech Computer Science", school: "IIT Delhi", year: "2022" }],
    documents: [{ name: "Rhona_CV.pdf", type: "Resume" }],
  },
]

const ROWS_PER_PAGE = 9

// ── Sub-components ─────────────────────────────────────────────

function AiScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? "#4aa785" : score >= 70 ? "#ffc555" : "#ef4444"
  const bg    = score >= 85 ? "#def8ee" : score >= 70 ? "#fffbd4" : "#fef2f2"
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
      style={{ background: bg, color }}
    >
      {/* checkmark for high scores */}
      {score >= 85 && (
        <svg viewBox="0 0 12 12" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
        </svg>
      )}
      {score}%
    </span>
  )
}

function StatusBadge({ status }: { status: EvalStatus }) {
  const { bg, text } = statusConfig[status]
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: bg, color: text }}
    >
      {status}
    </span>
  )
}

// Status dropdown
function StatusDropdown({
  value,
  onChange,
}: {
  value: EvalStatus
  onChange: (v: EvalStatus) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-[28px] min-w-[130px] items-center justify-between gap-1.5 rounded border border-border bg-white px-2.5 text-xs font-medium text-[#374151] hover:bg-muted"
      >
        <span>{value}</span>
        <ChevronDown className="size-3 shrink-0 text-[#8181a5]" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
          {STATUS_OPTIONS.map((opt) => {
            const { text } = statusConfig[opt]
            return (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false) }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-muted",
                  opt === value ? "font-semibold" : "font-medium"
                )}
                style={{ color: text }}
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: text }}
                />
                {opt}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// View profile side panel
function ProfilePanel({
  candidate,
  onClose,
}: {
  candidate: Candidate
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-40 flex h-full w-[420px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-[#1f2937]">Applicant Profile</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Identity */}
          <div className="flex items-start gap-4">
            <img
              src={candidate.photo}
              alt={candidate.name}
              className="size-16 shrink-0 rounded-full object-cover ring-2 ring-border"
            />
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold text-[#1f2937]">{candidate.name}</p>
              <p className="text-sm font-medium text-[#3d70fa]">{candidate.position}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#667388]">
                <span className="flex items-center gap-1">
                  <Mail className="size-3" />{candidate.email}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#667388]">
                <span className="flex items-center gap-1">
                  <Phone className="size-3" />{candidate.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />{candidate.location}
                </span>
              </div>
            </div>
          </div>

          {/* AI Score + Status */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-[#f8fafc] px-4 py-3">
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] uppercase tracking-wide text-[#8181a5]">AI Score</p>
              <AiScoreBadge score={candidate.aiScore} />
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] uppercase tracking-wide text-[#8181a5]">Status</p>
              <StatusBadge status={candidate.status} />
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] uppercase tracking-wide text-[#8181a5]">Applied</p>
              <p className="text-xs font-medium text-[#374151]">{candidate.appliedAt}</p>
            </div>
          </div>

          {/* About */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-[#1f2937]">
              <Star className="size-3.5 text-[#ffc555]" />About
            </p>
            <p className="text-sm leading-relaxed text-[#667388]">{candidate.about}</p>
          </div>

          {/* Skills */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-[#1f2937]">
              <Briefcase className="size-3.5 text-[#5e81f4]" />Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((s) => (
                <span key={s} className="rounded-full bg-[#f0f0ff] px-2.5 py-0.5 text-xs font-medium text-[#8a8cd9]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[#1f2937]">
              <Briefcase className="size-3.5 text-[#3b82f6]" />Experience
            </p>
            <div className="space-y-3">
              {candidate.experience.map((exp, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 size-2 shrink-0 rounded-full bg-[#5e81f4]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1f2937]">{exp.role}</p>
                    <p className="text-xs text-[#667388]">{exp.company} · {exp.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[#1f2937]">
              <GraduationCap className="size-3.5 text-[#4aa785]" />Education
            </p>
            <div className="space-y-3">
              {candidate.education.map((edu, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 size-2 shrink-0 rounded-full bg-[#4aa785]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1f2937]">{edu.degree}</p>
                    <p className="text-xs text-[#667388]">{edu.school} · {edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[#1f2937]">
              <FileText className="size-3.5 text-[#ffc555]" />Submitted Documents
            </p>
            <div className="space-y-2">
              {candidate.documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-[#f8fafc] px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff]">
                      <FileText className="size-4 text-[#3b82f6]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#1f2937]">{doc.name}</p>
                      <p className="text-[10px] text-[#8181a5]">{doc.type}</p>
                    </div>
                  </div>
                  <button className="rounded-lg p-1.5 text-[#5e81f4] hover:bg-[#f0f0ff]" title="Download">
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Job Listings",         href: "/dashboard/hr/jobs",       active: false },
  { label: "Applicants",           href: "/dashboard/hr/applicants", active: false },
  { label: "Candidate Evaluation", href: "/dashboard/hr/evaluation", active: true  },
  { label: "Interview Scheduling", href: "#",                         active: false },
  { label: "History",              href: "#",                         active: false },
]

// ── Main Page ─────────────────────────────────────────────────
export default function EvaluationPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(initial)
  const [search, setSearch]         = useState("")
  const [page, setPage]             = useState(1)
  const [viewing, setViewing]       = useState<Candidate | null>(null)

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.position.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  const updateStatus = (id: number, status: EvalStatus) =>
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-[#1c1c1c]">
      <HRIconSidebar />

      {/* ── Text sidebar ── */}
      <aside className="flex w-[280px] shrink-0 flex-col justify-between bg-white py-5 pl-5 pr-3 shadow-sm">
        <nav className="flex flex-col gap-1">
          {sidebarNav.map(({ label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "block w-full rounded px-3 py-2.5 text-left text-base font-medium transition-colors hover:bg-muted",
                active ? "font-semibold text-primary" : "text-[#324054]"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3">
          <button className="w-full rounded px-3 py-2.5 text-left text-base font-medium text-[#324054] hover:bg-muted">
            Settings
          </button>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2">
            <img src={profilePhoto} alt="Michael Smith" className="size-10 shrink-0 rounded-full object-cover" />
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-medium text-[#324054]">Michael Smith</p>
              <p className="truncate text-xs text-[#71839b]">michaelsmith12@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex flex-1 flex-col overflow-hidden p-6">
        {/* Search */}
        <div className="mb-5 flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
          <Search className="size-5 shrink-0 text-[#8181a5]" />
          <input
            type="text"
            placeholder="Search ⌘K"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="flex-1 bg-transparent text-sm text-[#1f2937] outline-none placeholder:text-[rgba(34,48,62,0.4)]"
          />
          <button className="rounded-lg p-1.5 text-[#8181a5] hover:bg-muted">
            <SlidersHorizontal className="size-5" />
          </button>
        </div>

        {/* Table card */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_2fr_1.2fr_0.8fr_1.2fr_1.8fr] items-center border-b border-border px-6 py-3.5">
            {["Candidate Name", "Job Position", "Applied", "AI Score", "Status", "Actions"].map((h, i) => (
              <span
                key={h}
                className={cn("text-sm font-medium text-[#1f2937]", i === 5 && "text-right")}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {paginated.length > 0 ? paginated.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[2fr_2fr_1.2fr_0.8fr_1.2fr_1.8fr] items-center gap-x-3 px-6 py-3 transition-colors hover:bg-[#f8fafc]"
              >
                {/* Name */}
                <div className="flex min-w-0 items-center gap-3">
                  <img src={c.photo} alt={c.name} className="size-9 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#1f2937]">{c.name}</p>
                    <p className="truncate text-xs text-[#667388]">{c.email}</p>
                  </div>
                </div>

                {/* Position */}
                <div className="min-w-0">
                  <p className="truncate text-sm text-[#1f2937]">{c.position}</p>
                  <p className="truncate text-xs text-[#8181a5]">{c.department}</p>
                </div>

                {/* Applied */}
                <span className="text-sm text-[#667388]">{c.appliedAt}</span>

                {/* AI Score */}
                <div>
                  <AiScoreBadge score={c.aiScore} />
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={c.status} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <StatusDropdown
                    value={c.status}
                    onChange={(v) => updateStatus(c.id, v)}
                  />
                  <button
                    onClick={() => setViewing(c)}
                    className="h-[28px] rounded border border-[#6e39cb] px-3 text-xs font-medium text-[#6e39cb] transition-colors hover:bg-[#6e39cb]/5"
                  >
                    View
                  </button>
                </div>
              </div>
            )) : (
              <div className="flex h-32 items-center justify-center text-sm text-[#8181a5]">
                No candidates match your search.
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-end gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex size-8 items-center justify-center rounded-full text-[#4b5563] transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                p === page ? "bg-[#3b6feb] text-white" : "text-[#4b5563] hover:bg-muted"
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex size-8 items-center justify-center rounded-full text-[#4b5563] transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </main>

      {/* Profile panel */}
      {viewing && (
        <ProfilePanel candidate={viewing} onClose={() => setViewing(null)} />
      )}
    </div>
  )
}
