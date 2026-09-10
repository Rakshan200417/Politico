"use client";

import React, { useState } from "react";
import { EyeOff, Eye } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        setSuccess(true);
        console.log("Logged in user:", data.user);
        
        // Save user session in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect based on role
        setTimeout(() => {
          if (data.user.role === "admin") {
            window.location.href = "/admin";
          } else if (data.user.role === "writer") {
            window.location.href = "/writer";
          } else {
            window.location.href = "/reader";
          }
        }, 1000);
      }
    } catch (err) {
      setError("An error occurred. Make sure XAMPP MySQL is running.");
    }
  };

  return (
    <div className="min-h-screen w-full relative font-sans overflow-hidden bg-[#0c121e]">
      {/* Full Screen Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1540839045646-19f7380108ca?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#0c121e] opacity-60 mix-blend-multiply"></div>
      </div>

      {/* Centered Content Container */}
      <div className="w-full max-w-[1440px] mx-auto relative z-10 flex h-screen">
        
        {/* Left Gray Panel */}
        <div className="w-full md:w-[500px] lg:w-[560px] h-full bg-[#f4f4f4] flex flex-col items-center py-6 px-8 lg:px-14 overflow-y-auto shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative">
          
          {/* Go Back Button */}
          <a 
            href="/" 
            className="absolute top-6 left-6 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </a>

          {/* Logo */}
          <div className="mb-6 lg:mb-8 mt-4">
            <a href="/" className="inline-block">
              <span className="text-[34px] font-bold tracking-tight text-[#ce1126] uppercase leading-none">
                POLITICO
              </span>
            </a>
          </div>

          {/* White Form Box */}
          <div className="w-full bg-white p-6 sm:p-8 shadow-sm flex-col rounded-sm">
            <h1 className="text-[26px] font-bold text-gray-900 mb-6">Login</h1>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded text-sm border border-green-200">
                Login successful!
              </div>
            )}

              {/* Email Field */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  EMAIL (REQUIRED)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-gray-500"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  PASSWORD (REQUIRED)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-gray-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <Eye size={18} strokeWidth={1.5} /> : <EyeOff size={18} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#ce1126] bg-white border-gray-300 rounded focus:ring-[#ce1126] focus:ring-2 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2 text-[13px] text-gray-600 cursor-pointer">
                  Remember this device for 60 days
                </label>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                className="w-full bg-[#aeb0b3] text-white rounded-full py-3 font-bold text-[14px] mt-4 hover:bg-gray-500 transition-colors duration-200"
              >
                Log in
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-[12px]">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Secondary Buttons */}
            <button
              type="button"
              className="w-full border border-gray-300 text-gray-700 bg-white rounded-full py-3 font-bold text-[14px] hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-3 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Log in with Google
            </button>

            <a href="#" className="block text-center text-[13px] text-gray-600 mt-5 hover:underline">
              Reset your password
            </a>
          </div>

          {/* Footer Links */}
          <div className="mt-auto pt-6 pb-4 flex items-center justify-center gap-2 text-[12px] text-gray-500">
            <a href="#" className="hover:underline hover:text-gray-700">Terms of Service</a>
            <span>|</span>
            <a href="#" className="hover:underline hover:text-gray-700">Privacy Policy</a>
          </div>

        </div>
      </div>
    </div>
  );
}
