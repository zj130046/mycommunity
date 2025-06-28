import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(request: Request) {
  try {
    // 从请求体中获取搜索关键字
    const { keyword } = await request.json();

    // 并发执行用户、帖子和文章的搜索查询
    const [userResult, postResult, articleResult] = await Promise.all([
      pool.query("SELECT * FROM users WHERE username ILIKE $1", [
        `%${keyword}%`,
      ]),
      pool.query(
        "SELECT * FROM blogs WHERE content ILIKE $1 OR username ILIKE $1",
        [`%${keyword}%`]
      ),
      pool.query(
        "SELECT * FROM articles WHERE title ILIKE $1 OR content ILIKE $1 OR excerpt ILIKE $1",
        [`%${keyword}%`]
      ),
    ]);

    const users = userResult.rows;
    const blogs = postResult.rows;
    const articles = articleResult.rows;

    // 返回包含搜索结果的 JSON 响应
    return NextResponse.json({ users, blogs, articles });
  } catch (error) {
    // 打印错误信息并返回错误响应
    console.error("Error searching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
