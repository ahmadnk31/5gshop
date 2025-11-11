import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import PartsPageClient from "./page-client";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'parts' });
  
  return await generatePageMetadata({
    title: t('meta.title'),
    description: t('meta.description'),
    path: "/parts", 
    keywords: t('meta.keywords').split(',').map((k: string) => k.trim())
  });
}

export default function PartsPage() {
  return <PartsPageClient />;
}
