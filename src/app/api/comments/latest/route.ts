import pool from "../../../../lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM comments ORDER BY created_at DESC LIMIT 7"
    );
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching latest comments:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
