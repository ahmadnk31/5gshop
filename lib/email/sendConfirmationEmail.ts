import { ResendService } from "@/lib/resend-service";

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
  return ResendService.sendRawEmail({ to, subject, html, text });
}
