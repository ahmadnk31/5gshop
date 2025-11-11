import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Truck, Shield, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DatabaseService } from "@/lib/database";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import ProductDetailClient from "./product-detail-client";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Helper function to create slug from name
function createSlug(name: string, id: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${nameSlug}-${id}`;
}

// Helper function to extract ID from slug
function extractIdFromSlug(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'parts' });
  const partId = extractIdFromSlug(slug);
  
  try {
    const part = await DatabaseService.getPart(partId);
    
    if (!part) {
      return {
        title: t('notFound.title', { defaultValue: 'Product Not Found' }),
      };
    }

    const locationText = locale === 'nl' ? 'België' : locale === 'fr' ? 'Belgique' : 'Belgium';
    
    return {
      title: `${part.name} - 5gphones ${locationText}`,
      description: part.description || t('partMeta.description', { 
        name: part.name, 
        device: part.deviceModel || part.deviceType || t('partMeta.yourDevice', { defaultValue: 'your device' }),
        sku: part.sku 
      }),
      keywords: [
        part.name,
        part.deviceModel || '',
        part.deviceType || '',
        part.quality || '',
        t('partMeta.keywords.repairPart', { defaultValue: 'repair part' }),
        t('partMeta.keywords.replacement', { defaultValue: 'replacement' }),
        locationText,
        '5gphones'
      ].filter(Boolean),
      openGraph: {
        title: part.name,
        description: part.description || `High-quality ${part.name} for ${part.deviceModel || part.deviceType || 'your device'}`,
        images: part.imageUrl ? [{ url: part.imageUrl, alt: part.name }] : [],
        type: 'website',
        locale: locale,
      },
      alternates: {
        canonical: `/${locale}/parts/${slug}`,
        languages: {
          en: `/en/parts/${slug}`,
          nl: `/nl/parts/${slug}`,
        },
      },
    };
  } catch (error) {
    return {
      title: 'Product Not Found',
    };
  }
}

export default async function PartDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('parts');
  
  const partId = extractIdFromSlug(slug);
  
  let part: any = null;
  let relatedParts: any[] = [];
  
  try {
    part = await DatabaseService.getPart(partId);
    
    if (!part) {
      notFound();
    }

    // Fetch related parts (same device type or model)
    const allParts = await DatabaseService.getParts({ limit: 20 });
    relatedParts = allParts.data
      .filter((p: any) => 
        p.id !== part.id && 
        (p.deviceModel === part.deviceModel || p.deviceType === part.deviceType)
      )
      .slice(0, 4);
      
  } catch (error) {
    console.error('Error loading part:', error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm flex-wrap">
            <Link href="/" className="text-gray-600 hover:text-green-600">
              {t('breadcrumb.home', { defaultValue: 'Home' })}
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/parts" className="text-gray-600 hover:text-green-600">
              {t('breadcrumb.parts', { defaultValue: 'Parts' })}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium line-clamp-1">{part.name}</span>
          </nav>
        </div>
      </section>

      {/* Client Component with Cart Functionality */}
      <ProductDetailClient part={part} relatedParts={relatedParts} />
    </div>
  );
}
