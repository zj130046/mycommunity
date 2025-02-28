import pool from "@/lib/db"; // 引入数据库连接池
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // 引入 JWT 库

// 自动生成 slug
function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  return `${slug}-${Date.now()}`;
}

function getUserIdFromRequest(request: Request): number | null {
  const authHeader = request.headers.get("Authorization");
  console.log("Received Authorization header:", authHeader); // 记录头信息，帮助调试
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("没有提供有效的 token");
    return null; // 返回 null 如果没有提供 token
  }

  const token = authHeader.split(" ")[1]; // 获取 token
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, secret) as { userId: number };
    return decoded.userId;
  } catch (error) {
    console.error("JWT 验证失败:", error);
    return null;
  }
}

const INSERT_BLOG_QUERY = `
  INSERT INTO blogs (content, slug, img, user_id, username, avatar_url, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, NOW())
  RETURNING id;
`;

const SELECT_USER_INFO_QUERY = `
  SELECT username, avatar_url FROM users WHERE id = $1
`;

export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: "未提供有效的身份验证信息" }),
      { status: 401 }
    );
  }
  try {
    const body = await req.json();
    const { content, img = null } = body;

    // 检查必要字段
    if (!content) {
      return new NextResponse(JSON.stringify({ message: "缺少必要字段" }), {
        status: 400,
      });
    }

    const slug = generateSlug(content);

    // 根据 userId 查询 username 和 avatar_url
    const userResult = await pool.query(SELECT_USER_INFO_QUERY, [userId]);
    if (userResult.rows.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "未找到对应的用户信息" }),
        { status: 404 }
      );
    }

    const { username, avatar_url } = userResult.rows[0];

    const result = await pool.query(INSERT_BLOG_QUERY, [
      content,
      slug,
      img,
      userId,
      username,
      avatar_url,
    ]);

    // 返回成功的响应
    return new NextResponse(
      JSON.stringify({
        message: "文章已发布",
        blogId: result.rows[0].id,
        avatar_url,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("发布文章失败:", error);
    return new NextResponse(JSON.stringify({ message: "发布文章失败" }), {
      status: 500,
    });
  }
}
