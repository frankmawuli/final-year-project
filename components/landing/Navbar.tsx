import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";

const navLinks = [
  { label: "Product", hasDropdown: true },
  { label: "Solutions", hasDropdown: true },
  { label: "Resources", hasDropdown: true },
  { label: "Pricing", hasDropdown: false },
  { label: "Company", hasDropdown: true },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Logo width={46} height={46} />
          <span className="text-sm font-bold text-gray-900">CoreRecruiter</span>
        </Link>

        <nav className="hidden items-center md:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              {link.label}
              {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5 text-gray-400" />}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-sm text-gray-600" asChild>
            <Link href="/auth/login">Log In</Link>
          </Button>
          <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
            Request Demo
          </Button>
        </div>
      </div>
    </header>
  );
}
