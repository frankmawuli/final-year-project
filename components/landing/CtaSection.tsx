import { Button } from "@/components/ui/button";
import Image from "next/image";

export function CtaSection() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid overflow-hidden rounded-[1.4rem] border-2 border-primary/80 bg-white md:grid-cols-[1.06fr_0.94fr]">
          <div className="flex flex-col justify-center px-7 py-12 sm:px-10 sm:py-14 lg:px-14">
            <h2 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl">
              Let&apos;s upgrade your
              <br />
              HR experience
              <br />
              with CoreRecruiter
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="h-11 rounded-full bg-primary px-7 text-xs font-semibold text-white hover:bg-primary/90">
                Request Demo
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full border-gray-900 bg-gray-900 px-7 text-xs font-semibold text-white hover:bg-gray-800 hover:text-white"
              >
                Watch Video
              </Button>
            </div>
          </div>
          <div className="relative min-h-[260px] overflow-hidden bg-[#eaf3f8] md:min-h-[340px]">
            <Image
              src="/assets/core-recruiter.png"
              alt="CoreRecruiter workforce dashboard"
              fill
              className="object-contain object-center p-5 sm:p-8"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
