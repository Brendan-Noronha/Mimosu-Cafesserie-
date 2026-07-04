import { createJsonStore } from "@/lib/storage/jsonStore";
import type { Lead } from "./types";

const store = createJsonStore<Lead>("leads");

export const saveLead = store.save;
export const getLead = store.get;

export async function listLeads(): Promise<Lead[]> {
  const leads = await store.list();
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listLeadsForClient(clientId: string): Promise<Lead[]> {
  const leads = await listLeads();
  return leads.filter((l) => l.clientId === clientId);
}
