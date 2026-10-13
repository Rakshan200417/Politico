"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

export default function AdvertisePage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    whatsapp: "",
    service_option: "Publish Company Article",
    requirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg("Please fill in your Name and Email.");
      return;
    }

    if (!formData.company.trim()) {
      setErrorMsg("Please provide your Company Name.");
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMsg("Please provide your Phone Number.");
      return;
    }

    if (!formData.requirements.trim()) {
      setErrorMsg("Please tell us about your brand / inquiry details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/advertise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          whatsapp: "",
          service_option: "Publish Company Article",
          requirements: "",
        });
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to submit request. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting advertise form:", err);
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900">
      <Header />

      {/* Top Banner Image under the Navbar - Full Screen Viewport Cover */}
      <div className="w-full relative overflow-hidden bg-gray-900 select-none h-[calc(100vh-130px)] min-h-[500px]">
        <img
          src="/images/press-banner.webp"
          alt="Washington Global Times News Broadcast Banner"
          className="w-full h-full object-cover object-center block"
        />
      </div>

      <main id="form-section" className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Advertise with Us Info & Our Services */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#111] leading-tight">
                Advertise with Us
              </h1>
              <div className="w-16 h-1 bg-[#ce1126] mt-3" />
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              The Washington Global Times reaches an influential global audience of corporate executives, investors, policy makers, and thought leaders. Position your brand alongside premium financial journalism and global reporting.
            </p>

            <div className="space-y-6 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                OUR SERVICES
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                    Publish Company Article
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Feature your brand's growth, announcement, or milestone with our premium editorial formatting.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                    Publish CEO Profile
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Get an exclusive written interview profiling your CEO's vision, leadership, and company direction.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                    Report News
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Collaborate with our reporting team to share key press developments or exclusive industry insights.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                    Washington Global Times Magazine
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Reserve a premium print or digital full-page ad placement inside our quarterly business magazine.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Client Inquiry Lead Form */}
          <div className="lg:col-span-7">
            <div className="border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-12 pt-8 lg:pt-0">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#111]">
                  Client Inquiry Lead
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Fill out the form below to connect with our advertising & partnership team.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">
                      Request Submitted Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Thank you for your interest. Our advertising and partnerships director will get in touch with you shortly.
                    </p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-medium">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Your Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      YOUR NAME <span className="text-[#ce1126]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      COMPANY NAME <span className="text-[#ce1126]">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company LLC"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Your Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      YOUR EMAIL <span className="text-[#ce1126]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400"
                    />
                  </div>

                  {/* Interested Option */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      INTERESTED OPTION <span className="text-[#ce1126]">*</span>
                    </label>
                    <select
                      name="service_option"
                      required
                      value={formData.service_option}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 cursor-pointer"
                    >
                      <option value="Publish Company Article">Publish Company Article</option>
                      <option value="Publish CEO Profile">Publish CEO Profile</option>
                      <option value="Report News">Report News</option>
                      <option value="Washington Global Times Magazine">Washington Global Times Magazine</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      PHONE NUMBER <span className="text-[#ce1126]">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400"
                    />
                  </div>

                  {/* WhatsApp Number (Optional) */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      WHATSAPP NUMBER
                    </label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Tell us about your brand / Inquiry details */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    TELL US ABOUT YOUR BRAND / INQUIRY DETAILS <span className="text-[#ce1126]">*</span>
                  </label>
                  <textarea
                    name="requirements"
                    required
                    rows={4}
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Please enter details of your advertising requirements, budget, or preferred dates..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 resize-y"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-[#00529b] hover:bg-[#003d73] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded shadow-sm transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "SUBMITTING..." : "SUBMIT REQUEST"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
