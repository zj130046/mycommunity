import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "未上传文件" }, { status: 400 });
    }

    // 使用 Vercel Blob 上传文件
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
