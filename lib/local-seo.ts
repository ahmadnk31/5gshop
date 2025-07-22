import { generateFAQSchema, generateLocalBusinessSchema, generateOrganizationSchema } from "@/lib/seo";

// Local SEO FAQ for common searches
export function generateLocalSEOFAQ() {
  return generateFAQSchema([
    {
      question: "Waar kan ik mijn telefoon laten repareren in Leuven?",
      answer: "Bij 5gphones op Bondgenotenlaan 84A in Leuven kunt u terecht voor professionele telefoon en GSM reparaties. Wij zijn gespecialiseerd in iPhone, Samsung, Huawei en andere smartphone reparaties."
    },
    {
      question: "Hoeveel kost een scherm reparatie in Leuven?",
      answer: "De kosten voor scherm reparatie variëren per toestel. Voor een iPhone scherm reparatie betaalt u vanaf €89, Samsung schermen vanaf €79. Neem contact op voor een exacte prijsopgave."
    },
    {
      question: "Hoe lang duurt een GSM reparatie?",
      answer: "De meeste reparaties zoals scherm vervanging worden binnen 1-2 uur uitgevoerd. Complexere reparaties kunnen 1-3 werkdagen duren. Wij informeren u altijd vooraf over de verwachte duur."
    },
    {
      question: "Geeft 5gphones garantie op reparaties?",
      answer: "Ja, wij geven 6 maanden garantie op alle uitgevoerde reparaties en gebruikte onderdelen. U krijgt altijd een garantiebewijs mee."
    },
    {
      question: "Welke smartphone merken repareren jullie?",
      answer: "Wij repareren alle bekende smartphone merken: iPhone (Apple), Samsung, Huawei, Xiaomi, OnePlus, Google Pixel, Sony, en vele andere merken en modellen."
    },
    {
      question: "Kan ik mijn telefoon vandaag nog laten repareren?",
      answer: "Voor veel reparaties bieden wij same-day service. Bel ons op +32 466 13 41 81 om te vragen of uw reparatie vandaag nog mogelijk is."
    },
    {
      question: "What are your opening hours in Leuven?",
      answer: "We are open Monday to Friday from 10:00 to 18:00, and Saturday from 10:00 to 18:30. We are closed on Sundays. Visit us at Bondgenotenlaan 84A, 3000 Leuven."
    },
    {
      question: "Do you repair phones for international students in Leuven?",
      answer: "Yes, we welcome international students and provide phone repair services in English. We repair all international phone models and accept various payment methods."
    }
  ]);
}

// Service-specific schema for repair services
export function generateRepairServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Smartphone Repair Service',
    name: 'GSM en Telefoon Reparatie Leuven',
    description: 'Professionele GSM reparatie service in Leuven voor alle smartphone merken',
    provider: {
      '@type': 'LocalBusiness',
      name: '5gphones Leuven',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bondgenotenlaan 84A',
        addressLocality: 'Leuven',
        postalCode: '3000',
        addressCountry: 'BE'
      }
    },
    areaServed: {
      '@type': 'City',
      name: 'Leuven'
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://5gphones.be',
      servicePhone: '+32 466 13 41 81'
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'iPhone Scherm Reparatie',
        price: '89',
        priceCurrency: 'EUR',
        description: 'Professionele iPhone scherm reparatie met garantie'
      },
      {
        '@type': 'Offer', 
        name: 'Samsung Scherm Reparatie',
        price: '79',
        priceCurrency: 'EUR',
        description: 'Samsung smartphone scherm vervanging'
      },
      {
        '@type': 'Offer',
        name: 'Batterij Vervanging',
        price: '49',
        priceCurrency: 'EUR', 
        description: 'Smartphone batterij vervanging alle merken'
      }
    ]
  };
}

// Generate enhanced local business data for Google My Business
export function generateEnhancedLocalBusiness() {
  const baseSchema = generateLocalBusinessSchema();
  
  return {
    ...baseSchema,
    // Add more specific business details for local SEO
    hasMap: 'https://www.google.com/maps/place/Bondgenotenlaan+84A,+3000+Leuven',
    isAccessibleForFree: false,
    smokingAllowed: false,
    foundingDate: '2020',
    slogan: 'Uw vertrouwde GSM reparatie specialist in Leuven',
    knowsAbout: [
      'iPhone reparatie',
      'Samsung reparatie', 
      'Huawei reparatie',
      'Smartphone reparatie',
      'Tablet reparatie',
      'Scherm vervanging',
      'Batterij reparatie',
      'GSM onderdelen',
      'Telefoon accessoires'
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Gratis Diagnose',
          description: 'Gratis diagnose van uw smartphone probleem'
        },
        price: '0',
        priceCurrency: 'EUR'
      }
    ]
  };
}
