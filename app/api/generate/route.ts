import { NextRequest, NextResponse } from "next/server";
import { generateCareerPack } from "@/lib/agents";
import { sendCareerPack } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { jobPosting, candidateBackground, targetRole, email } =
    await req.json();

  if (!jobPosting || !candidateBackground || !targetRole || !email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const pack = await generateCareerPack({ jobPosting, candidateBackground, targetRole });
  await sendCareerPack({ to: email, targetRole, pack });

  return NextResponse.json({ success: true });
}
