"use server";

import { revalidatePath } from "next/cache";
import { qualifyLead } from "@/lib/leads/qualify";
import { getLead, saveLead } from "@/lib/leads/storage";
import type { Lead, LeadAnswers, LeadStage } from "@/lib/leads/types";

export interface CreateLeadState {
  status: "idle" | "error" | "success";
  error?: string;
}

export async function createLead(
  _prevState: CreateLeadState,
  formData: FormData,
): Promise<CreateLeadState> {
  const clientId = String(formData.get("clientId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!clientId || !name || (!email && !phone)) {
    return { status: "error", error: "Client, name, and at least one contact method are required." };
  }

  const answers: LeadAnswers = {
    intent: String(formData.get("intent") ?? ""),
    budget: String(formData.get("budget") ?? ""),
    location: String(formData.get("location") ?? ""),
    propertyType: String(formData.get("propertyType") ?? ""),
    timeline: String(formData.get("timeline") ?? ""),
    financing: String(formData.get("financing") ?? ""),
    workingWithAgent: formData.get("workingWithAgent") === "on",
    phoneVerified: formData.get("phoneVerified") === "on",
    emailVerified: formData.get("emailVerified") === "on",
    motivationNotes: String(formData.get("motivationNotes") ?? ""),
  };

  const { score, reason } = await qualifyLead(answers);
  const now = new Date().toISOString();

  const lead: Lead = {
    id: crypto.randomUUID(),
    clientId,
    source: "manual",
    name,
    email,
    phone,
    answers,
    score,
    scoreReason: reason,
    stage: "new",
    notes: "",
    followUpLog: [],
    createdAt: now,
    updatedAt: now,
  };

  await saveLead(lead);
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/crm");
  revalidatePath("/dashboard");

  return { status: "success" };
}

export async function updateLeadStage(id: string, stage: LeadStage): Promise<void> {
  const lead = await getLead(id);
  if (!lead) return;
  lead.stage = stage;
  lead.updatedAt = new Date().toISOString();
  await saveLead(lead);
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/crm");
  revalidatePath(`/dashboard/leads/${id}`);
}

export async function updateLeadNotes(id: string, notes: string): Promise<void> {
  const lead = await getLead(id);
  if (!lead) return;
  lead.notes = notes;
  lead.updatedAt = new Date().toISOString();
  await saveLead(lead);
  revalidatePath(`/dashboard/leads/${id}`);
}
