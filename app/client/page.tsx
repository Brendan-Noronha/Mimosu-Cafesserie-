import { redirect } from "next/navigation";
import { Users, Flame, Megaphone, DollarSign } from "lucide-react";
import { Card, StatCard, Badge } from "@/components/ui";
import { getSession } from "@/lib/auth/session";
import { getOnboardingRecord } from "@/lib/onboarding/storage";
import { listLeadsForClient } from "@/lib/leads/storage";
import { listInvoices } from "@/lib/payments/storage";
import { formatInr } from "@/lib/payments/types";
import { SCORE_TONES, LEAD_STAGES, labelFor } from "@/lib/leads/types";

export const dynamic = "force-dynamic";

const STATUS_TONE = { pending: "orange", paid: "green", failed: "red" } as const;

export default async function ClientOverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [client, leads, allInvoices] = await Promise.all([
    getOnboardingRecord(session.clientId),
    listLeadsForClient(session.clientId),
    listInvoices(),
  ]);

  if (!client) redirect("/login");

  const invoices = allInvoices.filter((inv) => inv.clientEmail.toLowerCase() === client.email.toLowerCase());
  const hotLeads = leads.filter((l) => l.score === "hot").length;

  return (
    <div className="pt-4">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">{client.businessName}</h1>
      <p className="text-neutral-500 text-sm mb-8">Welcome back, {client.contactName.split(" ")[0]}.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Leads" value={String(leads.length)} icon={<Users size={20} />} />
        <StatCard label="Hot Leads" value={String(hotLeads)} icon={<Flame size={20} />} />
        <StatCard label="Active Campaigns" value="0" icon={<Megaphone size={20} />} />
        <StatCard label="Ad Spend" value="₹0" icon={<DollarSign size={20} />} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          <h2 className="font-bold text-neutral-900 mb-5">Your leads</h2>
          {leads.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No leads yet — once your Meta Ads campaigns are live, leads will appear here.
            </p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {leads.slice(0, 8).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{lead.name}</div>
                    <div className="text-xs text-neutral-400">{labelFor(LEAD_STAGES, lead.stage)}</div>
                  </div>
                  <Badge tone={SCORE_TONES[lead.score]}>{lead.score}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-neutral-900 mb-5">Your invoices</h2>
          {invoices.length === 0 ? (
            <p className="text-sm text-neutral-400">No invoices yet.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{inv.description}</div>
                    <div className="text-xs text-neutral-400">{formatInr(inv.amountInPaise)}</div>
                  </div>
                  <Badge tone={STATUS_TONE[inv.status]}>{inv.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
