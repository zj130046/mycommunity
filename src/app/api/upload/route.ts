import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "未上传文件" }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: "文件大小不能超过 5MB" },
        { status: 400 }
      );
    }
    const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
      access: "public", // 设置公开访问
      contentType: file.type, // 保留原始 MIME 类型
    });

    return NextResponse.json({ url: blob.url }, { status: 200 });
  } catch (error) {
    console.error("文件上传出错:", error);
    return NextResponse.json({ message: "文件上传失败" }, { status: 500 });
  }
}
