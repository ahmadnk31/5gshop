import { NextRequest, NextResponse } from "next/server";

import { sendResetEmail } from "@/lib/send-verification";
import crypto from "crypto";
import { prisma } from "@/lib/database";

export async function POST(req: NextRequest) {
  const { email,locale } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: true }); // Don't reveal if user exists
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });
  await sendResetEmail(email, token, locale);
  return NextResponse.json({ ok: true });
}
