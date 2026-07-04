import { Resend } from "resend";
import type { OnboardingRecord } from "./onboarding/types";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendOnboardingNotification(record: OnboardingRecord) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_NOTIFICATION_EMAIL) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; max-width: 680px; margin: 0 auto; padding: 24px; }
    h1 { color: #0f172a; font-size: 22px; margin-bottom: 4px; }
    h2 { color: #1d4ed8; font-size: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 28px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    td { padding: 4px 0; vertical-align: top; }
    td.label { color: #64748b; width: 200px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <h1>New client onboarding submission</h1>
  <p>${record.businessName} (${record.contactName}) just completed onboarding.</p>

  <h2>Business</h2>
  <table>
    <tr><td class="label">Business name</td><td>${record.businessName}</td></tr>
    <tr><td class="label">Contact</td><td>${record.contactName} — ${record.email} — ${record.phone}</td></tr>
    <tr><td class="label">Business type</td><td>${record.businessType}</td></tr>
    <tr><td class="label">Years in business</td><td>${record.yearsInBusiness || "—"}</td></tr>
  </table>

  <h2>Services &amp; Goals</h2>
  <table>
    <tr><td class="label">Services</td><td>${record.services.join(", ")}</td></tr>
    <tr><td class="label">Goals</td><td>${record.goals.join(", ")}</td></tr>
    <tr><td class="label">Ideal customer</td><td>${record.idealCustomer}</td></tr>
  </table>

  <h2>Market &amp; Budget</h2>
  <table>
    <tr><td class="label">Target locations</td><td>${record.targetLocations}</td></tr>
    <tr><td class="label">Avg. property price</td><td>${record.avgPropertyPrice}</td></tr>
    <tr><td class="label">Monthly ad budget</td><td>${record.monthlyAdBudget}</td></tr>
    <tr><td class="label">Previously ran ads?</td><td>${record.previousAdsRun}${record.previousAdsDetails ? " — " + record.previousAdsDetails : ""}</td></tr>
  </table>

  <h2>Digital Assets</h2>
  <table>
    <tr><td class="label">Facebook Page</td><td>${record.facebookPage}</td></tr>
    <tr><td class="label">Instagram</td><td>${record.instagram || "—"}</td></tr>
    <tr><td class="label">Business Manager ID</td><td>${record.metaBusinessManagerId}</td></tr>
    <tr><td class="label">Ad Account ID</td><td>${record.adAccountId}</td></tr>
    <tr><td class="label">Pixel ID</td><td>${record.pixelId || "—"}</td></tr>
    <tr><td class="label">Website</td><td>${record.website || "—"}</td></tr>
    <tr><td class="label">CRM</td><td>${record.crmName || "—"}</td></tr>
  </table>

  <h2>Brand &amp; Creative</h2>
  <table>
    <tr><td class="label">Logo</td><td>${record.files.logoUrl ?? "Not uploaded"}</td></tr>
    <tr><td class="label">Brand colors</td><td>${record.primaryColor} / ${record.secondaryColor} / ${record.accentColor}</td></tr>
    <tr><td class="label">Brand guidelines</td><td>${record.files.brandGuidelinesUrl ?? "Not uploaded"}</td></tr>
    <tr><td class="label">Previous creatives</td><td>${record.files.creativeUrls.length ? record.files.creativeUrls.join("<br>") : "None"}</td></tr>
  </table>

  <h2>Access Checklist</h2>
  <table>
    ${Object.entries(record.access)
      .map(([key, value]) => `<tr><td class="label">${key}</td><td>${value}</td></tr>`)
      .join("")}
  </table>

  <div class="footer">
    <p>Submitted ${new Date(record.submittedAt).toLocaleString()} · Record ID: ${record.id}</p>
  </div>
</body>
</html>
  `.trim();

  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Onboarding <onboarding@resend.dev>",
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject: `New onboarding: ${record.businessName}`,
    html,
  });
}
