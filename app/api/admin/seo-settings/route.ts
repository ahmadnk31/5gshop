import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/database';

// GET - Load SEO settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Load all SEO settings
    const settings = await prisma.setting.findMany({
      where: { category: 'seo' }
    });

    // Convert to object format (strip "seo." prefix from keys)
    const settingsObj: Record<string, any> = {};
    settings.forEach(setting => {
      const key = setting.key.replace(/^seo\./, ''); // Remove "seo." prefix
      try {
        // Try to parse JSON, fallback to string
        settingsObj[key] = JSON.parse(setting.value);
      } catch {
        settingsObj[key] = setting.value;
      }
    });

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    console.error('Error loading SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to load SEO settings' },
      { status: 500 }
    );
  }
}

// POST - Save SEO settings
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settings = await req.json();

    // Save each setting
    const promises = Object.entries(settings).map(([key, value]) => {
      const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
      
      return prisma.setting.upsert({
        where: { key: `seo.${key}` },
        update: {
          value: valueStr,
          updatedAt: new Date()
        },
        create: {
          key: `seo.${key}`,
          value: valueStr,
          category: 'seo',
          description: `SEO setting: ${key}`
        }
      });
    });

    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving SEO settings:', error);
    return NextResponse.json(
      { error: 'Failed to save SEO settings', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

