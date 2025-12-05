"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations("auth.reset");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError(t("mismatch"));
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Password reset successfully. You can now log in.");
      setTimeout(() => router.push("/auth/login"), 2000);
    } else {
      setError("Failed to reset password. The link may have expired.");
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-600 text-base md:text-lg">Enter your new password below</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-base font-semibold text-gray-900 mb-2">
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3.5 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-base font-semibold text-gray-900 mb-2">
              {t("confirmPassword")}
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3.5 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg text-base font-medium">
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-lg text-base font-medium">
              {message}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("resetting")}
              </span>
            ) : (
              t("button")
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-200" />
          </div>
          <div className="relative flex justify-center text-base">
            <span className="px-4 bg-white text-gray-500 font-medium">or continue with</span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={() => window.location.href = '/auth/login'}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3.5 text-base rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          <img src="/google.svg" alt="Google" className="h-6 w-6" />
          <span>Sign in with Google</span>
        </button>

        {/* Footer Links */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t-2 border-gray-100">
          <Link 
            href="/auth/login" 
            className="text-green-600 hover:text-green-700 font-medium text-base hover:underline transition-colors"
          >
            {t("back")}
          </Link>
          <Link 
            href="/auth/register" 
            className="text-green-600 hover:text-green-700 font-medium text-base hover:underline transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
