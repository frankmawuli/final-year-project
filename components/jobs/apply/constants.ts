import {
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Link2,
  FileText,
} from "lucide-react"

export const STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Name, contact & profile photo",
    icon: UserIcon,
  },
  {
    id: 2,
    title: "Professional Details",
    description: "Role, skills & resume",
    icon: Briefcase,
  },
  {
    id: 3,
    title: "Education",
    description: "Degree, school & graduation",
    icon: GraduationCap,
  },
  {
    id: 4,
    title: "Social & Portfolio",
    description: "LinkedIn, GitHub & links",
    icon: Link2,
  },
  {
    id: 5,
    title: "Additional Info",
    description: "Cover letter & consent",
    icon: FileText,
  },
]

export const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1–2 years",
  "2–3 years",
  "3–5 years",
  "5–7 years",
  "7–10 years",
  "10–15 years",
  "15+ years",
]

export const DEGREE_OPTIONS = [
  "High School Diploma / GED",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "MBA",
  "PhD / Doctorate",
  "Professional Certification",
  "Bootcamp / Vocational Training",
  "Self-taught / No formal degree",
  "Other",
]

export const GRAD_YEARS = Array.from({ length: 40 }, (_, i) => String(new Date().getFullYear() - i))

export interface ExtraLink {
  label: string
  url: string
}

export interface Step1Data {
  fullName: string
  email: string
  phone: string
}
export interface Step2Data {
  jobTitle: string
  skills: string[]
  experience: string
  resumeFileName: string | null
  resumeUrl: string | null
}
export interface Step3Data {
  degree: string
  school: string
  gradYear: string
  gpa: string
}
export interface Step4Data {
  linkedin: string
  github: string
  website: string
  twitter: string
  extraLinks: ExtraLink[]
}
export interface Step5Data {
  coverLetter: string
  references: string
  consent: boolean
}
