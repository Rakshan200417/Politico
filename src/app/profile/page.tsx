"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ArrowLeft, Check, Camera, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<{ id?: number | string; name?: string; role: string; email: string; avatar_url?: string } | null>(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setFullName(parsed.name || parsed.email.split("@")[0]);
      if (parsed.avatar_url) {
        setAvatarUrl(parsed.avatar_url);
      }

      // Load existing details from profile_details database table
      fetch(`/api/profile?email=${encodeURIComponent(parsed.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.profile) {
            setFullName(data.profile.full_name || parsed.name || parsed.email.split("@")[0]);
            setBio(data.profile.bio || "New Washington Global Times subscriber via Google.");
            setLinkedinProfile(data.profile.linkedin_profile || "");
            if (data.profile.avatar_url) {
              setAvatarUrl(data.profile.avatar_url);
            }
          }
        })
        .catch(() => {
          setBio("New Washington Global Times subscriber via Google.");
          setLinkedinProfile("");
        });
    }
  }, []);

  const displayName = fullName || user?.name || user?.email?.split("@")[0] || "User";
  const initialLetter = (displayName[0] || user?.email?.[0] || "K").toUpperCase();
  const role = (user?.role || "READER").toUpperCase();

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setErrorMsg("");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;
      setAvatarUrl(base64Url);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          setAvatarUrl(data.url);
        }
      } catch (uploadErr) {
        console.warn("Upload to disk fallback to data URL:", uploadErr);
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setLoading(true);
    setErrorMsg("");
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          fullName,
          bio,
          linkedinProfile,
          avatarUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save profile details.");
      } else {
        setSavedSuccess(true);

        const updatedUser = {
          ...user,
          name: fullName,
          avatar_url: avatarUrl,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        window.dispatchEvent(new Event("userProfileUpdated"));

        setTimeout(() => {
          setSavedSuccess(false);
        }, 3000);
      }
    } catch (err) {
      setErrorMsg("An error occurred while saving to database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8f9fa]">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10">
        {/* Hidden file input for browsing PC photos */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoSelect}
          accept="image/*"
          className="hidden"
        />

        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to News
        </a>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-7 sm:p-8 border border-gray-100 relative">
          {/* Header */}
          <div className="pb-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Profile Settings</h1>
            <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-0.5">
              MANAGE YOUR ACCOUNT
            </p>
          </div>

          {/* User Photo & Info Row */}
          <div className="flex items-center gap-4 py-4 my-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-2xl bg-[#b01753] text-white font-black text-2xl flex items-center justify-center select-none shadow-sm flex-shrink-0 relative overflow-hidden cursor-pointer group border border-gray-200/60"
              title="Click to browse photo on PC"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initialLetter}</span>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                {uploadingPhoto ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Camera size={20} />
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="text-xs font-bold text-gray-900 hover:text-[#ce1126] transition-colors text-left inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {uploadingPhoto ? (
                    <>
                      <Loader2 size={12} className="animate-spin text-[#ce1126]" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    "Change photo"
                  )}
                </button>

                {avatarUrl && (
                  <>
                    <span className="text-gray-300 text-xs select-none">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-xs font-bold text-gray-500 hover:text-[#ce1126] transition-colors cursor-pointer"
                    >
                      Use default icon
                    </button>
                  </>
                )}
              </div>

              <span className="text-xs text-gray-500 font-mono mt-1 truncate max-w-[280px]">
                {user?.email || "user@example.com"}
              </span>
              <div className="mt-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
                  {role}
                </span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-200">
              {errorMsg}
            </div>
          )}

          {savedSuccess && (
            <div className="mb-4 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
              <Check size={14} /> Profile details and photo saved to database table profile_details!
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                FULL NAME
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rakshan 2004"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                BIO
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell readers about yourself"
                rows={3}
                className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                LINKEDIN PROFILE
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 w-4 h-4 bg-[#0077b5] text-white rounded flex items-center justify-center text-[10px] font-black select-none pointer-events-none">
                  in
                </span>
                <input
                  type="text"
                  value={linkedinProfile}
                  onChange={(e) => setLinkedinProfile(e.target.value)}
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Shown on your article bylines so readers can connect with you.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <a
                href="/"
                className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors inline-block text-center cursor-pointer"
              >
                CANCEL
              </a>
              <button
                type="submit"
                disabled={loading || uploadingPhoto}
                className="bg-[#0a4778] hover:bg-[#08385e] disabled:opacity-50 text-white px-7 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow transition-colors cursor-pointer"
              >
                {loading ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
