'use client'
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function VerifySuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');
  const already = searchParams.get('already');
  const verified = searchParams.get('verified');

  let message = 'Your email address has been verified. You can now use all features of your account.';
  let title = 'Email Verified Successfully!';
  if (error === 'missing-email') {
    title = 'Verification Error';
    message = 'Missing email address. Please use the verification link from your email.';
  } else if (error === 'user-not-found') {
    title = 'Verification Error';
    message = 'User not found. Please check your verification link.';
  } else if (already) {
    title = 'Email Already Verified';
    message = 'Your email address was already verified. You can now log in.';
  } else if (verified) {
    title = 'Email Verified Successfully!';
    message = 'Your email has been verified and a welcome email has been sent. You can now log in to access all features.';
  }

  // Redirect to login after 3 seconds if successfully verified
  useEffect(() => {
    if (verified || already) {
      const timer = setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [verified, already, router]);

  return (
    <div className="w-full">
      <div className="space-y-6 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
        
        {/* Message */}
        <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto">{message}</p>

        {/* Button */}
        <div className="pt-4">
          {(verified || already) ? (
            <>
              <p className="text-sm text-gray-500 mb-4">Redirecting to login page in 3 seconds...</p>
              <Link 
                href="/auth/login" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-base transition-all shadow-md hover:shadow-lg"
              >
                Go to Login Now
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-base transition-all shadow-md hover:shadow-lg"
              >
                Go to Login
              </Link>
            </>
          )}
        </div>

        {/* Additional Links */}
        {!(verified || already) && (
          <div className="pt-4 border-t-2 border-gray-100">
            <Link 
              href="/" 
              className="text-green-600 hover:text-green-700 font-medium text-base hover:underline transition-colors"
            >
              Return to Home Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifySuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <VerifySuccessContent />
    </Suspense>
  );
}
