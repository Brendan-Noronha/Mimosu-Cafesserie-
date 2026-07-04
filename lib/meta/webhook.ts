import { createHmac, timingSafeEqual } from "crypto";

export function verifyMetaSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret || !signatureHeader) return false;

  const expected = "sha256=" + createHmac("sha256", appSecret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

interface LeadgenChange {
  field: string;
  value: {
    leadgen_id: string;
    page_id: string;
    form_id: string;
    created_time: number;
  };
}

interface MetaWebhookEntry {
  id: string;
  time: number;
  changes: LeadgenChange[];
}

export interface MetaWebhookPayload {
  object: string;
  entry: MetaWebhookEntry[];
}

export function extractLeadgenEvents(payload: MetaWebhookPayload) {
  return payload.entry.flatMap((entry) =>
    entry.changes
      .filter((change) => change.field === "leadgen")
      .map((change) => ({ pageId: entry.id, ...change.value })),
  );
}

interface GraphLeadFieldData {
  name: string;
  values: string[];
}

interface GraphLeadResponse {
  id: string;
  field_data: GraphLeadFieldData[];
  created_time: string;
}

export async function fetchLeadFromGraphApi(leadgenId: string): Promise<GraphLeadResponse | null> {
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!accessToken) return null;

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${leadgenId}?access_token=${encodeURIComponent(accessToken)}`,
  );
  if (!res.ok) return null;
  return (await res.json()) as GraphLeadResponse;
}

const FIELD_ALIASES: Record<string, string[]> = {
  name: ["full_name", "name", "first_name"],
  email: ["email"],
  phone: ["phone_number", "phone"],
  intent: ["intent", "buying_or_selling"],
  budget: ["budget", "price_range"],
  location: ["location", "preferred_location", "city"],
  propertyType: ["property_type"],
  timeline: ["timeline", "purchase_timeline"],
  financing: ["financing", "cash_or_loan"],
};

export function mapGraphFieldsToLead(fieldData: GraphLeadFieldData[]) {
  const byName = new Map(fieldData.map((f) => [f.name.toLowerCase(), f.values[0] ?? ""]));

  function pick(key: keyof typeof FIELD_ALIASES): string {
    for (const alias of FIELD_ALIASES[key]) {
      const value = byName.get(alias);
      if (value) return value;
    }
    return "";
  }

  return {
    name: pick("name"),
    email: pick("email"),
    phone: pick("phone"),
    intent: pick("intent"),
    budget: pick("budget"),
    location: pick("location"),
    propertyType: pick("propertyType"),
    timeline: pick("timeline"),
    financing: pick("financing"),
  };
}
