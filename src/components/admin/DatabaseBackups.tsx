"use client";

import React, { useState, useRef } from "react";
import { 
  Database, 
  Cloud, 
  Upload, 
  Download, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  HardDrive, 
  ShieldCheck,
  FileCode,
  X,
  Clock,
  Sparkles
} from "lucide-react";

export interface BackupItem {
  id: string;
  filename: string;
  date: string;
  size: string;
  source: "Backblaze B2" | "Local Snapshot";
  status: "available" | "restoring" | "completed";
}

export default function DatabaseBackups() {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "info" | "error"; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: "success" | "info" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch live backups from Backblaze B2 on load
  React.useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/database-backups");
      const data = await res.json();
      if (data.success && Array.isArray(data.backups)) {
        setBackups(data.backups);
      } else {
        setBackups([]);
      }
    } catch {
      setBackups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateB2Backup = async () => {
    setIsCreatingBackup(true);
    showToast("info", "Initiating real database snapshot and uploading to Backblaze B2...");
    try {
      const res = await fetch("/api/database-backups", { method: "POST" });
      const data = await res.json();
      if (data.success && data.backup) {
        await fetchBackups();
        showToast("success", "Database snapshot saved to Backblaze B2 (database-backups/)!");
      } else {
        throw new Error(data.error || "Failed to create backup");
      }
    } catch (err: any) {
      showToast("error", err.message || "Backup failed");
    } finally {
      setIsCreatingBackup(false);
    }
  };

  // Download directly prompting save location instead of opening raw text in a browser tab
  const handleDownload = async (backup: BackupItem) => {
    try {
      showToast("info", `Preparing download for ${backup.filename}...`);
      const key = (backup as any).key || `database-backups/${backup.filename}`;

      // Use the direct attachment download endpoint
      const downloadUrl = `/api/database-backups/download?key=${encodeURIComponent(key)}&filename=${encodeURIComponent(backup.filename)}`;
      
      const res = await fetch(downloadUrl);
      if (!res.ok) {
        // Fallback to direct download using blob if endpoint failed
        const fallbackUrl = (backup as any).url || `https://Politico.s3.us-east-005.backblazeb2.com/database-backups/${backup.filename}`;
        const blobRes = await fetch(fallbackUrl);
        const blob = await blobRes.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = backup.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = backup.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }

      showToast("success", `Download completed: ${backup.filename}`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to download backup file");
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename} from Backblaze B2?`)) return;
    try {
      const key = (backups.find((b) => b.id === id) as any)?.key || `database-backups/${filename}`;
      const res = await fetch(`/api/database-backups?key=${encodeURIComponent(key)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBackups((prev) => prev.filter((b) => b.id !== id));
        showToast("success", `Removed ${filename} from Backblaze B2`);
      } else {
        throw new Error(data.error || "Failed to delete");
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete from storage");
    }
  };

  // Browser alert confirmation matching image
  const handleRestoreClick = async (backup: BackupItem) => {
    const confirmed = window.confirm(
      `⚠️ WARNING: Are you sure you want to restore database from backup "${backup.filename}"? This will overwrite ALL current database records!`
    );

    if (!confirmed) return;

    setIsRestoring(true);
    showToast("info", `Restoring database from ${backup.filename}... Please wait.`);

    try {
      const key = (backup as any).key || `database-backups/${backup.filename}`;
      const res = await fetch("/api/database-backups/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("success", `Database restored successfully from "${backup.filename}"!`);
      } else {
        throw new Error(data.error || "Failed to restore database");
      }
    } catch (err: any) {
      showToast("error", err.message || "Database restore failed");
    } finally {
      setIsRestoring(false);
    }
  };

  // Direct trigger to PC file browser
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle uploaded JSON file from computer and restore
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      showToast("error", "Please select a valid .json database backup file.");
      e.target.value = "";
      return;
    }

    const confirmed = window.confirm(
      `⚠️ WARNING: Are you sure you want to restore database from backup "${file.name}"? This will overwrite ALL current database records!`
    );

    if (!confirmed) {
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    showToast("info", `Uploading and restoring database from ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/database-backups/restore", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        showToast("success", `Database restored successfully from uploaded file "${file.name}"!`);
        await fetchBackups();
      } else {
        throw new Error(data.error || "Restore from uploaded file failed");
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to restore uploaded database");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden File Input for Direct PC File Browsing */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-semibold transition-all ${
            notification.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-500/20"
              : notification.type === "info"
              ? "bg-[#111111] text-white shadow-black/20"
              : "bg-[#ce1126] text-white shadow-red-500/20"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : notification.type === "info" ? (
            <Sparkles size={18} className="text-amber-400" />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        
        {/* Header with Title and Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight font-serif flex items-center gap-2">
                Database Backups & Cloud Restore
              </h2>
              <span className="text-[10px] font-bold text-[#ce1126] bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Backblaze B2
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-1">
              Automated and manual database snapshots stored on Backblaze B2.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Create B2 Backup Button */}
            <button
              onClick={handleCreateB2Backup}
              disabled={isCreatingBackup || isRestoring || isUploading}
              className="px-4 py-2.5 bg-white border border-[#ce1126] text-[#ce1126] hover:bg-red-50 text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isCreatingBackup ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-[#ce1126]" />
                  <span>Creating Snapshot...</span>
                </>
              ) : (
                <>
                  <HardDrive size={15} className="text-[#ce1126]" />
                  <span>Create B2 Backup</span>
                </>
              )}
            </button>

            {/* Upload JSON Restore Button - Direct browsing on PC */}
            <button
              onClick={handleUploadButtonClick}
              disabled={isUploading || isRestoring || isCreatingBackup}
              className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-white" />
                  <span>Restoring from File...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>Upload JSON Restore</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Informational Subtext */}
        <div className="mt-4 mb-6">
          <p className="text-xs text-gray-500 leading-relaxed font-sans">
            Backups are automatically taken every 24 hours. The snapshots include all published articles, media links, admin & writer accounts, subscriber list, ad placements, and contact leads.
          </p>
        </div>

        {/* Backups Table */}
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                  Backup File
                </th>
                <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                  Backup Date
                </th>
                <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                  File Size
                </th>
                <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-400 font-mono text-right">
                  Action Gate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {backups.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                  {/* File Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <FileCode size={16} className="text-[#ce1126] flex-shrink-0" />
                      <span className="text-xs font-semibold text-gray-900 font-mono tracking-tight">
                        {item.filename}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-xs font-medium text-gray-600 font-sans whitespace-nowrap">
                    {item.date}
                  </td>

                  {/* Size */}
                  <td className="py-4 px-4 text-xs font-mono font-medium text-gray-600 whitespace-nowrap">
                    {item.size}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      {/* Restore Button - Directly triggers browser warning alert */}
                      <button
                        onClick={() => handleRestoreClick(item)}
                        disabled={isRestoring}
                        className="text-[10px] font-black uppercase tracking-widest text-[#ce1126] bg-red-50 hover:bg-[#ce1126] hover:text-white border border-red-200 hover:border-[#ce1126] px-3 py-1 rounded transition-colors cursor-pointer disabled:opacity-50"
                        title="Restore Database from this Snapshot"
                      >
                        {isRestoring ? "Restoring..." : "Restore"}
                      </button>

                      {/* Download Button - Directly downloads file to PC location */}
                      <button
                        onClick={() => handleDownload(item)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                        title="Download JSON Snapshot"
                      >
                        <Download size={15} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id, item.filename)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Delete Snapshot"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400 text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw size={14} className="animate-spin text-[#ce1126]" />
                      <span>Loading Backblaze B2 snapshots...</span>
                    </div>
                  </td>
                </tr>
              ) : backups.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400 text-xs">
                    No database backups found on Backblaze B2.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

