import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: NextRequest) {
  const { jobPosting, candidateBackground, targetRole, email } =
    await req.json();

  if (!jobPosting || !candidateBackground || !targetRole || !email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Career Launch Pack",
            description:
              "AI-tailored resume, cover letter, and LinkedIn About section — delivered to your email within minutes.",
          },
          unit_amount: 1700, // $17.00
        },
        quantity: 1,
      },
    ],
    metadata: {
      jobPosting: jobPosting.slice(0, 500),
      jobPostingFull: jobPosting,
      candidateBackground,
      targetRole,
      email,
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  });

  return NextResponse.json({ url: session.url });
}
