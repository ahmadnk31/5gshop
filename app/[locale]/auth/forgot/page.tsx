"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("auth.forgot");
  const locale = useLocale();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("If your email is registered, you will receive a reset link.");
    } else {
      setError("Failed to send reset email.");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="email" className="block font-medium">{t("email")}</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        {error && <div className="text-red-600 text-sm">{t("error")}</div>}
        {message && <div className="text-green-600 text-sm">{t("success")}</div>}
        <Button size='lg' type="submit" disabled={loading} className="w-full text-white py-2 rounded disabled:opacity-50">
          {loading ? t("sending") : t("button")}
        </Button>
      </form>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-2 text-gray-400 text-xs">or</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>
      <button
        type="button"
        onClick={() => window.location.href = '/auth/login'}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 mb-2"
      >
        <img src="/google.svg" alt="Google" className="h-5 w-5" />
        <span>Sign in with Google</span>
      </button>
      <div className="flex justify-between mt-4 text-sm">
        <Link href="/auth/login" className="text-secondary hover:underline">{t("back")}</Link>
        <Link href="/auth/register" className="text-secondary hover:underline">Register</Link>
      </div>
    </div>
  );
}
