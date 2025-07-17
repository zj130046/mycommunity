import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // 判断是否为 SSE
    const isSSE = req.headers.get("accept") === "text/event-stream";
    if (isSSE) {
      // deepseek 流式
      const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          stream: true,
          messages: messages.map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          })),
        }),
      });

      return new Response(res.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // 非流式
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages.map((msg: { role: string; content: string }) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        })),
      }),
    });

    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content || "AI暂时无法回复，请稍后再试。";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI Chat API 错误：", err);
    return NextResponse.json(
      { reply: "AI服务异常，请稍后再试。" },
      { status: 500 }
    );
  }
}
