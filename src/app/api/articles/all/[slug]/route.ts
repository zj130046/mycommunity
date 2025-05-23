import pool from "../../../../../lib/db";

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;
  try {
    const result = await pool.query("SELECT * FROM articles WHERE slug = $1", [
      slug,
    ]);
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: "Article not found" }), {
        status: 404,
      });
    }

    const article = result.rows[0];

    return new Response(JSON.stringify(article), { status: 200 });
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
