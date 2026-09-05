import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CategoryPage from "@/components/category/CategoryPage";
import { categorySlugs, getCategoryPage } from "@/components/category/categoryData";

export function generateStaticParams() {
  return categorySlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategoryPage(params.slug);
  return {
    title: category ? `${category.name} News, Analysis and Updates - POLITICO` : "POLITICO",
    description: category?.description,
  };
}

export default function CategoryRoute({ params }: { params: { slug: string } }) {
  const category = getCategoryPage(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CategoryPage category={category} />
      <Footer />
    </div>
  );
}
