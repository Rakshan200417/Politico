import React from "react";
import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "About Us - Florida 24",
  description: "Florida 24 News Network illuminates the forces shaping news, policy, business, and community. Learn about our mission and editorial standards.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 sm:px-8 py-12 md:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight uppercase mb-8">
          ABOUT US
        </h1>

        <div className="space-y-6 text-gray-800 text-base sm:text-lg leading-relaxed font-normal">
          <p>
            Florida 24 News Network LLC illuminates the forces shaping news, policy, business, and community. We deliver fast, accurate, and in-depth intelligence that anticipates tomorrow&apos;s headlines, not merely reports on yesterday&apos;s news.
          </p>

          <p>
            Community leaders, entrepreneurs, executives, and citizens rely on Florida 24 every day. CEOs shape strategy around our reporting. Policy and advocacy leaders rely on our insights to understand local and national developments. We deliver the straightforward facts and clear-eyed analysis needed to navigate today&apos;s rapidly evolving landscape.
          </p>

          <p>
            Our dedicated team of publishing professionals, journalists, and editors form an agile, premier modern newsroom. We tell the authentic stories of how decisions are made, explaining what matters and delivering timely scoops and balanced reporting from trusted sources.
          </p>

          <p>
            Innovation is at the core of our mission. Florida 24 embraces digital-first storytelling, robust investigative standards, and comprehensive multimedia reporting to deliver value directly to our readers across Florida and beyond.
          </p>

          <p>
            Today, our mission remains steadfast: Florida 24 News Network LLC is committed to providing authoritative, indispensable journalism that keeps our readers informed, empowered, and ahead of the curve.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

