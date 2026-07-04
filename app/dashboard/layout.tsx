import type { Metadata } from "next";
import type { ReactNode } from "react";
import DashboardNav from "./DashboardNav";

export const metadata: Metadata = {
  title: "Ops Dashboard — Mimosu",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <aside className="w-64 shrink-0 p-6 hidden md:flex md:flex-col">
        <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold mb-8">
          M
        </div>
        <DashboardNav />
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
