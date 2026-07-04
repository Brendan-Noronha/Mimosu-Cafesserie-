import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { listLeads } from "@/lib/leads/storage";
import { listOnboardingRecords } from "@/lib/onboarding/storage";
import { LEAD_STAGES, SCORE_TONES, labelFor } from "@/lib/leads/types";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const [leads, clients] = await Promise.all([listLeads(), listOnboardingRecords()]);
  const clientName = (id: string) => clients.find((c) => c.id === id)?.businessName ?? "Unknown client";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-neutral-900">Leads</h1>
        <Link
          href="/dashboard/leads/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
        >
          <Plus size={16} /> Add lead
        </Link>
      </div>
      <p className="text-neutral-500 text-sm mb-8">Every lead, scored and ready for follow-up.</p>

      <Card className="overflow-hidden">
        {leads.length === 0 ? (
          <p className="text-sm text-neutral-400 p-6">
            No leads yet. Add one manually, or connect Meta Lead Ads to receive them automatically.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-400 border-b border-neutral-100">
                <th className="font-medium px-6 py-3">Lead</th>
                <th className="font-medium px-6 py-3">Client</th>
                <th className="font-medium px-6 py-3">Score</th>
                <th className="font-medium px-6 py-3">Stage</th>
                <th className="font-medium px-6 py-3">Source</th>
                <th className="font-medium px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <div className="text-xs text-neutral-400">{lead.email || lead.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{clientName(lead.clientId)}</td>
                  <td className="px-6 py-4">
                    <Badge tone={SCORE_TONES[lead.score]}>{lead.score}</Badge>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{labelFor(LEAD_STAGES, lead.stage)}</td>
                  <td className="px-6 py-4 text-neutral-400 capitalize">{lead.source.replace("-", " ")}</td>
                  <td className="px-6 py-4 text-neutral-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
