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
  is_sponsored?: boolean | number;
}

export async function getPublishedArticlesByCategory(category: string, limit: number = 5, excludePlaced: boolean = false, page: number = 1, mainCategoryOnly: boolean = false): Promise<{articles: Article[], totalPages: number, currentPage: number}> {
  try {
    const offset = (page - 1) * limit;
    let placementFilter = "";
    if (excludePlaced) {
      placementFilter = " AND (homepage_placement IS NULL OR homepage_placement = 'None' OR homepage_placement = '')";
    }
    if (category.toLowerCase() === "world") {
      let condition = "";
      if (mainCategoryOnly) {
        condition = `status = 'published' AND category IN ('World', 'Middle East', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania', 'Russia', 'China', 'United Kingdom', 'Global')${placementFilter}`;
      } else {
        condition = `status = 'published' AND (category IN ('World', 'Middle East', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania', 'Russia', 'China', 'United Kingdom', 'Global') OR subcategories LIKE '%"World"%' OR subcategories LIKE '%"Middle East"%' OR subcategories LIKE '%"Asia"%' OR subcategories LIKE '%"Europe"%' OR subcategories LIKE '%"Africa"%' OR subcategories LIKE '%"Americas"%' OR subcategories LIKE '%"Oceania"%' OR subcategories LIKE '%"Russia"%' OR subcategories LIKE '%"China"%' OR subcategories LIKE '%"United Kingdom"%' OR subcategories LIKE '%"Global"%')${placementFilter}`;
      }
      
      const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM articles WHERE ${condition}`);
      const totalArticles = (countRows as any)[0].total;
      const totalPages = Math.ceil(totalArticles / limit);

      const [rows] = await pool.query(
        `SELECT * FROM articles WHERE ${condition} ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return { articles: rows as Article[], totalPages, currentPage: page };
    } else {
      let condition = "";
      let params: any[] = [];
      if (mainCategoryOnly) {
        condition = `status = 'published' AND category = ?${placementFilter}`;
        params = [category];
      } else {
        condition = `status = 'published' AND (category = ? OR subcategories LIKE ?)${placementFilter}`;
        params = [category, `%"${category}"%`];
      }
      
      const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM articles WHERE ${condition}`, params);
      const totalArticles = (countRows as any)[0].total;
      const totalPages = Math.ceil(totalArticles / limit);

      const [rows] = await pool.query(
        `SELECT * FROM articles WHERE ${condition} ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );
      return { articles: rows as Article[], totalPages, currentPage: page };
    }
  } catch (error) {
    console.error(`Error fetching articles for category ${category}:`, error);
    return { articles: [], totalPages: 0, currentPage: 1 };
  }
}

export async function getLatestPublishedArticles(limit: number = 10, excludePlaced: boolean = false): Promise<Article[]> {
  try {
    let placementFilter = "";
    if (excludePlaced) {
      placementFilter = " AND (homepage_placement IS NULL OR homepage_placement = 'None' OR homepage_placement = '')";
    }
    const [rows] = await pool.query(
      `SELECT * FROM articles WHERE status = 'published'${placementFilter} ORDER BY updated_at DESC LIMIT ?`,
      [limit]
    );
    return rows as Article[];
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return [];
  }
}

export async function getArticlesByPlacement(placement: string, limit: number = 4): Promise<Article[]> {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM articles WHERE status = 'published' AND homepage_placement = ? ORDER BY updated_at DESC LIMIT ?",
      [placement, limit]
    );
    return rows as Article[];
  } catch (error) {
    console.error(`Error fetching articles for placement ${placement}:`, error);
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
      "SELECT * FROM articles WHERE status = 'published' AND writer_name = ? ORDER BY updated_at DESC LIMIT ?",
      [authorName, limit]
    );
    return rows as Article[];
  } catch (error) {
    console.error(`Error fetching articles for author ${authorName}:`, error);
    return [];
  }
}

export async function getArticlesByAuthorSlug(slug: string, limit: number = 10, page: number = 1): Promise<{ articles: Article[], totalPages: number, currentPage: number }> {
  try {
    const namePattern = slug.replace(/-/g, ' ');
    const offset = (page - 1) * limit;
    
    const [countRows] = await pool.query(
      "SELECT COUNT(*) as total FROM articles WHERE status = 'published' AND LOWER(writer_name) = ?",
      [namePattern.toLowerCase()]
    );
    const totalArticles = (countRows as any)[0].total;
    const totalPages = Math.ceil(totalArticles / limit);

    const [rows] = await pool.query(
      "SELECT * FROM articles WHERE status = 'published' AND LOWER(writer_name) = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?",
      [namePattern.toLowerCase(), limit, offset]
    );
    return { articles: rows as Article[], totalPages, currentPage: page };
  } catch (error) {
    console.error(`Error fetching articles for author slug ${slug}:`, error);
    return { articles: [], totalPages: 0, currentPage: 1 };
  }
}

export async function getAuthorProfile(email: string): Promise<{ avatar_url?: string, linkedin_profile?: string, bio?: string } | null> {
  try {
    const [rows] = await pool.query(
      "SELECT avatar_url, linkedin_profile, bio FROM profile_details WHERE email = ? LIMIT 1",
      [email]
    );
    const profiles = rows as any[];
    let profile = profiles.length > 0 ? { ...profiles[0] } : null;

    // Check users table for avatar_url fallback if missing
    const [userRows] = await pool.query(
      "SELECT avatar_url FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const uRows = userRows as any[];
    if (uRows.length > 0 && uRows[0].avatar_url) {
      if (!profile) {
        profile = { avatar_url: uRows[0].avatar_url, linkedin_profile: '', bio: '' };
      } else if (!profile.avatar_url) {
        profile.avatar_url = uRows[0].avatar_url;
      }
    }

    return profile;
  } catch (error) {
    console.error(`Error fetching profile for ${email}:`, error);
    return null;
  }
}

export async function getAuthorProfileByName(name: string): Promise<{ avatar_url?: string, linkedin_profile?: string, bio?: string } | null> {
  try {
    const [rows] = await pool.query(
      `SELECT pd.avatar_url, pd.linkedin_profile, pd.bio 
       FROM profile_details pd 
       LEFT JOIN users u ON pd.email = u.email 
       WHERE LOWER(u.name) = ? OR LOWER(pd.full_name) = ? LIMIT 1`,
      [name.toLowerCase(), name.toLowerCase()]
    );
    const profiles = rows as any[];
    if (profiles.length > 0 && (profiles[0].avatar_url || profiles[0].linkedin_profile || profiles[0].bio)) {
      return profiles[0];
    }

    const [userRows] = await pool.query(
      "SELECT avatar_url FROM users WHERE LOWER(name) = ? LIMIT 1",
      [name.toLowerCase()]
    );
    const uRows = userRows as any[];
    if (uRows.length > 0 && uRows[0].avatar_url) {
      return { avatar_url: uRows[0].avatar_url, linkedin_profile: '', bio: '' };
    }

    return null;
  } catch (error) {
    console.error(`Error fetching profile by name ${name}:`, error);
    return null;
  }
}
