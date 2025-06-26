import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

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
  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });
  return NextResponse.redirect(`${origin}/auth/verify-success`);
}
