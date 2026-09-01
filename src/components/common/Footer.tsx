import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    "About Us",
    "Advertising",
    "Breaking News Alerts",
    "Careers",
    "Credit Card Payments",
    "FAQ",
    "Feedback",
    "Headlines",
    "Photos",
    "Press",
    "Request A Correction",
    "Write For Us",
    "RSS",
    "Site Map",
  ];

  return (
    <footer className="w-full bg-[#10141e] text-white py-10 mt-12 font-sans border-t-2 border-[#d32f2f]">
      <div className="max-w-[1400px] mx-auto px-4 space-y-6">
        {/* Main Nav Links Horizontal Bar */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold text-gray-300">
          {links.map((link, idx) => (
            <React.Fragment key={link}>
              <a href="#" className="hover:text-white transition hover:underline">
                {link}
              </a>
              {idx < links.length - 1 && (
                <span className="text-gray-600 font-normal">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Legal Links & Copyright Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-gray-400 pt-4 border-t border-gray-800 gap-4">
          <div className="flex items-center space-x-3 font-semibold">
            <a href="#" className="hover:text-white transition hover:underline">
              Terms of Service
            </a>
            <span className="text-gray-600">|</span>
            <a href="#" className="hover:text-white transition hover:underline">
              Privacy Policy
            </a>
          </div>

          <div className="text-gray-400 font-medium">
            © {currentYear} POLITICO LLC
          </div>
        </div>
      </div>
    </footer>
  );
}
