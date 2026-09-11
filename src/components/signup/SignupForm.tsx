"use client";

import React, { useState } from "react";
import { EyeOff, Eye, ArrowLeft } from "lucide-react";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the terms of service");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign up failed");
      } else {
        setSuccess(true);
        // Save user session in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      }
    } catch (err) {
      setError("An error occurred. Make sure XAMPP MySQL is running.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#eef1f5] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative">
      {/* Back to Home Link */}
      <a
        href="/"
        className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider z-20"
      >
        <ArrowLeft size={16} strokeWidth={2.2} />
        Back to POLITICO
      </a>

      {/* Main Split Authentication Card */}
      <div className="w-full max-w-[860px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 min-h-[580px]">
        {/* Left Column: Signature Red Brand Panel with P Logo */}
        <div className="bg-[#ce1126] flex flex-col items-center justify-center p-10 text-white relative select-none">
          <div className="flex flex-col items-center justify-center text-center">
            {/* P Letter Logo with Background */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-[0_14px_35px_rgba(0,0,0,0.25)] flex items-center justify-center mb-4 transition-all duration-300 hover:scale-105 hover:shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
              <span className="text-[#ce1126] font-black text-5xl sm:text-6xl tracking-tighter leading-none select-none pl-0.5">
                P
              </span>
            </div>

            {/* POLITICO Brand Wordmark */}
            <span className="text-[34px] md:text-[40px] font-black tracking-[-0.04em] text-white uppercase leading-none">
              POLITICO
            </span>
            <p className="text-white/80 text-[11px] font-medium tracking-widest uppercase mt-2">
              Politics &bull; Policy &bull; Power
            </p>
          </div>
        </div>

        {/* Right Column: Clean White Sign Up Form */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="text-xl sm:text-2xl font-black text-[#ce1126] uppercase tracking-wider">
                SIGN UP
              </h1>
              <p className="text-gray-400 text-xs mt-1.5">
                Create an account to access breaking political news and newsletters
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-2.5 rounded text-xs border border-red-200 font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 text-green-600 p-2.5 rounded text-xs border border-green-200 font-medium">
                Account created successfully! Redirecting...
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ce1126] transition-colors bg-transparent"
                  required
                />
              </div>

              {/* Email Address Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ce1126] transition-colors bg-transparent"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ce1126] transition-colors pr-8 bg-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <Eye size={16} strokeWidth={1.7} /> : <EyeOff size={16} strokeWidth={1.7} />}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ce1126] transition-colors pr-8 bg-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <Eye size={16} strokeWidth={1.7} /> : <EyeOff size={16} strokeWidth={1.7} />}
                </button>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#ce1126] border-gray-300 rounded focus:ring-[#ce1126] accent-[#ce1126] cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="ml-2 text-xs text-gray-600 cursor-pointer select-none">
                  I agree all statements in{" "}
                  <a href="#" className="text-[#ce1126] hover:underline font-medium">
                    terms of service
                  </a>
                </label>
              </div>

              {/* Primary Sign Up Button */}
              <button
                type="submit"
                className="w-full bg-[#ce1126] hover:bg-[#b00d1f] text-white font-bold py-3 text-xs tracking-wider uppercase rounded-sm shadow-md transition-all duration-200 mt-2 active:scale-[0.99]"
              >
                SIGN UP
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center my-3.5">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-3 text-gray-400 text-xs">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Sign Up Button */}
            <button
              type="button"
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 text-xs rounded-sm transition-colors flex items-center justify-center gap-2.5 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 flex-shrink-0">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Sign up with Google
            </button>

            {/* Link to Login */}
            <div className="text-center mt-3 text-xs text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-[#ce1126] font-bold hover:underline">
                Sign In
              </a>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-5 pt-3 border-t border-gray-100">
            <a href="#" className="hover:text-gray-700 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">
              Help & Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
