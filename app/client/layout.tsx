import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { logout } from "./actions";

export default async function ClientLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
            M
          </div>
          <span className="font-semibold text-neutral-900 text-sm">Client Portal</span>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-900">
            Log out
          </button>
        </form>
      </header>
      <main className="max-w-5xl mx-auto px-6 pb-16">{children}</main>
    </div>
  );
}
