import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  try {
    let query = "SELECT * FROM comments";
    const params: any[] = [];

    if (slug) {
      query += " WHERE article_slug = ?";
      params.push(slug);
    }

    query += " ORDER BY created_at DESC LIMIT 100";

    const [rows] = await pool.query(query, params);
    return NextResponse.json({ comments: rows });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { article_slug, category, article_author, commenter_name, commenter_email, comment_text } = await request.json();

    if (!article_slug || !comment_text) {
      return NextResponse.json(
        { error: "Article slug and comment text are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "INSERT INTO comments (article_slug, category, article_author, commenter_name, commenter_email, comment_text) VALUES (?, ?, ?, ?, ?, ?)",
      [article_slug, category || null, article_author || null, commenter_name || "Anonymous", commenter_email || null, comment_text]
    );

    const insertedId = (result as any).insertId;
    
    // Fetch the newly created comment to return it
    const [rows] = await pool.query("SELECT * FROM comments WHERE id = ?", [insertedId]);

    return NextResponse.json({ success: true, comment: (rows as any)[0] });
  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json(
      { error: "Failed to save comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    await pool.query("DELETE FROM comments WHERE id = ?", [id]);
    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
