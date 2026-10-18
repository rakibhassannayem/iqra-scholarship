import Link from "next/link";
import { siteConfig } from "@/config/site";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Register", href: "/register" },
  { label: "See Result", href: "/result" },
];

export default function Navbar() {
  return (
    <header className="border-b bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {siteConfig.brandName}
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
