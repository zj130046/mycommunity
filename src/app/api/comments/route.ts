import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET(request: NextRequest) {
  try {
    const query = `SELECT *FROM comments ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    const comments = result.rows.map((comment) => ({
      ...comment,
    }));
    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("获取评论出错:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
