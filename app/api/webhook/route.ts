import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { generateCareerPack } from "@/lib/agents";
import { sendCareerPack } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("x-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const hmac = crypto.createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET!);
  const digest = hmac.update(body).digest("hex");

  if (digest !== sig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const eventName = event?.meta?.event_name;

  if (eventName === "order_created") {
    const custom = event?.meta?.custom_data;
    const { jobPosting, candidateBackground, targetRole, email } = custom ?? {};

    if (jobPosting && candidateBackground && targetRole && email) {
      const pack = await generateCareerPack({ jobPosting, candidateBackground, targetRole });
      await sendCareerPack({ to: email, targetRole, pack });
    }
  }

  return NextResponse.json({ received: true });
}
