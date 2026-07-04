import { Card, Badge } from "@/components/ui";
import { listLeads } from "@/lib/leads/storage";
import { listOnboardingRecords } from "@/lib/onboarding/storage";
import { LEAD_STAGES, type LeadStage } from "@/lib/leads/types";

export const dynamic = "force-dynamic";

const STAGE_INDEX: Record<string, number> = Object.fromEntries(
  LEAD_STAGES.map((s, i) => [s.value, i]),
);

function reachedStageOrBeyond(stage: LeadStage, target: LeadStage): boolean {
  if (stage === "lost") return false;
  return STAGE_INDEX[stage] >= STAGE_INDEX[target];
}

export default async function ReportsPage() {
  const [leads, clients] = await Promise.all([listLeads(), listOnboardingRecords()]);

  const scoreCounts = { hot: 0, warm: 0, cold: 0, spam: 0 };
  for (const lead of leads) scoreCounts[lead.score] += 1;

  const qualifiedCount = leads.filter((l) => reachedStageOrBeyond(l.stage, "qualified")).length;
  const appointmentCount = leads.filter((l) => reachedStageOrBeyond(l.stage, "appointment")).length;
  const closedCount = leads.filter((l) => l.stage === "closed").length;

  const qualifiedRate = leads.length ? Math.round((qualifiedCount / leads.length) * 100) : 0;
  const appointmentRate = leads.length ? Math.round((appointmentCount / leads.length) * 100) : 0;

  const perClient = clients
    .map((c) => {
      const clientLeads = leads.filter((l) => l.clientId === c.id);
      return {
        id: c.id,
        businessName: c.businessName,
        total: clientLeads.length,
        hot: clientLeads.filter((l) => l.score === "hot").length,
        qualified: clientLeads.filter((l) => reachedStageOrBeyond(l.stage, "qualified")).length,
        closed: clientLeads.filter((l) => l.stage === "closed").length,
      };
    })
    .filter((c) => c.total > 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Reports</h1>
      <p className="text-neutral-500 text-sm mb-8">Lead performance across all clients.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="p-6">
          <div className="text-sm text-neutral-500 mb-1">Total Leads</div>
          <div className="text-3xl font-bold text-neutral-900 tracking-tight">{leads.length}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-neutral-500 mb-1">Qualified Rate</div>
          <div className="text-3xl font-bold text-neutral-900 tracking-tight">{qualifiedRate}%</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-neutral-500 mb-1">Appointment Rate</div>
          <div className="text-3xl font-bold text-neutral-900 tracking-tight">{appointmentRate}%</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-neutral-500 mb-1">Closed Deals</div>
          <div className="text-3xl font-bold text-neutral-900 tracking-tight">{closedCount}</div>
        </Card>
      </div>

      <Card className="p-6 mb-5">
        <h2 className="font-bold text-neutral-900 mb-4">Lead quality breakdown</h2>
        <div className="flex gap-3 flex-wrap">
          <Badge tone="red">Hot: {scoreCounts.hot}</Badge>
          <Badge tone="orange">Warm: {scoreCounts.warm}</Badge>
          <Badge tone="blue">Cold: {scoreCounts.cold}</Badge>
          <Badge tone="neutral">Spam: {scoreCounts.spam}</Badge>
        </div>
      </Card>

      <Card className="overflow-hidden mb-5">
        <div className="p-6 pb-0">
          <h2 className="font-bold text-neutral-900">By client</h2>
        </div>
        {perClient.length === 0 ? (
          <p className="text-sm text-neutral-400 p-6">No lead activity yet.</p>
        ) : (
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="text-left text-neutral-400 border-b border-neutral-100">
                <th className="font-medium px-6 py-3">Client</th>
                <th className="font-medium px-6 py-3">Total Leads</th>
                <th className="font-medium px-6 py-3">Hot</th>
                <th className="font-medium px-6 py-3">Qualified</th>
                <th className="font-medium px-6 py-3">Closed</th>
              </tr>
            </thead>
            <tbody>
              {perClient.map((c) => (
                <tr key={c.id} className="border-b border-neutral-50 last:border-0">
                  <td className="px-6 py-4 font-medium text-neutral-900">{c.businessName}</td>
                  <td className="px-6 py-4 text-neutral-600">{c.total}</td>
                  <td className="px-6 py-4 text-neutral-600">{c.hot}</td>
                  <td className="px-6 py-4 text-neutral-600">{c.qualified}</td>
                  <td className="px-6 py-4 text-neutral-600">{c.closed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="font-bold text-neutral-900 mb-2">Ad performance</h2>
        <p className="text-sm text-neutral-500">
          Spend, CTR, CPC, and CPM require a connected Meta Ads Insights API — not available yet.
          Once campaigns are running and the connection is configured, this section will populate
          automatically.
        </p>
      </Card>
    </div>
  );
}
