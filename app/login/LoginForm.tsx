"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui";
import { requestMagicLink, type RequestLinkState } from "./actions";

const initialState: RequestLinkState = { status: "idle" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(requestMagicLink, initialState);

  if (state.status === "sent") {
    return (
      <Card className="p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-4">
          ✓
        </div>
        <h1 className="font-bold text-neutral-900 mb-1">Check your email</h1>
        <p className="text-sm text-neutral-500">
          If that email is on a client account, a login link is on its way. It expires in 15
          minutes.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <h1 className="text-xl font-bold text-neutral-900 mb-1">Client Portal</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Enter the email you onboarded with and we&apos;ll send you a login link.
      </p>
      <form action={formAction}>
        <input
          name="email"
          type="email"
          required
          placeholder="you@business.com"
          className="w-full rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-300 mb-4"
        />
        {state.status === "error" && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-sm text-red-500">
            {state.error}
          </div>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full px-6 py-2.5 rounded-full text-sm font-bold bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white transition-colors"
        >
          {pending ? "Sending…" : "Send login link"}
        </button>
      </form>
    </Card>
  );
}
