"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    company: "",
    inquiry_type: "",
    message: "",
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

    if (!formData.inquiry_type) {
      setErrorMsg("Please select a Type of Inquiry.");
      return;
    }

    if (!formData.message.trim()) {
      setErrorMsg("Please enter your question or inquiry detail.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          whatsapp: "",
          company: "",
          inquiry_type: "",
          message: "",
        });
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
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
          {/* Left Column: Headquarters Address & Inquiries */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#111] leading-tight">
                Washington Global Times
              </h1>
              <div className="w-16 h-1 bg-[#ce1126] mt-3" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                HEADQUARTERS ADDRESS
              </h3>
              <p className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                2316 Eastgate St #160
                <br />
                Walla Walla, Washington (WA) 99362
                <br />
                United States
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                GENERAL INQUIRIES
              </h3>
              <a
                href="mailto:Info@Washington-times.com"
                className="text-base sm:text-lg font-bold text-blue-600 hover:text-blue-800 transition-colors block"
              >
                Info@Washington-times.com
              </a>
            </div>
          </div>

          {/* Right Column: Query Form */}
          <div className="lg:col-span-7">
            <div className="border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-12 pt-8 lg:pt-0">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#111]">
                  Submit Your Query
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Please, fill out the form below and submit your inquiry.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">
                      Inquiry Submitted Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Thank you for contacting us. Our editorial and support team will review your message and reach out shortly.
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      PHONE NUMBER (WITH COUNTRY CODE) <span className="text-[#ce1126]">*</span>
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

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      WHATSAPP NUMBER <span className="text-[#ce1126]">*</span>
                    </label>
                    <input
                      type="text"
                      name="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      COMPANY NAME
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company LLC (Optional)"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400"
                    />
                  </div>

                  {/* Type of Inquiry */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      TYPE OF INQUIRY <span className="text-[#ce1126]">*</span>
                    </label>
                    <select
                      name="inquiry_type"
                      required
                      value={formData.inquiry_type}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 cursor-pointer"
                    >
                      <option value="">--</option>
                      <option value="Business / Advertising">Business / Advertising</option>
                      <option value="Editorial">Editorial</option>
                      <option value="Technical glitch">Technical glitch</option>
                      <option value="General / Others">General / Others</option>
                    </select>
                  </div>
                </div>

                {/* Question / Inquiry Detail */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    YOUR QUESTION(S) / INQUIRY DETAIL <span className="text-[#ce1126]">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please enter your detailed query here..."
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
                    <span>{isSubmitting ? "SUBMITTING..." : "SUBMIT INQUIRY"}</span>
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
