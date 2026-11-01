import React from "react";
import type { Metadata } from "next";
import { Shield } from "lucide-react";
import LegalPageLayout, { LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy - POLITICO",
  description: "Learn how POLITICO collects, protects, uses, and respects your personal information and privacy rights.",
};

const privacySections: LegalSection[] = [
  {
    id: "introduction",
    label: "Introduction",
    title: "Introduction",
    content: (
      <>
        <p>
          <strong>POLITICO</strong> (&quot;POLITICO&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, subscribe to our newsletters, submit content, or otherwise interact with our Platform.
        </p>
        <p>
          By using the POLITICO Platform, you agree to the practices described in this Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    label: "1. Information We Collect",
    title: "1. Information We Collect",
    content: (
      <>
        <p>We may collect the following categories of information:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Personal Information:</strong> Full name, email address, phone number (if provided), postal address (if provided), account information, and billing information (when applicable).
          </li>
          <li>
            <strong>Technical Information:</strong> IP address, browser type, device information, operating system, referring website, pages visited, date and time of access, and cookies.
          </li>
          <li>
            <strong>Content You Submit:</strong> When you submit articles, comments, press releases, photographs, videos, or other materials, we collect the information necessary to process and publish your submission.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-your-information",
    label: "2. How We Use Your Information",
    title: "2. How We Use Your Information",
    content: (
      <p>
        We use your information to operate and improve our Platform, publish submitted content, respond to inquiries, process subscriptions or purchases, send newsletters, personalize your experience, detect fraud/security threats, comply with legal obligations, and analyze user engagement.
      </p>
    ),
  },
  {
    id: "cookies-and-tracking",
    label: "3. Cookies & Tracking",
    title: "3. Cookies & Tracking",
    content: (
      <p>
        We use cookies, web beacons, and similar tracking technologies to enhance user experience, remember preferences, and gather analytical data. You can manage cookie preferences through your browser settings or our <a href="/cookies" className="text-[#ce1126] font-bold hover:underline">Cookie Policy</a>.
      </p>
    ),
  },
  {
    id: "newsletter-communications",
    label: "4. Newsletter Communications",
    title: "4. Newsletter Communications",
    content: (
      <p>
        Subscribers receive breaking news, daily briefings, and policy analysis. You may opt out of newsletters at any time by clicking the unsubscribe link at the bottom of any email newsletter.
      </p>
    ),
  },
  {
    id: "sharing-of-information",
    label: "5. Sharing of Information",
    title: "5. Sharing of Information",
    content: (
      <p>
        We do not sell your personal information. We may share data with trusted service providers who assist in our operations, when required by law or legal process, or to protect the safety and rights of POLITICO and our users.
      </p>
    ),
  },
  {
    id: "data-security",
    label: "6. Data Security",
    title: "6. Data Security",
    content: (
      <p>
        We implement robust technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
      </p>
    ),
  },
  {
    id: "data-retention",
    label: "7. Data Retention",
    title: "7. Data Retention",
    content: (
      <p>
        We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy, satisfy legal obligations, or resolve disputes.
      </p>
    ),
  },
  {
    id: "your-privacy-rights",
    label: "8. Your Privacy Rights",
    title: "8. Your Privacy Rights",
    content: (
      <p>
        Depending on your location (including GDPR, CCPA, and applicable state laws), you may have the right to access, correct, delete, or restrict the processing of your personal information.
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    label: "9. Children's Privacy",
    title: "9. Children's Privacy",
    content: (
      <p>
        Our Platform is not directed to children under 13, and we do not knowingly collect personal data from minors without verified parental consent.
      </p>
    ),
  },
  {
    id: "third-party-websites",
    label: "10. Third-Party Websites",
    title: "10. Third-Party Websites",
    content: (
      <p>
        Our website may contain links to external sites. We are not responsible for the privacy practices, content, or policies of third-party platforms.
      </p>
    ),
  },
  {
    id: "international-data-transfers",
    label: "11. International Data Transfers",
    title: "11. International Data Transfers",
    content: (
      <p>
        Your information may be transferred to and maintained on secure servers located in jurisdictions outside your home country, subject to appropriate data transfer safeguards.
      </p>
    ),
  },
  {
    id: "changes-to-this-policy",
    label: "12. Changes to This Policy",
    title: "12. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy periodically. We will notify you of material changes by updating the &quot;Last Updated&quot; date at the top of this page.
      </p>
    ),
  },
  {
    id: "contact-us",
    label: "13. Contact Us",
    title: "13. Contact Us",
    content: (
      <p>
        If you have questions, comments, or requests regarding this Privacy Policy or your personal data, please contact our privacy compliance team at <span className="text-[#ce1126] font-bold">privacy@politico.com</span> or via our <a href="/contact-us" className="text-[#ce1126] font-bold hover:underline">Contact Us</a> page.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      pageTitle="Privacy Policy"
      sidebarTitle="PRIVACY POLICY SECTIONS"
      sidebarIcon={<Shield size={16} />}
      lastUpdated="November 2026"
      sections={privacySections}
    />
  );
}

