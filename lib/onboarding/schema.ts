import { z } from "zod";
import {
  ACCESS_ITEMS,
  ACCESS_STATUSES,
  AD_BUDGET_RANGES,
  BUSINESS_TYPES,
  CAMPAIGN_GOALS,
  PROPERTY_PRICE_RANGES,
  SERVICES_OFFERED,
} from "./types";

const valuesOf = <T extends readonly { value: string }[]>(list: T) =>
  list.map((item) => item.value) as unknown as [T[number]["value"], ...T[number]["value"][]];

const accessStatusEnum = z.enum(valuesOf(ACCESS_STATUSES));

export const onboardingSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required"),
  contactName: z.string().trim().min(1, "Contact name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(1, "Phone number is required"),
  businessType: z.enum(valuesOf(BUSINESS_TYPES)),
  yearsInBusiness: z.string().trim().optional().default(""),

  services: z
    .array(z.enum(valuesOf(SERVICES_OFFERED)))
    .min(1, "Select at least one service"),
  goals: z.array(z.enum(valuesOf(CAMPAIGN_GOALS))).min(1, "Select at least one goal"),
  idealCustomer: z.string().trim().min(1, "Describe your ideal customer"),

  targetLocations: z.string().trim().min(1, "Target locations are required"),
  avgPropertyPrice: z.enum(valuesOf(PROPERTY_PRICE_RANGES)),
  monthlyAdBudget: z.enum(valuesOf(AD_BUDGET_RANGES)),
  previousAdsRun: z.enum(["yes", "no"]),
  previousAdsDetails: z.string().trim().optional().default(""),

  facebookPage: z.string().trim().min(1, "Facebook Page URL is required"),
  instagram: z.string().trim().optional().default(""),
  metaBusinessManagerId: z.string().trim().min(1, "Meta Business Manager ID is required"),
  adAccountId: z.string().trim().min(1, "Ad Account ID is required"),
  pixelId: z.string().trim().optional().default(""),
  website: z.string().trim().optional().default(""),
  crmName: z.string().trim().optional().default(""),

  primaryColor: z.string().trim().min(1),
  secondaryColor: z.string().trim().min(1),
  accentColor: z.string().trim().min(1),

  access: z.object(
    Object.fromEntries(ACCESS_ITEMS.map((item) => [item.key, accessStatusEnum])) as Record<
      (typeof ACCESS_ITEMS)[number]["key"],
      typeof accessStatusEnum
    >,
  ),
  agreeToTerms: z
    .boolean()
    .refine((v) => v === true, { message: "You must agree to the terms to continue" }),
  signatureName: z.string().trim().min(1, "Type your name to confirm"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
