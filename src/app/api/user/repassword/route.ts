import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import bcrypt from "bcryptjs";

// 处理重置密码的 POST 请求
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "未提供有效的身份验证信息" },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "请提供旧密码和新密码" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "用户未找到" }, { status: 404 });
    }

    const currentPassword = rows[0].password;

    const isPasswordValid = await bcrypt.compare(oldPassword, currentPassword);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "旧密码不正确" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);

    return NextResponse.json({ message: "密码重置成功" }, { status: 200 });
  } catch (error) {
    console.error("密码重置错误:", error);
    return NextResponse.json({ message: "服务器错误" }, { status: 500 });
  }
}
