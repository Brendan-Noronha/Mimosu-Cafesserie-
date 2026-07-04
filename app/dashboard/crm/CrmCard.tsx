"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { LEAD_STAGES, SCORE_TONES, type Lead, type LeadStage } from "@/lib/leads/types";
import { updateLeadStage } from "../leads/actions";

export default function CrmCard({ lead, clientName }: { lead: Lead; clientName: string }) {
  const [stage, setStage] = useState(lead.stage);
  const [, startTransition] = useTransition();

  function handleChange(next: LeadStage) {
    setStage(next);
    startTransition(() => {
      updateLeadStage(lead.id, next);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_16px_-8px_rgba(0,0,0,0.08)] p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link href={`/dashboard/leads/${lead.id}`} className="font-medium text-sm text-neutral-900 hover:underline">
          {lead.name}
        </Link>
        <Badge tone={SCORE_TONES[lead.score]}>{lead.score}</Badge>
      </div>
      <p className="text-xs text-neutral-400 mb-3">{clientName}</p>
      <select
        value={stage}
        onChange={(e) => handleChange(e.target.value as LeadStage)}
        className="w-full rounded-lg bg-neutral-50 border border-neutral-200 px-2 py-1.5 text-xs text-neutral-700"
      >
        {LEAD_STAGES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
