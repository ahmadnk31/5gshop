"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import React from "react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("auth.error");
  const error = searchParams.get("error") || "default";

  // Map NextAuth error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    CredentialsSignin: t("invalidCredentials"),
    AccessDenied: t("accessDenied"),
    AccountBanned: "Your account has been suspended. Please contact support for assistance.",
    "Your account has been suspended. Please contact support for assistance.": "Your account has been suspended. Please contact support for assistance.",
    default: t("default")
  };

  return (
    <div className="w-full">
      <div className="space-y-6 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t("title")}</h1>
        
        {/* Error Message */}
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg text-base font-medium max-w-md mx-auto">
          {errorMessages[error] || errorMessages.default}
        </div>

        {/* Button */}
        <div className="pt-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-base transition-all shadow-md hover:shadow-lg"
            onClick={() => router.push("/auth/login")}
          >
            {t("backToLogin")}
          </button>
        </div>

        {/* Additional Links */}
        <div className="pt-4 border-t-2 border-gray-100 flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/auth/register" 
            className="text-green-600 hover:text-green-700 font-medium text-base hover:underline transition-colors"
          >
            Create Account
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
