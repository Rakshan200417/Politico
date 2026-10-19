"use client";

import React, { useState, useEffect } from "react";
import { Eye, Trash2, X, Mail, Phone, Building2, Calendar, FileText } from "lucide-react";

interface ContactSubmission {
  id: number;
  created_at: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  inquiry_type: string;
  message: string;
  status: string;
}

export default function ContactUsSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Inquiry Types");
  const [viewItem, setViewItem] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        if (data.submissions) {
          setSubmissions(data.submissions);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch contact submissions", err);
        setIsLoading(false);
      });
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
      );
      if (viewItem && viewItem.id === id) {
        setViewItem((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
      if (viewItem && viewItem.id === id) {
        setViewItem(null);
      }
    } catch (err) {
      console.error("Failed to delete submission", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  const statusOptions = ["New", "In Progress", "Resolved", "Archived"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "In Progress":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "Resolved":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Archived":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      sub.name.toLowerCase().includes(q) ||
      sub.email.toLowerCase().includes(q) ||
      (sub.company && sub.company.toLowerCase().includes(q)) ||
      (sub.message && sub.message.toLowerCase().includes(q));

    const matchesType =
      selectedType === "All Inquiry Types" ||
      sub.inquiry_type.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Us Submissions</h2>
        <p className="text-xs text-gray-500 font-mono">
          View and manage messages submitted by readers and partners on the Contact Us page.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, message..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-gray-400"
          />
        </div>
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:border-gray-400"
          >
            <option>All Inquiry Types</option>
            <option>Business / Advertising</option>
            <option>Editorial</option>
            <option>Technical glitch</option>
            <option>General / Others</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50/50">
              <th className="py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider whitespace-nowrap">Date</th>
              <th className="py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Name / Company</th>
              <th className="py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Contact</th>
              <th className="py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Type</th>
              <th className="py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Message</th>
              <th className="py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                  No submissions found matching criteria.
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-3 px-3 text-[11px] text-gray-500 whitespace-nowrap">
                    {formatDate(sub.created_at)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-xs font-bold text-gray-900 leading-tight">{sub.name}</div>
                    <div className="text-[10px] text-gray-400">{sub.company || "N/A"}</div>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-gray-600">
                    <div className="truncate max-w-[150px]">{sub.email}</div>
                    {(sub.phone || sub.whatsapp) && (
                      <div className="text-[10px] text-gray-400 whitespace-nowrap">
                        {sub.phone ? `P: ${sub.phone}` : ""} {sub.whatsapp ? `W: ${sub.whatsapp}` : ""}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-600 bg-gray-100 rounded-md">
                      {sub.inquiry_type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-gray-700 max-w-[220px]">
                    <div className="truncate" title={sub.message}>
                      {sub.message}
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <select
                      value={sub.status}
                      onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                      className={`text-[11px] font-bold px-2 py-1 rounded border focus:outline-none cursor-pointer appearance-none ${getStatusColor(sub.status)}`}
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .4rem top 50%', backgroundSize: '.6rem auto', paddingRight: '1.25rem' }}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt} className="text-gray-900 bg-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewItem(sub)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-gray-900">Contact Submission Details</h3>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Full Name
                  </span>
                  <p className="font-bold text-gray-900">{viewItem.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Company
                  </span>
                  <p className="font-semibold text-gray-800">{viewItem.company || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Email
                  </span>
                  <a href={`mailto:${viewItem.email}`} className="text-blue-600 hover:underline font-medium">
                    {viewItem.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Inquiry Type
                  </span>
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded">
                    {viewItem.inquiry_type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Phone
                  </span>
                  <p className="font-mono text-gray-700">{viewItem.phone || "-"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    WhatsApp
                  </span>
                  <p className="font-mono text-gray-700">{viewItem.whatsapp || "-"}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Submitted Date
                </span>
                <p className="text-gray-600 font-mono text-xs">
                  {new Date(viewItem.created_at).toLocaleString()}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Query Message
                </span>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 whitespace-pre-wrap leading-relaxed text-xs">
                  {viewItem.message}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold">Status:</span>
                  <select
                    value={viewItem.status}
                    onChange={(e) => handleStatusChange(viewItem.id, e.target.value)}
                    className={`text-xs font-bold px-2.5 py-1 rounded border focus:outline-none cursor-pointer ${getStatusColor(viewItem.status)}`}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt} className="text-gray-900 bg-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => handleDelete(viewItem.id)}
                  className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
