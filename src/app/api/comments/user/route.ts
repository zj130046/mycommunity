import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userId, username, avatarUrl, content } = await request.json();
    const created_at = new Date();
    const query = `
            INSERT INTO comments (user_id, username, avatar_url, content, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
    const result = await pool.query(query, [
      userId,
      username,
      avatarUrl,
      content,
      created_at,
    ]);
    return NextResponse.json(
      { message: "评论添加成功", commentId: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error("添加评论出错:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
