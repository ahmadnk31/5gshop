"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function VerifyRequiredPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("auth.verify");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
    // Redirect if already verified
    if (status === "authenticated" && session?.user?.emailVerified) {
      router.push("/");
    }
  }, [status, session, router]);

  const handleResendVerification = async () => {
    if (!session?.user?.email) {
      setError("Email not found. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Verification email sent! Please check your inbox.");
      } else {
        setError(data.error || "Failed to send verification email. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return null; // Will redirect
  }

  return (
    <div className="w-full">
      <div className="space-y-6 text-center">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Email Verification Required</h1>
        
        {/* Message */}
        <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-base font-medium max-w-md mx-auto">
          <p className="mb-2">Your email address needs to be verified to access this page.</p>
          <p className="text-sm">Please check your inbox ({session.user.email}) and click the verification link.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg text-base font-medium max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-lg text-base font-medium max-w-md mx-auto">
            {message}
          </div>
        )}

        {/* Resend Button */}
        <div className="pt-4">
          <Button
            onClick={handleResendVerification}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Resend Verification Email"
            )}
          </Button>
        </div>

        {/* Additional Links */}
        <div className="pt-4 border-t-2 border-gray-100 flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/auth/login" 
            className="text-green-600 hover:text-green-700 font-medium text-base hover:underline transition-colors"
          >
            Back to Login
          </Link>
          <Link 
            href="/" 
            className="text-green-600 hover:text-green-700 font-medium text-base hover:underline transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

