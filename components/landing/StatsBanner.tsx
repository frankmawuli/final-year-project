import { Building2, Users, Briefcase, Star } from "lucide-react";

const platformStats = [
  { value: "1,000+", label: "Companies Trust Us", icon: Building2 },
  { value: "50,000+", label: "Active Users", icon: Users },
  { value: "200K+", label: "Hires Made", icon: Briefcase },
  { value: "98%", label: "Customer Satisfaction", icon: Star },
];

export function StatsBanner() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="gradient-primary rounded-xl px-8 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {platformStats.map(({ value, label, icon: Icon }, index) => (
              <div
                key={label}
                className="relative flex items-center justify-center gap-4"
              >
                {index !== platformStats.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-12 -translate-y-1/2 border-r border-white/20 lg:block" />
                )}
                <Icon className="h-10 w-10 text-white/40" />
                <div>
                  <h3 className="text-3xl font-bold text-white">{value}</h3>
                  <p className="text-sm text-white/70">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
