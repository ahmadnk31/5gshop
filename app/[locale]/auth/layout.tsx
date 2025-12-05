import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  return await generatePageMetadata({
    title: 'Authentication - 5GPhones Fix',
    description: 'Login or register to access your account',
    path: '/auth',
    noIndex: true, // Auth pages should not be indexed
    locale
  });
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-12 bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
