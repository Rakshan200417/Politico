import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Politics, Policy, Political News - POLITICO",
  description: "Nobody covers politics, policy, and political news like POLITICO. We keep you informed with breaking news, analysis, and insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-white flex flex-col text-slate-900">
        {children}
      </body>
    </html>
  );
}
