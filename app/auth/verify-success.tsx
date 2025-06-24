import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function VerifySuccessPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const already = searchParams.get('already');

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
  }

  return (
    
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">{title}</h1>
        <p className="mb-6 text-gray-700">{message}</p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-semibold">
          Return to Home Page
        </Link>
      </div>
  
  );
}
