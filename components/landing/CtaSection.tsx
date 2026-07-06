import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 px-10 py-14">
          {/* Decorative dot grid — left */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-44 opacity-[0.07]">
            <div className="grid h-full grid-cols-5 gap-3 p-8">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary" />
              ))}
            </div>
          </div>
          {/* Decorative dot grid — right */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-44 opacity-[0.07]">
            <div className="grid h-full grid-cols-5 gap-3 p-8">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary" />
              ))}
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                Ready to transform your HR operations?
              </h2>
              <p className="text-base text-gray-500">
                Join thousands of HR teams already using CoreRecruiter.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap gap-3">
              <Button className="h-11 bg-primary px-6 text-white hover:bg-primary/90">
                Request Demo
              </Button>
              <Button
                variant="outline"
                className="h-11 border-gray-200 px-6 text-gray-700 hover:bg-gray-50"
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
