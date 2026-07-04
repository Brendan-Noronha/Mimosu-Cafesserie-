"use server";

import { createToken } from "@/lib/auth/magicLink";
import { sendMagicLinkEmail } from "@/lib/email";
import { listOnboardingRecords } from "@/lib/onboarding/storage";

export interface RequestLinkState {
  status: "idle" | "sent" | "error";
  error?: string;
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;

export async function requestMagicLink(
  _prevState: RequestLinkState,
  formData: FormData,
): Promise<RequestLinkState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) return { status: "error", error: "Enter your email address." };

  const clients = await listOnboardingRecords();
  const client = clients.find((c) => c.email.toLowerCase() === email);

  if (client) {
    try {
      const token = createToken({ clientId: client.id, email, exp: Date.now() + FIFTEEN_MINUTES });
      const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const url = `${base}/api/auth/verify?token=${encodeURIComponent(token)}`;
      await sendMagicLinkEmail(email, url);
    } catch {
      // AUTH_SECRET not configured, or email send failed — fall through to the
      // same generic response so we never reveal whether an email is registered.
    }
  }

  // Always report success, regardless of whether the email matched a client —
  // avoids leaking which emails are registered.
  return { status: "sent" };
}
