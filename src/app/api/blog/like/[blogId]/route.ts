import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  const { blogId } = await params;
  console.log(blogId);
  try {
    // 开启数据库事务
    const client = await pool.connect();
    await client.query("BEGIN");

    // 先获取当前博客的点赞数和点赞状态（这里假设新增一个字段 is_liked 来记录是否点赞）
    const { rows } = await client.query(
      "SELECT like_count, is_liked FROM blogs WHERE id = $1",
      [blogId]
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
      // 如果已经点赞，取消点赞，点赞数回到初始值
      newLikeCount = like_count - 1;
      newIsLiked = false;
    } else {
      // 如果未点赞，点赞数加一
      newLikeCount = like_count + 1;
      newIsLiked = true;
    }

    // 更新博客的点赞数和点赞状态
    await client.query(
      "UPDATE blogs SET like_count = $1, is_liked = $2 WHERE id = $3",
      [newLikeCount, newIsLiked, blogId]
    );

    // 提交事务
    await client.query("COMMIT");
    client.release();

    return NextResponse.json({ likeCount: newLikeCount }, { status: 200 });
  } catch (error) {
    console.error("点赞出错:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
