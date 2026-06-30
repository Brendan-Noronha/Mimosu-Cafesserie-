import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { generateCareerPack } from "@/lib/agents";
import { sendCareerPack } from "@/lib/email";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { jobPostingFull, candidateBackground, targetRole, email } =
      session.metadata!;

    const pack = await generateCareerPack({
      jobPosting: jobPostingFull,
      candidateBackground,
      targetRole,
    });

    await sendCareerPack({
      to: email,
      targetRole,
      pack,
    });
  }

  return NextResponse.json({ received: true });
}
