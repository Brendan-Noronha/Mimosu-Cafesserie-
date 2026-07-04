export const LEAD_INTENTS = [
  { value: "buying", label: "Buying" },
  { value: "selling", label: "Selling" },
  { value: "both", label: "Both" },
] as const;

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment / Condo" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot / Land" },
  { value: "commercial", label: "Commercial" },
] as const;

export const TIMELINES = [
  { value: "immediate", label: "Immediate (0–30 days)" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-plus-months", label: "6+ months" },
  { value: "just-browsing", label: "Just browsing" },
] as const;

export const FINANCING_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "loan", label: "Loan / Mortgage" },
  { value: "unsure", label: "Unsure" },
] as const;

export const LEAD_SCORES = ["hot", "warm", "cold", "spam"] as const;
export type LeadScore = (typeof LEAD_SCORES)[number];

export const SCORE_TONES: Record<LeadScore, "red" | "orange" | "blue" | "neutral"> = {
  hot: "red",
  warm: "orange",
  cold: "blue",
  spam: "neutral",
};

export const LEAD_STAGES = [
  { value: "new", label: "New Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "appointment", label: "Appointment Scheduled" },
  { value: "visit", label: "Property Visit" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number]["value"];

export const LEAD_SOURCES = ["manual", "meta-lead-ad"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const FOLLOW_UP_STAGES = [
  "immediate",
  "5-minutes",
  "1-day",
  "3-days",
  "7-days",
  "14-days",
] as const;
export type FollowUpStage = (typeof FOLLOW_UP_STAGES)[number];

export interface LeadAnswers {
  intent: string;
  budget: string;
  location: string;
  propertyType: string;
  timeline: string;
  financing: string;
  workingWithAgent: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  motivationNotes: string;
}

export interface FollowUpLogEntry {
  stage: FollowUpStage;
  sentAt: string;
}

export interface Lead {
  id: string;
  clientId: string;
  source: LeadSource;
  name: string;
  email: string;
  phone: string;
  answers: LeadAnswers;
  score: LeadScore;
  scoreReason: string;
  stage: LeadStage;
  notes: string;
  followUpLog: FollowUpLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export function labelFor<T extends readonly { value: string; label: string }[]>(
  list: T,
  value: string,
): string {
  return list.find((item) => item.value === value)?.label ?? value;
}
