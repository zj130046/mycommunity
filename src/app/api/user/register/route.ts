import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "../../../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const { username, password, repassword } = await request.json();
    if (password !== repassword) {
      return NextResponse.json(
        { message: "两次输入的密码不一致" },
        { status: 400 }
      );
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: "用户名已存在" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    return NextResponse.json(
      {
        message: "注册成功",
        userId: newUser.rows[0].id,
        username: newUser.rows[0].username,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("注册接口出错:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
