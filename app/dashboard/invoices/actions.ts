"use server";

import { revalidatePath } from "next/cache";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { saveInvoice } from "@/lib/payments/storage";
import type { Invoice } from "@/lib/payments/types";

export interface CreateInvoiceState {
  status: "idle" | "error" | "success";
  error?: string;
  invoiceId?: string;
}

export async function createInvoice(
  _prevState: CreateInvoiceState,
  formData: FormData,
): Promise<CreateInvoiceState> {
  const clientName = String(formData.get("clientName") ?? "").trim();
  const clientEmail = String(formData.get("clientEmail") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const amountInRupees = Number(formData.get("amount"));

  if (!clientName || !clientEmail || !description || !amountInRupees || amountInRupees <= 0) {
    return { status: "error", error: "All fields are required and amount must be greater than 0." };
  }

  const id = crypto.randomUUID();
  const amountInPaise = Math.round(amountInRupees * 100);

  let razorpayOrderId: string | null;
  try {
    const order = await createRazorpayOrder(amountInPaise, id);
    razorpayOrderId = order.id;
  } catch (err) {
    return {
      status: "error",
      error: err instanceof Error ? err.message : "Failed to create Razorpay order.",
    };
  }

  const invoice: Invoice = {
    id,
    clientName,
    clientEmail,
    description,
    amountInPaise,
    currency: "INR",
    status: "pending",
    razorpayOrderId,
    razorpayPaymentId: null,
    createdAt: new Date().toISOString(),
    paidAt: null,
  };

  await saveInvoice(invoice);
  revalidatePath("/dashboard/invoices");

  return { status: "success", invoiceId: id };
}
