import { Search, LayoutGrid, CheckSquare, MapPin } from "lucide-react";

const FEATURES = [
  {
    Icon: Search,
    title: "Easy Job Search",
    desc: "Find jobs that match your skills and preferences.",
  },
  {
    Icon: LayoutGrid,
    title: "Verified Employers",
    desc: "All companies are verified to ensure trust and safety.",
  },
  {
    Icon: CheckSquare,
    title: "Apply Effortlessly",
    desc: "Apply in just a few clicks with your profile.",
  },
  {
    Icon: MapPin,
    title: "Career Resources",
    desc: "Get tips and resources to accelerate your career.",
  },
];

export function Features() {
  return (
    <section className="py-6 bg-white my-12 sm:my-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-primary/10 rounded-2xl px-4 sm:px-10 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-card shadow-sm flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-[13.5px] font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
