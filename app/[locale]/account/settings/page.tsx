"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { data: session } = useSession();
  const user = session?.user;
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prefill address from user session (if available in session.user)
  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        // fallback to empty string if not present
        firstName: (user as any).firstName || "",
        lastName: (user as any).lastName || "",
        address1: (user as any).address1 || "",
        address2: (user as any).address2 || "",
        city: (user as any).city || "",
        state: (user as any).state || "",
        postalCode: (user as any).postalCode || "",
        country: (user as any).country || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/account/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow border mt-8">
      <h1 className="text-2xl font-bold mb-6">{t("title", { defaultValue: "Settings" })}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("firstName", { defaultValue: "First Name" })}</label>
            <Input name="firstName" value={address.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("lastName", { defaultValue: "Last Name" })}</label>
            <Input name="lastName" value={address.lastName} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("address1", { defaultValue: "Address Line 1" })}</label>
          <Input name="address1" value={address.address1} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("address2", { defaultValue: "Address Line 2 (optional)" })}</label>
          <Input name="address2" value={address.address2} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("city", { defaultValue: "City" })}</label>
            <Input name="city" value={address.city} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("state", { defaultValue: "State" })}</label>
            <Input name="state" value={address.state} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("postalCode", { defaultValue: "Postal Code" })}</label>
            <Input name="postalCode" value={address.postalCode} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("country", { defaultValue: "Country" })}</label>
            <Input name="country" value={address.country} onChange={handleChange} required />
          </div>
        </div>
        <Button type="submit" className="w-full mt-4" disabled={saving}>
          {saving ? t("saving", { defaultValue: "Saving..." }) : t("save", { defaultValue: "Save Address" })}
        </Button>
        {success && <div className="text-green-600 text-center mt-2">{t("success", { defaultValue: "Address updated!" })}</div>}
      </form>
    </div>
  );
}
