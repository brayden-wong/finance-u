import Image from "next/image";
import Link from "next/link";

import { AuthForm } from "./auth/auth-form";

export function LandingNavigation() {
  return (
    <nav className="border-b p-4 shadow-sm shadow-primary/50">
      <ul className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-x-8">
          <Image src="/images/logo.png" alt="logo" width={192} height={192} />
          <div className="flex items-center justify-center gap-x-2">
            <Link href="/" className="prose text-lg">
              Test Link
            </Link>
            <Link href="/" className="prose text-lg">
              Test Link
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-2">
          <AuthForm type="sign-in" />
          <AuthForm type="sign-up" />
        </div>
      </ul>
    </nav>
  );
}
