import {  MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

import { useTranslations } from 'next-intl';
import { CookiePreferencesButton } from "./cookie-preferences-button";
import { TrackablePhoneLink } from "./analytics-components";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
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
            <p className="text-gray-400 text-sm">
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/repairs" className="text-gray-400 hover:text-white transition-colors">
                  {t('quickLinks.deviceRepairs')}
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="text-gray-400 hover:text-white transition-colors">
                  {t('quickLinks.accessories')}
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-gray-400 hover:text-white transition-colors">
                  {t('quickLinks.getQuote')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  {t('quickLinks.aboutUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t('contactInfo.title')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">{t('contactInfo.address')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <TrackablePhoneLink 
                  phoneNumber="+32467871205"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {t('contactInfo.phone')}
                </TrackablePhoneLink>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">{t('contactInfo.email')}</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t('businessHours.title')}</h3>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li>{t('businessHours.mondayFriday')}</li>
              <li>{t('businessHours.saturday')}</li>
              <li>{t('businessHours.sunday')}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          {/* Legal Links */}
          <div className="flex items-center flex-wrap justify-center space-x-6 space-y-2 mb-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
              {t('legal.privacyPolicy')}
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
              {t('legal.termsOfService')}
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
              {t('legal.contactUs')}
            </Link>
            <CookiePreferencesButton />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              ©
              {new Date().getFullYear()} 5gphones. {t('copyright')}
              <span className="ml-1">{t('poweredBy')}
              <span className="text-blue-400">.</span>
              </span>
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}