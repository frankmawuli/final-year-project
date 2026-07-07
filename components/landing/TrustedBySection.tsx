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
    <section className="border-y border-gray-100 bg-gray-50/50 py-8">
      <div className="mx-auto max-w-7xl px-5">
        <p className="mb-6 text-center text-xs text-gray-400">
          Trusted by 1,000+ companies worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {companies.map(({ name, icon: Icon }) => (
            <div
              key={name}
              className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-gray-600"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-semibold tracking-wide">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
