import Link from "next/link";
import { Users, Inbox, Megaphone, DollarSign } from "lucide-react";
import { Card, StatCard } from "@/components/ui";
import { listOnboardingRecords } from "@/lib/onboarding/storage";
import { isWithinDays } from "@/lib/onboarding/types";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const clients = await listOnboardingRecords();
  const newThisWeek = clients.filter((c) => isWithinDays(c.submittedAt, 7)).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Overview</h1>
      <p className="text-neutral-500 text-sm mb-8">Your agency at a glance.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Clients" value={String(clients.length)} icon={<Users size={20} />} />
        <StatCard label="New This Week" value={String(newThisWeek)} icon={<Inbox size={20} />} />
        <StatCard label="Active Campaigns" value="0" icon={<Megaphone size={20} />} />
        <StatCard label="Managed Ad Spend" value="$0" icon={<DollarSign size={20} />} />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-neutral-900">Recent onboarding submissions</h2>
          <Link href="/dashboard/clients" className="text-sm text-neutral-500 hover:text-neutral-900">
            View all
          </Link>
        </div>
        {clients.length === 0 ? (
          <p className="text-sm text-neutral-400">
            No clients yet. Submissions from /onboarding will show up here.
          </p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {clients.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/clients/${c.id}`}
                className="flex items-center justify-between py-3 hover:bg-neutral-50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-neutral-900">{c.businessName}</div>
                  <div className="text-xs text-neutral-400">
                    {c.contactName} · {c.email}
                  </div>
                </div>
                <span className="text-xs text-neutral-400">
                  {new Date(c.submittedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
