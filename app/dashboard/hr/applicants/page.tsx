"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { HRIconSidebar } from "@/components/hr-icon-sidebar"
import { cn } from "@/lib/utils"

// ── Asset URLs ───────────────────────────────────────────────
const profilePhoto = "/assets/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png"

// ── Candidate photos ─────────────────────────────────────────
const photos = {
  tigerNixon:         "/assets/2d1ac17bcf9792bb9bf0aa23b05c618ef381e258.png",
  garrettWinters:     "/assets/2dba1db7966039308370470fce52b3b220f9a3fb.png",
  ashtonCox:          "/assets/5f121b335ad17b18af3c3c797e7a5f1afc3ec39f.png",
  tigerNixon2:        "/assets/9bc2b88fce6e56306262a2efd5513136569ca255.png",
  cedricKelly:        "/assets/635a3bf857069957b4442100197a1e910ea3121d.png",
  airiSatou:          "/assets/e4478e9b5a6f2c79870bedf6446dd7b9c9c09ee0.png",
  brielleWilliamson:  "/assets/3b57a33d98b5a1b80a335988932aa248a0875725.png",
  herrodChandler:     "/assets/79f659fe748e86736e3698f50db3ab3a1e03bf36.png",
  rhonaDavidson:      "/assets/277048e308d3c618330fc9b64ac87f9bdc187ddd.png",
  colleenHurst:       "/assets/e5675cc794aa5fab44f80689cbd19c4db987c3e7.png",
  soonyaeKim:         "/assets/c8f5ae43e33ebde623eb7d3b22aeb6930878a4ce.png",
  jennaElliott:       "/assets/ba50d841bff1eb820c0b59f56f778fbbf8b8a8c3.png",
}

// ── Types ─────────────────────────────────────────────────────
interface Social {
  facebook:  string
  linkedin:  string
  twitter:   string
}

interface Candidate {
  id:       number
  name:     string
  photo:    string
  email:    string
  position: string
  city:     string
  salary:   string
  social:   Social
}

// ── Candidate Data ─────────────────────────────────────────────
const allCandidates: Candidate[] = [
  {
    id: 1,
    name: "Tiger Nixon",
    photo: photos.tigerNixon,
    email: "brune33@gmail.com",
    position: "Web Developer",
    city: "Tokyo",
    salary: "$433,060",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
  {
    id: 2,
    name: "Garrett Winters",
    photo: photos.garrettWinters,
    email: "garrett.winters@gmail.com",
    position: "Accountant",
    city: "San Francisco",
    salary: "$433,060",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
  {
    id: 3,
    name: "Ashton Cox",
    photo: photos.ashtonCox,
    email: "ashton.cox@gmail.com",
    position: "Technical Author",
    city: "Edinburgh",
    salary: "$320,800",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
  {
    id: 4,
    name: "Tiger Nixon",
    photo: photos.tigerNixon2,
    email: "tiger.nixon@gmail.com",
    position: "Javascript Developer",
    city: "Tokyo",
    salary: "$170,750",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
  {
    id: 5,
    name: "Cedric Kelly",
    photo: photos.cedricKelly,
    email: "cedric.kelly@gmail.com",
    position: "Integration Specialist",
    city: "New York",
    salary: "$86,000",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
  {
    id: 6,
    name: "Airi Satou",
    photo: photos.airiSatou,
    email: "airi.satou@gmail.com",
    position: "Sales Assistant",
    city: "Edinburgh",
    salary: "$433,060",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
  {
    id: 7,
    name: "Brielle Williamson",
    photo: photos.brielleWilliamson,
    email: "brielle.w@gmail.com",
    position: "Integration Specialist",
    city: "Berlin",
    salary: "$162,700",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
  {
    id: 8,
    name: "Herrod Chandler",
    photo: photos.herrodChandler,
    email: "herrod.chandler@gmail.com",
    position: "Javascript Developer",
    city: "Islamabad",
    salary: "$372,000",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
  {
    id: 9,
    name: "Rhona Davidson",
    photo: photos.rhonaDavidson,
    email: "rhona.davidson@gmail.com",
    position: "Software Engineer",
    city: "Delhi",
    salary: "$137,500",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
  {
    id: 10,
    name: "Colleen Hurst",
    photo: photos.colleenHurst,
    email: "colleen.hurst@gmail.com",
    position: "Javascript Developer",
    city: "New York",
    salary: "$205,500",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
  {
    id: 11,
    name: "Sonya Kim",
    photo: photos.soonyaeKim,
    email: "sonya.kim@gmail.com",
    position: "Software Engineer",
    city: "Seoul",
    salary: "$118,200",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
  {
    id: 12,
    name: "Jenna Elliott",
    photo: photos.jennaElliott,
    email: "jenna.elliott@gmail.com",
    position: "Product Designer",
    city: "London",
    salary: "$145,000",
    social: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter:  "https://x.com",
    },
  },
]

const ROWS_PER_PAGE = 9

// ── Social icon buttons ────────────────────────────────────────
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="size-3">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="size-3">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="size-3">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function SocialLinks({ social }: { social: Social }) {
  return (
    <div className="flex items-center gap-1">
      <a
        href={social.facebook}
        target="_blank"
        rel="noopener noreferrer"
        title="Facebook profile"
        className="flex size-6 items-center justify-center rounded-full bg-[#1877f2] transition-opacity hover:opacity-85"
      >
        <FacebookIcon />
      </a>
      <a
        href={social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        title="LinkedIn profile"
        className="flex size-6 items-center justify-center rounded-full bg-[#0a66c2] transition-opacity hover:opacity-85"
      >
        <LinkedInIcon />
      </a>
      <a
        href={social.twitter}
        target="_blank"
        rel="noopener noreferrer"
        title="X (Twitter) profile"
        className="flex size-6 items-center justify-center rounded-full bg-[#000000] transition-opacity hover:opacity-75"
      >
        <XIcon />
      </a>
    </div>
  )
}

// ── Sidebar nav ───────────────────────────────────────────────
const sidebarNav = [
  { label: "Job Listings",         active: false, href: "/dashboard/hr/jobs"       },
  { label: "Applicants",           active: true,  href: "/dashboard/hr/applicants" },
  { label: "Candidate Evaluation", active: false, href: "/dashboard/hr/evaluation" },
  { label: "Interview Scheduling", active: false, href: "#"                        },
  { label: "History",              active: false, href: "#"                        },
]

// ── Main Page ─────────────────────────────────────────────────
export default function ApplicantsPage() {
  const [search, setSearch] = useState("")
  const [page, setPage]     = useState(1)

  const filtered = allCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.position.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-[#1c1c1c]">
      <HRIconSidebar />

      {/* ── Text sidebar ── */}
      <aside className="flex w-[280px] shrink-0 flex-col justify-between bg-white py-5 pl-5 pr-3 shadow-sm">
        <nav className="flex flex-col gap-1">
          {sidebarNav.map(({ label, active, href }) => (
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
        {/* Search bar */}
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
          <div className="grid grid-cols-[2fr_2fr_auto_1.2fr_1.5fr] items-center border-b border-border px-6 py-3">
            {["Candidate Name", "Email", "Social", "City", "Job Title"].map((col) => (
              <span key={col} className="text-sm font-medium text-[#1f2937]">
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {paginated.length > 0 ? (
              paginated.map((candidate) => (
                <div
                  key={candidate.id}
                  className="grid grid-cols-[2fr_2fr_auto_1.2fr_1.5fr] items-center gap-x-4 px-6 py-3.5 transition-colors hover:bg-[#f8fafc]"
                >
                  {/* Candidate Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="size-9 shrink-0 rounded-full object-cover"
                    />
                    <span className="truncate text-sm font-medium text-[#1f2937]">
                      {candidate.name}
                    </span>
                  </div>

                  {/* Email */}
                  <span className="truncate text-sm text-[#667388]">{candidate.email}</span>

                  {/* Social */}
                  <div className="flex justify-start pr-6">
                    <SocialLinks social={candidate.social} />
                  </div>

                  {/* City */}
                  <span className="truncate text-sm text-[#667388] ">{candidate.city}</span>

                  {/* Job Title */}
                  <span className="truncate text-sm text-[#667388]">{candidate.position}</span>
                </div>
              ))
            ) : (
              <div className="flex h-32 items-center justify-center text-sm text-[#8181a52f]">
                No applicants match your search.
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
                p === page
                  ? "bg-[#3b6feb] text-white"
                  : "text-[#4b5563] hover:bg-muted"
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
    </div>
  )
}
