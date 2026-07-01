const GUMROAD_URL = "https://brendanwave00.gumroad.com/l/olbun";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
        <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
          AI-Powered Career Documents
        </span>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Land the job.<br />
          <span className="text-blue-400">In 60 seconds.</span>
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          Paste a job posting and your background. Four AI agents analyze the role,
          tailor your resume, optimize for ATS, and polish every word.
          Your complete application pack lands in your inbox — fast.
        </p>
        <a
          href={GUMROAD_URL}
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-colors shadow-lg shadow-blue-500/20"
        >
          Get my Career Launch Pack — $17
        </a>
        <p className="text-slate-600 text-sm mt-4">
          One-time payment · No subscription · Delivered to your email
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-center mb-12 text-slate-100">
          What&apos;s in your pack
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              title: "Tailored Resume",
              desc: "Rewritten to match the exact language of your target job. ATS-optimized, clean formatting.",
              icon: "📄",
            },
            {
              title: "Cover Letter",
              desc: "A concise, compelling 3-paragraph letter connecting your story to the role. Never generic.",
              icon: "✉️",
            },
            {
              title: "LinkedIn About",
              desc: "Keyword-rich, human-sounding About section that makes recruiters reach out to you.",
              icon: "🔗",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-center mb-12 text-slate-100">
          How it works
        </h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { step: "1", label: "Researcher", desc: "Analyzes the job posting — extracts keywords, skills, ATS terms" },
            { step: "2", label: "Writer", desc: "Drafts your resume, cover letter, and LinkedIn About from scratch" },
            { step: "3", label: "ATS Optimizer", desc: "Cross-checks keyword coverage and improves your match score" },
            { step: "4", label: "Editor", desc: "Final polish pass — kills clichés, sharpens every sentence" },
          ].map((a) => (
            <div key={a.step} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold mb-3">
                {a.step}
              </div>
              <h3 className="font-semibold text-white mb-1 text-sm">{a.label}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to apply smarter?</h2>
        <p className="text-slate-400 mb-8">Your tailored pack will be in your inbox within minutes.</p>
        <a
          href={GUMROAD_URL}
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-colors"
        >
          Get my Career Launch Pack — $17
        </a>
      </section>

      <footer className="border-t border-slate-800 text-center py-8 text-slate-600 text-xs">
        Career Launch Pack · AI-powered career documents
      </footer>
    </main>
  );
}
