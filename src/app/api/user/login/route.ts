import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";

// 从环境变量中获取 JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 环境变量未设置");
}

// 处理 POST 请求的函数
export async function POST(request: NextRequest) {
  try {
    // 获取请求体中的 JSON 数据
    const { username, password } = await request.json();

    // 从数据库中查找用户
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { message: "用户名或密码错误" },
        { status: 401 }
      );
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "用户名或密码错误" },
        { status: 401 }
      );
    }
    // 生成 JWT 令牌，使用非空断言操作符
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      JWT_SECRET!,
      {
        expiresIn: "1h", // 令牌有效期为 1 小时
      }
    );

    // 登录成功，返回令牌、用户 ID、用户名和头像信息
    return NextResponse.json(
      {
        message: "登录成功",
        token,
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatar_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("登录接口出错:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
