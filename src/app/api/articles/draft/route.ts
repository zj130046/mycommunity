import pool from "@/lib/db"; // 引入数据库连接池
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"; // 引入 JWT 库和类型

function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  return `${slug}-${Date.now()}`; // 加上时间戳确保 slug 唯一
}

// 从请求头中提取 JWT 并解析用户 ID
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
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded.userId;
  } catch (error) {
    console.error("JWT 验证失败:", error);
    return null;
  }
}

export async function POST(req: Request): Promise<Response> {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: "未提供有效的身份验证信息" }),
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { title, excerpt, content, category, tag, img } = body;

    if (!title || !excerpt || !content || !category || !tag) {
      return new NextResponse(JSON.stringify({ message: "缺少必要字段" }), {
        status: 400,
      });
    }

    const slug = generateSlug(title);

    const result = await pool.query(
      `INSERT INTO articles (title, excerpt, content, slug, category, tag, img, user_id, created_at, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), false)
       RETURNING *;`,
      [title, excerpt, content, slug, category, tag, img, userId]
    );

    return new NextResponse(
      JSON.stringify({ message: "草稿已保存", draft: result.rows[0] }),
      { status: 200 }
    );
  } catch (error) {
    console.error("保存草稿失败:", error);
    return new NextResponse(JSON.stringify({ message: "保存草稿失败" }), {
      status: 500,
    });
  }
}

export async function GET(request: Request): Promise<Response> {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: "未提供有效的身份验证信息" }),
      { status: 401 }
    );
  }

  try {
    // 查询用户的草稿数据
    const result = await pool.query(
      `SELECT * FROM articles
       WHERE user_id = $1 AND is_published = false
       ORDER BY created_at DESC
       LIMIT 1;`, // 获取用户最新的草稿
      [userId]
    );

    if (result.rows.length === 0) {
      // 如果没有找到草稿，返回空对象而非错误消息
      return NextResponse.json({}, { status: 200 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("获取草稿失败:", error);
    return NextResponse.json({ message: "获取草稿失败" }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<Response> {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: "未提供有效的身份验证信息" }),
      { status: 401 }
    );
  }

  try {
    const result = await pool.query(
      `DELETE FROM articles
       WHERE user_id = $1 AND is_published = false;`,
      [userId]
    );
    console.log(result);
    return new NextResponse(JSON.stringify({ message: "草稿删除成功" }), {
      status: 200,
    });
  } catch (error) {
    console.error("草稿删除失败:", error);
    return new NextResponse(JSON.stringify({ message: "草稿删除失败" }), {
      status: 500,
    });
  }
}
