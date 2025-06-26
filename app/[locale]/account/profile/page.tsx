"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { FileUpload } from "@/components/ui/file-upload";
import { Link } from "@/i18n/navigation";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: session, status } = useSession();
  const user = session?.user;

  // Use uploaded photo if available, else user.image from session
  const avatarUrl = profilePhoto || user?.image || undefined;

  // Save uploaded photo to backend (update user profile)
  async function handleProfilePhotoUpload(url: string) {
    setUploading(true);
    try {
      // Call API to update user profile image
      await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });
      setProfilePhoto(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow border mt-8">
      <h1 className="text-2xl font-bold mb-6">{t("title", { defaultValue: "My Profile" })}</h1>
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-2">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={user?.name || "Profile"} />
          ) : (
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          )}
        </Avatar>
        <div className="w-full mt-2">
          <FileUpload
            accept="image/*"
            maxSize={5}
            label={t("uploadPhoto", { defaultValue: "Upload Photo" })}
            onUploadComplete={handleProfilePhotoUpload}
            disabled={uploading}
          />
        </div>
        {uploading && <span className="text-sm text-gray-500 mt-2">{t("uploading", { defaultValue: "Uploading..." })}</span>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{t("name", { defaultValue: "Name" })}</label>
        <Input value={user?.name || ""} disabled />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{t("email", { defaultValue: "Email" })}</label>
        <Input value={user?.email || ""} disabled />
      </div>
      <div className="mb-4">
        <Link href="/account/orders" className="text-blue-600 hover:underline font-medium block text-center mt-6">
          {t("orders", { defaultValue: "View My Orders" })}
        </Link>
      </div>
    </div>
  );
}
