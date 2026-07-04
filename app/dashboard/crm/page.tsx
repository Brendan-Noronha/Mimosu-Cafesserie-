import { listLeads } from "@/lib/leads/storage";
import { listOnboardingRecords } from "@/lib/onboarding/storage";
import { LEAD_STAGES } from "@/lib/leads/types";
import CrmCard from "./CrmCard";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const [leads, clients] = await Promise.all([listLeads(), listOnboardingRecords()]);
  const clientName = (id: string) => clients.find((c) => c.id === id)?.businessName ?? "Unknown client";

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">CRM</h1>
      <p className="text-neutral-500 text-sm mb-8">Pipeline from new lead to closed deal.</p>

      {leads.length === 0 ? (
        <p className="text-sm text-neutral-400">
          No leads yet. Add one from the Leads page, or connect Meta Lead Ads.
        </p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {LEAD_STAGES.map((stageDef) => {
            const stageLeads = leads.filter((l) => l.stage === stageDef.value);
            return (
              <div key={stageDef.value} className="w-64 shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="text-sm font-semibold text-neutral-700">{stageDef.label}</h2>
                  <span className="text-xs text-neutral-400">{stageLeads.length}</span>
                </div>
                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <CrmCard key={lead.id} lead={lead} clientName={clientName(lead.clientId)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
