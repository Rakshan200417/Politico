import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC");
    return NextResponse.json({ subscribers: rows });
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No ids provided" }, { status: 400 });
    }
    
    // In MySQL, to do a bulk delete we can use the IN operator
    const placeholders = ids.map(() => "?").join(",");
    const query = `DELETE FROM newsletter_subscribers WHERE id IN (${placeholders})`;
    
    await pool.execute(query, ids);
    
    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (error) {
    console.error("Error deleting newsletter subscribers:", error);
    return NextResponse.json(
      { error: "Failed to delete subscribers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, newsletters } = await request.json();
    if (!email || !newsletters) {
      return NextResponse.json({ error: "Email and newsletters are required" }, { status: 400 });
    }
    
    // Attempt to insert or update the newsletter subscriptions for the email
    await pool.query(
      "INSERT INTO newsletter_subscribers (email, newsletters) VALUES (?, ?) ON DUPLICATE KEY UPDATE newsletters = ?",
      [email, newsletters, newsletters]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error subscribing to newsletters:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

