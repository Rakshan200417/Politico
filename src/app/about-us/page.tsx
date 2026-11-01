import React from "react";
import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "About Us - POLITICO",
  description: "POLITICO illuminates the forces shaping global power. Learn about our mission, our journalists, and our editorial standards.",
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
            POLITICO illuminates the forces shaping global power. Since 2007, we have delivered intelligence that anticipates tomorrow&apos;s headlines, not reports on yesterday&apos;s news. As politics has increasingly become the defining force of our era, our work has never been more vital.
          </p>

          <p>
            Cabinet secretaries and Ministers start their mornings with our analysis. CEOs shape strategy around our reporting. Advocacy leaders rely on our insights to move policy. We deliver the straightforward facts and clear-eyed analysis they need to navigate the most complex political landscape of our lifetimes.
          </p>

          <p>
            Our 1,100+ publishing professionals across the world&apos;s key democratic capitals—Washington, Brussels, London, Paris, Berlin, Sacramento, and New York—form the world&apos;s premier politics and policy newsroom. We tell the story of how power really works by explaining who wields it and how they plan to exercise it, connecting dots others miss and delivering scoops from sources others don&apos;t even know exist.
          </p>

          <p>
            Innovation has always been a core tenet of our story. At launch, we bet that depth would trump scale, that talent would trump traffic, and that politics would become central to modern life. In 2011, we made another bet and launched POLITICO Pro to help decision-makers understand the business of government, transforming both how they shape government action and the business of journalism itself.
          </p>

          <p>
            These bets have made POLITICO the most successful digital news startup of its generation and an indispensable source of nonpartisan journalism for leaders across the globe. Today, our mission remains unchanged: to provide authoritative, indispensable journalism about the personalities and policies that shape our world.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

