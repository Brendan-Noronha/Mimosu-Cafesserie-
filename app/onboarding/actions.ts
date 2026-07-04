"use server";

import { sendOnboardingNotification } from "@/lib/email";
import { onboardingSchema } from "@/lib/onboarding/schema";
import { saveOnboardingRecord, saveUploadedFile } from "@/lib/onboarding/storage";
import type { OnboardingRecord } from "@/lib/onboarding/types";

export interface SubmitOnboardingState {
  status: "idle" | "error" | "success";
  errors?: Record<string, string>;
  recordId?: string;
}

export async function submitOnboarding(
  _prevState: SubmitOnboardingState,
  formData: FormData,
): Promise<SubmitOnboardingState> {
  const raw = {
    businessName: formData.get("businessName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    businessType: formData.get("businessType"),
    yearsInBusiness: formData.get("yearsInBusiness"),
    services: formData.getAll("services"),
    goals: formData.getAll("goals"),
    idealCustomer: formData.get("idealCustomer"),
    targetLocations: formData.get("targetLocations"),
    avgPropertyPrice: formData.get("avgPropertyPrice"),
    monthlyAdBudget: formData.get("monthlyAdBudget"),
    previousAdsRun: formData.get("previousAdsRun"),
    previousAdsDetails: formData.get("previousAdsDetails"),
    facebookPage: formData.get("facebookPage"),
    instagram: formData.get("instagram"),
    metaBusinessManagerId: formData.get("metaBusinessManagerId"),
    adAccountId: formData.get("adAccountId"),
    pixelId: formData.get("pixelId"),
    website: formData.get("website"),
    crmName: formData.get("crmName"),
    primaryColor: formData.get("primaryColor"),
    secondaryColor: formData.get("secondaryColor"),
    accentColor: formData.get("accentColor"),
    access: {
      facebookPage: formData.get("access.facebookPage"),
      instagram: formData.get("access.instagram"),
      businessManager: formData.get("access.businessManager"),
      adAccount: formData.get("access.adAccount"),
      pixel: formData.get("access.pixel"),
      crm: formData.get("access.crm"),
    },
    agreeToTerms: formData.get("agreeToTerms") === "true",
    signatureName: formData.get("signatureName"),
  };

  const parsed = onboardingSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.join(".")] = issue.message;
    }
    return { status: "error", errors };
  }

  const id = crypto.randomUUID();

  const logoFile = formData.get("logo") as File | null;
  const brandGuidelinesFile = formData.get("brandGuidelines") as File | null;
  const creativeFiles = formData.getAll("previousAdCreatives") as File[];

  const [logoUrl, brandGuidelinesUrl] = await Promise.all([
    logoFile ? saveUploadedFile(id, "logo", logoFile) : Promise.resolve(null),
    brandGuidelinesFile
      ? saveUploadedFile(id, "brand-guidelines", brandGuidelinesFile)
      : Promise.resolve(null),
  ]);

  const creativeUrls = (
    await Promise.all(
      creativeFiles
        .filter((f) => f && f.size > 0)
        .map((f) => saveUploadedFile(id, "creatives", f)),
    )
  ).filter((url): url is string => !!url);

  const record: OnboardingRecord = {
    ...parsed.data,
    id,
    submittedAt: new Date().toISOString(),
    files: { logoUrl, brandGuidelinesUrl, creativeUrls },
    status: "new",
  };

  await saveOnboardingRecord(record);
  await sendOnboardingNotification(record);

  return { status: "success", recordId: id };
}
