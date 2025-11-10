import { businessNAP } from '@/lib/local-business'

export function MicrodataLocalBusiness() {
  return (
    <div 
      itemScope 
      itemType="https://schema.org/LocalBusiness"
      style={{ display: 'none' }}
      aria-hidden="true"
    >
      <span itemProp="name">{businessNAP.name}</span>
      <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
        <span itemProp="streetAddress">{businessNAP.address.street}</span>
        <span itemProp="addressLocality">{businessNAP.address.city}</span>
        <span itemProp="postalCode">{businessNAP.address.postalCode}</span>
        <span itemProp="addressRegion">{businessNAP.address.region}</span>
        <span itemProp="addressCountry">{businessNAP.address.country}</span>
      </div>
      <span itemProp="telephone">{businessNAP.phone}</span>
      <span itemProp="email">{businessNAP.email}</span>
      <a itemProp="url" href={businessNAP.website}>{businessNAP.website}</a>
      <span itemProp="priceRange">€€</span>
      <meta itemProp="openingHours" content="Mo-Fr 10:00-18:00" />
      <meta itemProp="openingHours" content="Sa 10:00-18:30" />
      <div itemProp="geo" itemScope itemType="https://schema.org/GeoCoordinates">
        <meta itemProp="latitude" content="50.8798" />
        <meta itemProp="longitude" content="4.7005" />
      </div>
      <meta itemProp="paymentAccepted" content="Cash, Credit Card, Debit Card, Bancontact" />
      <meta itemProp="currenciesAccepted" content="EUR" />
    </div>
  )
}
