import React from "react";
import type { Metadata } from "next";
import { FileText } from "lucide-react";
import LegalPageLayout, { LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Editorial Policy - POLITICO",
  description: "Learn about POLITICO's editorial standards, journalistic ethics, verification practices, and independence guidelines.",
};

const editorialSections: LegalSection[] = [
  {
    id: "our-commitment",
    label: "Our Commitment",
    title: "Our Commitment",
    content: (
      <p>
        <strong>POLITICO</strong> is committed to the highest standards of editorial integrity, transparency, accountability, and ethical journalism. Every article, investigation, opinion piece, and multimedia publication is produced under rigorous editorial oversight to ensure that our readers receive trustworthy, accurate, and nonpartisan information.
      </p>
    ),
  },
  {
    id: "accuracy-and-verification",
    label: "1. Accuracy & Verification",
    title: "1. Accuracy and Verification",
    content: (
      <>
        <p>
          Accuracy is the foundation of our journalism. Before publication, our editorial team strives to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Verify information through reliable, firsthand, and credible sources.</li>
          <li>Confirm facts using official public records and verified documents whenever possible.</li>
          <li>Review names, dates, statistics, quotations, and references for precision.</li>
          <li>Seek multiple independent sources before publishing significant investigative claims.</li>
          <li>Clearly distinguish verified facts from opinions or analytical perspectives.</li>
        </ul>
        <p className="mt-3">
          If new verified information becomes available after publication, articles are updated promptly with clear editorial transparency.
        </p>
      </>
    ),
  },
  {
    id: "editorial-independence",
    label: "2. Editorial Independence",
    title: "2. Editorial Independence",
    content: (
      <p>
        POLITICO maintains complete editorial independence. Editorial decisions are never influenced by advertisers, sponsors, political organizations, government agencies, business partners, financial contributors, or individuals seeking favorable coverage. Our journalists and editors are expected to make decisions solely in the public interest.
      </p>
    ),
  },
  {
    id: "fairness-and-balance",
    label: "3. Fairness and Balance",
    title: "3. Fairness and Balance",
    content: (
      <p>
        Our reporting aims to present issues fairly and responsibly. Whenever practical, we seek responses from individuals or organizations that are the subject of our reporting. We strive to present multiple viewpoints, avoid sensationalism, provide context, separate facts from commentary, and avoid misleading headlines or imagery.
      </p>
    ),
  },
  {
    id: "source-standards",
    label: "4. Source Standards",
    title: "4. Source Standards",
    content: (
      <p>
        We rely primarily on on-the-record sources. When confidential sources are necessary to protect whistleblowers or sensitive information, their credibility and motivations are vetted rigorously by senior editors.
      </p>
    ),
  },
  {
    id: "original-journalism",
    label: "5. Original Journalism",
    title: "5. Original Journalism",
    content: (
      <p>
        POLITICO values deeply reported, original journalism. Plagiarism, copying, or fabrication in any form is strictly prohibited and grounds for immediate termination.
      </p>
    ),
  },
  {
    id: "attribution-and-copyright",
    label: "6. Attribution & Copyright",
    title: "6. Attribution & Copyright",
    content: (
      <p>
        We properly attribute reporting, quotes, data, and imagery produced by external outlets, wire services, and research institutions.
      </p>
    ),
  },
  {
    id: "opinion-content",
    label: "7. Opinion Content",
    title: "7. Opinion Content",
    content: (
      <p>
        Opinion and commentary pieces are clearly marked as &quot;Opinion&quot;, &quot;Analysis&quot;, or &quot;Perspective&quot; to avoid any confusion with factual news reporting.
      </p>
    ),
  },
  {
    id: "corrections-and-updates",
    label: "8. Corrections & Updates",
    title: "8. Corrections & Updates",
    content: (
      <p>
        We acknowledge mistakes promptly and transparently. Corrections are appended directly to the article with an explanation of what was changed, when, and why.
      </p>
    ),
  },
  {
    id: "artificial-intelligence",
    label: "9. Artificial Intelligence (AI)",
    title: "9. Artificial Intelligence (AI)",
    content: (
      <p>
        AI tools may assist with research or drafting, but all published copy must be verified, edited, and approved by human journalists. We do not publish unvetted AI-generated claims.
      </p>
    ),
  },
  {
    id: "visuals-and-multimedia",
    label: "10. Visuals & Multimedia",
    title: "10. Visuals & Multimedia",
    content: (
      <p>
        Photographs and videos must reflect reality. Altering images to mislead or distort context is strictly prohibited. AI-generated imagery, if used, is explicitly captioned as an illustration.
      </p>
    ),
  },
  {
    id: "user-generated-content",
    label: "11. User-Generated Content",
    title: "11. User-Generated Content",
    content: (
      <p>
        Comments and community submissions are moderated to remove hate speech, defamation, harassment, or spam.
      </p>
    ),
  },
  {
    id: "sponsored-content",
    label: "12. Sponsored Content & Ads",
    title: "12. Sponsored Content & Ads",
    content: (
      <p>
        Native advertising and sponsored content are clearly differentiated from news reporting with prominent labels such as &quot;Sponsored Content&quot; or &quot;Paid Post&quot;.
      </p>
    ),
  },
  {
    id: "conflicts-of-interest",
    label: "13. Conflicts of Interest",
    title: "13. Conflicts of Interest",
    content: (
      <p>
        Journalists must disclose potential conflicts of interest and may not write about entities or individuals where personal, financial, or family interests could compromise objectivity.
      </p>
    ),
  },
  {
    id: "diversity-and-inclusion",
    label: "14. Diversity & Inclusion",
    title: "14. Diversity & Inclusion",
    content: (
      <p>
        We seek diverse perspectives, ensuring our reporting reflects the multifaceted communities and audiences we serve.
      </p>
    ),
  },
  {
    id: "source-security",
    label: "15. Source Security",
    title: "15. Source Security",
    content: (
      <p>
        We protect confidential sources and utilize encrypted communication channels when receiving sensitive whistleblower disclosures.
      </p>
    ),
  },
  {
    id: "community-standards",
    label: "16. Community Standards",
    title: "16. Community Standards",
    content: (
      <p>
        Readers, commenters, and contributors must adhere to civil discourse and respectful engagement across all POLITICO discussion forums.
      </p>
    ),
  },
];

export default function EditorialPolicyPage() {
  return (
    <LegalPageLayout
      pageTitle="Editorial Policy"
      sidebarTitle="POLICY SECTIONS"
      sidebarIcon={<FileText size={16} />}
      lastUpdated="November 2026"
      sections={editorialSections}
    />
  );
}

