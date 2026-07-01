"use client";

import { useState } from "react";

export default function SuccessPage() {
  const [step, setStep] = useState<"form" | "generating" | "done">("form");
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
    setStep("generating");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStep("done");
    } catch {
      alert("Something went wrong. Please try again.");
      setStep("form");
    }
  };

  if (step === "generating") {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-6 animate-pulse">⚙️</div>
          <h1 className="text-2xl font-bold mb-3">Agents are working...</h1>
          <p className="text-slate-400">
            Researching your role, writing your documents, optimizing for ATS, polishing every word.
            <br />This takes about 60 seconds.
          </p>
        </div>
      </main>
    );
  }

  if (step === "done") {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-3xl font-bold mb-4">Pack delivered!</h1>
          <p className="text-slate-400 text-lg mb-8">
            Your resume, cover letter, and LinkedIn About section are on their way to <strong className="text-white">{form.email}</strong>. Check your inbox (and spam).
          </p>
          <a href="/" className="text-blue-400 hover:text-blue-300 text-sm underline">
            Back to home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✅</div>
          <h1 className="text-2xl font-bold mb-2">Payment confirmed!</h1>
          <p className="text-slate-400 text-sm">
            Now tell us about the role. The agents will get to work immediately.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Your email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Target role / job title
              </label>
              <input
                type="text"
                name="targetRole"
                required
                value={form.targetRole}
                onChange={handleChange}
                placeholder="e.g. Senior Product Manager at Stripe"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Job posting
                <span className="text-slate-500 font-normal ml-1">(paste the full posting)</span>
              </label>
              <textarea
                name="jobPosting"
                required
                value={form.jobPosting}
                onChange={handleChange}
                rows={6}
                placeholder="Paste the entire job description here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Your background
                <span className="text-slate-500 font-normal ml-1">(paste your current resume or describe your experience)</span>
              </label>
              <textarea
                name="candidateBackground"
                required
                value={form.candidateBackground}
                onChange={handleChange}
                rows={8}
                placeholder="Paste your current resume or describe your experience, skills, and education..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Generate my Career Launch Pack →
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
