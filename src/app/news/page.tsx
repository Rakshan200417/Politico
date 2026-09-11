import React from "react";
import type { Metadata } from "next";
import NewsArticlePage from "./[slug]/page";

export const metadata: Metadata = {
  title: "Top News & Analysis - POLITICO",
  description: "Read the latest authoritative political journalism, breaking news, and policy reporting from POLITICO.",
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
