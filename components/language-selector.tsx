'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

const locales = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' }
] as const;

export function LanguageSelector() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    try {
      router.replace(pathname, { locale: newLocale });
    } catch (error) {
      const segments = pathname.split('/').filter(Boolean);
      if (locales.some((l) => l.code === segments[0])) {
        segments[0] = newLocale;
      } else {
        segments.unshift(newLocale);
      }
      router.replace('/' + segments.join('/'));
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <Globe className="w-4 h-4 text-primary" aria-hidden="true" />
      <select
        value={currentLocale}
        onChange={handleChange}
        aria-label="Select language"
        className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        disabled={!isMounted}
      >
        {locales.map(({ code, label, flag }) => (
          <option key={code} value={code}>
            {flag} {label}
          </option>
        ))}
      </select>
    </div>
  );
}
