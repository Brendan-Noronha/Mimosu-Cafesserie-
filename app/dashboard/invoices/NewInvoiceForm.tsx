"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { createInvoice, type CreateInvoiceState } from "./actions";

const initialState: CreateInvoiceState = { status: "idle" };

const inputClass =
  "w-full rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-300";

export default function NewInvoiceForm() {
  const [state, formAction, pending] = useActionState(createInvoice, initialState);

  if (state.status === "success") {
    const payUrl = `/pay/${state.invoiceId}`;
    return (
      <Card className="p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-4">
          ✓
        </div>
        <h2 className="font-bold text-neutral-900 mb-1">Invoice created</h2>
        <p className="text-sm text-neutral-500 mb-4">Send this link to your client to collect payment.</p>
        <code className="block bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2.5 text-sm text-neutral-700 mb-4 break-all">
          {payUrl}
        </code>
        <Link href="/dashboard/invoices" className="text-sm font-semibold text-neutral-900 underline">
          Back to invoices
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form action={formAction}>
        <label className="block mb-5">
          <span className="block text-sm font-medium text-neutral-700 mb-1.5">Client name *</span>
          <input name="clientName" required className={inputClass} />
        </label>
        <label className="block mb-5">
          <span className="block text-sm font-medium text-neutral-700 mb-1.5">Client email *</span>
          <input name="clientEmail" type="email" required className={inputClass} />
        </label>
        <label className="block mb-5">
          <span className="block text-sm font-medium text-neutral-700 mb-1.5">Description *</span>
          <input
            name="description"
            required
            placeholder="e.g. Meta Ads management — July"
            className={inputClass}
          />
        </label>
        <label className="block mb-6">
          <span className="block text-sm font-medium text-neutral-700 mb-1.5">Amount (INR) *</span>
          <input name="amount" type="number" min="1" step="0.01" required className={inputClass} />
        </label>

        {state.status === "error" && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-sm text-red-500">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 rounded-full text-sm font-bold bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white transition-colors"
        >
          {pending ? "Creating…" : "Create invoice"}
        </button>
      </form>
    </Card>
  );
}
