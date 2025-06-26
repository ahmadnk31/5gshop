import { SESService } from "@/lib/ses-service";

// Add this to SESService if not present:
// static async sendGenericEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) { ... }

export async function sendConfirmationEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // Fallback to a simple text version
  const text = html.replace(/<[^>]+>/g, "");
  return SESService.sendRawEmail({ to, subject, html, text });
}
