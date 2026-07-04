import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "crypto";

export function getRazorpayClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("Razorpay is not configured — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
  }
  return new Razorpay({ key_id, key_secret });
}

export async function createRazorpayOrder(amountInPaise: number, receipt: string) {
  const client = getRazorpayClient();
  return client.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt,
  });
}

// Verifies the signature Razorpay Checkout returns to the browser after payment —
// per Razorpay's documented formula: HMAC-SHA256(order_id + "|" + payment_id, key_secret).
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Verifies the X-Razorpay-Signature header on server-to-server webhook events —
// uses a separate secret (RAZORPAY_WEBHOOK_SECRET) configured in the Razorpay Dashboard.
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  return Razorpay.validateWebhookSignature(rawBody, signature, secret);
}
