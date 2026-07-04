"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, Megaphone, Target, KanbanSquare, FileBarChart } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/dashboard/leads", label: "Leads", icon: Target },
  { href: "/dashboard/crm", label: "CRM", icon: KanbanSquare },
  { href: "/dashboard/reports", label: "Reports", icon: FileBarChart },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-colors ${
              active
                ? "bg-white shadow-[0_2px_16px_-6px_rgba(0,0,0,0.1)] text-neutral-900 font-medium"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Icon size={18} strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
