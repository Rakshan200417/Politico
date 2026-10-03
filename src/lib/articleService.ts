import pool from './db';

export interface Article {
  id: number;
  writer_email: string;
  writer_name: string;
  title: string;
  slug: string;
  deck: string;
  content: string;
  category: string;
  subcategories: string; // JSON string array
  tags: string;
  read_time: string;
  status: string;
  rejection_reason: string | null;
  card_summary: string | null;
  focus_keyword: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  image: string;
  image_caption: string | null;
  image_credit: string | null;
}

export async function getPublishedArticlesByCategory(category: string, limit: number = 5): Promise<Article[]> {
  try {
    if (category.toLowerCase() === "world") {
      const [rows] = await pool.query(
        "SELECT * FROM articles WHERE status = 'published' AND category IN ('World', 'Middle East', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania', 'Russia', 'China', 'United Kingdom', 'Global') ORDER BY created_at DESC LIMIT ?",
        [limit]
      );
      return rows as Article[];
    } else {
      const [rows] = await pool.query(
        "SELECT * FROM articles WHERE status = 'published' AND category = ? ORDER BY created_at DESC LIMIT ?",
        [category, limit]
      );
      return rows as Article[];
    }
  } catch (error) {
    console.error(`Error fetching articles for category ${category}:`, error);
    return [];
  }
}

export async function getLatestPublishedArticles(limit: number = 10): Promise<Article[]> {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM articles WHERE status = 'published' ORDER BY created_at DESC LIMIT ?",
      [limit]
    );
    return rows as Article[];
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM articles WHERE slug = ? LIMIT 1",
      [slug]
    );
    const articles = rows as Article[];
    return articles.length > 0 ? articles[0] : null;
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    return null;
  }
}

export async function getArticlesByAuthor(authorName: string, limit: number = 20): Promise<Article[]> {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM articles WHERE status = 'published' AND writer_name = ? ORDER BY created_at DESC LIMIT ?",
      [authorName, limit]
    );
    return rows as Article[];
  } catch (error) {
    console.error(`Error fetching articles for author ${authorName}:`, error);
    return [];
  }
}

export async function getArticlesByAuthorSlug(slug: string, limit: number = 20): Promise<Article[]> {
  try {
    const namePattern = slug.replace(/-/g, ' ');
    const [rows] = await pool.query(
      "SELECT * FROM articles WHERE status = 'published' AND writer_name LIKE ? ORDER BY created_at DESC LIMIT ?",
      [`%${namePattern}%`, limit]
    );
    return rows as Article[];
  } catch (error) {
    console.error(`Error fetching articles for author slug ${slug}:`, error);
    return [];
  }
}
