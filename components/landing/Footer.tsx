import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Send, Linkedin, Facebook, Twitter, Instagram } from "lucide-react";
import { Logo } from "@/components/logo";

function FooterCol({ heading, links }: { heading: string; links: string[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-gray-900">{heading}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-7">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Logo width={46} height={46} />
              <span className="text-sm font-bold text-gray-900">CoreRecruiter</span>
            </Link>
            <p className="mb-6 max-w-[200px] text-sm leading-relaxed text-gray-500">
              The all-in-one recruitment platform that helps you hire better, manage smarter, and
              grow together.
            </p>
            <div className="flex gap-2.5">
              {[Linkedin, Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol heading="Product" links={["Features", "Pricing", "Integrations", "What's New"]} />
          <FooterCol heading="Solutions" links={["Recruitment", "HR Management", "Payroll", "Small Business"]} />
          <FooterCol heading="Resources" links={["Blog", "Help Center", "Guides", "Webinars"]} />
          <FooterCol heading="Company" links={["About Us", "Careers", "Contact Us", "Partners"]} />

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Newsletter</h4>
            <p className="mb-4 text-sm leading-relaxed text-gray-500">
              Get the latest updates and HR insights straight to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-9 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Button
                size="icon"
                className="h-9 w-9 flex-shrink-0 bg-primary text-white hover:bg-primary/90"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 md:flex-row">
          <p className="text-xs text-gray-400">© 2024 CoreRecruiter. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            {["Privacy Policy", "Terms of Service", "Security", "Cookies Settings"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-gray-400 transition-colors hover:text-gray-700"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
