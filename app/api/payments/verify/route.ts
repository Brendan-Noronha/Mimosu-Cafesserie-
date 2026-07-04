import { NextResponse } from "next/server";
import { getInvoice, saveInvoice } from "@/lib/payments/storage";
import { verifyPaymentSignature } from "@/lib/payments/razorpay";

// Called directly by the browser after Razorpay Checkout completes, for immediate
// UI feedback. The webhook at /api/payments/webhook is the authoritative
// server-to-server confirmation and will mark the invoice paid even if the
// browser never calls this endpoint (e.g. tab closed mid-checkout).
export async function POST(request: Request) {
  const body = await request.json();
  const { invoiceId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!invoiceId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const invoice = await getInvoice(invoiceId);
  if (!invoice || invoice.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (invoice.status !== "paid") {
    invoice.status = "paid";
    invoice.razorpayPaymentId = razorpay_payment_id;
    invoice.paidAt = new Date().toISOString();
    await saveInvoice(invoice);
  }

  return NextResponse.json({ success: true });
}
