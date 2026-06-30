export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-3xl font-bold mb-4">You&apos;re all set!</h1>
        <p className="text-slate-400 text-lg mb-8">
          Your Career Launch Pack is being generated right now by the AI agents.
          Check your inbox — it&apos;ll be there within a few minutes.
        </p>
        <a
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm underline"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
