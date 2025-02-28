import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(request: NextRequest) {
  try {
    // 从动态路由参数中获取 userId
    const url = new URL(request.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { message: "缺少必要的参数: userId" },
        { status: 400 }
      );
    }

    // 构建 SQL 查询语句
    const query = `
            SELECT * FROM comments
            WHERE user_id = $1
            ORDER BY created_at DESC;
        `;

    // 执行 SQL 查询
    const result = await pool.query(query, [userId]);

    const comments = result.rows;

    return NextResponse.json(
      { message: "评论获取成功", comments },
      { status: 200 }
    );
  } catch (error) {
    console.error("获取评论出错:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
