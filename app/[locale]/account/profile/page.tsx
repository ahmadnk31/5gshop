"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { FileUpload } from "@/components/ui/file-upload";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: session, status, update } = useSession();
  const user = session?.user;
  console.log("Session user:", user);

  // Redirect to verification page if email is not verified
  useEffect(() => {
    if (status === "authenticated" && user && !user.emailVerified) {
      window.location.href = "/auth/verify-required";
    }
  }, [status, user]);  
  
  // Use uploaded photo if available, else user.image from session
  const avatarUrl = profilePhoto || user?.image || undefined;
  console.log("Avatar URL:", avatarUrl);
  console.log("Profile photo state:", profilePhoto);
  console.log("User image from session:", user?.image);

  // Check if the image is HEIC format (not supported by browsers)
  const isHeicImage = avatarUrl?.toLowerCase().includes('.heic');
  if (isHeicImage) {
    console.warn("HEIC image detected - this format may not display properly in browsers");
  }

  // Save uploaded photo to backend (update user profile)
  async function handleProfilePhotoUpload(fileUrl: string, key: string) {
    setUploading(true);
    setError(null);
    try {
      // Call API to update user profile image
      const response = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: fileUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const result = await response.json();
      console.log("API response:", result);
      setProfilePhoto(fileUrl);
      setSuccess(true);
      
      // Update the session with new data
      await update();
      
      // Show success message with refresh instruction
      setTimeout(() => {
        setSuccess(false);
        // Optionally refresh the page to update the session
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setUploading(false);
    }
  }

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  if (status === "loading") {
    return <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow border mt-8">
      <div className="text-center">Loading...</div>
    </div>;
  }

  if (status === "unauthenticated") {
    return <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow border mt-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">You need to be logged in to view your profile.</p>
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      </div>
    </div>;
  }

  // Show loading while checking verification status
  if (status === "authenticated" && user && !user.emailVerified) {
    return <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow border mt-8">
      <div className="text-center">Redirecting...</div>
    </div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow border mt-8">
      <h1 className="text-2xl font-bold mb-6">{t("title", { defaultValue: "My Profile" })}</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Profile updated successfully! Refreshing page to show changes...
        </div>
      )}
      
      <div className="flex flex-col items-center mb-8">
        {isHeicImage && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
            Warning: HEIC image format detected. This format may not display properly in browsers. 
            Please upload a JPEG or PNG image for better compatibility.
          </div>
        )}
        <Avatar className="w-24 h-24 mb-2">
          {avatarUrl && !isHeicImage ? (
            <AvatarImage 
              src={avatarUrl} 
              alt={user?.name || "Profile"}
              onLoad={() => console.log("Avatar image loaded successfully:", avatarUrl)}
              onError={(e) => console.error("Avatar image failed to load:", avatarUrl, e)}
            />
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
            onUploadError={handleUploadError}
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
