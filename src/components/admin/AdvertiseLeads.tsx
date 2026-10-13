"use client";

import React, { useState, useEffect } from "react";
import { Eye, Trash2, X, FileText } from "lucide-react";

interface AdvertiseLead {
  id: number;
  created_at: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  service_option: string;
  requirements: string;
  status: string;
}

export default function AdvertiseLeads() {
  const [leads, setLeads] = useState<AdvertiseLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("All Services");
  const [viewItem, setViewItem] = useState<AdvertiseLead | null>(null);

  useEffect(() => {
    fetch("/api/advertise")
      .then((res) => res.json())
      .then((data) => {
        if (data.leads) {
          setLeads(data.leads);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch advertise leads", err);
        setIsLoading(false);
      });
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await fetch("/api/advertise", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
      );
      if (viewItem && viewItem.id === id) {
        setViewItem((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await fetch(`/api/advertise?id=${id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      if (viewItem && viewItem.id === id) {
        setViewItem(null);
      }
    } catch (err) {
      console.error("Failed to delete lead", err);
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

  const statusOptions = ["New", "Contacted", "Proposal Sent", "Won", "Lost"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Contacted":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "Proposal Sent":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "Won":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Lost":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.company && lead.company.toLowerCase().includes(q)) ||
      (lead.requirements && lead.requirements.toLowerCase().includes(q));

    const matchesService =
      selectedService === "All Services" ||
      lead.service_option.toLowerCase() === selectedService.toLowerCase();

    return matchesSearch && matchesService;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Advertise Client Leads</h2>
        <p className="text-xs text-gray-500 font-mono">
          View and manage leads submitted by businesses and partners on the Advertise page.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, company, message..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-gray-400"
          />
        </div>
        <div>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:border-gray-400"
          >
            <option>All Services</option>
            <option>Publish Company Article</option>
            <option>Publish CEO Profile</option>
            <option>Report News</option>
            <option>Washington Global Times Magazine</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50/50">
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Submitter / Company</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Email</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Phone / WhatsApp</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Service Option</th>
              <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Requirements</th>
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
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                  No leads found matching criteria.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-4 text-[11px] text-gray-500 whitespace-nowrap">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-xs font-bold text-gray-900">{lead.name}</div>
                    <div className="text-[10px] text-gray-400">{lead.company || "N/A"}</div>
                  </td>
                  <td className="py-4 px-4 text-[11px] text-gray-600">
                    {lead.email}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-[10px] font-bold text-gray-600">P: {lead.phone || "-"}</div>
                    <div className="text-[10px] font-bold text-gray-600">W: {lead.whatsapp || "-"}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-3 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full whitespace-nowrap">
                      {lead.service_option}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[11px] text-gray-700 max-w-[200px] truncate">
                    {lead.requirements}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`text-[11px] font-bold px-2 py-1.5 rounded border focus:outline-none cursor-pointer appearance-none ${getStatusColor(lead.status)}`}
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewItem(lead)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
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
                <h3 className="text-base font-bold text-gray-900">Advertise Lead Details</h3>
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
                    Contact Name
                  </span>
                  <p className="font-bold text-gray-900">{viewItem.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Company
                  </span>
                  <p className="font-bold text-gray-900">{viewItem.company || "N/A"}</p>
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
                    Service Option
                  </span>
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded">
                    {viewItem.service_option}
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
                  Requirements & Brand Details
                </span>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 whitespace-pre-wrap leading-relaxed text-xs">
                  {viewItem.requirements}
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
