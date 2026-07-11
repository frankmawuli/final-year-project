import { ArrowRight, Users, UserPlus, DollarSign, BarChart3, TrendingUp, Briefcase } from "lucide-react";

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

export function FeaturesSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-11 text-center">
          <h2 className="mb-3 text-2xl font-bold text-gray-900 lg:text-3xl">
            A Complete Platform for Modern HR Teams
          </h2>
          <p className="text-sm text-gray-500">
            Everything you need to hire, manage, and grow your workforce.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-xs font-semibold text-gray-900">{title}</h3>
              <p className="mb-3 text-xs leading-relaxed text-gray-500">{desc}</p>
              <button className="flex items-center gap-1 text-xs font-medium text-primary transition-all group-hover:gap-1.5">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
