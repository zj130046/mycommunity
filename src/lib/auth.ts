import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export async function authMiddleware(req) {
  const token = req.cookies.token; // 假设JWT存储在cookies中

  if (!token) {
    return NextResponse.json({ message: "未授权访问" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // 将解码的用户信息附加到请求中
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json(
      { message: "无效的或过期的Token" },
      { status: 401 }
    );
  }
}
