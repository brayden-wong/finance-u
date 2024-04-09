import { api } from "@finance/eden";
import { UserRound } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UserSettings } from "./user-settings";

export async function MainNavigation() {
  const { data, error } = await api.users.me.get({
    $headers: {
      authorization: `Bearer ${cookies().get("token")?.value}`,
    },
  });

  if (error) {
    switch (error.status) {
      case 401:
        console.log("Unauthorized: redirecting to sign-in");
        redirect("/sign-in");
      case 404:
        console.log("User not found: redirecting to sign-in");
        redirect("/sign-in");
      default:
        console.log("Error fetching user data: redirecting to sign-in");
        redirect("/sign-in");
    }
  }

  return (
    <nav className="shrink-0 border-b p-4 shadow-sm shadow-primary/50">
      <ul className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-x-4">
          <Image width={196} height={196} src="/images/logo.png" alt="logo" />
          <div className="flex items-center justify-center gap-x-2">
            <Link href="/dashboard/accounts">Accounts</Link>
            <Link href="/dashboard/expenses">Expenses</Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <UserSettings profile="" />
        </div>
      </ul>
    </nav>
  );
}
