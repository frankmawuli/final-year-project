import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const metrics = [
  { title: "AI Candidate Match", value: "92%", label: "Match Accuracy", pct: 92 },
  { title: "Time to Hire", value: "28%", label: "Faster", pct: 28 },
  { title: "Offer Acceptance", value: "85%", label: "Acceptance Rate", pct: 85 },
  { title: "Employee Retention", value: "90%", label: "Retention Rate", pct: 90 },
];

function MetricCard({
  title,
  value,
  label,
  pct,
}: {
  title: string;
  value: string;
  label: string;
  pct: number;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-1 text-xs text-gray-400">{title}</div>
      <div className="text-[28px] font-bold leading-none text-gray-900">{value}</div>
      <div className="mb-3 mt-0.5 text-xs text-gray-400">{label}</div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function WhyChooseSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
              Why Choose CoreRecruiter
            </div>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-900">
              Smarter Tools.
              <br />
              Stronger Teams.
              <br />
              Better Results.
            </h2>
            <p className="mb-8 max-w-md text-base leading-relaxed text-gray-500">
              CoreRecruiter combines AI, automation, and human-centric design to help organizations
              achieve more.
            </p>
            <Button className="h-10 gap-2 bg-primary text-white hover:bg-primary/90">
              See How It Works
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right — metric cards */}
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((m) => (
              <MetricCard key={m.title} {...m} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
