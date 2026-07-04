"use client";

import { useState, startTransition } from "react";
import { useActionState } from "react";
import { Card } from "@/components/ui";
import { submitOnboarding, type SubmitOnboardingState } from "./actions";
import {
  ACCESS_ITEMS,
  ACCESS_STATUSES,
  AD_BUDGET_RANGES,
  BUSINESS_TYPES,
  CAMPAIGN_GOALS,
  PROPERTY_PRICE_RANGES,
  SERVICES_OFFERED,
  emptyOnboardingForm,
  type AccessKey,
  type OnboardingFormState,
} from "@/lib/onboarding/types";

const STEPS = [
  "Business",
  "Services & Goals",
  "Market & Budget",
  "Digital Assets",
  "Brand & Creative",
  "Access & Confirm",
];

const initialActionState: SubmitOnboardingState = { status: "idle" };

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-5">
      <span className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-neutral-400 mt-1">{hint}</span>}
      {error && <span className="block text-xs text-red-500 mt-1">{error}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-300";

export default function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingFormState>(emptyOnboardingForm);
  const [files, setFiles] = useState<{
    logo: File | null;
    brandGuidelines: File | null;
    creatives: File[];
  }>({ logo: null, brandGuidelines: null, creatives: [] });
  const [stepError, setStepError] = useState<string | null>(null);
  const [actionState, formAction, pending] = useActionState(
    submitOnboarding,
    initialActionState,
  );

  function update<K extends keyof OnboardingFormState>(key: K, value: OnboardingFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleListValue(key: "services" | "goals", value: string) {
    setForm((prev) => {
      const list = prev[key];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [key]: next };
    });
  }

  function updateAccess(key: AccessKey, value: string) {
    setForm((prev) => ({ ...prev, access: { ...prev.access, [key]: value as never } }));
  }

  function validateStep(): string | null {
    switch (step) {
      case 0:
        if (!form.businessName || !form.contactName || !form.email || !form.phone || !form.businessType)
          return "Please fill in all required fields.";
        break;
      case 1:
        if (form.services.length === 0) return "Select at least one service.";
        if (form.goals.length === 0) return "Select at least one goal.";
        if (!form.idealCustomer) return "Describe your ideal customer.";
        break;
      case 2:
        if (!form.targetLocations || !form.avgPropertyPrice || !form.monthlyAdBudget || !form.previousAdsRun)
          return "Please fill in all required fields.";
        break;
      case 3:
        if (!form.facebookPage || !form.metaBusinessManagerId || !form.adAccountId)
          return "Facebook Page, Business Manager ID, and Ad Account ID are required.";
        break;
      case 5:
        if (Object.values(form.access).some((v) => !v)) return "Please set a status for every access item.";
        if (!form.agreeToTerms) return "You must agree to the terms to continue.";
        if (!form.signatureName) return "Type your name to confirm.";
        break;
    }
    return null;
  }

  function next() {
    const err = validateStep();
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStepError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit() {
    const err = validateStep();
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);

    const fd = new FormData();
    fd.set("businessName", form.businessName);
    fd.set("contactName", form.contactName);
    fd.set("email", form.email);
    fd.set("phone", form.phone);
    fd.set("businessType", form.businessType);
    fd.set("yearsInBusiness", form.yearsInBusiness);
    form.services.forEach((s) => fd.append("services", s));
    form.goals.forEach((g) => fd.append("goals", g));
    fd.set("idealCustomer", form.idealCustomer);
    fd.set("targetLocations", form.targetLocations);
    fd.set("avgPropertyPrice", form.avgPropertyPrice);
    fd.set("monthlyAdBudget", form.monthlyAdBudget);
    fd.set("previousAdsRun", form.previousAdsRun);
    fd.set("previousAdsDetails", form.previousAdsDetails);
    fd.set("facebookPage", form.facebookPage);
    fd.set("metaPageId", form.metaPageId);
    fd.set("instagram", form.instagram);
    fd.set("metaBusinessManagerId", form.metaBusinessManagerId);
    fd.set("adAccountId", form.adAccountId);
    fd.set("pixelId", form.pixelId);
    fd.set("website", form.website);
    fd.set("crmName", form.crmName);
    fd.set("primaryColor", form.primaryColor);
    fd.set("secondaryColor", form.secondaryColor);
    fd.set("accentColor", form.accentColor);
    for (const item of ACCESS_ITEMS) {
      fd.set(`access.${item.key}`, form.access[item.key]);
    }
    fd.set("agreeToTerms", String(form.agreeToTerms));
    fd.set("signatureName", form.signatureName);
    if (files.logo) fd.set("logo", files.logo);
    if (files.brandGuidelines) fd.set("brandGuidelines", files.brandGuidelines);
    files.creatives.forEach((f) => fd.append("previousAdCreatives", f));

    startTransition(() => {
      formAction(fd);
    });
  }

  if (actionState.status === "success") {
    return (
      <div className="max-w-xl mx-auto text-center py-24 px-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-6">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">You&apos;re all set</h1>
        <p className="text-neutral-500">
          Thanks, {form.contactName.split(" ")[0] || "there"} — we&apos;ve received {form.businessName}&apos;s
          onboarding details. Our team will review your access and reach out shortly to confirm your
          campaign strategy.
        </p>
        <p className="text-neutral-400 text-xs mt-6">Reference ID: {actionState.recordId}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Client Onboarding</h1>
        <p className="text-neutral-500 text-sm">
          Tell us about your business so we can build your Meta Ads lead generation strategy.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full ${i <= step ? "bg-neutral-900" : "bg-neutral-200"}`}
            />
            <span
              className={`block text-[11px] mt-1.5 ${i === step ? "text-neutral-900 font-medium" : "text-neutral-400"}`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <Card className="p-6 sm:p-8">
        {step === 0 && (
          <>
            <Field label="Business name *">
              <input
                className={inputClass}
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
              />
            </Field>
            <Field label="Contact name *">
              <input
                className={inputClass}
                value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email *">
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <Field label="Phone *">
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Business type *">
              <select
                className={inputClass}
                value={form.businessType}
                onChange={(e) => update("businessType", e.target.value)}
              >
                <option value="">Select one</option>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Years in business" hint="Optional">
              <input
                className={inputClass}
                value={form.yearsInBusiness}
                onChange={(e) => update("yearsInBusiness", e.target.value)}
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Services you offer *">
              <div className="grid grid-cols-2 gap-2">
                {SERVICES_OFFERED.map((s) => (
                  <label key={s.value} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      checked={form.services.includes(s.value)}
                      onChange={() => toggleListValue("services", s.value)}
                      className="accent-neutral-900"
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Campaign goals *">
              <div className="grid grid-cols-2 gap-2">
                {CAMPAIGN_GOALS.map((g) => (
                  <label key={g.value} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      checked={form.goals.includes(g.value)}
                      onChange={() => toggleListValue("goals", g.value)}
                      className="accent-neutral-900"
                    />
                    {g.label}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Describe your ideal customer *">
              <textarea
                className={inputClass}
                rows={3}
                value={form.idealCustomer}
                onChange={(e) => update("idealCustomer", e.target.value)}
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Target locations *" hint="Cities, neighborhoods, or regions — comma separated">
              <input
                className={inputClass}
                value={form.targetLocations}
                onChange={(e) => update("targetLocations", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Average property price *">
                <select
                  className={inputClass}
                  value={form.avgPropertyPrice}
                  onChange={(e) => update("avgPropertyPrice", e.target.value)}
                >
                  <option value="">Select one</option>
                  {PROPERTY_PRICE_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Monthly ad budget *">
                <select
                  className={inputClass}
                  value={form.monthlyAdBudget}
                  onChange={(e) => update("monthlyAdBudget", e.target.value)}
                >
                  <option value="">Select one</option>
                  {AD_BUDGET_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Have you run ads before? *">
              <div className="flex gap-4">
                {["yes", "no"].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="radio"
                      name="previousAdsRun"
                      checked={form.previousAdsRun === v}
                      onChange={() => update("previousAdsRun", v as "yes" | "no")}
                      className="accent-neutral-900"
                    />
                    {v === "yes" ? "Yes" : "No"}
                  </label>
                ))}
              </div>
            </Field>
            {form.previousAdsRun === "yes" && (
              <Field label="Tell us about your previous ads" hint="Optional">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.previousAdsDetails}
                  onChange={(e) => update("previousAdsDetails", e.target.value)}
                />
              </Field>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Facebook Page URL *">
              <input
                className={inputClass}
                value={form.facebookPage}
                onChange={(e) => update("facebookPage", e.target.value)}
              />
            </Field>
            <Field
              label="Facebook Page ID"
              hint="Optional — numeric ID from Meta Business Suite, used to route incoming leads to your account"
            >
              <input
                className={inputClass}
                value={form.metaPageId}
                onChange={(e) => update("metaPageId", e.target.value)}
              />
            </Field>
            <Field label="Instagram handle or URL" hint="Optional">
              <input
                className={inputClass}
                value={form.instagram}
                onChange={(e) => update("instagram", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Meta Business Manager ID *">
                <input
                  className={inputClass}
                  value={form.metaBusinessManagerId}
                  onChange={(e) => update("metaBusinessManagerId", e.target.value)}
                />
              </Field>
              <Field label="Ad Account ID *">
                <input
                  className={inputClass}
                  value={form.adAccountId}
                  onChange={(e) => update("adAccountId", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Meta Pixel ID" hint="Optional — if you have one already">
              <input
                className={inputClass}
                value={form.pixelId}
                onChange={(e) => update("pixelId", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Website" hint="Optional">
                <input
                  className={inputClass}
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </Field>
              <Field label="CRM in use" hint="Optional">
                <input
                  className={inputClass}
                  value={form.crmName}
                  onChange={(e) => update("crmName", e.target.value)}
                />
              </Field>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <Field label="Logo" hint="PNG, JPG, or SVG">
              <input
                type="file"
                accept="image/*"
                className="text-sm text-neutral-600"
                onChange={(e) => setFiles((p) => ({ ...p, logo: e.target.files?.[0] ?? null }))}
              />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Primary color">
                <input
                  type="color"
                  className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50"
                  value={form.primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                />
              </Field>
              <Field label="Secondary color">
                <input
                  type="color"
                  className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50"
                  value={form.secondaryColor}
                  onChange={(e) => update("secondaryColor", e.target.value)}
                />
              </Field>
              <Field label="Accent color">
                <input
                  type="color"
                  className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50"
                  value={form.accentColor}
                  onChange={(e) => update("accentColor", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Brand guidelines" hint="Optional — PDF or doc">
              <input
                type="file"
                className="text-sm text-neutral-600"
                onChange={(e) =>
                  setFiles((p) => ({ ...p, brandGuidelines: e.target.files?.[0] ?? null }))
                }
              />
            </Field>
            <Field label="Previous ad creatives" hint="Optional — images or videos, multiple allowed">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="text-sm text-neutral-600"
                onChange={(e) =>
                  setFiles((p) => ({ ...p, creatives: Array.from(e.target.files ?? []) }))
                }
              />
            </Field>
          </>
        )}

        {step === 5 && (
          <>
            <Field label="Access checklist *" hint="For each item, tell us where things stand">
              <div className="space-y-3">
                {ACCESS_ITEMS.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 bg-neutral-50 border border-neutral-100 rounded-xl px-3.5 py-2.5"
                  >
                    <span className="text-sm text-neutral-700">{item.label}</span>
                    <select
                      className="rounded-lg bg-white border border-neutral-200 px-2 py-1.5 text-xs text-neutral-900"
                      value={form.access[item.key]}
                      onChange={(e) => updateAccess(item.key, e.target.value)}
                    >
                      <option value="">Select status</option>
                      {ACCESS_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </Field>
            <Field label="Type your full name to confirm *">
              <input
                className={inputClass}
                value={form.signatureName}
                onChange={(e) => update("signatureName", e.target.value)}
              />
            </Field>
            <label className="flex items-start gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={form.agreeToTerms}
                onChange={(e) => update("agreeToTerms", e.target.checked)}
                className="accent-neutral-900 mt-0.5"
              />
              <span>
                I confirm the information provided is accurate and I agree to grant the access above
                so the team can begin building and launching campaigns.
              </span>
            </label>
          </>
        )}

        {(stepError || (actionState.status === "error" && actionState.errors)) && (
          <div className="mt-5 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-sm text-red-500">
            {stepError ?? "Please check the highlighted fields and try again."}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-neutral-400 disabled:opacity-30 hover:text-neutral-900 transition-colors"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={pending}
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white transition-colors"
            >
              {pending ? "Submitting…" : "Submit onboarding"}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
