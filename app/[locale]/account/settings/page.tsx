"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { data: session, status } = useSession();
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
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;
      
      try {
        const response = await fetch("/api/account/profile");
        if (response.ok) {
          const data = await response.json();
          const userData = data.user; // Extract user data from response
          setAddress({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            address1: userData.address1 || "",
            address2: userData.address2 || "",
            city: userData.city || "",
            state: userData.state || "",
            postalCode: userData.postalCode || "",
            country: userData.country || "",
          });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && user?.email) {
      fetchUserData();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [user, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Refresh the page to update the session with new data
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow border mt-8">
      <div className="text-center">Loading...</div>
    </div>;
  }

  if (status === "unauthenticated") {
    return <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow border mt-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">You need to be logged in to view your settings.</p>
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      </div>
    </div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow border mt-8">
      <h1 className="text-2xl font-bold mb-6">{t("title", { defaultValue: "Settings" })}</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {t("success", { defaultValue: "Address updated! Refreshing page..." })}
        </div>
      )}
      
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
      </form>
    </div>
  );
}
