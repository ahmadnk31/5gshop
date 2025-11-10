"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Navigation
} from "lucide-react";
// Import analytics components
import { TrackablePhoneLink, PageSectionTracker } from "@/components/analytics-components";
import { useTranslations } from 'next-intl';
import ContactMapClientWrapper from "./contact-map-client-wrapper";
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-1/2 h-10 mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full mb-4" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <Skeleton className="h-96 w-full mb-4" />
          <Skeleton className="h-96 w-full mb-4" />
        </div>
        <Skeleton className="w-1/3 h-8 mb-4" />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full mb-4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all">
              <CardHeader>
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>{t('info.visitUs')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {t('info.address.line1')}<br />
                  {t('info.address.line2')}<br />
                  {t('info.address.line3')}<br />
                  <strong>{t('info.address.postalLabel')}</strong> {t('info.address.postalCode')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all">
              <CardHeader>
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>{t('info.callUs')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>{t('info.phone.main')}:</strong> <TrackablePhoneLink phoneNumber="+32466134181" className="text-green-600 hover:underline">+32 (466) 13 41 81</TrackablePhoneLink><br />
                  <strong>{t('info.phone.support')}:</strong> <TrackablePhoneLink phoneNumber="+32467871205" className="text-green-600 hover:underline">+32 (467) 87 12 05</TrackablePhoneLink><br />
                  <strong>{t('info.phone.emergency')}:</strong> <TrackablePhoneLink phoneNumber="+32466134181" className="text-green-600 hover:underline">+32 (466) 13 41 81</TrackablePhoneLink>
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all">
              <CardHeader>
                <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>{t('info.emailUs')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>{t('info.email.general')}:</strong> info@5gphones.be<br />
                  <strong>{t('info.email.support')}:</strong> support@5gphones.be<br />
                  <strong>{t('info.email.sales')}:</strong> sales@5gphones.be
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>{t('info.hoursLabel')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <strong>{t('info.hours.mondayFriday')}:</strong> 10:00 AM - 6:00 PM<br />
                  <strong>{t('info.hours.saturday')}:</strong> 10:00 AM - 6:30 PM<br />
                  <strong>{t('info.hours.sunday')}:</strong> {t('info.hours.closed')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form and Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <MessageSquare className="h-6 w-6 mr-2 text-green-600" />
                  {subject === 'b2b' ? 'B2B Inquiry' : 'Send Us a Message'}
                </CardTitle>
                <CardDescription>
                  {subject === 'b2b' 
                    ? 'Fill out the form below for B2B solutions and we\'ll contact you within 4 hours'
                    : 'Fill out the form below and we\'ll get back to you within 24 hours'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm initialSubject={subject || undefined} />
              </CardContent>
            </Card>

            {/* Map and Directions */}
            <div className="space-y-6">
              <Card className="border-2 border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <Navigation className="h-6 w-6 mr-2 text-green-600" />
                    Find Our Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactMapClientWrapper className="h-64 w-full rounded-lg" />
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100">
                <CardHeader>
                  <CardTitle className="text-green-700">Parking & Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-600">Free parking available in front of the store</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-600">Wheelchair accessible entrance</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-600">Public transportation: Bus stop 50m away</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-600">Train Station: 5-minute walk</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">How long do repairs typically take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Most repairs are completed within 24-48 hours. Complex repairs may take 3-5 business days. We'll provide an estimated completion time when you drop off your device.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Do you offer warranties on repairs?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Yes! We provide a 90-day warranty on all repairs and replacement parts. This covers any defects in workmanship or parts failure.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">We accept cash, all major credit cards (Visa, MasterCard, American Express), debit cards, and digital payments (Apple Pay, Google Pay).</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Do you provide free diagnostics?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Yes, we offer free diagnostic services to identify the issue with your device. You'll receive a detailed quote before any repair work begins.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Service */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Emergency Repair Service</h2>
          <p className="text-base sm:text-lg mb-4 sm:mb-6 max-w-2xl text-white opacity-80 mx-auto px-2">
            Device emergency? We offer same-day repair service for critical issues.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-gray-100 text-sm sm:text-base px-4 sm:px-6">
            <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
            
            <span className="whitespace-wrap">+32 (466) 13 41 81</span>
          </Button>
        </div>
      </section>

      {/* Analytics Tracking - Page View */}
      <PageSectionTracker sectionName="contact_page" />
    </div>
  );
}
