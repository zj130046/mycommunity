import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET() {
  try {
    const [articleResult, countResult] = await Promise.all([
      pool.query("SELECT * FROM blogs ORDER BY created_at DESC"),
      pool.query("SELECT COUNT(*) as total FROM blogs"),
    ]);

    const blogs = articleResult.rows;
    const total = countResult.rows[0].total;

    return NextResponse.json({ blogs, total });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
