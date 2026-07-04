import Anthropic from "@anthropic-ai/sdk";
import type { LeadAnswers, LeadScore } from "./types";

interface QualifyResult {
  score: LeadScore;
  reason: string;
}

const FALLBACK: QualifyResult = {
  score: "warm",
  reason: "AI qualification unavailable — defaulted to warm for manual review.",
};

export async function qualifyLead(answers: LeadAnswers): Promise<QualifyResult> {
  if (!process.env.ANTHROPIC_API_KEY) return FALLBACK;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are a real estate lead qualification specialist. Score the following lead as exactly one of: hot, warm, cold, spam.

Lead details:
- Intent: ${answers.intent}
- Budget: ${answers.budget}
- Location: ${answers.location}
- Property type: ${answers.propertyType}
- Timeline: ${answers.timeline}
- Financing: ${answers.financing}
- Already working with an agent: ${answers.workingWithAgent ? "yes" : "no"}
- Phone verified: ${answers.phoneVerified ? "yes" : "no"}
- Email verified: ${answers.emailVerified ? "yes" : "no"}
- Motivation notes: ${answers.motivationNotes || "none provided"}

Scoring guide:
- hot: clear budget, urgent timeline (0-30 days), verified contact, motivated, not already with another agent
- warm: real intent but a longer timeline, missing some details, or already lightly engaged elsewhere
- cold: vague answers, long or no timeline, unverified contact, low motivation
- spam: nonsensical, fake, or bot-like answers

Respond with ONLY a JSON object, no markdown fencing, in this exact shape:
{"score": "hot" | "warm" | "cold" | "spam", "reason": "one sentence explaining why"}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content.find((block) => block.type === "text")?.text ?? "";
    const parsed = JSON.parse(text.trim());
    if (["hot", "warm", "cold", "spam"].includes(parsed.score)) {
      return { score: parsed.score, reason: String(parsed.reason ?? "") };
    }
    return FALLBACK;
  } catch {
    return FALLBACK;
  }
}
