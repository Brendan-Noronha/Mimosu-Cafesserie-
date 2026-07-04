export const INVOICE_STATUSES = ["pending", "paid", "failed"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  description: string;
  amountInPaise: number;
  currency: "INR";
  status: InvoiceStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
  paidAt: string | null;
}

export function formatInr(amountInPaise: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amountInPaise / 100,
  );
}
