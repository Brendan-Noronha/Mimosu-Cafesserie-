import { NextResponse } from "next/server";
import { qualifyLead } from "@/lib/leads/qualify";
import { saveLead } from "@/lib/leads/storage";
import type { Lead } from "@/lib/leads/types";
import { listOnboardingRecords } from "@/lib/onboarding/storage";
import {
  extractLeadgenEvents,
  fetchLeadFromGraphApi,
  mapGraphFieldsToLead,
  verifyMetaSignature,
  type MetaWebhookPayload,
} from "@/lib/meta/webhook";

// Meta's webhook verification handshake — configure this URL in
// Meta App Dashboard > Webhooks > Page > leadgen, with the same
// META_WEBHOOK_VERIFY_TOKEN you set in your environment.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_WEBHOOK_VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifyMetaSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody) as MetaWebhookPayload;
  const events = extractLeadgenEvents(payload);

  const clients = await listOnboardingRecords();

  for (const event of events) {
    const client = clients.find((c) => c.metaPageId === event.pageId);
    if (!client) continue; // no client onboarded with this Page ID yet

    const graphLead = await fetchLeadFromGraphApi(event.leadgen_id);
    if (!graphLead) continue;

    const fields = mapGraphFieldsToLead(graphLead.field_data);
    const answers = {
      intent: fields.intent,
      budget: fields.budget,
      location: fields.location,
      propertyType: fields.propertyType,
      timeline: fields.timeline,
      financing: fields.financing,
      workingWithAgent: false,
      phoneVerified: !!fields.phone,
      emailVerified: !!fields.email,
      motivationNotes: "",
    };

    const { score, reason } = await qualifyLead(answers);
    const now = new Date().toISOString();

    const lead: Lead = {
      id: crypto.randomUUID(),
      clientId: client.id,
      source: "meta-lead-ad",
      name: fields.name || "Unknown",
      email: fields.email,
      phone: fields.phone,
      answers,
      score,
      scoreReason: reason,
      stage: "new",
      notes: "",
      followUpLog: [],
      createdAt: now,
      updatedAt: now,
    };

    await saveLead(lead);
  }

  // Always 200 quickly — Meta disables webhooks that repeatedly time out or error.
  return NextResponse.json({ received: true });
}
