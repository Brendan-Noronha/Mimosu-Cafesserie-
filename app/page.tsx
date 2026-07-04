import Link from "next/link";
import { Target, Brain, Repeat } from "lucide-react";
import { Card, Badge } from "@/components/ui";

const FEATURES = [
  {
    title: "Meta Ads",
    desc: "Campaign strategy, creative, and optimization across Facebook & Instagram — nothing else.",
    icon: Target,
  },
  {
    title: "Lead Qualification",
    desc: "Every lead scored hot, warm, cold, or spam before it reaches your sales team.",
    icon: Brain,
  },
  {
    title: "CRM & Follow-Up",
    desc: "Automated follow-up sequences and pipeline tracking from new lead to closed deal.",
    icon: Repeat,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="flex justify-center mb-6">
          <Badge tone="orange">Meta Ads for Real Estate</Badge>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-neutral-900">
          Qualified buyer &amp; seller leads.
          <br />
          <span className="text-neutral-400">On autopilot.</span>
        </h1>
        <p className="text-neutral-500 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          We run Facebook &amp; Instagram lead generation campaigns for real estate agents,
          brokerages, and developers — then qualify, follow up, and report on every lead with AI.
        </p>
        <Link
          href="/onboarding"
          className="inline-block bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-lg px-10 py-4 rounded-full transition-colors"
        >
          Start client onboarding
        </Link>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-12 text-neutral-900">What we handle</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {FEATURES.map((item) => (
            <Card key={item.title} className="p-6">
              <div className="w-11 h-11 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-500 mb-4">
                <item.icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">{item.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-neutral-900">Already a client?</h2>
        <p className="text-neutral-500 mb-8">Complete your onboarding to get your campaigns started.</p>
        <Link
          href="/onboarding"
          className="inline-block bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-lg px-10 py-4 rounded-full transition-colors"
        >
          Go to onboarding
        </Link>
      </section>

      <footer className="border-t border-neutral-200 text-center py-8 text-neutral-400 text-xs">
        Meta Ads lead generation for real estate businesses ·{" "}
        <Link href="/login" className="underline hover:text-neutral-600">
          Client login
        </Link>
      </footer>
    </main>
  );
}
