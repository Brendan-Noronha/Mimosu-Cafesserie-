import { Target } from "lucide-react";
import { Card } from "@/components/ui";

export default function LeadsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Leads</h1>
      <p className="text-neutral-500 text-sm mb-8">Every lead, scored and ready for follow-up.</p>
      <Card className="p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-4">
          <Target size={22} />
        </div>
        <h2 className="font-bold text-neutral-900 mb-1">Coming soon</h2>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          Once campaigns are live, incoming leads will be scored hot, warm, cold, or spam and listed
          here.
        </p>
      </Card>
    </div>
  );
}
