import { KanbanSquare } from "lucide-react";
import { Card } from "@/components/ui";

export default function CrmPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">CRM</h1>
      <p className="text-neutral-500 text-sm mb-8">Pipeline from new lead to closed deal.</p>
      <Card className="p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-4">
          <KanbanSquare size={22} />
        </div>
        <h2 className="font-bold text-neutral-900 mb-1">Coming soon</h2>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          New Lead → Contacted → Qualified → Appointment → Visit → Negotiation → Closed/Lost — the
          full pipeline will live here.
        </p>
      </Card>
    </div>
  );
}
