import { notFound } from "next/navigation";
import { Card, Badge } from "@/components/ui";
import { getLead } from "@/lib/leads/storage";
import { getOnboardingRecord } from "@/lib/onboarding/storage";
import {
  FINANCING_OPTIONS,
  LEAD_INTENTS,
  PROPERTY_TYPES,
  SCORE_TONES,
  TIMELINES,
  labelFor,
} from "@/lib/leads/types";
import LeadControls from "./LeadControls";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="text-neutral-900 text-right">{value}</dd>
    </div>
  );
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const client = await getOnboardingRecord(lead.clientId);

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{lead.name}</h1>
          <p className="text-neutral-500 text-sm">
            {lead.email || "no email"} · {lead.phone || "no phone"} · for{" "}
            {client?.businessName ?? "Unknown client"}
          </p>
        </div>
        <Badge tone={SCORE_TONES[lead.score]}>{lead.score}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Lead details</h2>
          <dl className="space-y-2.5 text-sm">
            <Row label="Intent" value={labelFor(LEAD_INTENTS, lead.answers.intent) || "—"} />
            <Row label="Budget" value={lead.answers.budget || "—"} />
            <Row label="Location" value={lead.answers.location || "—"} />
            <Row label="Property type" value={labelFor(PROPERTY_TYPES, lead.answers.propertyType) || "—"} />
            <Row label="Timeline" value={labelFor(TIMELINES, lead.answers.timeline) || "—"} />
            <Row label="Financing" value={labelFor(FINANCING_OPTIONS, lead.answers.financing) || "—"} />
            <Row label="Working with another agent" value={lead.answers.workingWithAgent ? "Yes" : "No"} />
            <Row label="Phone verified" value={lead.answers.phoneVerified ? "Yes" : "No"} />
            <Row label="Email verified" value={lead.answers.emailVerified ? "Yes" : "No"} />
            <Row label="Motivation notes" value={lead.answers.motivationNotes || "—"} />
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-neutral-900 mb-4">AI Qualification</h2>
          <p className="text-sm text-neutral-600 mb-4">{lead.scoreReason || "No reasoning recorded."}</p>
          <h2 className="font-bold text-neutral-900 mb-4 mt-6">Follow-up log</h2>
          {lead.followUpLog.length === 0 ? (
            <p className="text-sm text-neutral-400">No automated follow-ups sent yet.</p>
          ) : (
            <ul className="text-sm text-neutral-600 space-y-1.5">
              {lead.followUpLog.map((entry, i) => (
                <li key={i}>
                  {entry.stage} — {new Date(entry.sentAt).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6 md:col-span-2">
          <h2 className="font-bold text-neutral-900 mb-4">Pipeline &amp; notes</h2>
          <LeadControls leadId={lead.id} initialStage={lead.stage} initialNotes={lead.notes} />
        </Card>
      </div>
    </div>
  );
}
