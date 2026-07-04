import { createJsonStore } from "@/lib/storage/jsonStore";
import type { Invoice } from "./types";

const store = createJsonStore<Invoice>("invoices");

export const saveInvoice = store.save;
export const getInvoice = store.get;

export async function listInvoices(): Promise<Invoice[]> {
  const invoices = await store.list();
  return invoices.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
