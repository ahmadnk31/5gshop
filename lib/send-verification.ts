import { SESService } from "./ses-service";

export async function sendVerificationEmail(email: string, token?: string) {
  return SESService.sendVerificationEmail(email, token || "");
}

export async function sendResetEmail(email: string, token: string, locale: string) {
  return SESService.sendResetEmail(email, token, locale);
}
