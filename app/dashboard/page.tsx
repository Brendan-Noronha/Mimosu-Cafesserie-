import Link from "next/link";
import { Users, Flame, Megaphone, DollarSign } from "lucide-react";
import { Card, StatCard } from "@/components/ui";
import { listOnboardingRecords } from "@/lib/onboarding/storage";
import { listLeads } from "@/lib/leads/storage";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const [clients, leads] = await Promise.all([listOnboardingRecords(), listLeads()]);
  const hotLeads = leads.filter((l) => l.score === "hot").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Overview</h1>
      <p className="text-neutral-500 text-sm mb-8">Your agency at a glance.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Clients" value={String(clients.length)} icon={<Users size={20} />} />
        <StatCard label="Total Leads" value={String(leads.length)} icon={<Megaphone size={20} />} />
        <StatCard label="Hot Leads" value={String(hotLeads)} icon={<Flame size={20} />} />
        <StatCard label="Managed Ad Spend" value="₹0" icon={<DollarSign size={20} />} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-neutral-900">Recent clients</h2>
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

        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-neutral-900">Recent leads</h2>
            <Link href="/dashboard/leads" className="text-sm text-neutral-500 hover:text-neutral-900">
              View all
            </Link>
          </div>
          {leads.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No leads yet. Add one manually or connect Meta Lead Ads.
            </p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {leads.slice(0, 5).map((l) => (
                <Link
                  key={l.id}
                  href={`/dashboard/leads/${l.id}`}
                  className="flex items-center justify-between py-3 hover:bg-neutral-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{l.name}</div>
                    <div className="text-xs text-neutral-400 capitalize">{l.score} · {l.stage}</div>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
