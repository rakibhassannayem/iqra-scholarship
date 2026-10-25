"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  School,
  UserGroup,
  ClipboardPenLine,
  Menu,
  X,
  Wallet,
  Megaphone,
  UserShield,
} from "lucide-react";
import { useState } from "react";
import SignOutButton from "./SignOutButton";
import { useSession } from "next-auth/react";

const navigation = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Scholarships",
    href: "/admin/scholarships",
    icon: GraduationCap,
  },
  {
    title: "Institutions",
    href: "/admin/institutions",
    icon: School,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: UserGroup,
  },
  {
    title: "Registrations",
    href: "/admin/registrations",
    icon: ClipboardPenLine,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: Wallet,
  },
  {
    title: "Notices",
    href: "/admin/notices",
    icon: Megaphone,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: UserShield,
  },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-200 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link
            href="/admin"
            className="flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="size-6" />
            </div>

            <div>
              <p className="font-bold">Iqra Scholarship</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            className="rounded-md p-2 hover:bg-muted md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-4 pb-2 pt-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main Menu
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-5 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t p-4">
          <p className="mb-3 text-xs text-muted-foreground">
            Iqra Noorani Talimul Quran
          </p>

          <SignOutButton />
        </div>
      </aside>

      <div className="min-h-screen md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              className="rounded-md p-2 hover:bg-muted md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </button>

            <div>
              <h1 className="font-semibold">
                {navigation.find((item) =>
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href),
                )?.title ?? "Admin Panel"}
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Manage your scholarship system
              </p>
            </div>
          </div>

          <div className="rounded-full border bg-card px-3 py-1.5 text-sm font-medium">
            {session?.user?.name ?? "AdminName"}
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
