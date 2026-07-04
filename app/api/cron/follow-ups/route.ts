import { NextResponse } from "next/server";
import { sendLeadEmail } from "@/lib/email";
import { listLeads, saveLead } from "@/lib/leads/storage";
import { getFollowUpContent, nextDueFollowUp } from "@/lib/leads/followups";

// Configured in vercel.json as a scheduled job. Vercel automatically sends
// `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set as an env var —
// see https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs.
// On the Hobby plan, Vercel Cron only runs once/day; point an external
// scheduler (e.g. cron-job.org) at this URL with the same bearer secret for
// tighter intervals.
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // no secret configured — allow (local/dev use)
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

const SKIPPED_STAGES = new Set(["closed", "lost"]);

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const leads = await listLeads();
  let sent = 0;

  for (const lead of leads) {
    if (lead.score === "spam" || SKIPPED_STAGES.has(lead.stage)) continue;
    if (!lead.email) continue;

    const dueStage = nextDueFollowUp(lead);
    if (!dueStage) continue;

    const { subject, body } = getFollowUpContent(dueStage, lead);
    const wasSent = await sendLeadEmail(lead.email, subject, body);
    if (!wasSent) continue;

    lead.followUpLog.push({ stage: dueStage, sentAt: new Date().toISOString() });
    lead.updatedAt = new Date().toISOString();
    await saveLead(lead);
    sent += 1;
  }

  return NextResponse.json({ checked: leads.length, sent });
}
