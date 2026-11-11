import React from "react";
import type { Metadata } from "next";
import { Cookie } from "lucide-react";
import LegalPageLayout, { LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Cookie Policy - Florida 24",
  description: "Understand how Florida 24 uses cookies and tracking technologies to deliver and improve our digital news services.",
};

const cookieSections: LegalSection[] = [
  {
    id: "introduction",
    label: "Introduction",
    title: "Introduction",
    content: (
      <>
        <p>
          This Cookie Policy explains how <strong>Florida 24</strong> (&quot;Florida 24&quot;, &quot;Florida 24 News Network LLC&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) uses cookies and similar tracking technologies when you visit our website and use our online services.
        </p>
        <p>
          By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy, unless you disable them through your browser settings.
        </p>
      </>
    ),
  },
  {
    id: "what-are-cookies",
    label: "1. What Are Cookies?",
    title: "1. What Are Cookies?",
    content: (
      <>
        <p>
          Cookies are small text files that are placed on your computer, smartphone, or other device when you visit a website. They help websites function properly, improve user experience, remember preferences, and provide analytical information.
        </p>
        <p>
          Cookies do not generally contain information that personally identifies you, but they may be linked to personal information that you voluntarily provide to us.
        </p>
      </>
    ),
  },
  {
    id: "types-of-cookies-we-use",
    label: "2. Types of Cookies We Use",
    title: "2. Types of Cookies We Use",
    content: (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 border-l-2 border-gray-400">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">
            Essential Cookies
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            These cookies are necessary for the operation of our website. They enable core features such as page navigation, secure access, account login, and website functionality. These cookies cannot be disabled.
          </p>
        </div>

        <div className="bg-gray-50 p-4 border-l-2 border-blue-500">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">
            Performance & Analytics Cookies
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            These cookies collect aggregated, anonymous information about how visitors navigate and interact with our website, such as which articles are read most frequently and whether error pages occur. This helps us optimize site performance.
          </p>
        </div>

        <div className="bg-gray-50 p-4 border-l-2 border-emerald-500">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">
            Functionality Cookies
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            These cookies allow our website to remember choices you make (such as font size, region, or saved reading lists) to provide a tailored, seamless reading experience.
          </p>
        </div>

        <div className="bg-gray-50 p-4 border-l-2 border-amber-500">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">
            Targeting & Advertising Cookies
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            These cookies record your visits to our website, pages you viewed, and links followed. They help deliver advertisements relevant to your interests and measure the effectiveness of marketing campaigns.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "how-we-use-cookies",
    label: "3. How We Use Cookies",
    title: "3. How We Use Cookies",
    content: (
      <p>
        We use cookies to maintain your active reading session, understand audience engagement across politics and policy topics, monitor platform uptime, prevent fraudulent activity, and ensure fast loading speeds for articles and multimedia.
      </p>
    ),
  },
  {
    id: "managing-cookies",
    label: "4. Managing Cookies",
    title: "4. Managing Cookies",
    content: (
      <p>
        Most web browsers allow you to control cookies through their browser preferences. You can configure your browser to block or alert you about cookies, or delete existing cookies. Please note that disabling essential cookies may impact certain site features and functionality.
      </p>
    ),
  },
  {
    id: "changes-to-this-policy",
    label: "5. Changes to This Policy",
    title: "5. Changes to This Policy",
    content: (
      <p>
        We may update this Cookie Policy from time to time to reflect operational, legal, or regulatory changes. We encourage you to review this page periodically.
      </p>
    ),
  },
  {
    id: "contact-us",
    label: "6. Contact Us",
    title: "6. Contact Us",
    content: (
      <p>
        If you have questions about our use of cookies or tracking technologies, please contact our privacy compliance team at <span className="text-[#ce1126] font-bold">cookies@florida24.com</span> or via our <a href="/contact-us" className="text-[#ce1126] font-bold hover:underline">Contact Us</a> page.
      </p>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      pageTitle="Cookie Policy"
      sidebarTitle="COOKIE POLICY SECTIONS"
      sidebarIcon={<Cookie size={16} />}
      lastUpdated="November 2026"
      sections={cookieSections}
    />
  );
}

