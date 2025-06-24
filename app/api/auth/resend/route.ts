import { prisma } from "@/lib/database";
import { sendVerificationEmail } from "@/lib/send-verification";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.emailVerified) return NextResponse.json({ ok: true });
  await sendVerificationEmail(user.email);
  return NextResponse.json({ ok: true });
}
