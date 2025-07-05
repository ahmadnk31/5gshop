"use server";

import { prisma } from "@/lib/database";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: string;
  hashedPassword: string | null;
  createdAt: Date;
  updatedAt: Date;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  _count?: {
    orders: number;
    sessions: number;
  };
}

export async function getUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            orders: true,
            sessions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath('/admin');
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error('Failed to update user role');
  }
}

export async function banUser(userId: string): Promise<void> {
  try {
    // Add a banned flag or use role to indicate banned status
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'BANNED' },
    });

    // Optionally, delete all sessions for the user
    await prisma.session.deleteMany({
      where: { userId },
    });

    revalidatePath('/admin');
  } catch (error) {
    console.error('Error banning user:', error);
    throw new Error('Failed to ban user');
  }
}

export async function unbanUser(userId: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'USER' },
    });

    revalidatePath('/admin');
  } catch (error) {
    console.error('Error unbanning user:', error);
    throw new Error('Failed to unban user');
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    // Delete related data first (sessions, orders, etc.)
    await prisma.session.deleteMany({
      where: { userId },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

export async function getUserStats() {
  try {
    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({ where: { role: 'ADMIN' } });
    const retailerUsers = await prisma.user.count({ where: { role: 'RETAILER' } });
    const regularUsers = await prisma.user.count({ where: { role: 'USER' } });
    const bannedUsers = await prisma.user.count({ where: { role: 'BANNED' } });
    const verifiedUsers = await prisma.user.count({ where: { emailVerified: { not: null } } });

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    return {
      totalUsers,
      adminUsers,
      retailerUsers,
      regularUsers,
      bannedUsers,
      verifiedUsers,
      newUsersThisMonth,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw new Error('Failed to fetch user statistics');
  }
}

export async function updateUserData(userId: string, data: Partial<User>): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data,
    });
    revalidatePath('/admin');
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Failed to update user data');
  }
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword },
    });
    revalidatePath('/admin');
  } catch (error) {
    console.error('Error updating user password:', error);
    throw new Error('Failed to update user password');
  }
} 