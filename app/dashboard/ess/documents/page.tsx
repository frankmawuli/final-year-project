"use client"

import { useState } from "react"
import {
  FileText, Award, Shield, Receipt, Upload,
  Download, Eye, Search, X, CheckCircle2, Clock,
  FileImage, File,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────
type DocCategory = "Company-issued" | "Certificate" | "Personal" | "Payroll" | "Uploaded"
type DocStatus   = "Verified" | "Pending" | "Expired"
type DocFileType = "pdf" | "png" | "jpg" | "docx"

interface Document {
  id:        number
  name:      string
  category:  DocCategory
  fileType:  DocFileType
  size:      string
  issuedBy:  string
  issuedOn:  string
  expiresOn?: string
  status:    DocStatus
  preview?:  string // simulated content description
}

// ── Style maps ───────────────────────────────────────────────────
const categoryIcon: Record<DocCategory, React.ElementType> = {
  "Company-issued": FileText,
  "Certificate":    Award,
  "Personal":       Shield,
  "Payroll":        Receipt,
  "Uploaded":       Upload,
}

const categoryColor: Record<DocCategory, string> = {
  "Company-issued": "#5e81f4",
  "Certificate":    "#f59e0b",
  "Personal":       "#10b981",
  "Payroll":        "#8b5cf6",
  "Uploaded":       "#f472b6",
}

const categoryBg: Record<DocCategory, string> = {
  "Company-issued": "bg-[#eef2ff]",
  "Certificate":    "bg-[#fffbeb]",
  "Personal":       "bg-[#f0fdf4]",
  "Payroll":        "bg-[#f5f3ff]",
  "Uploaded":       "bg-[#fdf2f8]",
}

const statusBadge: Record<DocStatus, string> = {
  Verified: "bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]",
  Pending:  "bg-[#fffbeb] text-[#d97706] border border-[#d97706]",
  Expired:  "bg-[#fef2f2] text-[#dc2626] border border-[#dc2626]",
}

const statusIcon: Record<DocStatus, React.ReactNode> = {
  Verified: <CheckCircle2 className="size-3" />,
  Pending:  <Clock className="size-3" />,
  Expired:  <X className="size-3" />,
}

const fileTypeIcon: Record<DocFileType, React.ElementType> = {
  pdf:  FileText,
  png:  FileImage,
  jpg:  FileImage,
  docx: File,
}

const fileTypeColor: Record<DocFileType, string> = {
  pdf:  "text-rose-500",
  png:  "text-sky-500",
  jpg:  "text-sky-500",
  docx: "text-blue-600",
}

const TABS: (DocCategory | "All")[] = ["All", "Company-issued", "Certificate", "Personal", "Payroll", "Uploaded"]

// ── Data ─────────────────────────────────────────────────────────
const docs: Document[] = [
  {
    id: 1,
    name:     "Employment Contract",
    category: "Company-issued",
    fileType: "pdf",
    size:     "284 KB",
    issuedBy: "HR Department",
    issuedOn: "Jan 15, 2024",
    status:   "Verified",
    preview:  "Employment Agreement between CoreRecruiter Ltd. and Muhammad Rifky Andrianto. Position: UI/UX Designer. Start date: February 1, 2024.",
  },
  {
    id: 2,
    name:     "Offer Letter",
    category: "Company-issued",
    fileType: "pdf",
    size:     "156 KB",
    issuedBy: "HR Department",
    issuedOn: "Jan 10, 2024",
    status:   "Verified",
    preview:  "Formal offer of employment for the role of UI/UX Designer at a base salary of $4,500/month.",
  },
  {
    id: 3,
    name:     "Promotion Letter – Senior Designer",
    category: "Company-issued",
    fileType: "pdf",
    size:     "98 KB",
    issuedBy: "HR Department",
    issuedOn: "Sep 01, 2025",
    status:   "Verified",
    preview:  "This letter confirms your promotion to Senior UI/UX Designer effective September 1, 2025.",
  },
  {
    id: 4,
    name:     "Figma Advanced – Completion Certificate",
    category: "Certificate",
    fileType: "pdf",
    size:     "512 KB",
    issuedBy: "Figma Academy",
    issuedOn: "Mar 10, 2026",
    expiresOn:"Mar 10, 2028",
    status:   "Verified",
    preview:  "This certifies that Muhammad Rifky Andrianto has successfully completed the Figma Advanced Components course (16 hours).",
  },
  {
    id: 5,
    name:     "AWS Cloud Practitioner",
    category: "Certificate",
    fileType: "pdf",
    size:     "340 KB",
    issuedBy: "Amazon Web Services",
    issuedOn: "Nov 22, 2024",
    expiresOn:"Nov 22, 2027",
    status:   "Verified",
    preview:  "AWS Certified Cloud Practitioner — Validates foundational cloud knowledge and skills.",
  },
  {
    id: 6,
    name:     "Design Thinking Workshop",
    category: "Certificate",
    fileType: "pdf",
    size:     "210 KB",
    issuedBy: "IDEO U",
    issuedOn: "Jun 05, 2023",
    expiresOn:"Jun 05, 2025",
    status:   "Expired",
    preview:  "Certificate of participation in the Design Thinking for Innovation workshop.",
  },
  {
    id: 7,
    name:     "National ID Card",
    category: "Personal",
    fileType: "jpg",
    size:     "1.2 MB",
    issuedBy: "Government",
    issuedOn: "Apr 01, 2020",
    expiresOn:"Apr 01, 2030",
    status:   "Verified",
    preview:  "Government-issued national identity document.",
  },
  {
    id: 8,
    name:     "Passport Scan",
    category: "Personal",
    fileType: "jpg",
    size:     "980 KB",
    issuedBy: "Passport Office",
    issuedOn: "Jul 15, 2021",
    expiresOn:"Jul 15, 2031",
    status:   "Verified",
    preview:  "Scanned copy of employee passport for HR records.",
  },
  {
    id: 9,
    name:     "P60 – Annual Earnings 2025",
    category: "Payroll",
    fileType: "pdf",
    size:     "124 KB",
    issuedBy: "Payroll Department",
    issuedOn: "Jan 31, 2026",
    status:   "Verified",
    preview:  "End-of-year tax statement for the period April 2024 – March 2025. Total earnings: $51,600. Tax paid: $11,352.",
  },
  {
    id: 10,
    name:     "P60 – Annual Earnings 2024",
    category: "Payroll",
    fileType: "pdf",
    size:     "118 KB",
    issuedBy: "Payroll Department",
    issuedOn: "Jan 31, 2025",
    status:   "Verified",
    preview:  "End-of-year tax statement for the period April 2023 – March 2024.",
  },
  {
    id: 11,
    name:     "Medical Certificate – Mar 2026",
    category: "Uploaded",
    fileType: "pdf",
    size:     "88 KB",
    issuedBy: "City Health Clinic",
    issuedOn: "Mar 12, 2026",
    status:   "Verified",
    preview:  "Medical certificate supporting sick leave request. Physician: Dr. Amira Khalid.",
  },
  {
    id: 12,
    name:     "Training Receipt – Figma Course",
    category: "Uploaded",
    fileType: "pdf",
    size:     "62 KB",
    issuedBy: "Figma Academy",
    issuedOn: "Feb 28, 2026",
    status:   "Pending",
    preview:  "Receipt for training reimbursement claim. Amount: $149.",
  },
]

// ── Download helper ───────────────────────────────────────────────
function downloadDoc(doc: Document) {
  const content = `Document: ${doc.name}\nIssued by: ${doc.issuedBy}\nDate: ${doc.issuedOn}\nStatus: ${doc.status}\n\n${doc.preview ?? ""}`
  const blob = new Blob([content], { type: "text/plain" })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement("a"), {
    href:     url,
    download: `${doc.name.replace(/\s+/g, "_")}.txt`,
  })
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// ── Preview modal ─────────────────────────────────────────────────
function PreviewModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const Icon    = categoryIcon[doc.category]
  const FIcon   = fileTypeIcon[doc.fileType]
  const catClr  = categoryColor[doc.category]
  const catBg   = categoryBg[doc.category]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-start gap-4">
            <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", catBg)}>
              <Icon className="size-5" style={{ color: catClr }} />
            </div>
            <div>
              <p className="font-semibold text-foreground">{doc.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: catClr }}
                >
                  {doc.category}
                </span>
                <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", statusBadge[doc.status])}>
                  {statusIcon[doc.status]} {doc.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        {/* Preview area */}
        <div className="mx-6 mt-5 overflow-hidden rounded-xl border border-border bg-muted/30">
          {/* Fake document viewer toolbar */}
          <div className="flex items-center justify-between border-b border-border bg-white px-4 py-2.5">
            <div className="flex items-center gap-2">
              <FIcon className={cn("size-4", fileTypeColor[doc.fileType])} />
              <span className="text-xs font-medium text-foreground">{doc.name}.{doc.fileType}</span>
            </div>
            <span className="text-xs text-muted-foreground">{doc.size}</span>
          </div>
          {/* Simulated document body */}
          <div className="flex min-h-[180px] flex-col items-center justify-center gap-4 p-6">
            <div className="flex size-14 items-center justify-center rounded-2xl" style={{ backgroundColor: catBg.replace("bg-[", "").replace("]", "") }}>
              <Icon className="size-7" style={{ color: catClr }} />
            </div>
            <div className="max-w-xs text-center">
              <p className="text-sm font-medium text-foreground">{doc.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{doc.preview}</p>
            </div>
            <span className="mt-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {doc.fileType.toUpperCase()} · {doc.size}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="mx-6 mt-4 grid grid-cols-2 gap-3">
          {[
            { label: "Issued by",   value: doc.issuedBy  },
            { label: "Issued on",   value: doc.issuedOn  },
            ...(doc.expiresOn ? [{ label: "Expires on", value: doc.expiresOn }] : []),
            { label: "File type",   value: doc.fileType.toUpperCase() },
          ].map((m) => (
            <div key={m.label} className="rounded-lg bg-muted/40 px-3 py-2.5">
              <p className="text-[11px] text-muted-foreground">{m.label}</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Close
          </button>
          <button
            onClick={() => downloadDoc(doc)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <Download className="size-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Document card ─────────────────────────────────────────────────
function DocCard({ doc, onPreview }: { doc: Document; onPreview: () => void }) {
  const Icon  = categoryIcon[doc.category]
  const FIcon = fileTypeIcon[doc.fileType]
  const clr   = categoryColor[doc.category]
  const bg    = categoryBg[doc.category]

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Top row */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", bg)}>
          <Icon className="size-5" style={{ color: clr }} />
        </div>
        <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", statusBadge[doc.status])}>
          {statusIcon[doc.status]}{doc.status}
        </span>
      </div>

      {/* Name */}
      <p className="mb-0.5 text-sm font-semibold leading-snug text-foreground line-clamp-2">
        {doc.name}
      </p>
      <p className="text-xs text-muted-foreground">{doc.issuedBy}</p>

      {/* Meta row */}
      <div className="mt-2 flex items-center gap-2">
        <FIcon className={cn("size-3.5 shrink-0", fileTypeColor[doc.fileType])} />
        <span className="text-[11px] text-muted-foreground">{doc.fileType.toUpperCase()} · {doc.size}</span>
      </div>

      {doc.expiresOn && (
        <p className={cn(
          "mt-1 text-[11px]",
          doc.status === "Expired" ? "text-[#dc2626]" : "text-muted-foreground"
        )}>
          {doc.status === "Expired" ? "Expired" : "Expires"}: {doc.expiresOn}
        </p>
      )}

      {/* Actions */}
      <div className="mt-auto flex gap-2 pt-3">
        <button
          onClick={onPreview}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-foreground hover:bg-muted"
        >
          <Eye className="size-3.5" />
          Preview
        </button>
        <button
          onClick={() => downloadDoc(doc)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-white hover:opacity-90"
        >
          <Download className="size-3.5" />
          Download
        </button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────
export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<DocCategory | "All">("All")
  const [search,    setSearch]    = useState("")
  const [preview,   setPreview]   = useState<Document | null>(null)

  const filtered = docs.filter((d) => {
    const matchTab    = activeTab === "All" || d.category === activeTab
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.issuedBy.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  // Stats
  const total      = docs.length
  const verified   = docs.filter((d) => d.status === "Verified").length
  const pending    = docs.filter((d) => d.status === "Pending").length
  const expired    = docs.filter((d) => d.status === "Expired").length

  return (
    <div className="flex h-full flex-col">
      {/* Mobile title */}
      <div className="border-b border-border bg-white px-4 py-3 lg:hidden">
        <h1 className="text-base font-semibold text-foreground">My Documents</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">Documents › All</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

        {/* ── Stats row ── */}
     
        {/* ── Category tabs + search ── */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((tab) => {
              const count = tab === "All" ? docs.length : docs.filter((d) => d.category === tab).length
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    activeTab === tab
                      ? "bg-primary text-white"
                      : "border border-border bg-white text-muted-foreground hover:bg-muted"
                  )}
                >
                  {tab}
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    activeTab === tab ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 shadow-sm">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
              className="w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Document grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((doc) => (
              <DocCard key={doc.id} doc={doc} onPreview={() => setPreview(doc)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-20">
            <FileText className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">No documents found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different category or search term</p>
          </div>
        )}

      </div>

      {preview && <PreviewModal doc={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
