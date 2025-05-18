import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json(
        { message: "未登录用户不能点赞" },
        { status: 401 }
      );
    }

    const client = await pool.connect();
    await client.query("BEGIN");

    // 检查是否已经点赞
    const { rows: likeRows } = await client.query(
      "SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2",
      [commentId, userId]
    );
    if (likeRows.length > 0) {
      await client.query("ROLLBACK");
      client.release();
      return NextResponse.json(
        { message: "您已点赞过该评论" },
        { status: 400 }
      );
    }

    // 点赞
    await client.query(
      "INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)",
      [commentId, userId]
    );
    await client.query(
      "UPDATE comments SET like_count = like_count + 1 WHERE id = $1",
      [commentId]
    );

    await client.query("COMMIT");
    client.release();

    return NextResponse.json({ message: "点赞成功" }, { status: 200 });
  } catch (error) {
    console.error("点赞出错:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
