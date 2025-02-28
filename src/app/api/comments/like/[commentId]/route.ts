import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;
  console.log(commentId);
  try {
    const client = await pool.connect();
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT like_count, is_liked FROM comments WHERE id = $1",
      [commentId]
    );
    if (rows.length === 0) {
      await client.query("ROLLBACK");
      client.release();
      return NextResponse.json({ message: "博客未找到" }, { status: 404 });
    }

    const { like_count, is_liked } = rows[0];
    let newLikeCount;
    let newIsLiked;

    if (is_liked) {
      newLikeCount = like_count - 1;
      newIsLiked = false;
    } else {
      newLikeCount = like_count + 1;
      newIsLiked = true;
    }

    await client.query(
      "UPDATE comments SET like_count = $1, is_liked = $2 WHERE id = $3",
      [newLikeCount, newIsLiked, commentId]
    );

    await client.query("COMMIT");
    client.release();

    return NextResponse.json({ likeCount: newLikeCount }, { status: 200 });
  } catch (error) {
    console.error("点赞出错:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
