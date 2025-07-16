import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;

interface Article {
  id: number;
  category: string;
  tag: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  created_at: string;
  img: string;
  word_count: number;
  user_id: number;
  is_published: boolean;
}

// 查找本地文章
async function searchArticles(keyword: string): Promise<Article[]> {
  const res = await fetch("http://localhost:3000/api/articles/all");
  const data = await res.json();
  const articles: Article[] = Array.isArray(data.articles) ? data.articles : [];
  return articles.filter(
    (item) => item.title.includes(keyword) || item.content.includes(keyword)
  );
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMsg = messages[messages.length - 1]?.content || "";

    // 判断是否查找文章
    const match = lastMsg.match(/(查找|找|搜索|推荐)(.*?)(文章|内容)/);
    if (match) {
      const keyword = match[2].trim();
      if (!keyword) {
        return NextResponse.json({ reply: "请说明你要查找的关键词。" });
      }
      const articles = await searchArticles(keyword);
      if (!articles.length) {
        return NextResponse.json({ reply: `没有找到关于“${keyword}”的文章。` });
      }
      // 拼接结果
      const reply = articles
        .slice(0, 5)
        .map(
          (a: Article) =>
            `标题：${a.title}\n链接：/article/${a.slug}\n简介：${
              a.excerpt || a.content.slice(0, 40)
            }...`
        )
        .join("\n\n");
      return NextResponse.json({ reply });
    }

    // 不是查找文章，走大模型
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
