import Link from "next/link";
import { Check, CircleHelp, Rocket, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

const plans = [
  {
    name: "Business",
    description: "For growing teams building a reliable hiring process",
    price: "GH₵49",
    icon: Users,
    features: [
      "1 active hiring workflow",
      "Candidate pipeline management",
      "AI-assisted candidate screening",
      "Basic team collaboration",
    ],
    button: "Current plan",
  },
  {
    name: "Advanced",
    description: "For teams ready to automate more of their work",
    price: "GH₵149",
    icon: Rocket,
    popular: true,
    features: [
      "Unlimited hiring workflows",
      "Agentic candidate screening",
      "Automated interview coordination",
      "Advanced analytics and reports",
      "Team approvals and permissions",
      "Priority support",
    ],
    button: "Get Advanced",
  },
  {
    name: "Plus",
    description: "For complex organizations scaling across teams",
    price: "GH₵399",
    icon: Sparkles,
    features: [
      "Everything in Advanced",
      "Multi-team HR workspaces",
      "Custom AI agent workflows",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated support",
    ],
    button: "Get Plus",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f7] text-gray-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Simple, transparent pricing
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Choose the workflow that fits your team
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-500 sm:text-base">
            Start with the essentials and unlock more intelligent HR automation as your organization grows.
          </p>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <article
                key={plan.name}
                className={`relative flex min-h-[535px] flex-col rounded-2xl border bg-white p-6 shadow-sm sm:p-7 ${
                  plan.popular
                    ? "border-primary border-t-4 pt-5 shadow-md lg:-mt-5"
                    : "border-gray-100"
                }`}
              >
                {plan.popular && (
                  <span className="absolute right-5 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Popular
                  </span>
                )}

                <div className="mb-7">
                  <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">{plan.name}</h2>
                  <p className="mt-1 max-w-[230px] text-sm leading-relaxed text-gray-500">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-7">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-medium tracking-tight text-gray-900">{plan.price}</span>
                    <span className="mb-1.5 text-xs text-gray-400">/month</span>
                  </div>
                </div>

                <Button
                  asChild={!plan.button.includes("Current")}
                  disabled={plan.button.includes("Current")}
                  className={`mb-7 h-11 w-full rounded-lg text-sm ${
                    plan.popular
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-primary/10 text-primary hover:bg-primary/15"
                  }`}
                >
                  {plan.button.includes("Current") ? (
                    plan.button
                  ) : (
                    <Link href="/auth/signup">{plan.button}</Link>
                  )}
                </Button>

                <div className="border-t border-gray-100 pt-5">
                  <h3 className="mb-4 text-sm font-semibold text-gray-800">Included features</h3>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs leading-relaxed text-gray-600">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{feature}</span>
                        {feature.includes("AI") && <CircleHelp className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" />}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}