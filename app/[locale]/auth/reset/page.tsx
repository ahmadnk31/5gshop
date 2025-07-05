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
    <div className="auth-container">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="password" className="block font-medium">{t("password")}</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <label htmlFor="confirm" className="block font-medium">{t("confirmPassword")}</label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{t("success")}</div>}
        <Button size='lg' type="submit" disabled={loading} className="w-full text-white py-2 rounded disabled:opacity-50">
          {loading ? t("resetting") : t("button")}
        </Button>
      </form>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-2 text-gray-400 text-xs">or</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>
      <Button
        type="button"
        onClick={() => window.location.href = '/auth/login'}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 mb-2"
      >
        <img src="/google.svg" alt="Google" className="h-5 w-5" />
        <span>Sign in with Google</span>
      </Button>
      <div className="flex justify-between mt-4 text-sm">
        <Link href="/auth/login" className="text-secondary hover:underline">{t("back")}</Link>
        <Link href="/auth/register" className="text-secondary hover:underline">Register</Link>
      </div>
    </div>
  );
}
