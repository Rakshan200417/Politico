import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Florida 24 | Florida 24 News Network LLC",
  description:
    "Florida 24 News Network brings you breaking news, analysis, politics, business, and investigative coverage across Florida and beyond.",
  icons: {
    icon: "/icon.png?v=3",
    shortcut: "/icon.png?v=3",
    apple: "/icon.png?v=3",
  },
  openGraph: {
    title: "Florida 24 | Florida 24 News Network LLC",
    description:
      "Florida 24 News Network brings you breaking news, analysis, politics, business, and investigative coverage across Florida and beyond.",
    images: ["/images/site-thumbnail.jpg"],
  },
};

import GlobalArticleLinkHandler from "@/components/common/GlobalArticleLinkHandler";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/icon.png?v=3" />
        <link rel="shortcut icon" href="/icon.png?v=3" />
        <link rel="apple-touch-icon" href="/icon.png?v=3" />
      </head>
      <body className="min-h-screen bg-white flex flex-col text-slate-900">
        <GlobalArticleLinkHandler />
        {children}
      </body>
    </html>
  );
}
