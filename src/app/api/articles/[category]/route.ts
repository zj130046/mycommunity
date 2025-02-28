import pool from "../../../../lib/db";

interface Params {
  params: {
    category: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { category } = await params;
  try {
    const result = await pool.query(
      "SELECT * FROM articles WHERE category = $1 AND is_published = true ORDER BY created_at DESC",
      [category]
    );
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
