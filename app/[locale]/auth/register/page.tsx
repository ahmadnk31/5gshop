"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const t = useTranslations("auth.register");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuccess(data.message || "Check your email for a verification link.");
      setForm({ name: "", email: "", password: "" });
    } else {
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm md:text-base font-semibold text-gray-900 mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 md:py-3.5 text-sm md:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm md:text-base font-semibold text-gray-900 mb-2">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 md:py-3.5 text-sm md:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm md:text-base font-semibold text-gray-900 mb-2">
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 md:py-3.5 text-sm md:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
        </div>
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm md:text-base font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm md:text-base font-medium">
            {success}
          </div>
        )}
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 mt-4 text-white font-semibold py-3 md:py-4 text-base md:text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t("registering")}
            </span>
          ) : (
            t("button")
          )}
        </Button>
      </form>
      
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm md:text-base">
          <span className="px-4 bg-white text-gray-500 font-medium">or continue with</span>
        </div>
      </div>

      {/* Google Sign Up */}
      <button
        type="button"
        onClick={() => signIn("google")}
        className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 md:py-3.5 text-sm md:text-base rounded-lg transition-all shadow-sm hover:shadow-md"
      >
        <img src="/google.svg" alt="Google" className="h-5 w-5 md:h-6 md:w-6" />
        <span>Sign up with Google</span>
      </button>

      {/* Footer Links */}
      <div className="flex justify-center mt-6 pt-4 border-t-2 border-gray-100">
        <Link 
          href="/auth/login" 
          className="text-green-600 hover:text-green-700 font-medium text-sm md:text-base hover:underline transition-colors"
        >
          {t("login")}
        </Link>
      </div>
    </div>
  );
}
