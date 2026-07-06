import { Zap, Globe, Award, BarChart3, Cloud } from "lucide-react";

const companies = [
  { name: "TechNova", icon: Zap },
  { name: "BrightFuture", icon: Globe },
  { name: "InnovateLab", icon: Award },
  { name: "DataBridge", icon: BarChart3 },
  { name: "CloudScale", icon: Cloud },
  { name: "VoltEdge", icon: Zap },
];

export function TrustedBySection() {
  return (
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
  );
}
