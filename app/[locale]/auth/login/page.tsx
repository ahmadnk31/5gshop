"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("auth.login");
  const { data: session, status } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/";
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    console.log('Login attempt for email:', email);
    
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      console.log('NextAuth response:', res);
      
      if (res?.error) {
        // Handle specific error cases
        if (res.error === 'CredentialsSignin') {
          setError("Invalid email or password");
        } else if (res.error === 'AccessDenied') {
          setError("Your account has been suspended. Please contact support for assistance.");
        } else {
          setError("Login failed. Please try again.");
        }
      } else if (res?.url?.includes("/auth/error")) {
        setError("Invalid email or password");
      } else if (res?.ok) {
        console.log("Login successful, redirecting...");
        // Force a hard redirect to ensure session is properly loaded
        window.location.href = "/";
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-600 text-base md:text-lg">Welcome back to 5gphones Fix</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-base font-semibold text-gray-900 mb-2">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3.5 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg text-base font-medium">
              {error}
            </div>
          )}

          {/* Login Button */}
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
                {t("loggingIn")}
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
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3.5 text-base rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          <img src="/google.svg" alt="Google" className="h-6 w-6" />
          <span>Sign in with Google</span>
        </button>

        {/* Footer Links */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t-2 border-gray-100">
          <Link 
            href="/auth/forgot" 
            className="text-green-600 hover:text-green-700 font-medium text-base hover:underline transition-colors"
          >
            {t("forgot")}
          </Link>
          <Link 
            href="/auth/register" 
            className="text-green-600 hover:text-green-700 font-medium text-base hover:underline transition-colors"
          >
            {t("register")}
          </Link>
        </div>
      </div>
    </div>
  );
}
