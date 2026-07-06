import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-primary py-10 sm:py-12 px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Dot pattern overlay */}
          <div
            className="absolute inset-y-0 left-0 w-40 pointer-events-none"
            aria-hidden="true"
          >
            <div className="grid grid-cols-7 gap-2.5 p-5 opacity-[0.18]">
              {Array.from({ length: 56 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-[20px] font-bold text-primary-foreground mb-1.5">
              Ready to take the next step in your career?
            </h2>
            <p className="text-primary-foreground/80 text-[13.5px]">
              Create your profile and get matched with the best opportunities.
            </p>
          </div>
          <Link
            href="/jobs/signup"
            className="relative z-10 shrink-0 bg-primary-foreground text-primary font-semibold text-[13.5px] px-6 py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors flex items-center gap-2"
          >
            Create Profile
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
