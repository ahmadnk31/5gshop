import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { hash } from "bcryptjs";
import { sendVerificationEmail } from "@/lib/send-verification";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }
  const hashedPassword = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      role: "user",
      emailVerified: null,
    },
  });
  // Send verification email
  await sendVerificationEmail(email);
  return NextResponse.json({ message: "Registration successful. Please check your email for a verification link." });
}
