"use client";

import React, { useState, useEffect } from "react";
import { Play, Video as VideoIcon, ExternalLink, CheckCircle2, RefreshCw, Upload, Sparkles, Trash2, Edit3, X } from "lucide-react";

export interface ShortReelVideo {
  id?: number;
  slot_number: number;
  title: string;
  video_url: string;
  platform: string;
  thumbnail_url: string;
  duration: string;
  active: boolean | number;
  updated_at?: string;
}

export default function ShortsManager() {
  const [videos, setVideos] = useState<ShortReelVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [videoUrl, setVideoUrl] = useState("");
  const [platform, setPlatform] = useState("YouTube Shorts");
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [duration, setDuration] = useState("0:45");
  const [targetSlot, setTargetSlot] = useState<number>(1);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [isEditingId, setIsEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/shorts");
      const data = await res.json();
      if (data.videos) {
        setVideos(data.videos);
        // Find first empty slot if any
        const occupied = data.videos.map((v: ShortReelVideo) => v.slot_number);
        const firstEmpty = [1, 2, 3, 4].find((s) => !occupied.includes(s));
        if (firstEmpty) {
          setTargetSlot(firstEmpty);
        }
      }
    } catch (err) {
      console.error("Failed to fetch shorts:", err);
      showNotification("error", "Failed to load shorts & reels data");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to extract YouTube video ID
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Auto detect platform and fetch metadata
  const handleUrlChange = async (url: string) => {
    setVideoUrl(url);

    // Auto-detect platform (excluding YouTube Shorts as requested)
    let detectedPlatform = "YouTube";
    if (url.includes("rumble.com")) {
      detectedPlatform = "Rumble";
    } else if (url.includes("instagram.com")) {
      detectedPlatform = "Instagram Reels";
    } else if (url.includes("facebook.com") || url.includes("fb.watch")) {
      detectedPlatform = "Facebook Reels";
    } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
      detectedPlatform = "YouTube";
    }
    setPlatform(detectedPlatform);

    // Trigger auto-fetch if valid URL
    if (url.startsWith("http://") || url.startsWith("https://")) {
      fetchVideoMetadata(url, true);
    }
  };

  const fetchVideoMetadata = async (urlToFetch: string, isTyping: boolean = false) => {
    try {
      const res = await fetch(`/api/shorts/fetch-metadata?url=${encodeURIComponent(urlToFetch)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.platform) setPlatform(data.platform);
          if (data.title) setTitle(data.title);
          if (data.thumbnail_url) setThumbnailUrl(data.thumbnail_url);
          if (data.duration) setDuration(data.duration);
          if (!isTyping) {
            showNotification("success", "Video headline, thumbnail and duration loaded!");
          }
        }
      }
    } catch (e) {
      console.warn("Auto-fetch error:", e);
    }
  };

  // Auto fetch title/duration/image button handler
  const handleAutoFetch = async () => {
    if (!videoUrl) {
      showNotification("error", "Please paste a video URL first");
      return;
    }

    try {
      showNotification("success", "Fetching video metadata...");
      const res = await fetch(`/api/shorts/fetch-metadata?url=${encodeURIComponent(videoUrl)}`);
      const data = await res.json();
      if (data.success) {
        if (data.platform) setPlatform(data.platform);
        if (data.title) setTitle(data.title);
        if (data.thumbnail_url) setThumbnailUrl(data.thumbnail_url);
        if (data.duration) setDuration(data.duration);
        showNotification("success", "Video headline, thumbnail and duration loaded!");
      } else {
        showNotification("error", data.error || "Could not fetch metadata");
      }
    } catch (err) {
      showNotification("error", "Failed to auto-fetch video details");
    }
  };

  // Handle custom thumbnail upload (base64)
  const handleCustomThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showNotification("error", "Thumbnail image should be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setThumbnailUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  // Submit to add / replace in target slot
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim() || !title.trim()) {
      showNotification("error", "Please provide both Video URL and Title");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        slot_number: targetSlot,
        title: title.trim(),
        video_url: videoUrl.trim(),
        platform,
        thumbnail_url: thumbnailUrl.trim() || `https://picsum.photos/seed/${targetSlot * 87}/800/600`,
        duration: duration.trim() || "0:45",
        active: status === "Active" ? 1 : 0,
      };

      const res = await fetch("/api/shorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save video");
      }

      showNotification("success", `Slot #${targetSlot} saved successfully!`);
      // Reset form
      setVideoUrl("");
      setTitle("");
      setThumbnailUrl("");
      setDuration("0:45");
      setStatus("Active");
      setIsEditingId(null);

      fetchVideos();
    } catch (err: any) {
      console.error(err);
      showNotification("error", err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick toggle active / inactive directly on slot card
  const handleToggleActive = async (video: ShortReelVideo) => {
    const newActive = !Boolean(video.active);
    try {
      const res = await fetch("/api/shorts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: video.id,
          slot_number: video.slot_number,
          active: newActive ? 1 : 0,
        }),
      });
      if (res.ok) {
        setVideos((prev) =>
          prev.map((v) => (v.slot_number === video.slot_number ? { ...v, active: newActive } : v))
        );
        showNotification("success", `Slot #${video.slot_number} marked as ${newActive ? "Active" : "Inactive"}`);
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
      showNotification("error", "Failed to update status");
    }
  };

  // Delete / clear a slot
  const handleDeleteSlot = async (slotNumber: number) => {
    if (!confirm(`Are you sure you want to clear Video Slot #${slotNumber}?`)) return;
    try {
      const res = await fetch(`/api/shorts?slot_number=${slotNumber}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showNotification("success", `Slot #${slotNumber} removed`);
        fetchVideos();
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to delete slot");
    }
  };

  // Edit an existing slot
  const handleEditSlot = (v: ShortReelVideo) => {
    setIsEditingId(v.id || null);
    setTargetSlot(v.slot_number);
    setVideoUrl(v.video_url);
    setTitle(v.title);
    setPlatform(v.platform === "YouTube Shorts" ? "YouTube" : (v.platform || "YouTube"));
    setThumbnailUrl(v.thumbnail_url || "");
    setDuration(v.duration || "0:45");
    setStatus(v.active ? "Active" : "Inactive");

    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const getSlotVideo = (slotNum: number) => {
    return videos.find((v) => v.slot_number === slotNum);
  };

  const activeCount = videos.filter((v) => Boolean(v.active)).length;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-semibold transition-all ${
            notification.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-500/20"
              : "bg-red-600 text-white shadow-red-500/20"
          }`}
        >
          {notification.type === "success" ? <CheckCircle2 size={18} /> : <X size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              Shorts & Reels Manager
            </h2>
            <span className="bg-orange-100 text-orange-700 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-orange-200">
              {videos.length} Videos
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Curate short-form video stories from YouTube Shorts, YouTube, Rumble, Instagram Reels, and Facebook Reels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">
            HOMEPAGE FEED: {activeCount} / 4 VIDEOS ACTIVE
          </span>
          <button
            onClick={fetchVideos}
            disabled={isLoading}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Form Card: Add / Edit Short / Reel Video */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fff2eb] flex items-center justify-center shadow-xs border border-orange-100 flex-shrink-0">
              <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[11px] border-l-[#e85d1e] ml-1"></div>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {isEditingId ? `Edit Short / Reel (Slot #${targetSlot})` : "Add New Short / Reel Video"}
              </h3>
              <p className="text-xs text-gray-500">
                Paste any YouTube, Rumble, Instagram, or Facebook link — platform and thumbnails are detected automatically.
              </p>
            </div>
          </div>

          {isEditingId && (
            <button
              onClick={() => {
                setIsEditingId(null);
                setVideoUrl("");
                setTitle("");
                setThumbnailUrl("");
                setDuration("0:45");
                setStatus("Active");
              }}
              className="text-xs font-bold text-gray-400 hover:text-gray-700 flex items-center gap-1"
            >
              <X size={14} /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form Fields */}
            <div className="lg:col-span-2 space-y-5">
              {/* Video URL & Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                      Video URL <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoFetch}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
                    >
                      <Sparkles size={12} /> Auto-Fetch Title, Image & Duration
                    </button>
                  </div>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/shorts/... or https://rumble.com/..."
                    required
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-sans"
                  />
                  <span className="text-[9px] text-gray-400 mt-1 block">
                    Supports YouTube Shorts, YouTube, Rumble videos, Instagram Reels, and Facebook Reels.
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-medium text-gray-800"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Rumble">Rumble</option>
                    <option value="Instagram Reels">Instagram Reels</option>
                    <option value="Facebook Reels">Facebook Reels</option>
                  </select>
                </div>
              </div>

              {/* Title / Headline */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Video Title / Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Supreme Court Hearing Highlights & Legal Analysis"
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-sans"
                />
              </div>

              {/* Cover Image / Thumbnail URL + Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Cover Image / Thumbnail URL
                  </label>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/... or auto-fetched"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Or Upload Custom Thumbnail
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Upload size={14} /> Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCustomThumbnailUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                      {thumbnailUrl ? "Thumbnail set" : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration, Target Slot, Status Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Duration (Auto / Edit)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="0:45"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Target Slot (1 to 4) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={targetSlot}
                    onChange={(e) => setTargetSlot(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold text-gray-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                  >
                    {[1, 2, 3, 4].map((slot) => {
                      const existing = getSlotVideo(slot);
                      return (
                        <option key={slot} value={slot}>
                          Slot #{slot} {existing ? `(Occupied: ${existing.title.slice(0, 24)}...)` : "(Available / Empty)"}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                  >
                    <option value="Active">Active (Shows on Homepage)</option>
                    <option value="Inactive">Inactive (Hidden from Homepage)</option>
                  </select>
                </div>
              </div>

              {/* Warning Notice about 1 Video per Slot */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-800">
                <span className="text-amber-500 text-sm">💡</span>
                <p className="text-[11px] leading-relaxed">
                  <strong className="font-bold">Strict 1 Video Per Slot:</strong> Each slot (Slot #1 to #4) holds only 1 video. Slot 1 is top video and 4 is the last. If you assign a video to an already occupied slot, the previous video will automatically be replaced.
                </p>
              </div>
            </div>

            {/* Right Col: Live Feed Preview */}
            <div className="flex flex-col items-center justify-start border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Live Feed Preview
              </span>

              <div className="w-[190px] h-[310px] rounded-2xl bg-black overflow-hidden relative shadow-lg flex flex-col justify-end p-3.5 group border border-gray-900">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-85"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center text-gray-600 gap-2">
                    <VideoIcon size={32} />
                    <span className="text-[10px] font-bold">No Image</span>
                  </div>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                {/* Platform Badge Top Left */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      platform.toLowerCase().includes("rumble")
                        ? "bg-[#85c441] text-black"
                        : platform.toLowerCase().includes("instagram")
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-[#ce1126] text-white"
                    }`}
                  >
                    {platform}
                  </span>
                </div>

                {/* Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Play size={18} className="fill-white text-white translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 text-white">
                  <div className="text-[9px] font-bold text-gray-300 flex items-center gap-1.5 mb-1">
                    <span>Slot #{targetSlot}</span>
                    <span>•</span>
                    <span>{duration || "0:45"}</span>
                  </div>
                  <h4 className="text-xs font-bold leading-snug line-clamp-2 text-white font-sans">
                    {title || "Short Video Title"}
                  </h4>
                </div>
              </div>

              {/* Add to Feed Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-5 py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md shadow-orange-500/25 transition-all hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : isEditingId ? (
                  "Update Slot Video"
                ) : (
                  "Add To Feed"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Slots Section: Current Shorts & Reels (4 Dedicated Slots) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Current Shorts & Reels (4 Dedicated Slots)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Strictly 1 video per slot (Slot #1 to #4). Slot 1 is top video and 4 is the last. Adding or moving a video to an occupied slot replaces the old video.
            </p>
          </div>
          <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 w-fit">
            {videos.length} / 4 Slots Occupied
          </span>
        </div>

        {/* 4 Dedicated Slot Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((slotNum) => {
            const video = getSlotVideo(slotNum);

            if (!video) {
              return (
                <div
                  key={slotNum}
                  onClick={() => {
                    setTargetSlot(slotNum);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  className="rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-400 bg-gray-50/50 hover:bg-orange-50/30 p-5 flex flex-col items-center justify-center min-h-[360px] text-center cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center text-gray-400 group-hover:text-orange-600 mb-3 transition-colors">
                    <VideoIcon size={24} />
                  </div>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                    Slot #{slotNum} {slotNum === 1 ? "(Top Video)" : slotNum === 4 ? "(Last Video)" : ""}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 mb-1">Slot is Empty</span>
                  <p className="text-[11px] text-gray-400 max-w-[170px]">
                    Click here to assign a video to Slot #{slotNum}
                  </p>
                </div>
              );
            }

            const isActive = Boolean(video.active);

            return (
              <div
                key={slotNum}
                className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 shadow-sm overflow-hidden flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Video Thumbnail Header */}
                  <div className="relative aspect-[3/4] w-full bg-gray-900 overflow-hidden">
                    <img
                      src={video.thumbnail_url || `https://picsum.photos/seed/${slotNum * 55}/800/600`}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      {/* Platform */}
                      <span
                        className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm ${
                          video.platform?.toLowerCase().includes("rumble")
                            ? "bg-[#85c441] text-black"
                            : video.platform?.toLowerCase().includes("instagram")
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "bg-[#ce1126] text-white"
                        }`}
                      >
                        {video.platform || "Video"}
                      </span>

                      {/* Active Status Badge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(video);
                        }}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                          isActive
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        title="Click to toggle Active / Inactive"
                      >
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    {/* Slot Indicator Tag */}
                    <div className="absolute top-10 right-3 z-10">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-orange-500 text-white shadow">
                        Slot #{slotNum} {slotNum === 1 ? "(Top)" : slotNum === 4 ? "(Last)" : ""}
                      </span>
                    </div>

                    {/* Center Play Icon to open video in new tab */}
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center z-10 group/play"
                      title="Open Video in New Tab"
                    >
                      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm group-hover/play:bg-orange-500 flex items-center justify-center text-white transition-all transform group-hover/play:scale-110 shadow-lg">
                        <Play size={20} className="fill-white translate-x-0.5" />
                      </div>
                    </a>

                    {/* Duration Bottom Left */}
                    <div className="absolute bottom-3 left-3 text-[10px] font-bold text-gray-200 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs z-10">
                      {video.duration || "0:45"}
                    </div>

                    {/* Watch External Link Bottom Right */}
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 text-[10px] font-bold text-orange-400 hover:text-white flex items-center gap-1 z-10"
                    >
                      Watch <ExternalLink size={11} />
                    </a>
                  </div>

                  {/* Title & Info */}
                  <div className="p-4">
                    <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 min-h-[34px] group-hover:text-orange-600 transition-colors">
                      {video.title}
                    </h4>

                    {/* Active / Inactive Selector Dropdown */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Status:
                      </label>
                      <select
                        value={isActive ? "active" : "inactive"}
                        onChange={(e) => {
                          const shouldBeActive = e.target.value === "active";
                          if (shouldBeActive !== isActive) {
                            handleToggleActive(video);
                          }
                        }}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-500 border-gray-300"
                        }`}
                      >
                        <option value="active">Active (Visible)</option>
                        <option value="inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (Edit / Delete) */}
                <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleEditSlot(video)}
                    className="flex-1 py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-gray-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSlot(slotNum)}
                    className="py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-white hover:bg-red-600 rounded-lg border border-red-200 hover:border-red-600 transition-colors flex items-center justify-center gap-1.5"
                    title="Clear Slot"
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
