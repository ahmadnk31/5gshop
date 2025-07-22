import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import PartsPageClient from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata({
    title: "Device Replacement Parts & Components",
    description: "High-quality replacement parts for smartphones, tablets, laptops & more. Screens, batteries, cameras, charging ports. Professional installation available in Leuven.",
    path: "/parts", 
    keywords: [
      "replacement parts",
      "phone parts",
      "smartphone screens",
      "phone batteries",
      "charging ports",
      "camera modules",
      "iPhone parts",
      "Samsung parts",
      "tablet parts",
      "laptop parts",
      "repair parts Belgium",
      "Leuven repair shop"
    ]
  });
}

export default function PartsPage() {
  return <PartsPageClient />;
}
