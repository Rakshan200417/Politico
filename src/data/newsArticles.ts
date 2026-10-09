export interface NewsArticle {
  slug: string;
  category: string;
  categorySlug: string;
  title: string;
  deck: string;
  byline: string;
  authorRole: string;
  authorBio: string;
  authorAvatar?: string;
  authorLinkedin?: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  image: string;
  imageCaption: string;
  paragraphs: string[];
  keyTakeaways?: string[];
  tags: string[];
}

export function slugify(text?: string): string {
  if (!text || typeof text !== "string") return "article";
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "article";
}
