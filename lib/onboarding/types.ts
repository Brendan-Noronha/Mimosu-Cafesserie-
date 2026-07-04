export const BUSINESS_TYPES = [
  { value: "agent", label: "Real Estate Agent" },
  { value: "broker-brokerage", label: "Broker / Brokerage" },
  { value: "developer", label: "Developer / Builder" },
  { value: "luxury-realtor", label: "Luxury Realtor" },
  { value: "property-consultant", label: "Property Consultant" },
  { value: "investment-company", label: "Property Investment Company" },
  { value: "other", label: "Other" },
] as const;

export const SERVICES_OFFERED = [
  { value: "buyer-leads", label: "Buyer Leads" },
  { value: "seller-leads", label: "Seller Leads" },
  { value: "luxury-leads", label: "Luxury Property Leads" },
  { value: "project-launch", label: "Project Launch Campaigns" },
  { value: "open-house", label: "Open House Campaigns" },
  { value: "rental-leads", label: "Rental Leads" },
  { value: "investment-leads", label: "Investment Leads" },
] as const;

export const CAMPAIGN_GOALS = [
  { value: "more-buyer-leads", label: "More Buyer Leads" },
  { value: "more-seller-leads", label: "More Seller Leads" },
  { value: "more-appointments", label: "More Booked Appointments" },
  { value: "project-launch-leads", label: "Project Launch Leads" },
  { value: "brand-awareness", label: "Brand Awareness" },
] as const;

export const PROPERTY_PRICE_RANGES = [
  { value: "under-200k", label: "Under $200k" },
  { value: "200k-500k", label: "$200k – $500k" },
  { value: "500k-1m", label: "$500k – $1M" },
  { value: "1m-3m", label: "$1M – $3M" },
  { value: "3m-plus", label: "$3M+" },
] as const;

export const AD_BUDGET_RANGES = [
  { value: "under-1k", label: "Under $1,000/mo" },
  { value: "1k-3k", label: "$1,000 – $3,000/mo" },
  { value: "3k-5k", label: "$3,000 – $5,000/mo" },
  { value: "5k-10k", label: "$5,000 – $10,000/mo" },
  { value: "10k-plus", label: "$10,000+/mo" },
] as const;

export const ACCESS_ITEMS = [
  { key: "facebookPage", label: "Facebook Page" },
  { key: "instagram", label: "Instagram Account" },
  { key: "businessManager", label: "Meta Business Manager" },
  { key: "adAccount", label: "Meta Ad Account" },
  { key: "pixel", label: "Meta Pixel" },
  { key: "crm", label: "CRM" },
] as const;

export const ACCESS_STATUSES = [
  { value: "granted", label: "Already granted" },
  { value: "will-grant", label: "Will grant during onboarding" },
  { value: "not-applicable", label: "Not applicable" },
] as const;

export type AccessKey = (typeof ACCESS_ITEMS)[number]["key"];
export type AccessStatus = (typeof ACCESS_STATUSES)[number]["value"];

export interface OnboardingFormState {
  // Step 1 — Business
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  yearsInBusiness: string;

  // Step 2 — Services & Goals
  services: string[];
  goals: string[];
  idealCustomer: string;

  // Step 3 — Market & Budget
  targetLocations: string;
  avgPropertyPrice: string;
  monthlyAdBudget: string;
  previousAdsRun: "yes" | "no" | "";
  previousAdsDetails: string;

  // Step 4 — Digital Assets
  facebookPage: string;
  metaPageId: string;
  instagram: string;
  metaBusinessManagerId: string;
  adAccountId: string;
  pixelId: string;
  website: string;
  crmName: string;

  // Step 5 — Brand & Creative
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;

  // Step 6 — Access & Confirm
  access: Record<AccessKey, AccessStatus | "">;
  agreeToTerms: boolean;
  signatureName: string;
}

export const emptyOnboardingForm: OnboardingFormState = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  businessType: "",
  yearsInBusiness: "",
  services: [],
  goals: [],
  idealCustomer: "",
  targetLocations: "",
  avgPropertyPrice: "",
  monthlyAdBudget: "",
  previousAdsRun: "",
  previousAdsDetails: "",
  facebookPage: "",
  metaPageId: "",
  instagram: "",
  metaBusinessManagerId: "",
  adAccountId: "",
  pixelId: "",
  website: "",
  crmName: "",
  primaryColor: "#1d4ed8",
  secondaryColor: "#0f172a",
  accentColor: "#eab308",
  access: {
    facebookPage: "",
    instagram: "",
    businessManager: "",
    adAccount: "",
    pixel: "",
    crm: "",
  },
  agreeToTerms: false,
  signatureName: "",
};

export function isWithinDays(isoDate: string, days: number): boolean {
  return Date.now() - new Date(isoDate).getTime() < days * 24 * 60 * 60 * 1000;
}

export function labelFor<T extends readonly { value: string; label: string }[]>(
  list: T,
  value: string,
): string {
  return list.find((item) => item.value === value)?.label ?? value;
}

export interface OnboardingRecord extends Omit<OnboardingFormState, "access"> {
  id: string;
  submittedAt: string;
  access: Record<AccessKey, AccessStatus | "">;
  files: {
    logoUrl: string | null;
    brandGuidelinesUrl: string | null;
    creativeUrls: string[];
  };
  status: "new" | "reviewing" | "active";
}
