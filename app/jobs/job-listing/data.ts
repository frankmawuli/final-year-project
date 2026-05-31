export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  level: string;
  jobType: string;
  salary: string;
  description: string;
  tags: string[];
  date: string;
  logoBg: string;
  logoText: string;
};

export type FilterItem = {
  label: string;
  count: number;
  checked: boolean;
};

export const EMPLOYMENT_TYPES: Omit<FilterItem, "checked">[] = [
  { label: "Full Time Jobs", count: 199 },
  { label: "Part Time Jobs", count: 30 },
  { label: "Remote Jobs", count: 33 },
  { label: "Training Jobs", count: 15 },
];

export const SENIORITY_LEVELS: Omit<FilterItem, "checked">[] = [
  { label: "Student Level", count: 48 },
  { label: "Entry Level", count: 21 },
  { label: "Mid Level", count: 150 },
  { label: "Senior Level", count: 30 },
  { label: "Directors", count: 20 },
  { label: "VP or Above", count: 13 },
];

export const JOBS: Job[] = [
  {
    id: 1,
    title: "UX UI Designer",
    company: "MAGIC UNICORN",
    location: "ESTONIA, TALLIN",
    level: "Student-Entry",
    jobType: "Remote Job",
    salary: "$10520 PA",
    description:
      "In this position, you will work closely with cross-functional peers, including Product Managers, Data Analysts, and Engineers to make offers, bundles, and messaging efficient and seamless.",
    tags: ["Design", "UX", "UI"],
    date: "24 March 2024",
    logoBg: "#1B5E20",
    logoText: "MU",
  },
  {
    id: 2,
    title: "UI Artist",
    company: "BUSINESS CORPORATE GROUP",
    location: "DENMARK, KOPENHAGEN",
    level: "Mid-Senior",
    jobType: "Remote Job",
    salary: "$52100 PA",
    description:
      "With design ingrained at all levels of our organization, including senior leadership, your impact will be valued and recognized. Join a well-established design organization.",
    tags: ["Design", "Senior", "Remote"],
    date: "24 March 2024",
    logoBg: "#E65100",
    logoText: "BC",
  },
  {
    id: 3,
    title: "Senior Product Designer",
    company: "GUY",
    location: "CZECH REPUBLIC, PRAGUE",
    level: "Senior",
    jobType: "Full-Time",
    salary: "$100000 PA",
    description:
      "We've adopted a hybrid workplace model where 2 days in office are recommended but not enforced. It's up to you and your team to decide on the exact days you'll spend working together.",
    tags: ["Design", "Product", "Remote"],
    date: "23 March 2024",
    logoBg: "#1565C0",
    logoText: "GY",
  },
  {
    id: 4,
    title: "Senior Producrt Designer",
    company: "SINTRA GROUP",
    location: "ALBANIA, TIRANA",
    level: "Mid-Senior",
    jobType: "Full-Time",
    salary: "$60520 PA",
    description:
      "Since our inception in 2014, founded by a team of scientists from CERN, we have dedicated ourselves to providing free and open-source technology to millions worldwide and freedom online.",
    tags: ["Design", "Senior", "AI"],
    date: "28 March 2024",
    logoBg: "#0D47A1",
    logoText: "SG",
  },
  {
    id: 5,
    title: "UI Designer",
    company: "MOON ACTIVE",
    location: "ARGENTINA, BUENOS AIRES",
    level: "Senior",
    jobType: "Full-Time",
    salary: "$84800 PA",
    description:
      "We're a growing, ambitious HealthTech business building the essential digital health partner of tomorrow to empower women, girls with the knowledge and support they need to live better.",
    tags: ["Design", "Senior", "Full-Time"],
    date: "28 March 2024",
    logoBg: "#1A237E",
    logoText: "MA",
  },
  {
    id: 6,
    title: "Lead Product Designer",
    company: "GUY",
    location: "BELGIUM, BRUSSELS",
    level: "Lead",
    jobType: "Full-Time",
    salary: "$101100 PA",
    description:
      "In July, we secured a $200M investment led by General Atlantic to help revolutionise women's health, and became the first purely digital consumer women's health app to achieve unicorn status!",
    tags: ["Design", "Lead", "Full-Time"],
    date: "26 March 2024",
    logoBg: "#212121",
    logoText: "GY",
  },
  {
    id: 7,
    title: "Senior Producrt Designer",
    company: "COWI",
    location: "FINLAND, HELSINKI",
    level: "Senior",
    jobType: "Full-Time",
    salary: "$100500 PA",
    description:
      "In this position, you will work closely with cross-functional peers, including Product Managers, Data Analysts, and Engineers to make offers, bundles, and messaging efficient and seamless.",
    tags: ["Design", "Senior", "Full-Time"],
    date: "22 March 2024",
    logoBg: "#0277BD",
    logoText: "CW",
  },
  {
    id: 8,
    title: "Senior Game Designer",
    company: "UTIT GROUP",
    location: "ITALIA, ROME",
    level: "Senior",
    jobType: "Full-Time",
    salary: "$100800 PA",
    description:
      "We've adopted a hybrid workplace model where 2 days in office are recommended but not enforced. It's up to you and your team to decide on the exact days you'll spend working together.",
    tags: ["Design", "Game", "Full-Time"],
    date: "22 March 2024",
    logoBg: "#2E7D32",
    logoText: "UG",
  },
  {
    id: 9,
    title: "Senior Concept Artist, Generalist",
    company: "BEHANCE",
    location: "GERMANY, BERLIN",
    level: "Senior",
    jobType: "Remote Job",
    salary: "$102100 PA",
    description:
      "With design ingrained at all levels of our organization, including senior leadership, your impact will be valued and recognized. Join a well-established design organization.",
    tags: ["Design", "Senior", "Remote"],
    date: "22 March 2024",
    logoBg: "#0057FF",
    logoText: "Bē",
  },
];

export function parseSalary(s: string): number {
  const m = s.match(/[\d,]+/);
  return m ? parseInt(m[0].replace(/,/g, ""), 10) : 0;
}

export const EMPLOYMENT_MAP: Record<string, string> = {
  "Full Time Jobs": "full",
  "Part Time Jobs": "part",
  "Remote Jobs": "remote",
  "Training Jobs": "training",
};

export const SENIORITY_MAP: Record<string, string[]> = {
  "Student Level": ["student"],
  "Entry Level": ["entry"],
  "Mid Level": ["mid"],
  "Senior Level": ["senior"],
  Directors: ["director"],
  "VP or Above": ["vp", "lead"],
};

export const UNIQUE_COUNTRIES = Array.from(
  new Set(JOBS.map((j) => j.location.split(",")[0].trim()))
).sort();

export const JOB_TYPES = Array.from(new Set(JOBS.map((j) => j.jobType))).sort();
