"use client";

import { useState, useTransition } from "react";
import { LEAD_STAGES, type LeadStage } from "@/lib/leads/types";
import { updateLeadNotes, updateLeadStage } from "../actions";

export default function LeadControls({
  leadId,
  initialStage,
  initialNotes,
}: {
  leadId: string;
  initialStage: LeadStage;
  initialNotes: string;
}) {
  const [stage, setStage] = useState(initialStage);
  const [notes, setNotes] = useState(initialNotes);
  const [savedNotes, setSavedNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();

  function handleStageChange(next: LeadStage) {
    setStage(next);
    startTransition(() => {
      updateLeadStage(leadId, next);
    });
  }

  function handleSaveNotes() {
    startTransition(() => {
      updateLeadNotes(leadId, notes).then(() => setSavedNotes(notes));
    });
  }

  return (
    <div className="space-y-6">
      <label className="block">
        <span className="block text-sm font-medium text-neutral-700 mb-1.5">Pipeline stage</span>
        <select
          value={stage}
          onChange={(e) => handleStageChange(e.target.value as LeadStage)}
          className="w-full rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/5"
        >
          {LEAD_STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="block text-sm font-medium text-neutral-700 mb-1.5">Notes</span>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/5"
        />
        <button
          type="button"
          onClick={handleSaveNotes}
          disabled={isPending || notes === savedNotes}
          className="mt-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white transition-colors"
        >
          {isPending ? "Saving…" : "Save notes"}
        </button>
      </label>
    </div>
  );
}
