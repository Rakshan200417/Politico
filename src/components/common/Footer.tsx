import React from "react";
import { Facebook, Linkedin, Instagram, Mail, Play } from "lucide-react";

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
    { label: "RSS Feed", href: "/rss" },
  ];

  // 2nd line: Social media icons from user reference image
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: <Facebook size={16} className="text-gray-400 group-hover:text-[#1877f2] transition-colors" />,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: <Linkedin size={16} className="text-gray-400 group-hover:text-[#0a66c2] transition-colors" />,
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: <Instagram size={16} className="text-gray-400 group-hover:text-[#e4405f] transition-colors" />,
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
        {/* 1st Line: Headings */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-semibold text-gray-300">
          {navLinks.map((link, idx) => (
            <React.Fragment key={link.label}>
              <a href={link.href} className="hover:text-white transition hover:underline">
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
          <p>© {currentYear} POLITICO LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
