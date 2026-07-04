import type { FollowUpStage, Lead } from "./types";

export const FOLLOW_UP_THRESHOLD_MINUTES: Record<FollowUpStage, number> = {
  immediate: 0,
  "5-minutes": 5,
  "1-day": 24 * 60,
  "3-days": 3 * 24 * 60,
  "7-days": 7 * 24 * 60,
  "14-days": 14 * 24 * 60,
};

export const FOLLOW_UP_ORDER: FollowUpStage[] = [
  "immediate",
  "5-minutes",
  "1-day",
  "3-days",
  "7-days",
  "14-days",
];

const CONTENT: Record<FollowUpStage, (lead: Lead) => { subject: string; body: string }> = {
  immediate: (lead) => ({
    subject: "Thanks for reaching out!",
    body: `Hi ${lead.name.split(" ")[0] || "there"}, thanks for your interest — we've received your inquiry and someone from our team will be in touch shortly.`,
  }),
  "5-minutes": (lead) => ({
    subject: "Quick question about your search",
    body: `Hi ${lead.name.split(" ")[0] || "there"}, are you looking to buy or sell, and what's your ideal timeline? Reply and we'll tailor a few options for you right away.`,
  }),
  "1-day": (lead) => ({
    subject: "Still interested?",
    body: `Just checking in — are you still interested in properties${lead.answers.location ? ` in ${lead.answers.location}` : ""}? Happy to send over some options.`,
  }),
  "3-days": () => ({
    subject: "Following up",
    body: "Following up on your recent inquiry — happy to answer any questions or schedule a quick call whenever works for you.",
  }),
  "7-days": () => ({
    subject: "Reconnecting",
    body: "Wanted to reconnect — let us know if you'd like updated listings, pricing, or have any questions we can help with.",
  }),
  "14-days": () => ({
    subject: "Whenever you're ready",
    body: "No pressure at all — we're here whenever you're ready to move forward with your property search. Just reply to this email.",
  }),
};

export function getFollowUpContent(stage: FollowUpStage, lead: Lead) {
  return CONTENT[stage](lead);
}

export function nextDueFollowUp(lead: Lead): FollowUpStage | null {
  const sentStages = new Set(lead.followUpLog.map((entry) => entry.stage));
  const ageMinutes = (Date.now() - new Date(lead.createdAt).getTime()) / (60 * 1000);

  for (const stage of FOLLOW_UP_ORDER) {
    if (sentStages.has(stage)) continue;
    if (ageMinutes >= FOLLOW_UP_THRESHOLD_MINUTES[stage]) return stage;
    break; // stages are in ascending order — stop at the first not-yet-due one
  }
  return null;
}
