import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Politics, Policy, Political News - POLITICO",
  description:
    "Nobody covers politics, policy, and political news like POLITICO. We keep you informed with breaking news, analysis, and insights.",
  icons: {
    icon: "/icon.png?v=2",
    shortcut: "/icon.png?v=2",
    apple: "/icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/icon.png?v=2" />
        <link rel="shortcut icon" href="/icon.png?v=2" />
      </head>
      <body className="min-h-screen bg-white flex flex-col text-slate-900">
        {children}
      </body>
    </html>
  );
}
