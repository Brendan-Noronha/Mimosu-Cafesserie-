import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { listInvoices } from "@/lib/payments/storage";
import { formatInr } from "@/lib/payments/types";

export const dynamic = "force-dynamic";

const STATUS_TONE = { pending: "orange", paid: "green", failed: "red" } as const;

export default async function InvoicesPage() {
  const invoices = await listInvoices();

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-neutral-900">Invoices</h1>
        <Link
          href="/dashboard/invoices/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
        >
          <Plus size={16} /> New invoice
        </Link>
      </div>
      <p className="text-neutral-500 text-sm mb-8">Payments collected via Razorpay.</p>

      <Card className="overflow-hidden">
        {invoices.length === 0 ? (
          <p className="text-sm text-neutral-400 p-6">No invoices yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-400 border-b border-neutral-100">
                <th className="font-medium px-6 py-3">Client</th>
                <th className="font-medium px-6 py-3">Description</th>
                <th className="font-medium px-6 py-3">Amount</th>
                <th className="font-medium px-6 py-3">Status</th>
                <th className="font-medium px-6 py-3">Created</th>
                <th className="font-medium px-6 py-3">Pay link</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">{inv.clientName}</div>
                    <div className="text-xs text-neutral-400">{inv.clientEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{inv.description}</td>
                  <td className="px-6 py-4 text-neutral-900 font-medium">
                    {formatInr(inv.amountInPaise)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge tone={STATUS_TONE[inv.status]}>{inv.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/pay/${inv.id}`} className="text-neutral-500 hover:text-neutral-900 underline">
                      /pay/{inv.id.slice(0, 8)}…
                    </Link>
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
