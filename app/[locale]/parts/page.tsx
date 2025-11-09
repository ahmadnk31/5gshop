import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";
import PartsPageClient from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata({
    title: "GSM Onderdelen Leuven | iPhone, MacBook, iPad, Laptop Parts ⭐ 5G Phones",
    description: "⭐ Kwaliteitsvolle onderdelen Leuven - iPhone schermen, MacBook batterijen, iPad displays, Laptop onderdelen, Samsung screens ✓ Professionele installatie ✓ Garantie ✓ Op voorraad ✓ Bondgenotenlaan 84A ✓ Replacement parts for all devices!",
    path: "/parts", 
    keywords: [
      // Primary Parts Keywords
      "gsm onderdelen leuven",
      "telefoon onderdelen leuven",
      "smartphone parts leuven",
      "replacement parts leuven",
      "reparatie onderdelen leuven",
      
      // iPhone Parts
      "iphone onderdelen leuven",
      "iphone screen leuven",
      "iphone scherm leuven",
      "iphone battery leuven",
      "iphone parts leuven",
      "iphone display leuven",
      
      // MacBook Parts
      "macbook onderdelen leuven",
      "macbook battery leuven",
      "macbook screen leuven",
      "macbook keyboard leuven",
      "macbook parts leuven",
      
      // iPad Parts
      "ipad onderdelen leuven",
      "ipad screen leuven",
      "ipad display leuven",
      "ipad battery leuven",
      "ipad parts leuven",
      
      // Laptop Parts
      "laptop onderdelen leuven",
      "laptop screen leuven",
      "laptop battery leuven",
      "laptop keyboard leuven",
      "laptop parts leuven",
      
      // Samsung Parts
      "samsung onderdelen leuven",
      "samsung screen leuven",
      "samsung display leuven",
      "samsung parts leuven",
      "galaxy onderdelen leuven",
      
      // Tablet Parts
      "tablet onderdelen leuven",
      "tablet screen leuven",
      "tablet parts leuven",
      
      // Part Types
      "smartphone schermen leuven",
      "telefoon batterijen leuven",
      "phone screens leuven",
      "phone batteries leuven",
      "charging ports leuven",
      "camera modules leuven",
      "oplaadpoorten leuven",
      
      // Desktop & Computer Parts
      "computer onderdelen leuven",
      "pc parts leuven",
      "desktop components leuven",
      "imac parts leuven",
      
      // Location-specific
      "onderdelen leuven centrum",
      "repair parts bondgenotenlaan",
      "gsm parts leuven",
      "device parts belgium"
    ]
  });
}

export default function PartsPage() {
  return <PartsPageClient />;
}
