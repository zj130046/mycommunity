import { NextResponse } from "next/server";
import pool from "../../../lib/db";

// 定义评论接口
interface Comment {
  id: number;
  parent_id?: number;
  content: string;
  user_id: number;
  username: string;
  avatar_url?: string;
  created_at: string;
  children?: Comment[];
}

// 辅助函数：将平铺的评论数组转为树形结构
function buildCommentTree(comments: Comment[]): Comment[] {
  const map: { [key: number]: Comment } = {};
  const roots: Comment[] = [];
  comments.forEach((c) => (map[c.id] = { ...c, children: [] }));
  comments.forEach((c) => {
    if (c.parent_id) {
      map[c.parent_id]?.children?.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });
  return roots;
}

export async function GET() {
  try {
    const query = `SELECT * FROM comments ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    const comments = result.rows;
    const tree = buildCommentTree(comments);
    return NextResponse.json({ comments: tree }, { status: 200 });
  } catch (error) {
    console.error("获取评论出错:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
