import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/payments/storage";
import { formatInr } from "@/lib/payments/types";
import RazorpayCheckoutButton from "./RazorpayCheckoutButton";

export const dynamic = "force-dynamic";

export default async function PayInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  if (!invoice) notFound();

  const keyId = process.env.RAZORPAY_KEY_ID;

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_24px_-8px_rgba(0,0,0,0.08)] p-8">
        <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold mb-6">
          M
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-1">{invoice.description}</h1>
        <p className="text-sm text-neutral-500 mb-6">For {invoice.clientName}</p>
        <div className="text-4xl font-bold text-neutral-900 mb-8">
          {formatInr(invoice.amountInPaise)}
        </div>

        {invoice.status === "paid" ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-4">
              ✓
            </div>
            <p className="font-bold text-neutral-900">This invoice has already been paid.</p>
          </div>
        ) : !invoice.razorpayOrderId || !keyId ? (
          <p className="text-sm text-red-500">
            Payment is not available right now — please contact us directly.
          </p>
        ) : (
          <RazorpayCheckoutButton
            invoiceId={invoice.id}
            razorpayOrderId={invoice.razorpayOrderId}
            amountInPaise={invoice.amountInPaise}
            keyId={keyId}
            clientName={invoice.clientName}
            clientEmail={invoice.clientEmail}
            description={invoice.description}
          />
        )}
      </div>
    </main>
  );
}
