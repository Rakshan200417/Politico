"use client";

import React, { useState, useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";

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
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Us Submissions</h2>
        <p className="text-xs text-gray-500 font-mono">
          View and manage messages submitted by readers and partners on the Contact Us page.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search name, email, message..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="ml-4">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:border-gray-400">
            <option>All Inquiry Types</option>
            <option>Editorial</option>
            <option>Advertising</option>
            <option>General</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50/50">
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Name / Company</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Email</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Phone / WhatsApp</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Type</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Message</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                  No submissions found.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-4 text-[11px] text-gray-500 whitespace-nowrap">
                    {formatDate(sub.created_at)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-xs font-bold text-gray-900">{sub.name}</div>
                    <div className="text-[10px] text-gray-400">{sub.company || "N/A"}</div>
                  </td>
                  <td className="py-4 px-4 text-[11px] text-gray-600">
                    {sub.email}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-[10px] text-gray-500">P: {sub.phone || "-"}</div>
                    <div className="text-[10px] text-gray-500">W: {sub.whatsapp || "-"}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-gray-600 bg-gray-100 rounded-md">
                      {sub.inquiry_type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[11px] text-gray-700 max-w-[200px] truncate">
                    {sub.message}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={sub.status}
                      onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                      className={`text-[11px] font-bold px-2 py-1.5 rounded border focus:outline-none cursor-pointer appearance-none ${getStatusColor(sub.status)}`}
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .5rem top 50%', backgroundSize: '.65rem auto', paddingRight: '1.5rem' }}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt} className="text-gray-900 bg-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View details">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
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
    </div>
  );
}
