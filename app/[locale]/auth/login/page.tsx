"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("auth.login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else if (res?.url?.includes("/auth/error")) {
      setError("Invalid email or password");
    } else if (res?.ok) {
      console.log("res", res);
      router.push("/");
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
        <label htmlFor="password" className="block font-medium">{t("password")}</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        {error && <div className="text-red-600 text-sm">{t("error")}</div>}
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50">
          {loading ? t("loggingIn") : t("button")}
        </button>
      </form>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-2 text-gray-400 text-xs">or</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>
      <button
        type="button"
        onClick={() => signIn("google")}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 mb-2"
      >
        <img src="/google.svg" alt="Google" className="h-5 w-5" />
        <span>Sign in with Google</span>
      </button>
      <div className="flex justify-between mt-4 text-sm">
        <a href="/auth/forgot" className="text-indigo-600 hover:underline">{t("forgot")}</a>
        <a href="/auth/register" className="text-indigo-600 hover:underline">{t("register")}</a>
      </div>
    </div>
  );
}
