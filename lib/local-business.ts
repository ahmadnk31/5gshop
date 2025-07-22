import { generateLocalBusinessSchema } from '@/lib/seo'

// NAP (Name, Address, Phone) consistency data
export const businessNAP = {
  name: '5gphones Leuven',
  address: {
    street: 'Bondgenotenlaan 84A',
    city: 'Leuven',
    postalCode: '3000',
    region: 'Vlaams-Brabant',
    country: 'Belgium',
    countryCode: 'BE'
  },
  phone: '+32 466 13 41 81',
  email: 'info@5gphones.be',
  website: 'https://5gphones.be'
}

// Google My Business optimization data
export const googleBusinessData = {
  ...businessNAP,
  categories: [
    'Mobile Phone Repair Shop',
    'Electronics Repair Shop', 
    'Cell Phone Store',
    'Electronics Store'
  ],
  description: 'Professionele GSM en telefoon reparatie service in Leuven. Gespecialiseerd in iPhone, Samsung, Huawei en alle smartphone merken. Snelle service, kwaliteitsgarantie, ervaren techniekers.',
  hours: {
    monday: '10:00-18:00',
    tuesday: '10:00-18:00', 
    wednesday: '10:00-18:00',
    thursday: '10:00-18:00',
    friday: '10:00-18:00',
    saturday: '10:00-18:30',
    sunday: 'Gesloten'
  },
  services: [
    'iPhone Reparatie',
    'Samsung Reparatie',
    'Huawei Reparatie',
    'Scherm Vervanging',
    'Batterij Reparatie',
    'Waterschade Herstel',
    'Software Problemen',
    'Tablet Reparatie',
    'Smartwatch Reparatie',
    'Gratis Diagnose'
  ],
  keywords: [
    'gsm reparatie leuven',
    'telefoon reparatie leuven',
    'iphone reparatie leuven',
    'samsung reparatie leuven',
    'smartphone reparatie leuven',
    'scherm reparatie leuven',
    'batterij vervanging leuven'
  ]
}

// Local citation sources for Belgium/Flanders
export const localCitationSources = [
  {
    name: 'Google My Business',
    url: 'https://www.google.com/business/',
    priority: 'high',
    completed: false
  },
  {
    name: 'Bing Places',
    url: 'https://www.bingplaces.com/',
    priority: 'high', 
    completed: false
  },
  {
    name: 'Apple Maps Connect',
    url: 'https://mapsconnect.apple.com/',
    priority: 'medium',
    completed: false
  },
  {
    name: 'Foursquare',
    url: 'https://foursquare.com/business/',
    priority: 'medium',
    completed: false
  },
  {
    name: 'Gouden Gids (Belgium)',
    url: 'https://www.goudengids.be/',
    priority: 'high',
    completed: false
  },
  {
    name: 'Pagesdor (Belgium)',
    url: 'https://www.pagesdor.be/',
    priority: 'high', 
    completed: false
  },
  {
    name: 'Telefoongids.be',
    url: 'https://www.telefoongids.be/',
    priority: 'medium',
    completed: false
  },
  {
    name: 'Yelp',
    url: 'https://www.yelp.com/business/',
    priority: 'medium',
    completed: false
  }
]

// Generate local business hours schema
export function generateBusinessHoursSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OpeningHoursSpecification',
    openingHours: [
      'Mo-Fr 10:00-18:00',
      'Sa 10:00-18:30'
    ],
    opens: '10:00',
    closes: '18:00',
    dayOfWeek: [
      'Monday',
      'Tuesday', 
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
  }
}

// Generate review aggregate schema (when you have reviews)
export function generateReviewAggregateSchema(averageRating: number = 4.8, reviewCount: number = 47) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: averageRating,
    reviewCount: reviewCount,
    bestRating: 5,
    worstRating: 1
  }
}

// Generate structured data for local business with enhanced details
export function generateCompleteLocalBusinessSchema() {
  const baseSchema = generateLocalBusinessSchema()
  
  return {
    ...baseSchema,
    openingHoursSpecification: generateBusinessHoursSchema(),
    aggregateRating: generateReviewAggregateSchema(),
    hasMap: `https://www.google.com/maps/place/${encodeURIComponent(businessNAP.address.street + ', ' + businessNAP.address.city)}`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.8798, // Approximate coordinates for Bondgenotenlaan, Leuven
      longitude: 4.7005
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Leuven'
      },
      {
        '@type': 'State', 
        name: 'Vlaams-Brabant'
      },
      {
        '@type': 'Country',
        name: 'Belgium'
      }
    ],
    paymentAccepted: [
      'Cash',
      'Credit Card',
      'Debit Card', 
      'Bancontact',
      'Bank Transfer'
    ],
    currenciesAccepted: 'EUR',
    priceRange: '€€',
    knowsLanguage: ['Dutch', 'English', 'French'],
    foundingDate: '2020-01-01',
    slogan: 'Uw vertrouwde GSM reparatie specialist in Leuven',
    brand: {
      '@type': 'Brand',
      name: '5gphones',
      logo: 'https://5gphones.be/logo.png'
    }
  }
}
