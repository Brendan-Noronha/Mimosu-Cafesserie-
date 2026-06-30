import { Resend } from "resend";
import { CareerPack } from "./agents";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface SendCareerPackOptions {
  to: string;
  targetRole: string;
  pack: CareerPack;
}

export async function sendCareerPack({
  to,
  targetRole,
  pack,
}: SendCareerPackOptions) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; max-width: 680px; margin: 0 auto; padding: 24px; }
    h1 { color: #0f172a; font-size: 24px; margin-bottom: 4px; }
    h2 { color: #1e40af; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 40px; }
    pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; }
    .badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 99px; font-size: 13px; font-weight: 600; margin-bottom: 24px; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <h1>Your Career Launch Pack is ready 🚀</h1>
  <span class="badge">Tailored for: ${targetRole}</span>
  <p>All three documents below were generated and optimized specifically for your target role. Copy each one directly — they're ready to use.</p>

  <h2>Resume</h2>
  <pre>${pack.resume}</pre>

  <h2>Cover Letter</h2>
  <pre>${pack.coverLetter}</pre>

  <h2>LinkedIn About Section</h2>
  <pre>${pack.linkedInAbout}</pre>

  <div class="footer">
    <p>Career Launch Pack · AI-powered career documents<br>
    Questions? Reply to this email.</p>
  </div>
</body>
</html>
  `.trim();

  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Career Launch Pack <onboarding@resend.dev>",
    to,
    subject: `Your Career Launch Pack for ${targetRole} is ready`,
    html,
  });
}
