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
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="email"
          type="email"
          placeholder={t("email")}
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder={t("password")}
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <Button
          size='lg'
          type="submit"
          className="w-full text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? t("registering") : t("button")}
        </Button>
        {error && <div className="text-red-600">{t("error")}</div>}
        {success && <div className="text-green-600">{t("success")}</div>}
      </form>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-2 text-gray-400 text-xs">or</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>
      <Button
        type="button"
        onClick={() => signIn("google")}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 mb-2"
      >
        <img src="/google.svg" alt="Google" className="h-5 w-5" />
        <span>Sign up with Google</span>
      </Button>
      <div className="flex justify-between mt-4 text-sm">
        <Link href="/auth/login" className="text-secondary hover:underline">{t("login")}</Link>
      </div>
    </div>
  );
}
