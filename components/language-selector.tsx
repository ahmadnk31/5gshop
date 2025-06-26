'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

const locales = ['en', 'nl'] as const;

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    
    // Use the router's built-in locale switching if available
    // This is safer than manual pathname manipulation
    try {
      router.replace(pathname, { locale: newLocale });
    } catch (error) {
      // Fallback to manual pathname construction if needed
      console.warn('Router locale switching failed, using fallback method:', error);
      
      let newPath = pathname;
      const segments = pathname.split('/').filter(Boolean);
      
      // Check if first segment is a locale
      if (locales.includes(segments[0] as any)) {
        // Replace existing locale
        segments[0] = newLocale;
      } else {
        // Add locale at the beginning
        segments.unshift(newLocale);
      }
      
      newPath = '/' + segments.join('/');
      router.replace(newPath);
    }
  };

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      aria-label="Select language"
      className="rounded border px-2 py-1 text-sm text-primary mt-4 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale === 'en' ? 'English' : locale === 'nl' ? 'Nederlands' : locale}
        </option>
      ))}
    </select>
  );
}