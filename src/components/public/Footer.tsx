import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{siteConfig.brandName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
          <Link href="/result" className="hover:text-foreground">
            See Result
          </Link>
        </nav>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.brandName}
        </p>
      </div>
    </footer>
  );
}
