import { Button } from "@/components/ui/button";
import { ArrowUpRight, Check } from "lucide-react";

const chartPoints = "0,70 20,54 38,63 55,30 72,45 90,18 110,25 130,4 150,18 170,0";

function AnalyticsPanel() {
  return (
    <article className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-[10px] font-semibold text-gray-900">Simple analytics</p>
      <p className="mt-1 max-w-[150px] text-[9px] leading-relaxed text-gray-500">Make informed decisions backed by data through our analytics tools.</p>
      <div className="mt-5 flex items-center gap-1 text-[9px] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> 14.2%</div>
      <svg viewBox="0 0 170 74" className="mt-2 h-20 w-full" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={chartPoints} fill="none" stroke="#35e0ba" strokeWidth="1.4" />
      </svg>
    </article>
  );
}

function GrowthPanel() {
  return (
    <article className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm sm:p-6">
      <p className="text-[10px] font-semibold text-gray-900">Boosting your team.</p>
      <p className="text-[10px] font-semibold text-gray-900">Today and tomorrow.</p>
      <p className="mx-auto mt-2 max-w-xs text-[9px] leading-relaxed text-gray-500">Bring harmony to your HR workflows with clear processes and real-time visibility.</p>
      <div className="mt-5 rounded-lg bg-gray-50 px-4 py-4">
        <svg viewBox="0 0 220 66" className="h-20 w-full" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="0,52 25,38 45,48 65,22 84,55 106,30 132,39 148,11 175,15 198,25 220,0" fill="none" stroke="#2563eb" strokeWidth="1" />
          <polyline points="0,60 25,57 45,61 65,42 84,62 106,51 132,54 148,42 175,49 198,30 220,34" fill="none" stroke="#737373" strokeDasharray="4 4" strokeWidth="1" />
        </svg>
      </div>
    </article>
  );
}

function CollaborationPanel() {
  return (
    <article className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm sm:p-6">
      <p className="text-[10px] font-semibold text-gray-900">Easy collaboration</p>
      <p className="mt-1 text-[9px] leading-relaxed text-gray-500">Seamlessly collaborate with your team members like never before.</p>
      <div className="mt-8 flex justify-center -space-x-2">
        {["bg-[#e0b191]", "bg-[#a97355]", "bg-[#d7c2a1]", "bg-[#8e5744]", "bg-[#f1d3b4]"].map((color, index) => <span key={index} className={`h-7 w-7 rounded-full border-2 border-white ${color}`} />)}
      </div>
    </article>
  );
}

function AccountingPanel() {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-[11px] font-semibold text-gray-900">Real-time HR insights at your fingertips.</p>
      <p className="mt-2 max-w-sm text-[9px] leading-relaxed text-gray-500">Take the pain out of keeping workforce records organized. CoreRecruiter gives your team a new way of managing people.</p>
      <div className="mt-5 grid grid-cols-[1fr_1.1fr] items-end gap-5">
        <div><p className="text-xl font-semibold text-gray-900">1,245</p><p className="mt-2 h-1 w-20 rounded bg-gray-200" /><p className="mt-2 h-1 w-14 rounded bg-gray-100" /><p className="mt-2 h-1 w-24 rounded bg-gray-100" /></div>
        <div className="rounded-lg bg-gray-50 p-3"><p className="text-[8px] font-semibold text-gray-500">Monthly overview</p>{["New employees", "Leave requests", "Pending reviews"].map((item, index) => <div key={item} className="mt-2 flex items-center gap-2 text-[8px] text-gray-500"><span className={`h-4 w-4 rounded-full ${index === 0 ? "bg-pink-300" : index === 1 ? "bg-blue-400" : "bg-lime-300"}`} /><span className="truncate">{item}</span><Check className="ml-auto h-3 w-3 text-gray-400" /></div>)}</div>
      </div>
    </article>
  );
}

function TeamPanel() {
  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div><h3 className="max-w-xs text-xl font-semibold leading-tight text-gray-900 sm:text-2xl">A smarter way to manage your people.</h3><p className="mt-3 max-w-sm text-[10px] leading-relaxed text-gray-500">Bring your HR workflows together with tools that help your team work faster, stay organized, and grow with confidence.</p></div>
      <Button className="mt-7 h-8 w-fit gap-1.5 rounded-full bg-primary px-4 text-[10px] font-semibold text-white hover:bg-primary/90">Explore more <ArrowUpRight className="h-3 w-3" /></Button>
    </article>
  );
}

export function WhyChooseSection() {
  return (
    <section data-gsap="scroll-section" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div data-gsap="scroll-item" className="mb-10 flex items-end justify-between gap-5 sm:mb-12">
          <div><div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Why choose CoreRecruiter</div><h2 className="max-w-xl text-3xl font-semibold leading-tight text-gray-900 sm:text-4xl">A clearer way to run your HR team.</h2></div>
          <p className="hidden max-w-xs text-right text-xs leading-relaxed text-gray-500 md:block"></p>
        </div>
        <div data-gsap="scroll-item" className="grid gap-3 md:grid-cols-[0.9fr_1.9fr_0.9fr]">
          <AnalyticsPanel />
          <GrowthPanel />
          <CollaborationPanel />
        </div>
        <div data-gsap="scroll-item" className="mt-3 grid gap-3 md:grid-cols-[1.05fr_1fr]">
          <AccountingPanel />
          <TeamPanel />
        </div>
      </div>
    </section>
  );
}
