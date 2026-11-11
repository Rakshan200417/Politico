import React from "react";
import type { Metadata } from "next";
import NewsArticlePage from "./[slug]/page";

export const metadata: Metadata = {
  title: "Top News & Analysis - Florida 24",
  description: "Read the latest authoritative journalism, breaking news, and reporting from Florida 24.",
};

export default function NewsIndexPage() {
  return (
    <NewsArticlePage
      params={{
        slug: "dont-take-this-one-for-granted-new-hampshire-democrats-brace-for-a-tough-senate-race",
      }}
    />
  );
}
