import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";
import { put } from "@vercel/blob"; // 导入 Vercel Blob 的 put 方法

// 获取 JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 环境变量未设置");
}

const MAX_SIZE = 5 * 1024 * 1024; // 限制上传文件最大为 5MB

export async function POST(request: NextRequest) {
  try {
    // 从 Authorization 头部获取 JWT 令牌
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "未提供授权令牌" }, { status: 401 });
    }

    // 验证 JWT 令牌
    const decoded = jwt.verify(token, JWT_SECRET!);
    const userId = (decoded as { userId: string }).userId;

    // 获取上传的文件
    const formData = await request.formData();
    const avatar = formData.get("avatar");

    if (!avatar || !(avatar instanceof Blob)) {
      return NextResponse.json(
        { message: "请上传有效的图片文件" },
        { status: 400 }
      );
    }

    // 文件类型验证：仅允许图片
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(avatar.type)) {
      return NextResponse.json(
        { message: "只允许上传 JPG, PNG 或 GIF 格式的图片" },
        { status: 400 }
      );
    }

    // 文件大小验证
    if (avatar.size > MAX_SIZE) {
      return NextResponse.json(
        { message: "文件大小不能超过 5MB" },
        { status: 400 }
      );
    }

    // 使用 Vercel Blob 上传文件
    const fileName = `${Date.now()}-${avatar.name}`; // 生成唯一的文件名
    const blob = await put(`uploads/${fileName}`, avatar, {
      access: "public", // 设置公开访问
      contentType: avatar.type, // 保留原始 MIME 类型
    });

    // 上传成功后，获取 Blob 的 URL
    const avatarUrl = blob.url;

    // 更新数据库中的头像 URL
    await pool.query("UPDATE users SET avatar_url = $1 WHERE id = $2", [
      avatarUrl,
      userId,
    ]);

    // 更新评论表中的头像 URL
    await pool.query("UPDATE comments SET avatar_url = $1 WHERE user_id = $2", [
      avatarUrl,
      userId,
    ]);

    // 更新博客表中的头像 URL
    await pool.query("UPDATE blogs SET avatar_url = $1 WHERE user_id = $2", [
      avatarUrl,
      userId,
    ]);

    return NextResponse.json(
      { message: "头像更新成功", avatarUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("头像上传错误:", error);
    return NextResponse.json({ message: "服务器错误" }, { status: 500 });
  }
}
