import { listOnboardingRecords } from "@/lib/onboarding/storage";
import NewLeadForm from "../NewLeadForm";

export const dynamic = "force-dynamic";

export default async function NewLeadPage() {
  const clients = (await listOnboardingRecords()).map((c) => ({
    id: c.id,
    businessName: c.businessName,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Add a lead</h1>
      <p className="text-neutral-500 text-sm mb-8">
        Manually add a lead for testing, or while Meta Lead Ads isn&apos;t connected yet. The AI
        qualifies it immediately.
      </p>
      <NewLeadForm clients={clients} />
    </div>
  );
}
