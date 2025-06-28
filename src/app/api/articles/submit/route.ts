import pool from "@/lib/db";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  return `${slug}-${Date.now()}`;
}

function getUserIdFromRequest(request: Request): number | null {
  const authHeader = request.headers.get("Authorization");
  console.log("Received Authorization header:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("没有提供有效的 token");
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded.userId;
  } catch (error) {
    console.error("JWT 验证失败:", error);
    return null;
  }
}

export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: "未提供有效的身份验证信息" }),
      { status: 401 }
    );
  }
  try {
    const body = await req.json(); // 读取请求体
    const { title, excerpt, content, category, tag, img } = body;

    // 检查必要字段
    if (!title || !excerpt || !content || !category || !tag) {
      return new Response(
        JSON.stringify({ message: "缺少必要字段" }),
        { status: 400 } // 使用 `Response` 对象的 `status` 设置响应状态码
      );
    }

    const slug = generateSlug(title);

    const result = await pool.query(
      `INSERT INTO articles (title, excerpt, content, slug, category, tag, img, user_id, created_at, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), true)
       RETURNING id;`,
      [title, excerpt, content, slug, category, tag, img, userId]
    );

    // 返回成功的响应
    return new Response(
      JSON.stringify({ message: "文章已发布", articleId: result.rows[0].id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("发布文章失败:", error);
    return new Response(JSON.stringify({ message: "发布文章失败" }), {
      status: 500,
    });
  }
}
