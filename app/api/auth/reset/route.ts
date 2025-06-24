import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/database";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: "Token expired or invalid" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email: record.identifier } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { hashedPassword: hashed } });
  await prisma.verificationToken.delete({ where: { token } });
  return NextResponse.json({ ok: true });
}
