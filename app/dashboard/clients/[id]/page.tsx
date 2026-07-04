import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Card, Badge } from "@/components/ui";
import { getOnboardingRecord } from "@/lib/onboarding/storage";
import {
  ACCESS_ITEMS,
  ACCESS_STATUSES,
  AD_BUDGET_RANGES,
  BUSINESS_TYPES,
  CAMPAIGN_GOALS,
  PROPERTY_PRICE_RANGES,
  SERVICES_OFFERED,
  labelFor,
} from "@/lib/onboarding/types";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="text-neutral-900 text-right">{value}</dd>
    </div>
  );
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getOnboardingRecord(id);
  if (!client) notFound();

  const colors: Array<[string, string]> = [
    ["Primary", client.primaryColor],
    ["Secondary", client.secondaryColor],
    ["Accent", client.accentColor],
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{client.businessName}</h1>
          <p className="text-neutral-500 text-sm">
            {client.contactName} · {client.email} · {client.phone}
          </p>
        </div>
        <Badge tone={client.status === "new" ? "orange" : "green"}>{client.status}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Business</h2>
          <dl className="space-y-2.5 text-sm">
            <Row label="Type" value={labelFor(BUSINESS_TYPES, client.businessType)} />
            <Row label="Years in business" value={client.yearsInBusiness || "—"} />
            <Row label="Ideal customer" value={client.idealCustomer} />
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Services &amp; Goals</h2>
          <dl className="space-y-2.5 text-sm">
            <Row
              label="Services"
              value={client.services.map((s) => labelFor(SERVICES_OFFERED, s)).join(", ")}
            />
            <Row label="Goals" value={client.goals.map((g) => labelFor(CAMPAIGN_GOALS, g)).join(", ")} />
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Market &amp; Budget</h2>
          <dl className="space-y-2.5 text-sm">
            <Row label="Target locations" value={client.targetLocations} />
            <Row label="Avg. property price" value={labelFor(PROPERTY_PRICE_RANGES, client.avgPropertyPrice)} />
            <Row label="Monthly ad budget" value={labelFor(AD_BUDGET_RANGES, client.monthlyAdBudget)} />
            <Row
              label="Ran ads before"
              value={client.previousAdsRun === "yes" ? `Yes — ${client.previousAdsDetails || "n/a"}` : "No"}
            />
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Digital Assets</h2>
          <dl className="space-y-2.5 text-sm">
            <Row label="Facebook Page" value={client.facebookPage} />
            <Row label="Instagram" value={client.instagram || "—"} />
            <Row label="Business Manager ID" value={client.metaBusinessManagerId} />
            <Row label="Ad Account ID" value={client.adAccountId} />
            <Row label="Pixel ID" value={client.pixelId || "—"} />
            <Row label="Website" value={client.website || "—"} />
            <Row label="CRM" value={client.crmName || "—"} />
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Brand &amp; Creative</h2>
          <div className="flex items-center gap-4 mb-4">
            {colors.map(([label, hex]) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full border border-neutral-200"
                  style={{ background: hex }}
                />
                <span className="text-xs text-neutral-400">{label}</span>
              </div>
            ))}
          </div>
          {client.files.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={client.files.logoUrl}
              alt={`${client.businessName} logo`}
              className="h-16 mb-4 rounded-lg border border-neutral-100 object-contain bg-neutral-50 p-2"
            />
          )}
          <dl className="space-y-2.5 text-sm">
            <Row
              label="Brand guidelines"
              value={
                client.files.brandGuidelinesUrl ? (
                  <a className="underline" href={client.files.brandGuidelinesUrl}>
                    View file
                  </a>
                ) : (
                  "Not uploaded"
                )
              }
            />
            <Row
              label="Creatives"
              value={client.files.creativeUrls.length ? `${client.files.creativeUrls.length} file(s)` : "None"}
            />
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-neutral-900 mb-4">Access Checklist</h2>
          <dl className="space-y-2.5 text-sm">
            {ACCESS_ITEMS.map((item) => (
              <Row
                key={item.key}
                label={item.label}
                value={labelFor(ACCESS_STATUSES, client.access[item.key])}
              />
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}
