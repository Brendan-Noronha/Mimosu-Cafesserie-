import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { listOnboardingRecords } from "@/lib/onboarding/storage";
import { AD_BUDGET_RANGES, labelFor } from "@/lib/onboarding/types";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await listOnboardingRecords();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Clients</h1>
      <p className="text-neutral-500 text-sm mb-8">Everyone who has completed onboarding.</p>

      <Card className="overflow-hidden">
        {clients.length === 0 ? (
          <p className="text-sm text-neutral-400 p-6">No clients yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-400 border-b border-neutral-100">
                <th className="font-medium px-6 py-3">Business</th>
                <th className="font-medium px-6 py-3">Contact</th>
                <th className="font-medium px-6 py-3">Budget</th>
                <th className="font-medium px-6 py-3">Status</th>
                <th className="font-medium px-6 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/clients/${c.id}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      {c.businessName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{c.contactName}</td>
                  <td className="px-6 py-4 text-neutral-600">
                    {labelFor(AD_BUDGET_RANGES, c.monthlyAdBudget)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge tone={c.status === "new" ? "orange" : "green"}>{c.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {new Date(c.submittedAt).toLocaleDateString()}
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
