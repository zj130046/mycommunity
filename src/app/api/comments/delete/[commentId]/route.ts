import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;

  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ message: "未登录用户不能删除" }, { status: 401 });
    }

    const client = await pool.connect();
    await client.query("BEGIN");

    const { rows } = await client.query(
      "SELECT id, user_id, parent_id FROM comments WHERE id = $1",
      [commentId]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      client.release();
      return NextResponse.json({ message: "评论不存在" }, { status: 404 });
    }

    const comment = rows[0] as {
      id: number;
      user_id: number;
      parent_id: number | null;
    };

    if (Number(userId) !== Number(comment.user_id)) {
      await client.query("ROLLBACK");
      client.release();
      return NextResponse.json({ message: "无权限删除该评论" }, { status: 403 });
    }

    // 删除策略（配合你当前的双层结构）：
    // - 删除根评论（parent_id 为 null）：删除自己 + 所有 parent_id = 自己 的子评论
    // - 删除子评论：只删除自己
    const idsToDelete: number[] =
      comment.parent_id === null
        ? [comment.id]
        : [comment.id];

    if (comment.parent_id === null) {
      const { rows: childRows } = await client.query(
        "SELECT id FROM comments WHERE parent_id = $1",
        [comment.id]
      );
      idsToDelete.push(...childRows.map((r: { id: number }) => r.id));
    }

    // 先删点赞记录（避免外键约束或脏数据）
    await client.query("DELETE FROM comment_likes WHERE comment_id = ANY($1)", [
      idsToDelete,
    ]);

    // 再删评论
    await client.query("DELETE FROM comments WHERE id = ANY($1)", [idsToDelete]);

    await client.query("COMMIT");
    client.release();

    return NextResponse.json(
      { message: "删除成功", deletedIds: idsToDelete },
      { status: 200 }
    );
  } catch (error) {
    console.error("删除评论出错:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}

