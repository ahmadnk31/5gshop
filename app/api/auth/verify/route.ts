import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { ResendService } from "@/lib/resend-service";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const origin = req.nextUrl.origin;
  if (!email) {
    return NextResponse.redirect(
      `${origin}/auth/verify-success?error=missing-email`
    );
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.redirect(
      `${origin}/auth/verify-success?error=user-not-found`
    );
  }
  if (user.emailVerified) {
    return NextResponse.redirect(`${origin}/auth/verify-success?already=1`);
  }
  
  // Update user to verified
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });
  
  // Send welcome email after verification
  try {
    await ResendService.sendWelcomeEmail(email, user.name || "User");
  } catch (error) {
    // Log error but don't fail verification if welcome email fails
    console.error("Failed to send welcome email after verification:", error);
  }
  
  return NextResponse.redirect(`${origin}/auth/verify-success?verified=1`);
}
