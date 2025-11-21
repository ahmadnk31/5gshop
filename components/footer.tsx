import {  MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

import { useTranslations } from 'next-intl';
import { CookiePreferencesButton } from "./cookie-preferences-button";
import { TrackablePhoneLink } from "./analytics-components";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { LanguageSelector } from "./language-selector";

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Logo and Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
                         <Image
                           src="/logo.svg"
                           alt="5gphones Logo"
                           width={42}
                           height={42}
                           className="h-12 w-12 sm:h-8 sm:w-8 text-blue-500" 
                         />
                         <span className="text-lg sm:text-xl font-bold">
                           5gphones
                         </span>
                       </Link>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('description')}
            </p>
            <LanguageSelector />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('quickLinks.title')}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/repairs" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  {t('quickLinks.deviceRepairs')}
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  {t('quickLinks.accessories')}
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  {t('quickLinks.getQuote')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
                  {t('quickLinks.aboutUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('contactInfo.title')}</h3>
            <ul className="space-y-2.5">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm leading-relaxed">{t('contactInfo.address')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                <TrackablePhoneLink 
                  phoneNumber="+32467871205"
                  className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                >
                  {t('contactInfo.phone')}
                </TrackablePhoneLink>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{t('contactInfo.email')}</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('businessHours.title')}</h3>
            <ul className="space-y-1.5 text-gray-300 text-sm">
              <li>{t('businessHours.mondayFriday')}</li>
              <li>{t('businessHours.saturday')}</li>
              <li>{t('businessHours.sunday')}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          {/* Legal Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center flex-wrap gap-4 sm:gap-6 mb-6">
            <Link href="/privacy" className="text-gray-300 hover:text-green-400 transition-colors text-sm whitespace-nowrap">
              {t('legal.privacyPolicy')}
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-green-400 transition-colors text-sm whitespace-nowrap">
              {t('legal.termsOfService')}
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-green-400 transition-colors text-sm whitespace-nowrap">
              {t('legal.contactUs')}
            </Link>
            <div className="flex items-center">
              <CookiePreferencesButton />
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="flex flex-col items-center mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">{t('paymentMethods.title') || 'Accepted Payment Methods'}</h4>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Image
                src="/visa-logo.svg"
                alt="Visa"
                width={120}
                height={110}
                className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity [&_rect]:fill-transparent [&_path]:fill-current"
              />
              <Image
                src="/mastercard-svgrepo-com.svg"
                alt="Mastercard"
                width={60}
                height={40}
                className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/amex-svgrepo-com.svg"
                alt="American Express"
                width={60}
                height={40}
                className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/apple-pay-svgrepo-com.svg"
                alt="Apple Pay"
                width={60}
                height={40}
                className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/stripe-logo-blue.svg"
                alt="Stripe"
                width={60}
                height={40}
                className="h-12 w-auto opacity-70 hover:opacity-100  transition-opacity"
              />
              <Image
                src="/klarna-svgrepo-com.svg"
                alt="Klarna"
                width={60}
                height={40}
                className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/bancontact-svgrepo-com.svg"
                alt="Bancontact"
                width={60}
                height={40}
                className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/belfius-svgrepo-com.svg"
                alt="Belfius"
                width={60}
                height={40}
                className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/bancontact-payconiq-svgrepo-com.svg"
                alt="Payconiq"
                width={60}
                height={40}
                className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-sm text-center md:text-left">
              © {new Date().getFullYear()} 5gphones. {t('copyright')}
              {t('poweredBy') && (
                <span className="ml-1 text-gray-400">
                  {t('poweredBy')}
                </span>
              )}
            </p>
            <div className="flex space-x-4">
              <Link 
                target="_blank" 
                href="https://www.facebook.com/people/5G-Phones/61574724281619/?mibextid=wwXIfr&rdid=ejJd9qfqIlAcJifz&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BRtxJDHSV%2F%3Fmibextid%3DwwXIfr" 
                className="text-gray-400 hover:text-green-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}