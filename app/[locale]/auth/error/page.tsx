"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
    default: t("default")
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4 text-red-600">{t("title")}</h1>
      <p className="mb-6 text-gray-700 text-center">
        {errorMessages[error] || errorMessages.default}
      </p>
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        onClick={() => router.push("/auth/login")}
      >
        {t("backToLogin")}
      </button>
    </div>
  );
}
