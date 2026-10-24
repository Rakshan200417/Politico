"use client";

import React, { useState } from "react";
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

const INITIAL_MOCK_BACKUPS: BackupItem[] = [
  {
    id: "b1",
    filename: "db_backup_manual_2026_09_27_20_21_24.json",
    date: "Sep 28, 2026, 01:51 AM",
    size: "28.65 MB",
    source: "Backblaze B2",
    status: "available",
  },
  {
    id: "b2",
    filename: "db_backup_manual_2026_09_10_12_04_07.json",
    date: "Sep 10, 2026, 05:34 PM",
    size: "28.09 MB",
    source: "Backblaze B2",
    status: "available",
  },
  {
    id: "b3",
    filename: "db_backup_manual_2026_09_10_07_58_01.json",
    date: "Sep 10, 2026, 01:28 PM",
    size: "28.01 MB",
    source: "Backblaze B2",
    status: "available",
  },
  {
    id: "b4",
    filename: "db_backup_manual_2026_09_09_15_04_15.json",
    date: "Sep 9, 2026, 08:34 PM",
    size: "28.24 MB",
    source: "Backblaze B2",
    status: "available",
  },
  {
    id: "b5",
    filename: "db_backup_manual_2026_09_08_08_32_57.json",
    date: "Sep 8, 2026, 02:02 PM",
    size: "28.07 MB",
    source: "Backblaze B2",
    status: "available",
  },
];

export default function DatabaseBackups() {
  const [backups, setBackups] = useState<BackupItem[]>(INITIAL_MOCK_BACKUPS);
  const [isScanning, setIsScanning] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupItem | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "info" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "info" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateB2Backup = () => {
    setIsCreatingBackup(true);
    showToast("info", "Initiating automated database snapshot for Backblaze B2...");
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const pad = (n: number) => String(n).padStart(2, "0");
      const timestampName = `${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}`;
      
      const newBackup: BackupItem = {
        id: `b_${Date.now()}`,
        filename: `db_backup_manual_${timestampName}.json`,
        date: `${dateStr}, ${timeStr}`,
        size: "28.72 MB",
        source: "Backblaze B2",
        status: "available",
      };

      setBackups([newBackup, ...backups]);
      setIsCreatingBackup(false);
      showToast("success", "Backup snapshot created! (UI template ready for Backblaze B2 integration)");
    }, 1800);
  };

  const handleScanStorage = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast("success", "Backblaze B2 storage scan complete. All 5 snapshots verified.");
    }, 1200);
  };

  const handleDownload = (backup: BackupItem) => {
    showToast("info", `Preparing download for ${backup.filename}...`);
  };

  const handleDelete = (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename} from storage?`)) return;
    setBackups(backups.filter((b) => b.id !== id));
    showToast("success", `Removed ${filename}`);
  };

  const openRestoreModal = (backup: BackupItem) => {
    setSelectedBackup(backup);
    setShowRestoreModal(true);
  };

  return (
    <div className="space-y-8">
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
              disabled={isCreatingBackup}
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

            {/* Upload JSON Restore Button */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Upload size={14} />
              <span>Upload JSON Restore</span>
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
                      {/* Restore Button */}
                      <button
                        onClick={() => openRestoreModal(item)}
                        className="text-[10px] font-black uppercase tracking-widest text-[#ce1126] bg-red-50 hover:bg-[#ce1126] hover:text-white border border-red-200 hover:border-[#ce1126] px-3 py-1 rounded transition-colors cursor-pointer"
                        title="Restore Database from this file"
                      >
                        Restore
                      </button>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(item)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="Download JSON Snapshot"
                      >
                        <Download size={15} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id, item.filename)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Snapshot"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {backups.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400 text-xs">
                    No database backups found on Backblaze B2.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono text-gray-500">
              Backblaze B2 Target Bucket: <strong className="text-gray-700 font-mono">washington-backups-secure</strong>
            </span>
          </div>

          <button
            onClick={handleScanStorage}
            disabled={isScanning}
            className="text-[11px] font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw size={13} className={isScanning ? "animate-spin text-[#ce1126]" : ""} />
            <span>{isScanning ? "Scanning Backblaze B2..." : "Rescan B2 Bucket"}</span>
          </button>
        </div>

      </div>

      {/* Restore Confirmation Modal (Template Design) */}
      {showRestoreModal && selectedBackup && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#ce1126] flex items-center justify-center">
                  <RotateCcw size={18} />
                </div>
                <h3 className="text-base font-bold text-gray-950 font-serif">
                  Confirm Database Restore
                </h3>
              </div>
              <button 
                onClick={() => setShowRestoreModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed flex items-start gap-2.5">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Caution:</strong> Restoring this snapshot will replace current articles, user profiles, newsletter subscribers, and ads with the snapshot state.
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">File:</span>
                  <span className="font-mono font-bold text-gray-800 truncate max-w-[220px]">
                    {selectedBackup.filename}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Snapshot Date:</span>
                  <span className="font-medium text-gray-800">{selectedBackup.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">File Size:</span>
                  <span className="font-mono text-gray-800">{selectedBackup.size}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  showToast("info", "Restore template trigger acknowledged. Ready for Backblaze B2 backend implementation.");
                }}
                className="px-5 py-2.5 bg-[#ce1126] hover:bg-[#b00d1f] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Proceed With Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload JSON Restore Modal (Template Design) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center">
                  <Upload size={18} />
                </div>
                <h3 className="text-base font-bold text-gray-950 font-serif">
                  Upload Database JSON Restore
                </h3>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Upload an existing <code>.json</code> database snapshot from your computer to restore or store in Backblaze B2.
              </p>

              <div className="border-2 border-dashed border-gray-200 hover:border-[#ce1126] rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-red-50/10">
                <FileCode size={32} className="mx-auto text-gray-400 mb-2" />
                <span className="text-xs font-bold text-gray-700 block">
                  Click to select .JSON file
                </span>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Supported format: JSON (up to 100MB)
                </span>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  showToast("info", "Upload template design ready for Backblaze B2 integration.");
                }}
                className="px-5 py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Upload & Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
