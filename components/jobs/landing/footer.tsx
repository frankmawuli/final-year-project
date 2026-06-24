import Link from "next/link";
import { Facebook, Linkedin, Twitter, Instagram } from "lucide-react";
import { LogoJobs } from "@/components/logo";

const FOOTER_LINKS: Record<string, string[]> = {
  "For Job Seekers": ["Browse Jobs", "Create Profile", "Career Tips", "Job Alerts"],
  "For Employers": ["Post a Job", "Browse Candidates", "Pricing", "Employer Resources"],
  Company: ["About Us", "Contact Us", "Careers", "Blog"],
  Support: ["Help Center", "Privacy Policy", "Terms of Service", "Cookies Policy"],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-10 sm:pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 mb-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <LogoJobs width={46} height={46} />
              <span className="font-semibold text-[14px] text-foreground">
                CoreRecruiter Jobs
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-5">
              Connecting talent with opportunities. Building better futures together.
            </p>
            <div className="flex items-center gap-2.5">
              {[Facebook, Linkedin, Twitter, Instagram].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-7 h-7 rounded-full bg-secondary hover:bg-primary text-muted-foreground hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[13px] font-semibold text-foreground mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[12px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-[11.5px] text-muted-foreground">
            © 2024 CoreRecruiter Jobs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
