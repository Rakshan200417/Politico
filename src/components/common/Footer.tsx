import React from "react";
import { Linkedin, Mail, Play } from "lucide-react";

export default function Footer({ className = "" }: { className?: string }) {
  const currentYear = new Date().getFullYear();

  // 1st line: Headings from user reference image
  const navLinks = [
    { label: "About us", href: "/about-us" },
    { label: "Contact us", href: "/contact-us" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Editorial Policy", href: "/editorial-policy" },
    { label: "Advertise with us", href: "/advertise" },
    { label: "RSS Feed", href: "/rss.xml" },
  ];

  // 2nd line: Social media icons from user reference image
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: (
        <svg className="w-4 h-4 text-gray-400 group-hover:text-[#1877f2] transition-colors fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: <Linkedin size={16} className="text-gray-400 group-hover:text-[#0a66c2] transition-colors" />,
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg className="w-4 h-4 text-gray-400 group-hover:text-[#e4405f] transition-colors fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "Rumble",
      href: "https://rumble.com",
      icon: (
        <span className="w-4 h-4 rounded-full bg-[#85c742] flex items-center justify-center text-white shrink-0">
          <Play size={9} fill="white" className="ml-0.5 text-white" />
        </span>
      ),
    },
    {
      name: "Newsletter",
      href: "#newsletter",
      icon: <Mail size={16} className="text-gray-400 group-hover:text-[#ce1126] transition-colors" />,
    },
  ];

  return (
    <footer className={`w-full bg-[#10141e] text-white py-8 font-sans border-t-2 border-[#d32f2f] ${className}`}>
      <div className="max-w-[1400px] mx-auto px-4 space-y-5">
        {/* Brand Logo */}
        <div className="pt-1">
          <a href="/" className="inline-block" aria-label="Florida 24 Home">
            <img
              src="/images/footer-logo.svg"
              alt="Florida 24 News Network"
              className="h-8 md:h-9 w-auto object-contain"
            />
          </a>
        </div>

        {/* 1st Line: Headings */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-semibold text-gray-300">
          {navLinks.map((link, idx) => (
            <React.Fragment key={link.label}>
              <a
                href={link.href}
                target={link.href.includes("rss") ? "_blank" : undefined}
                rel={link.href.includes("rss") ? "noopener noreferrer" : undefined}
                className="hover:text-white transition hover:underline"
              >
                {link.label}
              </a>
              {idx < navLinks.length - 1 && (
                <span className="text-gray-600 font-normal">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 2nd Line: Social Media Icons */}
        <div className="flex flex-wrap items-center gap-6 text-[12px] font-medium text-gray-300 pt-1">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2 group hover:text-white transition-colors"
            >
              {social.icon}
              <span className="group-hover:underline">{social.name}</span>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-gray-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-gray-400 gap-2">
          <p>© {currentYear} Florida 24 News Network LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
