"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Check, Camera, Loader2 } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (updated: { name: string; email: string; avatarUrl?: string }) => void;
}

export default function ProfileModal({ isOpen, onClose, onProfileUpdated }: ProfileModalProps) {
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
    if (!isOpen) return;

    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setFullName(parsed.name || parsed.email.split("@")[0]);
      if (parsed.avatar_url) {
        setAvatarUrl(parsed.avatar_url);
      }

      // Fetch saved profile details from the database table profile_details
      fetch(`/api/profile?email=${encodeURIComponent(parsed.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.profile) {
            setFullName(data.profile.full_name || parsed.name || parsed.email.split("@")[0]);
            setBio(data.profile.bio || "New Washington Global Times subscriber via Google.");
            // Do NOT pre-fill placeholder as text value - keep as user input or empty
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
  }, [isOpen]);

  if (!isOpen) return null;

  const displayName = fullName || user?.name || user?.email?.split("@")[0] || "User";
  const initialLetter = (displayName[0] || user?.email?.[0] || "K").toUpperCase();
  const role = (user?.role || "READER").toUpperCase();

  // Handle selecting photo from PC
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

        // Update local session with new name and avatar_url
        const updatedUser = {
          ...user,
          name: fullName,
          avatar_url: avatarUrl,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        // Trigger real-time updates for header and dashboards
        window.dispatchEvent(new Event("userProfileUpdated"));

        if (onProfileUpdated) {
          onProfileUpdated({ name: fullName, email: user.email, avatarUrl });
        }

        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 800);
      }
    } catch (err) {
      setErrorMsg("An error occurred while saving. Please ensure MySQL is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[490px] bg-white rounded-2xl shadow-2xl p-6 sm:p-7 border border-gray-100 relative font-sans text-gray-900 animate-in zoom-in-95 duration-150"
      >
        {/* Hidden File Input for browsing 4to / photo on PC */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoSelect}
          accept="image/*"
          className="hidden"
        />

        {/* Header with Title & Close */}
        <div className="flex items-start justify-between pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Profile Settings</h2>
            <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-0.5">
              MANAGE YOUR ACCOUNT
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Avatar Summary Header */}
        <div className="flex items-center gap-4 py-3 mb-4">
          {/* Avatar box: Shows uploaded image or initial letter */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-xl bg-[#b01753] text-white font-black text-2xl flex items-center justify-center select-none shadow-sm flex-shrink-0 relative overflow-hidden cursor-pointer group border border-gray-200/60"
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

            {/* Hover overlay with camera icon */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
              {uploadingPhoto ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Camera size={18} />
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
              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 bg-red-50 text-red-600 p-2.5 rounded-lg text-xs font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        {savedSuccess && (
          <div className="mb-4 bg-emerald-50 text-emerald-700 p-2.5 rounded-lg text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
            <Check size={14} /> Saved to database!
          </div>
        )}

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              FULL NAME
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rakshan 2004"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              BIO
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell readers about yourself"
              rows={3}
              className="w-full border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              LINKEDIN PROFILE
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 w-4 h-4 bg-[#0077b5] text-white rounded flex items-center justify-center text-[10px] font-black select-none pointer-events-none">
                in
              </span>
              <input
                type="text"
                value={linkedinProfile}
                onChange={(e) => setLinkedinProfile(e.target.value)}
                placeholder="https://www.linkedin.com/in/your-profile"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Shown on your article bylines so readers can connect with you.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading || uploadingPhoto}
              className="bg-[#0a4778] hover:bg-[#08385e] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow transition-colors cursor-pointer"
            >
              {loading ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
