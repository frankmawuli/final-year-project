import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-white pb-20 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-5 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              AI-Powered HR &amp; Recruitment Platform
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight lg:text-[3.5rem]">
              <span className="block text-gray-900">Hire Better</span>
              <span className="block text-primary">Manage Smarter</span>
              <span className="block text-gray-900">Grow Together</span>
            </h1>
            <p className="mb-8 max-w-md text-base leading-relaxed text-gray-500">
              CoreRecruiter helps HR teams attract top talent, streamline hiring, onboard employees,
              and manage your entire workforce in one intelligent platform
            </p>
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <Button className="h-11 gap-2 bg-primary px-6 text-white hover:bg-primary/90">
                Request Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-11 gap-2.5 border-gray-200 px-5 text-gray-700 hover:bg-gray-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <Play className="h-3 w-3 fill-primary text-primary" />
                </span>
                Explore Features
              </Button>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-gray-500">
              {["AI-Powered Hiring", "End-to-End HR", "Secure & Scalable"].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right — dashboard preview */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-primary/5 via-blue-50/40 to-indigo-50/60" />
            <div className="relative">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
