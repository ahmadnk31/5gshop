import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/database";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// PATCH or POST: update user profile (image, name, address)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      image, name,
      firstName, lastName, address1, address2, city, state, postalCode, country
    } = body;

    // Check if any data is provided
    if (!image && !name && !firstName && !lastName && !address1 && !address2 && !city && !state && !postalCode && !country) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Build update data object
    const updateData: { [key: string]: string | undefined } = {};
    if (image) updateData.image = image;
    if (name) updateData.name = name;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (address1) updateData.address1 = address1;
    if (address2) updateData.address2 = address2;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (postalCode) updateData.postalCode = postalCode;
    if (country) updateData.country = country;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        address1: updatedUser.address1,
        address2: updatedUser.address2,
        city: updatedUser.city,
        state: updatedUser.state,
        postalCode: updatedUser.postalCode,
        country: updatedUser.country,
      },
      message: "Profile updated successfully. Please refresh the page to see changes."
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ 
      error: "Failed to update profile" 
    }, { status: 500 });
  }
}

// GET: retrieve user profile
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        firstName: true,
        lastName: true,
        address1: true,
        address2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Profile retrieval error:', error);
    return NextResponse.json({ 
      error: "Failed to retrieve profile" 
    }, { status: 500 });
  }
}
