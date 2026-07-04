import { NextResponse } from "next/server";
import { listInvoices, saveInvoice } from "@/lib/payments/storage";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        status: string;
      };
    };
  };
}

// Configure this URL in Razorpay Dashboard > Settings > Webhooks, subscribed to
// the "payment.captured" event, with RAZORPAY_WEBHOOK_SECRET matching the
// secret you set there. This is the authoritative payment confirmation path —
// it doesn't depend on the client's browser staying open.
export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifyWebhookSignature(rawBody, request.headers.get("x-razorpay-signature"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody) as RazorpayWebhookPayload;

  if (payload.event === "payment.captured" && payload.payload.payment) {
    const { order_id, id: paymentId } = payload.payload.payment.entity;
    const invoices = await listInvoices();
    const invoice = invoices.find((inv) => inv.razorpayOrderId === order_id);

    if (invoice && invoice.status !== "paid") {
      invoice.status = "paid";
      invoice.razorpayPaymentId = paymentId;
      invoice.paidAt = new Date().toISOString();
      await saveInvoice(invoice);
    }
  }

  return NextResponse.json({ received: true });
}
