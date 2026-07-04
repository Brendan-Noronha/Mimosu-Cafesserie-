import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
        <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
          Meta Ads for Real Estate
        </span>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Qualified buyer &amp; seller leads.<br />
          <span className="text-blue-400">On autopilot.</span>
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          We run Facebook &amp; Instagram lead generation campaigns for real estate agents,
          brokerages, and developers — then qualify, follow up, and report on every lead with AI.
        </p>
        <Link
          href="/onboarding"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-colors shadow-lg shadow-blue-500/20"
        >
          Start client onboarding
        </Link>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-center mb-12 text-slate-100">What we handle</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              title: "Meta Ads",
              desc: "Campaign strategy, creative, and optimization across Facebook & Instagram — nothing else.",
              icon: "🎯",
            },
            {
              title: "Lead Qualification",
              desc: "Every lead scored hot, warm, cold, or spam before it reaches your sales team.",
              icon: "🧠",
            },
            {
              title: "CRM & Follow-Up",
              desc: "Automated follow-up sequences and pipeline tracking from new lead to closed deal.",
              icon: "🔁",
            },
          ].map((item) => (
            <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Already a client?</h2>
        <p className="text-slate-400 mb-8">Complete your onboarding to get your campaigns started.</p>
        <Link
          href="/onboarding"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-colors"
        >
          Go to onboarding
        </Link>
      </section>

      <footer className="border-t border-slate-800 text-center py-8 text-slate-600 text-xs">
        Meta Ads lead generation for real estate businesses
      </footer>
    </main>
  );
}
