"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { createLead, type CreateLeadState } from "./actions";
import {
  FINANCING_OPTIONS,
  LEAD_INTENTS,
  PROPERTY_TYPES,
  TIMELINES,
} from "@/lib/leads/types";

const initialState: CreateLeadState = { status: "idle" };

const inputClass =
  "w-full rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-300";

export default function NewLeadForm({
  clients,
}: {
  clients: { id: string; businessName: string }[];
}) {
  const [state, formAction, pending] = useActionState(createLead, initialState);

  if (state.status === "success") {
    return (
      <Card className="p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-4">
          ✓
        </div>
        <h2 className="font-bold text-neutral-900 mb-1">Lead added &amp; qualified</h2>
        <p className="text-sm text-neutral-500 mb-4">
          The AI has scored this lead. View it on the Leads or CRM board.
        </p>
        <Link href="/dashboard/leads" className="text-sm font-semibold text-neutral-900 underline">
          Back to leads
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form action={formAction}>
        <div className="grid sm:grid-cols-2 gap-x-4">
          <label className="block mb-5">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Client *</span>
            <select name="clientId" required className={inputClass} defaultValue="">
              <option value="" disabled>
                Select a client
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.businessName}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-5">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Lead name *</span>
            <input name="name" required className={inputClass} />
          </label>
          <label className="block mb-5">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Email</span>
            <input name="email" type="email" className={inputClass} />
          </label>
          <label className="block mb-5">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</span>
            <input name="phone" className={inputClass} />
          </label>
          <label className="block mb-5">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Intent</span>
            <select name="intent" className={inputClass} defaultValue="">
              <option value="">Select one</option>
              {LEAD_INTENTS.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-5">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Budget</span>
            <input name="budget" placeholder="e.g. ₹80L – ₹1.2Cr" className={inputClass} />
          </label>
          <label className="block mb-5">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Location</span>
            <input name="location" className={inputClass} />
          </label>
          <label className="block mb-5">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Property type</span>
            <select name="propertyType" className={inputClass} defaultValue="">
              <option value="">Select one</option>
              {PROPERTY_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-5">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Timeline</span>
            <select name="timeline" className={inputClass} defaultValue="">
              <option value="">Select one</option>
              {TIMELINES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-5">
            <span className="block text-sm font-medium text-neutral-700 mb-1.5">Financing</span>
            <select name="financing" className={inputClass} defaultValue="">
              <option value="">Select one</option>
              {FINANCING_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-5 mb-5">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" name="workingWithAgent" className="accent-neutral-900" />
            Already working with an agent
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" name="phoneVerified" className="accent-neutral-900" />
            Phone verified
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" name="emailVerified" className="accent-neutral-900" />
            Email verified
          </label>
        </div>

        <label className="block mb-6">
          <span className="block text-sm font-medium text-neutral-700 mb-1.5">Motivation notes</span>
          <textarea name="motivationNotes" rows={3} className={inputClass} />
        </label>

        {state.status === "error" && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-sm text-red-500">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 rounded-full text-sm font-bold bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white transition-colors"
        >
          {pending ? "Qualifying with AI…" : "Add & qualify lead"}
        </button>
      </form>
    </Card>
  );
}
