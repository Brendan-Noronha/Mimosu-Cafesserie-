"use client";

import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState<"landing" | "order">("landing");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    targetRole: "",
    jobPosting: "",
    candidateBackground: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (step === "order") {
    return (
      <main className="min-h-screen bg-slate-50 flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-2xl">
          <button
            onClick={() => setStep("landing")}
            className="text-slate-500 text-sm mb-6 hover:text-slate-800 flex items-center gap-1"
          >
            ← Back
          </button>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Build your Career Launch Pack
            </h2>
            <p className="text-slate-500 mb-8 text-sm">
              Fill in the details below. Your resume, cover letter, and LinkedIn
              About section will be delivered to your email within minutes.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target role / job title
                </label>
                <input
                  type="text"
                  name="targetRole"
                  required
                  value={form.targetRole}
                  onChange={handleChange}
                  placeholder="e.g. Senior Product Manager at Stripe"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job posting
                  <span className="text-slate-400 font-normal ml-1">
                    (paste the full posting)
                  </span>
                </label>
                <textarea
                  name="jobPosting"
                  required
                  value={form.jobPosting}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Paste the entire job description here..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Your background
                  <span className="text-slate-400 font-normal ml-1">
                    (paste your current resume or describe your experience)
                  </span>
                </label>
                <textarea
                  name="candidateBackground"
                  required
                  value={form.candidateBackground}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Paste your current resume or describe your experience, skills, and education..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                {loading ? "Redirecting to payment..." : "Pay $17 → Get my pack"}
              </button>
              <p className="text-center text-xs text-slate-400">
                Secured by Stripe · Delivered to your email within minutes
              </p>
            </form>
          </div>
        </div>
      </main>
    );
  }

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
        <button
          onClick={() => setStep("order")}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-colors shadow-lg shadow-blue-500/20"
        >
          Get my Career Launch Pack — $17
        </button>
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
        <button
          onClick={() => setStep("order")}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-colors"
        >
          Get my Career Launch Pack — $17
        </button>
      </section>

      <footer className="border-t border-slate-800 text-center py-8 text-slate-600 text-xs">
        Career Launch Pack · AI-powered career documents
      </footer>
    </main>
  );
}
