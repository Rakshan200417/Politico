import React from "react";
import type { Metadata } from "next";
import { Scale } from "lucide-react";
import LegalPageLayout, { LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions - Florida 24",
  description: "Read the Terms and Conditions governing your access and use of Florida 24's website, publications, and digital services.",
};

const termsSections: LegalSection[] = [
  {
    id: "introduction",
    label: "Introduction",
    title: "Introduction",
    content: (
      <>
        <p>
          Welcome to <strong>Florida 24</strong> (&quot;Florida 24&quot;, &quot;Florida 24 News Network LLC&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the Florida 24 website, mobile services, digital publications, and all related platforms (collectively, the &quot;Platform&quot;).
        </p>
        <p>
          By accessing, browsing, submitting content, or using any part of our Platform, you agree to comply with these Terms. If you do not agree with these Terms, please discontinue use of the Platform immediately.
        </p>
        <p>
          Florida 24 reserves the right to update or modify these Terms at any time. Continued use of the Platform following any updates constitutes acceptance of the revised Terms.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    label: "1. Eligibility",
    title: "1. Eligibility",
    content: (
      <p>
        You must be at least 18 years old, or have permission from a parent or legal guardian, to use our Platform. By using our services, you represent that you have the legal authority to accept these Terms.
      </p>
    ),
  },
  {
    id: "our-services",
    label: "2. Our Services",
    title: "2. Our Services",
    content: (
      <>
        <p>
          Florida 24 is an independent digital news and media platform providing breaking news, politics, policy, business, technology, world news, opinion articles, press releases, sponsored content, and multimedia publications.
        </p>
        <p>
          Our editorial team reserves the right to determine which content is published, promoted, or removed on our Platform.
        </p>
      </>
    ),
  },
  {
    id: "user-accounts",
    label: "3. User Accounts",
    title: "3. User Accounts",
    content: (
      <p>
        Certain services may require registration. You agree to provide accurate information, maintain the confidentiality of your account credentials, notify us immediately of any unauthorized access, and accept responsibility for all activities conducted under your account.
      </p>
    ),
  },
  {
    id: "user-content",
    label: "4. User Content",
    title: "4. User Content",
    content: (
      <p>
        Users may submit articles, comments, feedback, or multimedia. By submitting content, you grant Florida 24 a worldwide, non-exclusive, royalty-free, perpetual license to publish, display, distribute, reproduce, and adapt that content across our channels.
      </p>
    ),
  },
  {
    id: "editorial-independence",
    label: "5. Editorial Independence",
    title: "5. Editorial Independence",
    content: (
      <p>
        Florida 24 maintains complete editorial independence. Advertisers, corporate sponsors, political organizations, and business partners have no influence over our editorial decision-making or investigative coverage.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    label: "6. Intellectual Property",
    title: "6. Intellectual Property",
    content: (
      <p>
        All articles, photographs, illustrations, audio, video clips, logos, trademarks, and code on Florida 24 are protected by copyright, trademark, and other applicable intellectual property laws. Unauthorized reproduction or scraping is prohibited.
      </p>
    ),
  },
  {
    id: "sponsored-content",
    label: "7. Sponsored Content & Ads",
    title: "7. Sponsored Content & Ads",
    content: (
      <p>
        Sponsored articles and advertisements are distinctly labeled. Florida 24 does not endorse sponsored claims, products, or services advertised by third parties on our Platform.
      </p>
    ),
  },
  {
    id: "third-party-links",
    label: "8. Third-Party Links",
    title: "8. Third-Party Links",
    content: (
      <p>
        Our articles and platform may contain hyperlinks to external third-party websites. Florida 24 does not control and is not responsible for the content, privacy practices, or accuracy of third-party platforms.
      </p>
    ),
  },
  {
    id: "copyright-policy",
    label: "9. Copyright Policy",
    title: "9. Copyright Policy",
    content: (
      <p>
        We respect intellectual property rights. If you believe your copyrighted work has been infringed on our Platform, please contact our designated copyright agent with written notice containing proof of ownership.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    label: "10. Acceptable Use",
    title: "10. Acceptable Use",
    content: (
      <p>
        You agree not to use the Platform for unlawful purposes, harass others, distribute malware, scrape content without written authorization, or attempt to disrupt network infrastructure and server operations.
      </p>
    ),
  },
  {
    id: "disclaimer",
    label: "11. Disclaimer",
    title: "11. Disclaimer",
    content: (
      <p>
        The Platform and all content are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, or accuracy.
      </p>
    ),
  },
  {
    id: "limitation-of-liability",
    label: "12. Limitation of Liability",
    title: "12. Limitation of Liability",
    content: (
      <p>
        To the fullest extent permitted by applicable law, Florida 24 News Network LLC, its affiliates, directors, officers, and employees shall not be liable for any indirect, incidental, special, punitive, or consequential damages arising from your use of the Platform.
      </p>
    ),
  },
  {
    id: "indemnification",
    label: "13. Indemnification",
    title: "13. Indemnification",
    content: (
      <p>
        You agree to defend, indemnify, and hold harmless Florida 24 News Network LLC and its officers, employees, and agents from any claims, damages, liabilities, and expenses resulting from your violation of these Terms or your use of the Platform.
      </p>
    ),
  },
  {
    id: "privacy-policy-link",
    label: "14. Privacy Policy Link",
    title: "14. Privacy Policy Link",
    content: (
      <p>
        Your use of our Platform is also governed by our <a href="/privacy" className="text-[#ce1126] font-bold hover:underline">Privacy Policy</a>, which details how we collect, use, and safeguard your personal information.
      </p>
    ),
  },
  {
    id: "changes-to-services",
    label: "15. Changes to Services",
    title: "15. Changes to Services",
    content: (
      <p>
        We reserve the right to modify, suspend, or discontinue any aspect of our services, features, or content at any time without prior notice.
      </p>
    ),
  },
  {
    id: "governing-law",
    label: "16. Governing Law",
    title: "16. Governing Law",
    content: (
      <p>
        These Terms are governed by and construed in accordance with the laws of the United States and the State of Delaware, without regard to conflict of law principles.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      pageTitle="Terms & Conditions"
      sidebarTitle="TABLE OF CONTENTS"
      sidebarIcon={<Scale size={16} />}
      lastUpdated="November 2026"
      sections={termsSections}
    />
  );
}

