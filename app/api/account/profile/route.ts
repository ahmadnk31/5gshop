import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/database";
import { NextResponse } from "next/server";

// PATCH or POST: update user profile (image)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const {
    image, name,
    firstName, lastName, address1, address2, city, state, postalCode, country
  } = await req.json();
  if (!image && !name && !firstName && !lastName && !address1 && !address2 && !city && !state && !postalCode && !country) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }
  const data: { [key: string]: string | undefined } = {};
  if (image) data.image = image;
  if (name) data.name = name;
  if (firstName) data.firstName = firstName;
  if (lastName) data.lastName = lastName;
  if (address1) data.address1 = address1;
  if (address2) data.address2 = address2;
  if (city) data.city = city;
  if (state) data.state = state;
  if (postalCode) data.postalCode = postalCode;
  if (country) data.country = country;
  await prisma.user.update({
    where: { email: session.user.email },
    data,
  });
  return NextResponse.json({ success: true });
}
