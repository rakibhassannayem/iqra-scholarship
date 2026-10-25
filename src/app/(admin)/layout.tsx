import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import AuthSessionProvider from "@/providers/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel | Iqra Scholarship",
    template: "%s | Iqra Scholarship Admin",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthSessionProvider>
      <AdminShell>{children}</AdminShell>
    </AuthSessionProvider>
  );
}
