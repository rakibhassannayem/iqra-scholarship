"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <Button
      variant="outline"
      className="w-full text-red-500 border-red-500 text-lg cursor-pointer"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      <LogOut className="mr-2 size-4" />
      Sign Out
    </Button>
  );
}
