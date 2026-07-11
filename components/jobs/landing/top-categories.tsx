import Link from "next/link";
import {
  Code2,
  Brush,
  Megaphone,
  ChartNoAxesCombined,
  Headphones,
  Package,
  Wallet,
  Users,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = [
  { Icon: Code2, name: "Development", count: "12,540 Jobs" },
  { Icon: Brush, name: "Design", count: "8,430 Jobs" },
  { Icon: Megaphone, name: "Marketing", count: "6,210 Jobs" },
  { Icon: ChartNoAxesCombined, name: "Sales", count: "4,890 Jobs" },
  { Icon: Headphones, name: "Customer Support", count: "3,120 Jobs" },
  { Icon: Package, name: "Product", count: "2,980 Jobs" },
  { Icon: Wallet, name: "Finance", count: "2,450 Jobs" },
  { Icon: Users, name: "HR & Admin", count: "1,980 Jobs" },
];

export function TopCategories() {
  return (
    <section className="py-10 sm:py-12 bg-card lg:my-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        {/* Section title */}
        <div className="text-center mb-8">
          <h2 className="text-[22px] font-bold text-foreground">Top Categories</h2>
          <div className="w-10 h-[3px] bg-primary rounded-full mx-auto mt-1.5" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map(({ Icon, name, count }) => (
            <Link
              key={name}
              href="#"
              className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card "
            >
              <div className="w-12 h-12 rounded-xl  flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-[22px] h-[22px] text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-foreground leading-tight">
                  {name}
                </p>
                <p className="text-[11.5px] text-muted-foreground mt-0.5">{count}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse link */}
        <div className="text-center mt-6">
          <Link
            href="#"
            className="inline-flex items-center gap-1 text-[13.5px] font-medium text-primary hover:underline"
          >
            Browse All Categories
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
