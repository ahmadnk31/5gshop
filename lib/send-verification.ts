import { ResendService } from "./resend-service";

export async function sendVerificationEmail(email: string, token?: string) {
  return ResendService.sendVerificationEmail(email, token || "");
}

export async function sendResetEmail(email: string, token: string, locale: string) {
  return ResendService.sendResetEmail(email, token, locale);
}
