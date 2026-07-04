"use client";

import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function RazorpayCheckoutButton({
  invoiceId,
  razorpayOrderId,
  amountInPaise,
  keyId,
  clientName,
  clientEmail,
  description,
}: {
  invoiceId: string;
  razorpayOrderId: string;
  amountInPaise: number;
  keyId: string;
  clientName: string;
  clientEmail: string;
  description: string;
}) {
  const [status, setStatus] = useState<"idle" | "processing" | "verifying" | "paid" | "error">(
    "idle",
  );
  const [scriptReady, setScriptReady] = useState(false);

  function openCheckout() {
    if (!scriptReady || !window.Razorpay) return;
    setStatus("processing");

    const razorpay = new window.Razorpay({
      key: keyId,
      amount: amountInPaise,
      currency: "INR",
      name: "Mimosu",
      description,
      order_id: razorpayOrderId,
      prefill: { name: clientName, email: clientEmail },
      theme: { color: "#171717" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        setStatus("verifying");
        try {
          const res = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoiceId, ...response }),
          });
          setStatus(res.ok ? "paid" : "error");
        } catch {
          setStatus("error");
        }
      },
      modal: {
        ondismiss: () => setStatus("idle"),
      },
    });

    razorpay.open();
  }

  if (status === "paid") {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-4">
          ✓
        </div>
        <p className="font-bold text-neutral-900">Payment received — thank you!</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptReady(true)}
      />
      <button
        type="button"
        onClick={openCheckout}
        disabled={!scriptReady || status === "processing" || status === "verifying"}
        className="w-full px-6 py-3 rounded-full text-sm font-bold bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white transition-colors"
      >
        {status === "verifying"
          ? "Confirming payment…"
          : status === "processing"
            ? "Opening checkout…"
            : "Pay now"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-500 mt-3 text-center">
          Payment could not be verified. If money was deducted, contact us — no need to retry.
        </p>
      )}
    </>
  );
}
