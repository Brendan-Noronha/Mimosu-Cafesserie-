import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Redirects to Gumroad product page — no API key needed
export async function GET() {
  return NextResponse.redirect(
    process.env.GUMROAD_PRODUCT_URL || "https://brendanwave00.gumroad.com/l/olbun"
  );
}
