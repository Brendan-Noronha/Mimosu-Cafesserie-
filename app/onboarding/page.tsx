import type { Metadata } from "next";
import OnboardingWizard from "./OnboardingWizard";

export const metadata: Metadata = {
  title: "Client Onboarding — Mimosu",
  description: "Onboard your real estate business for Meta Ads lead generation.",
};

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <OnboardingWizard />
    </main>
  );
}
