import type { ReactNode } from "react";

import { MainNavigation } from "./_components/main-navigation";

async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-screen flex-col space-y-4">
      <MainNavigation />
      <main className="grow px-4">{children}</main>
    </div>
  );
}

export default DashboardLayout;
