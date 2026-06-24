const SECTION_SUMMARIES: { title: string; summary: string }[] = [
  {
    title: "About Me",
    summary:
      "Full-stack developer with 1 year of hands-on experience building web and mobile products. Comfortable across the stack, from React/Next.js front ends to Node.js APIs, with a strong focus on clean, maintainable code and shipping features that solve real problems for users.",
  },
  {
    title: "Employment & Availability",
    summary:
      "Currently working in Accounting, Auditing & Finance and open to Full Time roles in the same field. Based in Nigeria, with a preference for opportunities in Nigeria and Ghana. Actively looking and available immediately, with a monthly salary expectation of ₦400,000.",
  },
  {
    title: "Experience & Education",
    summary:
      "2 years as a Frontend Developer at Flutterwave in Lagos, Nigeria, building and maintaining customer-facing dashboards in React and TypeScript. Holds a BSc in Computer Science from the University of Lagos (2019 – 2023).",
  },
  {
    title: "Certificates & Awards",
    summary:
      "AWS Certified Solutions Architect – Associate, issued by Amazon Web Services (Jan 2024). Also holds a Meta Front-End Developer Professional Certificate (Aug 2023).",
  },
  {
    title: "Languages & Skills",
    summary:
      "Fluent in English (Native / Bilingual) and conversational in French. Core skills include React, TypeScript, Node.js, Tailwind CSS, and Project Management.",
  },
  {
    title: "CV / Portfolio / Cover Letter",
    summary:
      "CV on file (Mawuli_Frank_Resume.pdf). Portfolio available at mawulifrank.dev. Cover letter uploaded (Mawuli_Frank_Cover_Letter.pdf).",
  },
];

export function OverviewTab() {
  return (
    <div className="bg-white rounded-b-xl border border-[#E5E7EB] divide-y divide-[#F3F4F6]">
      {SECTION_SUMMARIES.map((section) => (
        <div key={section.title} className="px-6 py-6">
          <h3 className="text-[15px] font-semibold text-foreground">{section.title}</h3>
          <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">{section.summary}</p>
        </div>
      ))}
    </div>
  );
}
